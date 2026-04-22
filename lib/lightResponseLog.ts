import {
  LIGHT_QUESTION_SET_ID,
  LIGHT_QUESTION_SET_VERSION,
  type LightQuestion,
  lightQuestionMaster,
} from "@/data/lightQuestionMaster";
import type { DiagnosisMode, LightDiagnosisResult, ResultType } from "@/types";

export const LIGHT_RESPONSE_LOGS_KEY = "questoria_light_response_logs";
export const LIGHT_SESSION_ID_KEY = "questoria_light_session_id";
export const LAST_LIGHT_RESPONSE_ID_KEY = "questoria_last_light_response_id";

const MAX_LOGS = 500;

export type LabeledValue = { value: string; label: string };

export type LightResponseLog = {
  created_at: string;
  updated_at: string;

  light_response_id: string;
  session_id: string;

  question_set_id: string;
  version: number;
  source: "light";

  result_type: ResultType;

  answers_json: Record<string, string>;
  answers_labeled_json: Record<string, LabeledValue>;

  went_to_deep: boolean;
  deep_mode: DiagnosisMode | null;
  deep_started_at: string | null;

  clicked_line: boolean;
  line_clicked_at: string | null;

  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function nowIso(): string {
  return new Date().toISOString();
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback: not cryptographically strong, but fine for local analysis IDs.
    return `lr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function generateLightResponseId(): string {
  return randomId();
}

export function getOrCreateLightSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = localStorage.getItem(LIGHT_SESSION_ID_KEY);
    if (existing && existing.trim()) return existing;
    const id = randomId();
    localStorage.setItem(LIGHT_SESSION_ID_KEY, id);
    return id;
  } catch {
    return null;
  }
}

export function getLastLightResponseId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(LAST_LIGHT_RESPONSE_ID_KEY);
    if (s && s.trim()) return s;
  } catch {
    // noop
  }
  try {
    const l = localStorage.getItem(LAST_LIGHT_RESPONSE_ID_KEY);
    return l && l.trim() ? l : null;
  } catch {
    return null;
  }
}

export function setLastLightResponseId(lightResponseId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LAST_LIGHT_RESPONSE_ID_KEY, lightResponseId);
  } catch {
    // noop
  }
  try {
    localStorage.setItem(LAST_LIGHT_RESPONSE_ID_KEY, lightResponseId);
  } catch {
    // noop
  }
}

export function readLightResponseLogs(): LightResponseLog[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = safeJsonParse<unknown>(localStorage.getItem(LIGHT_RESPONSE_LOGS_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed as LightResponseLog[];
  } catch {
    return [];
  }
}

function writeLightResponseLogs(next: LightResponseLog[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LIGHT_RESPONSE_LOGS_KEY, JSON.stringify(next));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] writeLightResponseLogs failed", e);
  }
}

function clampLogsByCreatedAt(logs: LightResponseLog[]): LightResponseLog[] {
  if (logs.length <= MAX_LOGS) return logs;
  const sorted = [...logs].sort((a, b) => {
    const ax = a?.created_at ?? "";
    const bx = b?.created_at ?? "";
    return ax.localeCompare(bx);
  });
  return sorted.slice(sorted.length - MAX_LOGS);
}

export function getUtmParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
  try {
    const sp = new URLSearchParams(window.location.search);
    const v = (k: string) => {
      const raw = sp.get(k);
      return raw && raw.trim() ? raw : null;
    };
    return {
      utm_source: v("utm_source"),
      utm_medium: v("utm_medium"),
      utm_campaign: v("utm_campaign"),
    };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
}

export function buildAnswersJson(
  selected: { questionId: string; optionId: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of selected) out[a.questionId] = a.optionId;
  return out;
}

const STABLE_LABEL_KEYS: Record<string, string> = {
  q1_position: "position",
  q2_ai_frequency: "ai_frequency",
  q3_main_purpose: "main_purpose",
  q4_biggest_problem: "biggest_problem",
  q5_anxiety: "anxiety",
  q8_after_using_ai: "after_using_ai",
  q9_how_to_start: "how_to_start",
  q10_when_answer_is_off: "when_answer_is_off",
  q11_when_ai_differs: "when_ai_differs",
  q12_current_state: "current_state",
};

export function buildAnswersLabeledJson(
  questions: readonly LightQuestion[],
  selected: { questionId: string; optionId: string }[],
): Record<string, LabeledValue> {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const out: Record<string, LabeledValue> = {};
  for (const a of selected) {
    const q = qMap.get(a.questionId);
    if (!q) continue;
    const opt = q.options.find((o) => o.id === a.optionId);
    if (!opt) continue;
    const key = STABLE_LABEL_KEYS[q.id] ?? q.id;
    out[key] = { value: opt.id, label: opt.label };
  }
  return out;
}

export function createLightResponseLog(input: {
  result: Pick<LightDiagnosisResult, "resultType" | "answers" | "questionSetId" | "version">;
  light_response_id?: string;
}): LightResponseLog | null {
  if (typeof window === "undefined") return null;
  try {
    const created_at = nowIso();
    const session_id = getOrCreateLightSessionId();
    if (!session_id) return null;

    // Convert `LightDiagnosisResult.answers` into (questionId, optionId) pairs.
    const selected = input.result.answers.map((a) => ({ questionId: a.questionId, optionId: a.optionId }));
    const answers_json = buildAnswersJson(selected);
    const answers_labeled_json = buildAnswersLabeledJson(lightQuestionMaster, selected);
    const utm = getUtmParams();

    const light_response_id = input.light_response_id ?? randomId();
    const log: LightResponseLog = {
      created_at,
      updated_at: created_at,
      light_response_id,
      session_id,
      question_set_id: input.result.questionSetId ?? LIGHT_QUESTION_SET_ID,
      version: input.result.version ?? LIGHT_QUESTION_SET_VERSION,
      source: "light",
      result_type: input.result.resultType,
      answers_json,
      answers_labeled_json,
      went_to_deep: false,
      deep_mode: null,
      deep_started_at: null,
      clicked_line: false,
      line_clicked_at: null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    };

    const logs = readLightResponseLogs();
    const next = clampLogsByCreatedAt([...logs, log]);
    writeLightResponseLogs(next);
    setLastLightResponseId(light_response_id);
    return log;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] createLightResponseLog failed", e);
    return null;
  }
}

export function markLightResponseWentToDeep(
  lightResponseId: string,
  deepMode: DiagnosisMode,
): void {
  if (typeof window === "undefined") return;
  try {
    const logs = readLightResponseLogs();
    const t = nowIso();
    const next = logs.map((l) =>
      l.light_response_id === lightResponseId
        ? {
            ...l,
            updated_at: t,
            went_to_deep: true,
            deep_mode: deepMode,
            deep_started_at: l.deep_started_at ?? t,
          }
        : l,
    );
    writeLightResponseLogs(next);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] markLightResponseWentToDeep failed", e);
  }
}

export function markLightResponseClickedLine(lightResponseId: string): void {
  if (typeof window === "undefined") return;
  try {
    const logs = readLightResponseLogs();
    const t = nowIso();
    const next = logs.map((l) =>
      l.light_response_id === lightResponseId
        ? {
            ...l,
            updated_at: t,
            clicked_line: true,
            line_clicked_at: l.line_clicked_at ?? t,
          }
        : l,
    );
    writeLightResponseLogs(next);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] markLightResponseClickedLine failed", e);
  }
}

const CSV_COLUMNS = [
  "created_at",
  "light_response_id",
  "session_id",
  "question_set_id",
  "version",
  "result_type",
  "went_to_deep",
  "deep_mode",
  "clicked_line",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "answers_json",
  "answers_labeled_json",
] as const;

type CsvColumn = (typeof CSV_COLUMNS)[number];

function csvEscape(raw: string): string {
  const s = raw.replace(/"/g, '""');
  return `"${s}"`;
}

function toCsvRow(log: LightResponseLog): string {
  const get = (col: CsvColumn): string => {
    switch (col) {
      case "answers_json":
        return JSON.stringify(log.answers_json);
      case "answers_labeled_json":
        return JSON.stringify(log.answers_labeled_json);
      case "deep_mode":
        return log.deep_mode ?? "";
      case "utm_source":
        return log.utm_source ?? "";
      case "utm_medium":
        return log.utm_medium ?? "";
      case "utm_campaign":
        return log.utm_campaign ?? "";
      case "version":
        return String(log.version);
      case "went_to_deep":
        return log.went_to_deep ? "true" : "false";
      case "clicked_line":
        return log.clicked_line ? "true" : "false";
      default:
        return String((log as unknown as Record<string, unknown>)[col] ?? "");
    }
  };
  return CSV_COLUMNS.map((c) => csvEscape(get(c))).join(",");
}

export function buildLightResponseLogsCsv(logs: LightResponseLog[]): string {
  const header = CSV_COLUMNS.join(",");
  const body = logs.map((l) => toCsvRow(l)).join("\r\n");
  // UTF-8 BOM for Excel friendliness
  return `\uFEFF${header}\r\n${body}\r\n`;
}

export function downloadLightResponseLogsCsv(filename = "light_response_logs.csv"): void {
  if (typeof window === "undefined") return;
  try {
    const logs = readLightResponseLogs();
    const csv = buildLightResponseLogsCsv(logs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Questoria] downloadLightResponseLogsCsv failed", e);
  }
}


import type { DiagnosisMode, DiagnosisResult, ResultType } from "@/types";

const LEGACY_RESULT_TYPE: Record<string, ResultType> = {
  oracle: "prophet",
  berserker: "hunter",
};

const LEGACY_MODE_MAP: Record<string, DiagnosisMode> = {
  hard: "work",
  easy: "life",
};

const VALID_ANSWER_COUNTS = new Set([9, 12]);

const VALID: readonly ResultType[] = [
  "hero",
  "sage",
  "hunter",
  "prophet",
  "artisan",
  "wizard",
  "pioneer",
  "origin",
] as const;

function coerceResultType(raw: string): ResultType | null {
  const mapped = LEGACY_RESULT_TYPE[raw] ?? raw;
  return (VALID as readonly string[]).includes(mapped) ? (mapped as ResultType) : null;
}

function isValidAnswerRecordArray(maybe: unknown): maybe is DiagnosisResult["answers"] {
  if (!Array.isArray(maybe)) return false;
  if (!VALID_ANSWER_COUNTS.has(maybe.length)) return false;

  for (const row of maybe as unknown[]) {
    if (!row || typeof row !== "object") return false;
    const r = row as Record<string, unknown>;
    if (typeof r.questionId !== "string" || r.questionId.length === 0) return false;

    const choice = r.selectedChoiceId ?? r.selectedOption;
    if (choice !== "A" && choice !== "B" && choice !== "C" && choice !== "D") return false;

    if (typeof r.score !== "number" || Number.isNaN(r.score)) return false;
  }

  return true;
}

/** sessionStorage 等に残った oracle / berserker を prophet / hunter として読み替える */
export function parseStoredDiagnosisResult(parsed: unknown): DiagnosisResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<DiagnosisResult>;
  if (!p.answers || !isValidAnswerRecordArray(p.answers)) return null;
  if (typeof p.resultType !== "string") return null;
  const resultType = coerceResultType(p.resultType);
  if (!resultType) return null;
  if (!p.rawScores || !p.normalizedScores || !p.levels) return null;

  const rawMode = typeof p.mode === "string" ? p.mode : "";
  const mode: DiagnosisMode =
    rawMode === "work" || rawMode === "life"
      ? rawMode
      : LEGACY_MODE_MAP[rawMode] ?? "work";

  return {
    mode,
    answers: p.answers,
    rawScores: p.rawScores,
    normalizedScores: p.normalizedScores,
    levels: p.levels,
    resultType,
  };
}

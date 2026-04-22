import type { LightDiagnosisResult, ResultType } from "@/types";

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

const LIGHT_V1_QUESTION_SET_ID = "light_v1";
const LIGHT_V2_QUESTION_SET_ID = "light_v2";

function isValidResultType(raw: unknown): raw is ResultType {
  return typeof raw === "string" && (VALID as readonly string[]).includes(raw);
}

function isValidAnswerRecords(maybe: unknown): maybe is LightDiagnosisResult["answers"] {
  if (!Array.isArray(maybe)) return false;
  for (const row of maybe as unknown[]) {
    if (!row || typeof row !== "object") return false;
    const r = row as Record<string, unknown>;
    if (typeof r.questionId !== "string" || r.questionId.length === 0) return false;
    if (typeof r.optionId !== "string" || r.optionId.length === 0) return false;
    if (typeof r.optionLabel !== "string" || r.optionLabel.length === 0) return false;
  }
  return true;
}

/**
 * Parse/validate `questoria_light_result`.
 *
 * Notes:
 * - LIGHT result must NOT contain `mode`.
 * - Supports both legacy 12-question and current 10-question LIGHT results.
 */
export function parseStoredLightDiagnosisResult(parsed: unknown): LightDiagnosisResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<LightDiagnosisResult> & { mode?: unknown };

  // mode must not exist for LIGHT (avoid accidental dummy values)
  if (typeof p.mode !== "undefined") return null;

  if (p.source !== "light") return null;
  if (!p.answers || !isValidAnswerRecords(p.answers)) return null;
  if (!p.coreScores || !p.adjustments) return null;
  if (!isValidResultType(p.resultType)) return null;
  if (!p.rawScores || !p.normalizedScores || !p.levels) return null;
  if (typeof p.completedAt !== "string" || !p.completedAt.trim()) return null;
  if (typeof p.questionSetId !== "string" || !p.questionSetId.trim()) return null;
  if (typeof p.version !== "number") return null;

  // Compatibility gate: validate answer count by (questionSetId, version).
  // - v1: 12 questions
  // - v2+: 10 questions
  const expectedAnswersLength =
    p.questionSetId === LIGHT_V2_QUESTION_SET_ID
      ? 10
      : p.questionSetId === LIGHT_V1_QUESTION_SET_ID
        ? 12
        : p.version >= 2
          ? 10
          : 12;
  if (p.answers.length !== expectedAnswersLength) return null;

  return p as LightDiagnosisResult;
}


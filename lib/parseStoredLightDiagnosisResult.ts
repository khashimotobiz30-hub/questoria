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

function isValidResultType(raw: unknown): raw is ResultType {
  return typeof raw === "string" && (VALID as readonly string[]).includes(raw);
}

/**
 * Parse/validate `questoria_light_result`.
 *
 * Notes:
 * - LIGHT result must NOT contain `mode`.
 * - `answers.length === 12` is enforced to match current 12-question product constraint.
 *   If LIGHT question count changes later, relax this check *only for LIGHT* here.
 */
export function parseStoredLightDiagnosisResult(parsed: unknown): LightDiagnosisResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<LightDiagnosisResult> & { mode?: unknown };

  // mode must not exist for LIGHT (avoid accidental dummy values)
  if (typeof p.mode !== "undefined") return null;

  if (p.source !== "light") return null;
  if (!p.answers || !Array.isArray(p.answers) || p.answers.length !== 12) return null;
  if (!p.coreScores || !p.adjustments) return null;
  if (!isValidResultType(p.resultType)) return null;
  if (!p.rawScores || !p.normalizedScores || !p.levels) return null;
  if (typeof p.completedAt !== "string" || !p.completedAt.trim()) return null;
  if (typeof p.questionSetId !== "string" || !p.questionSetId.trim()) return null;
  if (typeof p.version !== "number") return null;

  return p as LightDiagnosisResult;
}


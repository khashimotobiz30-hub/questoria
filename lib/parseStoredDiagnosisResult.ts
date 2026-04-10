import type { DiagnosisMode, DiagnosisResult, ResultType } from "@/types";

const LEGACY_RESULT_TYPE: Record<string, ResultType> = {
  oracle: "prophet",
  berserker: "hunter",
};

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

/** sessionStorage 等に残った oracle / berserker を prophet / hunter として読み替える */
export function parseStoredDiagnosisResult(parsed: unknown): DiagnosisResult | null {
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<DiagnosisResult>;
  if (!p.answers || !Array.isArray(p.answers) || p.answers.length !== 12) return null;
  if (typeof p.resultType !== "string") return null;
  const resultType = coerceResultType(p.resultType);
  if (!resultType) return null;
  if (!p.rawScores || !p.normalizedScores || !p.levels) return null;

  const mode: DiagnosisMode =
    p.mode === "easy" || p.mode === "hard" ? p.mode : "hard";

  return {
    mode,
    answers: p.answers as DiagnosisResult["answers"],
    rawScores: p.rawScores,
    normalizedScores: p.normalizedScores,
    levels: p.levels,
    resultType,
  };
}

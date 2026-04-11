/** sessionStorage / localStorage 共通キー（診断結果・最新1件の永続用） */
export const QUESTORIA_RESULT_KEY = "questoria_result";

/** 診断途中の回答（主に sessionStorage） */
export const QUESTORIA_ANSWERS_KEY = "questoria_answers";

/**
 * `questoria_result` を sessionStorage と localStorage の両方から削除する。
 * 一方のストレージが失敗しても、もう一方は試行する（それぞれ try/catch）。
 */
export function clearStoredDiagnosisResult(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUESTORIA_RESULT_KEY);
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(QUESTORIA_RESULT_KEY);
  } catch {
    /* noop */
  }
}

/**
 * `questoria_answers` を sessionStorage と localStorage の両方から削除する。
 * 現状 answers は session のみ使用だが、孤児データや将来の拡張に備えて両方クリアする。
 */
export function clearStoredQuestoriaAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUESTORIA_ANSWERS_KEY);
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(QUESTORIA_ANSWERS_KEY);
  } catch {
    /* noop */
  }
}

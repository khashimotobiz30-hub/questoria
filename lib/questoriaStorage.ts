/** sessionStorage / localStorage 共通キー（診断結果・最新1件の永続用） */
export const QUESTORIA_RESULT_KEY = "questoria_result";

/** sessionStorage / localStorage 共通キー（LIGHT診断結果・最新1件の永続用） */
export const QUESTORIA_LIGHT_RESULT_KEY = "questoria_light_result";

/** 診断途中の回答（主に sessionStorage） */
export const QUESTORIA_ANSWERS_KEY = "questoria_answers";

/** 診断中の設問表示順（questionId配列） */
export const QUESTORIA_QUESTION_ORDER_KEY = "questoria_question_order";

/** 診断中の選択肢表示順（questionId -> OptionKey[]） */
export const QUESTORIA_CHOICE_ORDER_KEY = "questoria_choice_order";

/**
 * `questoria_result` を sessionStorage と localStorage の両方から削除する。
 * 一方のストレージが失敗しても、もう一方は試行する（それぞれ try/catch）。
 */
export function clearStoredDiagnosisResult(): void {
  if (typeof window === "undefined") return;
  try {
    const debug = localStorage.getItem("questoria_debug_storage") === "1";
    if (debug) {
      // eslint-disable-next-line no-console
      console.warn("[Questoria] clearStoredDiagnosisResult called", new Error().stack);
    }
  } catch {
    /* noop */
  }
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
 * `questoria_light_result` を sessionStorage と localStorage の両方から削除する。
 * 一方のストレージが失敗しても、もう一方は試行する（それぞれ try/catch）。
 */
export function clearStoredLightDiagnosisResult(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUESTORIA_LIGHT_RESULT_KEY);
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(QUESTORIA_LIGHT_RESULT_KEY);
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
    sessionStorage.removeItem(QUESTORIA_QUESTION_ORDER_KEY);
    sessionStorage.removeItem(QUESTORIA_CHOICE_ORDER_KEY);
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(QUESTORIA_ANSWERS_KEY);
    localStorage.removeItem(QUESTORIA_QUESTION_ORDER_KEY);
    localStorage.removeItem(QUESTORIA_CHOICE_ORDER_KEY);
  } catch {
    /* noop */
  }
}

export type ResultType =
  | "hero"
  | "sage"
  | "hunter"
  | "prophet"
  | "artisan"
  | "wizard"
  | "pioneer"
  | "origin";

export type DiagnosisMode = "work" | "life";

export type OptionKey = "A" | "B" | "C" | "D";

export type AxisKey = "purpose" | "design" | "decision";

export type AxisScores = {
  purpose: number;
  design: number;
  decision: number;
};

export type AxisLevels = {
  purpose: "HIGH" | "MID" | "LOW";
  design: "HIGH" | "MID" | "LOW";
  decision: "HIGH" | "MID" | "LOW";
};

export type AnswerRecord = {
  questionId: string; // "q1"〜"q12"
  /**
   * 選択肢の「元のID」（A/B/C/D）。
   * 表示順をランダム化しても score 対応がズレないよう、常にこの値で保存する。
   */
  selectedChoiceId: OptionKey;
  /**
   * 旧フィールド（表示ラベル依存）。後方互換のため残すが、新規保存では使わない。
   * TODO: 旧データ移行後に削除
   */
  selectedOption?: OptionKey;
  score: number; // 0 / 0.5 / 1.0 / 1.5 / 2.0
};

export type DiagnosisResult = {
  mode: DiagnosisMode;
  answers: AnswerRecord[];
  rawScores: AxisScores;
  normalizedScores: AxisScores;
  levels: AxisLevels;
  resultType: ResultType;
};

/** LIGHT専用軸（入口用・自己申告）。Deepの `decision` と区別して `judgment` を使う。 */
export type LightAxisKey = "purpose" | "design" | "judgment";

export type LightAxisScores = Record<LightAxisKey, number>;
export type LightAxisLevels = Record<LightAxisKey, "HIGH" | "LOW">;

export type LightAnswerRecord = {
  questionId: string; // e.g. "Q1"〜
  optionId: string; // e.g. "A"〜
  optionLabel: string;
};

/**
 * LIGHT entry diagnosis result.
 * - `mode` is intentionally NOT present (WORK/LIFE meaning must be preserved for deep diagnosis only).
 * - `source` lets UI/storage distinguish deep vs light safely.
 */
export type LightDiagnosisResult = {
  source: "light";

  /** 将来活用前提の回答ログ（集計・個別参照用） */
  answers: LightAnswerRecord[];

  /** コア設問（Q9/Q10/Q11）由来の軸スコア */
  coreScores: LightAxisScores;
  /** 補正値（設問単位/選択肢による加減点の合算） */
  adjustments: LightAxisScores;

  /** 生点（raw）= ベース + 補正 */
  rawScores: LightAxisScores;
  /** 表示用の0-100正規化（deepのレーダー等と合わせる） */
  normalizedScores: LightAxisScores;

  /** High/Low判定（raw>=4 かつ core>=2 を High） */
  levels: LightAxisLevels;

  /** 8タイプ */
  resultType: ResultType;

  /** ISO timestamp */
  completedAt: string;
  /** identifies the question set used */
  questionSetId: string;
  /** for future compatibility when question set changes */
  version: number;
};

/** Deep diagnosis result (existing WORK/LIFE). */
export type DeepDiagnosisResult = DiagnosisResult & {
  source?: "deep";
};

export type StoredDiagnosisResult = DeepDiagnosisResult | LightDiagnosisResult;

/** TYPE ANALYSIS（Phase 2）— 6項目の表示用コピー */
export type TypeAnalysisCopy = {
  essence: string;
  strength: string;
  thinkingPattern: string;
  workStyle: string;
  riskPoint: string;
  growth: string;
};

/** DEEPER GUIDE（Phase 3） */
export type DeeperGuideCopy = {
  title: string;
  description: string;
  buttonLabel: string;
  footnote?: string;
};

/** SHARE / COMPARE 説明コピー（Phase 3） */
export type ShareCompareCopy = {
  lead: string;
  compareHint: string;
};

export type QuestionOption = {
  label: OptionKey;
  text: string;
  score: number;
  correct: boolean;
};

export type Question = {
  id: string; // "q1"〜"q12"
  axis: AxisKey;
  theme: string;
  question: string[];
  options: QuestionOption[];
};

export type SharePatternId = "pattern1" | "pattern2" | "pattern3" | "friends";

export type SharePattern = {
  id: SharePatternId;
  label: string;
  template: string;
};
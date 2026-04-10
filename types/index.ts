export type ResultType =
  | "hero"
  | "sage"
  | "hunter"
  | "prophet"
  | "artisan"
  | "wizard"
  | "pioneer"
  | "origin";

export type DiagnosisMode = "easy" | "hard";

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
  selectedOption: OptionKey;
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
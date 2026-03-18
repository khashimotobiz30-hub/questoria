export type QuestType = "daily" | "business";

export type ResultType =
  | "hero"
  | "sage"
  | "berserker"
  | "oracle"
  | "artisan"
  | "wizard"
  | "pioneer"
  | "origin";

export type OptionKey = "A" | "B" | "C" | "D";

export type AxisScores = {
  purpose: number; // 目的定義力
  design: number; // 設計力
  decision: number; // 自律判断力
};

export type AxisLevels = {
  purpose: "HIGH" | "MID" | "LOW";
  design: "HIGH" | "MID" | "LOW";
  decision: "HIGH" | "MID" | "LOW";
};

export type AnswerRecord = {
  questionId: string; // "{questType}_q{n}" 例: business_q1
  selectedOption: OptionKey;
  scores: AxisScores;
};

export type DiagnosisResult = {
  questType: QuestType;
  answers: AnswerRecord[];
  totalScores: AxisScores;
  normalizedScores: AxisScores;
  levels: AxisLevels;
  resultType: ResultType;
};

export type QuestionOption = {
  key: OptionKey;
  text: string;
  scores: AxisScores;
};

export type Question = {
  questionId: string; // "{questType}_q{n}"
  questType: QuestType;
  chapter: number; // 1〜5
  questionText: string;
  options: QuestionOption[];
};

// MVP: pattern1 / pattern2 / pattern3 / friends（STEP 5b で活用）
export type SharePatternId = "pattern1" | "pattern2" | "pattern3" | "friends";

export type SharePattern = {
  id: SharePatternId;
  label: string;
  template: string; // {タイプ名} と {一言コピー} をプレースホルダーとして使用
};

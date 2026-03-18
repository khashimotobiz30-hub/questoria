import type { AxisScores, QuestType } from "@/types";

type ScenarioData = {
  questType: QuestType;
  label: string;
  description: string;
  introText: string;
  maxScores: AxisScores;
};

export const scenarioMaster: Record<QuestType, ScenarioData> = {
  daily: {
    questType: "daily",
    label: "日常クエスト",
    description: "仲間5人との旅行計画",
    introText:
      "一人の旅人があなたの元を訪ねてきた。「来月、仲間5人で初めての旅に出たい。でも誰も段取りをしたことがなく、何から始めればいいかわからない。助けてくれ。」クエストを開始せよ。",
    maxScores: { purpose: 11, design: 18, decision: 23 },
  },
  business: {
    questType: "business",
    label: "ビジネスクエスト",
    description: "売上低下に悩む商人の相談",
    introText:
      "一人の商人があなたの元を訪ねてきた。「最近、店の売上が落ちている。何が原因かわからない。どうにかしたい。」クエストを開始せよ。",
    maxScores: { purpose: 13, design: 20, decision: 23 },
  },
};

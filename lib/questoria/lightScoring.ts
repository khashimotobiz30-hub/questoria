import type {
  LightAxisKey,
  LightAxisLevels,
  LightAxisScores,
  LightAnswerRecord,
  LightDiagnosisResult,
  ResultType,
} from "@/types";
import {
  LIGHT_QUESTION_SET_ID,
  LIGHT_QUESTION_SET_VERSION,
  type LightQuestion,
} from "@/data/lightQuestionMaster";

export type LightSelectedAnswer = {
  questionId: string; // "Q1"〜
  optionId: string; // "A"〜
};

function zeros(): LightAxisScores {
  return { purpose: 0, design: 0, judgment: 0 };
}

function isAxisKey(v: unknown): v is LightAxisKey {
  return v === "purpose" || v === "design" || v === "judgment";
}

function resolveBitsToResultType(pHigh: boolean, dHigh: boolean, jHigh: boolean): ResultType {
  // same mapping as deep: purpose/design/judgment -> hero..origin
  if (pHigh && dHigh && jHigh) return "hero";
  if (pHigh && dHigh && !jHigh) return "sage";
  if (pHigh && !dHigh && jHigh) return "hunter";
  if (pHigh && !dHigh && !jHigh) return "prophet";
  if (!pHigh && dHigh && jHigh) return "artisan";
  if (!pHigh && dHigh && !jHigh) return "wizard";
  if (!pHigh && !dHigh && jHigh) return "pioneer";
  return "origin";
}

export function collectLightAnswerRecords(
  questions: readonly LightQuestion[],
  selected: LightSelectedAnswer[],
): LightAnswerRecord[] {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  return selected
    .map((s) => {
      const q = qMap.get(s.questionId);
      if (!q) return null;
      const opt = q.options.find((o) => o.id === s.optionId);
      if (!opt) return null;
      return {
        questionId: q.id,
        optionId: opt.id,
        optionLabel: opt.label,
      } satisfies LightAnswerRecord;
    })
    .filter((x): x is LightAnswerRecord => Boolean(x));
}

export function calculateLightCoreScores(
  questions: readonly LightQuestion[],
  selected: LightSelectedAnswer[],
): LightAxisScores {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const out = zeros();
  for (const s of selected) {
    const q = qMap.get(s.questionId);
    if (!q?.coreAxis || !isAxisKey(q.coreAxis)) continue;
    const opt = q.options.find((o) => o.id === s.optionId);
    const v = typeof opt?.coreScore === "number" ? opt.coreScore : 0;
    out[q.coreAxis] += v;
  }
  return out;
}

export function calculateLightAdjustments(
  questions: readonly LightQuestion[],
  selected: LightSelectedAnswer[],
): LightAxisScores {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const out = zeros();
  for (const s of selected) {
    const q = qMap.get(s.questionId);
    if (!q) continue;
    const opt = q.options.find((o) => o.id === s.optionId);
    const adj = opt?.adjustment;
    if (!adj || typeof adj !== "object") continue;
    for (const [k, v] of Object.entries(adj)) {
      if (!isAxisKey(k)) continue;
      const n = typeof v === "number" ? v : 0;
      out[k] += n;
    }
  }
  return out;
}

export function calculateLightRawScores(
  questions: readonly LightQuestion[],
  selected: LightSelectedAnswer[],
  adjustments: LightAxisScores,
): LightAxisScores {
  const coreScores = calculateLightCoreScores(questions, selected);
  return {
    purpose: coreScores.purpose + adjustments.purpose,
    design: coreScores.design + adjustments.design,
    judgment: coreScores.judgment + adjustments.judgment,
  };
}

export function calculateLightLevels(rawScores: LightAxisScores, coreScores: LightAxisScores): LightAxisLevels {
  const isHigh = (axis: LightAxisKey) => rawScores[axis] >= 4 && coreScores[axis] >= 2;
  return {
    purpose: isHigh("purpose") ? "HIGH" : "LOW",
    design: isHigh("design") ? "HIGH" : "LOW",
    judgment: isHigh("judgment") ? "HIGH" : "LOW",
  };
}

export function resolveLightResultType(levels: LightAxisLevels): ResultType {
  return resolveBitsToResultType(
    levels.purpose === "HIGH",
    levels.design === "HIGH",
    levels.judgment === "HIGH",
  );
}

export function buildLightDiagnosisResult(
  questions: readonly LightQuestion[],
  selected: LightSelectedAnswer[],
): LightDiagnosisResult {
  const answers = collectLightAnswerRecords(questions, selected);
  const coreScores = calculateLightCoreScores(questions, selected);
  const adjustments = calculateLightAdjustments(questions, selected);
  const rawScores = {
    purpose: coreScores.purpose + adjustments.purpose,
    design: coreScores.design + adjustments.design,
    judgment: coreScores.judgment + adjustments.judgment,
  };
  const levels = calculateLightLevels(rawScores, coreScores);
  const resultType = resolveLightResultType(levels);

  // normalize to 0-100 (deep uses raw/8*100 for each axis)
  const normalizedScores: LightAxisScores = {
    purpose: Math.round((rawScores.purpose / 8) * 100),
    design: Math.round((rawScores.design / 8) * 100),
    judgment: Math.round((rawScores.judgment / 8) * 100),
  };

  return {
    source: "light",
    answers,
    coreScores,
    adjustments,
    rawScores,
    normalizedScores,
    levels,
    resultType,
    completedAt: new Date().toISOString(),
    questionSetId: LIGHT_QUESTION_SET_ID,
    version: LIGHT_QUESTION_SET_VERSION,
  };
}


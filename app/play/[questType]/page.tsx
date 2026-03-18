"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

import { questionMaster } from "@/data/questionMaster";
import { scenarioMaster } from "@/data/scenarioMaster";
import type {
  AnswerRecord,
  AxisLevels,
  AxisScores,
  DiagnosisResult,
  QuestType,
  ResultType,
} from "@/types";

type PageProps = {
  params: Promise<{ questType: string }>;
};

function isQuestType(value: string): value is QuestType {
  return value === "daily" || value === "business";
}

const SESSION_KEY_QUEST_TYPE = "questoria_questType";
const SESSION_KEY_ANSWERS = "questoria_answers";
const SESSION_KEY_RESULT = "questoria_result";

function addScores(a: AxisScores, b: AxisScores): AxisScores {
  return {
    purpose: a.purpose + b.purpose,
    design: a.design + b.design,
    decision: a.decision + b.decision,
  };
}

function calcNormalizedScores(total: AxisScores, max: AxisScores): AxisScores {
  const normalize = (raw: number, base: number) =>
    base <= 0 ? 0 : Math.round((raw / base) * 100);

  return {
    purpose: normalize(total.purpose, max.purpose),
    design: normalize(total.design, max.design),
    decision: normalize(total.decision, max.decision),
  };
}

function calcLevels(normalizedRounded: AxisScores): AxisLevels {
  const levelOf = (n: number): AxisLevels["purpose"] => {
    if (n >= 67) return "HIGH";
    if (n >= 33) return "MID";
    return "LOW";
  };

  return {
    purpose: levelOf(normalizedRounded.purpose),
    design: levelOf(normalizedRounded.design),
    decision: levelOf(normalizedRounded.decision),
  };
}

function calcResultType(levels: AxisLevels): ResultType {
  const p = levels.purpose === "HIGH";
  const d = levels.design === "HIGH";
  const c = levels.decision === "HIGH";

  if (p && d && c) return "hero";
  if (p && d && !c) return "sage";
  if (p && !d && c) return "berserker";
  if (p && !d && !c) return "oracle";
  if (!p && d && c) return "artisan";
  if (!p && d && !c) return "wizard";
  if (!p && !d && c) return "pioneer";
  return "origin";
}

export default function PlayIntroPage({ params }: PageProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerRecord[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(
    null,
  );

  const { questType } = use(params);

  useEffect(() => {
    if (!isQuestType(questType)) {
      router.replace("/quest");
      return;
    }

    try {
      const storedQuestType = sessionStorage.getItem(SESSION_KEY_QUEST_TYPE);
      if (!storedQuestType || storedQuestType !== questType) {
        router.replace("/quest");
        return;
      }
    } catch {
      router.replace("/quest");
      return;
    }

    setIsReady(true);
  }, [questType, router]);

  const scenario = useMemo(() => {
    if (!isQuestType(questType)) return null;
    return scenarioMaster[questType];
  }, [questType]);

  const questLabelEn = useMemo(() => {
    if (questType === "daily") return "DAILY QUEST";
    if (questType === "business") return "BUSINESS QUEST";
    return "";
  }, [questType]);

  if (!isReady || !scenario) return null;

  const questions = questionMaster.filter((q) => q.questType === questType);
  const currentQuestionIndex = selectedAnswers.length;
  const isCompleted = currentQuestionIndex >= 10;
  const currentQuestion = !isCompleted ? questions[currentQuestionIndex] : null;

  return (
    <main className="min-h-[100svh] w-full bg-[#0A0A0F] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-cyan-400/30 bg-black/30 p-5 shadow-[0_0_30px_rgba(0,229,255,0.08)] backdrop-blur">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs tracking-[0.28em] text-cyan-300/90">
              {questLabelEn}
            </p>
            <h1 className="font-orbitron text-2xl tracking-wide text-[#FFD700]">
              {scenario.label}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              全10問・4択。知識量ではなく、課題定義・設計・判断の筋道を問う診断。
              テンポ重視の固定出題です。
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
            <h2 className="font-orbitron text-sm tracking-wide text-cyan-200">
              SCENARIO
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/85">
              {scenario.introText}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
            <h2 className="font-orbitron text-sm tracking-wide text-cyan-200">
              RULES
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                <span>全10問、各問4択で進行します。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                <span>知識量ではなく、思考の筋道を評価します。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                <span>テンポ重視の固定出題です（戻って修正は想定しません）。</span>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            {!hasStarted ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers([]);
                  setDiagnosisResult(null);
                  setHasStarted(true);
                }}
                className="w-full rounded-xl border border-cyan-300/60 bg-cyan-400/10 px-4 py-3 font-mono text-sm tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.20)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
              >
                ▶ 診断を開始する
              </button>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                {!isCompleted ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs tracking-wide text-white/70">
                        Q{currentQuestionIndex + 1} / 10
                      </p>
                      <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 font-mono text-[11px] tracking-wide text-cyan-100">
                        {scenario.label}
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                      <p className="text-sm leading-relaxed text-white/90">
                        {currentQuestion?.questionText ??
                          "設問データが見つかりません。"}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {(currentQuestion?.options ?? []).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            if (!currentQuestion) return;
                            setSelectedAnswers((prev) => {
                              if (prev.length >= 10) return prev;

                              const next: AnswerRecord = {
                                questionId: currentQuestion.questionId,
                                selectedOption: opt.key,
                                scores: opt.scores,
                              };

                              const nextAnswers = [...prev, next];

                              try {
                                sessionStorage.setItem(
                                  SESSION_KEY_ANSWERS,
                                  JSON.stringify(nextAnswers),
                                );
                              } catch {
                                // ignore
                              }

                              if (nextAnswers.length === 10) {
                                const totalScores = nextAnswers.reduce<AxisScores>(
                                  (acc, a) => addScores(acc, a.scores),
                                  { purpose: 0, design: 0, decision: 0 },
                                );

                                const normalizedScores = calcNormalizedScores(
                                  totalScores,
                                  scenario.maxScores,
                                );

                                const levels = calcLevels(normalizedScores);
                                const resultType = calcResultType(levels);

                                const result: DiagnosisResult = {
                                  questType: questType as QuestType,
                                  answers: nextAnswers,
                                  totalScores,
                                  normalizedScores,
                                  levels,
                                  resultType,
                                };

                                setDiagnosisResult(result);
                              }

                              return nextAnswers;
                            });
                          }}
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-left shadow-[0_0_22px_rgba(0,229,255,0.05)] transition hover:border-cyan-300/30 hover:bg-black/35 active:scale-[0.99]"
                        >
                          <div className="flex gap-3">
                            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cyan-300/40 bg-cyan-400/10 font-mono text-xs text-cyan-100">
                              {opt.key}
                            </span>
                            <span className="text-sm leading-relaxed text-white/85">
                              {opt.text}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#FFD700]/30 bg-black/40 p-4">
                    <p className="font-mono text-sm text-[#FFD700]/90">
                      診断完了（10 / 10）
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      クエスト完了だ。お前の判断は、すべて見届けた。
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      ギルドマスターが審査を開始する…
                    </p>

                    <button
                      type="button"
                      disabled={!diagnosisResult || selectedAnswers.length !== 10}
                      onClick={() => {
                        if (!diagnosisResult) return;
                        if (selectedAnswers.length !== 10) return;

                        try {
                          sessionStorage.setItem(
                            SESSION_KEY_RESULT,
                            JSON.stringify(diagnosisResult),
                          );
                        } catch {
                          // ignore
                        }

                        router.replace("/loading");
                      }}
                      className="mt-5 w-full rounded-xl border border-cyan-300/60 bg-cyan-400/10 px-4 py-3 font-mono text-sm tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.20)] transition hover:bg-cyan-400/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ▶ 審査へ進む
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


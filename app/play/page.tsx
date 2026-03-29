"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { questionMaster } from "@/data/questionMaster";
import type {
  AnswerRecord,
  AxisLevels,
  AxisScores,
  DiagnosisResult,
  OptionKey,
  Question,
  QuestionOption,
  ResultType,
} from "@/types";

const SESSION_KEY_ANSWERS = "questoria_answers";
const SESSION_KEY_RESULT = "questoria_result";

const DISPLAY_LABELS: OptionKey[] = ["A", "B", "C", "D"];

const optionOrderMap: Record<string, number[]> = {
  q1: [2, 0, 3, 1],
  q2: [3, 1, 0, 2],
  q3: [1, 3, 2, 0],
  q4: [0, 2, 1, 3],
  q5: [2, 1, 3, 0],
  q6: [1, 0, 2, 3],
  q7: [3, 2, 0, 1],
  q8: [0, 3, 1, 2],
  q9: [2, 0, 1, 3],
  q10: [1, 2, 3, 0],
  q11: [3, 0, 2, 1],
  q12: [0, 1, 3, 2],
};

type DisplayOption = QuestionOption & {
  displayLabel: OptionKey;
};

function getOrderedOptions(question: Question): DisplayOption[] {
  const order = optionOrderMap[question.id] ?? [0, 1, 2, 3];

  return order.map((originalIndex, displayIndex) => ({
    ...question.options[originalIndex],
    displayLabel: DISPLAY_LABELS[displayIndex],
  }));
}

function getAxisInitialScores(): AxisScores {
  return {
    purpose: 0,
    design: 0,
    decision: 0,
  };
}

function normalizeScore(raw: number): number {
  return Math.round((raw / 8) * 100);
}

function getLevel(score: number): AxisLevels["purpose"] {
  if (score >= 67) return "HIGH";
  if (score >= 34) return "MID";
  return "LOW";
}

function getResultType(normalizedScores: AxisScores): ResultType {
  const p = normalizedScores.purpose >= 67;
  const d = normalizedScores.design >= 67;
  const j = normalizedScores.decision >= 67;

  if (p && d && j) return "hero";
  if (p && d && !j) return "sage";
  if (p && !d && j) return "berserker";
  if (p && !d && !j) return "oracle";
  if (!p && d && j) return "artisan";
  if (!p && d && !j) return "wizard";
  if (!p && !d && j) return "pioneer";
  return "origin";
}

function calculateDiagnosisResult(answers: AnswerRecord[]): DiagnosisResult {
  const rawScores = answers.reduce<AxisScores>((acc, answer) => {
    const question = questionMaster.find((item) => item.id === answer.questionId);
    if (!question) return acc;

    acc[question.axis] += answer.score;
    return acc;
  }, getAxisInitialScores());

  const normalizedScores: AxisScores = {
    purpose: normalizeScore(rawScores.purpose),
    design: normalizeScore(rawScores.design),
    decision: normalizeScore(rawScores.decision),
  };

  const levels: AxisLevels = {
    purpose: getLevel(normalizedScores.purpose),
    design: getLevel(normalizedScores.design),
    decision: getLevel(normalizedScores.decision),
  };

  return {
    answers,
    rawScores,
    normalizedScores,
    levels,
    resultType: getResultType(normalizedScores),
  };
}

export default function PlayPage() {
  const router = useRouter();

  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerRecord[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(
    null,
  );

  const currentQuestionIndex = selectedAnswers.length;
  const totalQuestions = questionMaster.length;
  const isCompleted = currentQuestionIndex >= totalQuestions;

  const currentQuestion = useMemo(() => {
    if (isCompleted) return null;
    return questionMaster[currentQuestionIndex] ?? null;
  }, [currentQuestionIndex, isCompleted]);

  const currentDisplayOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return getOrderedOptions(currentQuestion);
  }, [currentQuestion]);

  const handleStart = () => {
    setSelectedAnswers([]);
    setDiagnosisResult(null);

    try {
      sessionStorage.removeItem(SESSION_KEY_ANSWERS);
      sessionStorage.removeItem(SESSION_KEY_RESULT);
    } catch {
      // noop
    }

    setHasStarted(true);
  };

  const handleSelectOption = (option: DisplayOption) => {
    if (!currentQuestion) return;
    if (selectedAnswers.length >= totalQuestions) return;

    const nextAnswer: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOption: option.displayLabel,
      score: option.score,
    };

    const nextAnswers = [...selectedAnswers, nextAnswer];
    setSelectedAnswers(nextAnswers);

    try {
      sessionStorage.setItem(SESSION_KEY_ANSWERS, JSON.stringify(nextAnswers));
    } catch {
      // noop
    }

    if (nextAnswers.length === totalQuestions) {
      const result = calculateDiagnosisResult(nextAnswers);
      setDiagnosisResult(result);
    }
  };

  const handleGoLoading = () => {
    if (!diagnosisResult) return;
    if (selectedAnswers.length !== totalQuestions) return;

    try {
      sessionStorage.setItem(SESSION_KEY_RESULT, JSON.stringify(diagnosisResult));
    } catch {
      // noop
    }

    router.replace("/loading");
  };

  return (
    <main className="min-h-[100svh] w-full bg-[#0A0A0F] px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-cyan-400/30 bg-black/30 p-5 shadow-[0_0_30px_rgba(0,229,255,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/25 bg-[#00E5FF]/5 px-3 py-2 font-[var(--font-share-tech)] text-xs tracking-[0.22em] text-[#00E5FF] transition-colors hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              ← BACK
            </button>

            <span className="rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-2 font-[var(--font-orbitron)] text-[10px] tracking-[0.18em] text-[#FFD700]">
              SINGLE FLOW
            </span>
          </div>

          <div className="mt-6">
            <p className="font-mono text-xs tracking-[0.28em] text-cyan-300/90">
              AI SKILL DIAGNOSIS
            </p>
            <h1 className="mt-2 font-orbitron text-2xl tracking-wide text-[#FFD700]">
              QUESTORIA
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              全12問・4択。知識量ではなく、課題定義・設計・判断の筋道を問う診断。
              クエスト選択は不要。単一フローで審査まで進みます。
            </p>
          </div>

          {!hasStarted ? (
            <>
              <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-orbitron text-sm tracking-wide text-cyan-200">
                    RUNE
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.25em] text-[#FFD700]">
                    GUIDE
                  </p>
                </div>

                <div className="mt-3 space-y-3 text-sm leading-7 text-white/85">
                  <p>
                    ようこそ、挑戦者よ。ここから先に待つのは、知識を問う試験ではない。
                  </p>
                  <p>
                    問われるのは、「何をやるべきか」「どう進めるべきか」「最後にどう判断するか」。
                  </p>
                  <p>
                    お前の思考の軌跡は、すべてギルドマスターが見届ける。
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
                <h2 className="font-orbitron text-sm tracking-wide text-cyan-200">
                  RULES
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>TRIAL 1〜12 を順番に進行します。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>各設問は4択です。テンポ重視で進みます。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>Q12完了後に審査へ進み、結果が確定します。</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full rounded-xl border border-cyan-300/60 bg-cyan-400/10 px-4 py-3 font-mono text-sm tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.20)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
                >
                  ▶ 診断を開始する
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              {!isCompleted && currentQuestion ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs tracking-wide text-white/70">
                        TRIAL {currentQuestionIndex + 1} / {totalQuestions}
                      </p>
                      <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 font-mono text-[11px] tracking-wide text-cyan-100">
                        {currentQuestion.axis.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-1">
                      {questionMaster.map((question, index) => {
                        const isActive = index === currentQuestionIndex;
                        const isPassed = index < currentQuestionIndex;

                        return (
                          <div
                            key={question.id}
                            className={`h-2 rounded-full ${
                              isPassed
                                ? "bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.55)]"
                                : isActive
                                  ? "bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.55)]"
                                  : "bg-white/10"
                            }`}
                            aria-hidden="true"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#FFD700]/20 bg-black/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[11px] tracking-[0.28em] text-[#FFD700]">
                        ◆ あなたならどうする？
                      </p>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-300/80">
                        {currentQuestion.theme}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {currentQuestion.question.map((line, index) =>
                        line === "" ? (
                          <div key={`${currentQuestion.id}-blank-${index}`} className="h-2" />
                        ) : (
                          <p
                            key={`${currentQuestion.id}-line-${index}`}
                            className="text-sm leading-relaxed text-white/90"
                          >
                            {line}
                          </p>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {currentDisplayOptions.map((option) => (
                      <button
                        key={`${currentQuestion.id}-${option.displayLabel}-${option.text}`}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-left shadow-[0_0_22px_rgba(0,229,255,0.05)] transition hover:border-cyan-300/30 hover:bg-black/35 active:scale-[0.99]"
                      >
                        <div className="flex gap-3">
                          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cyan-300/40 bg-cyan-400/10 font-mono text-xs text-cyan-100">
                            {option.displayLabel}
                          </span>
                          <span className="text-sm leading-relaxed text-white/85">
                            {option.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#FFD700]/30 bg-black/40 p-4">
                  <p className="font-mono text-sm text-[#FFD700]/90">
                    診断完了（12 / 12）
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    クエスト完了だ。お前の判断は、すべて見届けた。
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    ギルドマスターが審査を開始する…
                  </p>

                  <button
                    type="button"
                    disabled={!diagnosisResult || selectedAnswers.length !== totalQuestions}
                    onClick={handleGoLoading}
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
    </main>
  );
}
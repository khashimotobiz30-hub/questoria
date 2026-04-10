"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { questionMaster, questionMasterV2 } from "@/data/questionMaster";
import type {
  AnswerRecord,
  AxisLevels,
  AxisScores,
  DiagnosisMode,
  DiagnosisResult,
  OptionKey,
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

type DisplayChoice = {
  id: OptionKey;
  text: string;
  score: number;
  correct: boolean;
  displayLabel: OptionKey;
};

function getOrderedChoices(
  questionId: string,
  choices: { id: OptionKey; score: number; correct: boolean; text: string }[],
): DisplayChoice[] {
  const order = optionOrderMap[questionId] ?? [0, 1, 2, 3];
  return order.map((originalIndex, displayIndex) => ({
    ...choices[originalIndex],
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
  if (p && !d && j) return "hunter";
  if (p && !d && !j) return "prophet";
  if (!p && d && j) return "artisan";
  if (!p && d && !j) return "wizard";
  if (!p && !d && j) return "pioneer";
  return "origin";
}

function calculateDiagnosisResult(answers: AnswerRecord[], mode: DiagnosisMode): DiagnosisResult {
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
    mode,
    answers,
    rawScores,
    normalizedScores,
    levels,
    resultType: getResultType(normalizedScores),
  };
}

function parseMode(raw: string | null): DiagnosisMode {
  return raw === "easy" || raw === "hard" ? raw : "hard";
}

export default function PlayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMode = parseMode(searchParams.get("mode"));

  const [hasStarted, setHasStarted] = useState(false);
  const [activeMode, setActiveMode] = useState<DiagnosisMode>(urlMode);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerRecord[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    if (hasStarted) return;
    setActiveMode(urlMode);
  }, [hasStarted, urlMode]);

  const currentQuestionIndex = selectedAnswers.length;
  const totalQuestions = questionMasterV2.length;
  const isCompleted = currentQuestionIndex >= totalQuestions;

  const currentQuestion = useMemo(() => {
    if (isCompleted) return null;
    return questionMasterV2[currentQuestionIndex] ?? null;
  }, [currentQuestionIndex, isCompleted]);

  const currentDisplayOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const choices = currentQuestion.choices.map((c) => ({
      id: c.id,
      score: c.score,
      correct: c.correct,
      text: c.text[activeMode],
    }));
    return getOrderedChoices(currentQuestion.questionId, choices);
  }, [activeMode, currentQuestion]);

  const handleStart = (mode: DiagnosisMode) => {
    setSelectedAnswers([]);
    setDiagnosisResult(null);

    try {
      sessionStorage.removeItem(SESSION_KEY_ANSWERS);
      sessionStorage.removeItem(SESSION_KEY_RESULT);
    } catch {
      // noop
    }

    setActiveMode(mode);
    router.replace(`/play?mode=${mode}`);
    setHasStarted(true);
  };

  const handleSelectOption = (option: DisplayChoice) => {
    if (!currentQuestion) return;
    if (selectedAnswers.length >= totalQuestions) return;

    const nextAnswer: AnswerRecord = {
      questionId: currentQuestion.questionId,
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
      const result = calculateDiagnosisResult(nextAnswers, activeMode);
      setDiagnosisResult(result);
    }
  };

  const handleGoLoading = () => {
    if (!diagnosisResult) return;
    if (selectedAnswers.length !== totalQuestions) return;

    try {
      const raw = JSON.stringify(diagnosisResult);
      sessionStorage.setItem(SESSION_KEY_RESULT, raw);
      // 最新1件を永続保持（タブを閉じても /result で見返せる）
      localStorage.setItem(SESSION_KEY_RESULT, raw);
    } catch {
      // noop
    }

    router.replace("/loading");
  };

  return (
    <main className="min-h-[100svh] w-full bg-[#0A0A0F] px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-cyan-400/30 bg-black/30 p-5 shadow-[0_0_30px_rgba(0,229,255,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/25 bg-[#00E5FF]/5 px-3 py-2 font-[var(--font-share-tech)] text-xs tracking-[0.22em] text-[#00E5FF] transition-colors hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              TOPに戻る
            </button>
          </div>

          <div className="mt-6">
            <p className="font-mono text-xs tracking-[0.28em] text-cyan-300/90">
              AI SKILL DIAGNOSIS
            </p>
            <h1 className="mt-2 font-orbitron text-2xl tracking-wide text-[#FFD700]">
              QUESTORIA
            </h1>
          </div>

          {!hasStarted ? (
            <>
              <div className="mt-5 rounded-xl border border-cyan-300/25 bg-gradient-to-b from-cyan-400/[0.055] via-black/[0.41] to-black/[0.44] p-4 shadow-[0_0_28px_rgba(0,229,255,0.075)]">
                <p className="font-orbitron text-sm tracking-wide text-cyan-100 [text-shadow:0_0_14px_rgba(0,229,255,0.22)]">
                  GUIDE
                </p>

                <div className="mt-3 space-y-3 text-sm leading-7 text-white/85">
                  <p>この診断は、知識を競うためのものではありません。</p>
                  <p>
                    見るのは、
                    <br />
                    課題に向き合ったときに何を重視し、
                    <br />
                    どう組み立て、どう判断するか。
                  </p>
                  <p>
                    12の設問を通して、
                    <br />
                    あなたのAI活用スタイルと
                    <br />
                    思考の強みを診断します。
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.11] bg-black/40 p-4">
                <h2 className="font-orbitron text-sm tracking-wide text-cyan-200">
                  INFO
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>全12問・4択で進みます</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>所要時間は約3〜4分です</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>回答後すぐに結果を確認できます</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD700]/85" />
                    <span>EASYは短い文章で答えやすいモードです</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD700]/85" />
                    <span>HARDは具体的な状況を読み解くモードです</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleStart("easy")}
                    className="w-full rounded-xl border border-[#FFD700]/55 bg-[#FFD700]/[0.10] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-[#fff6dc] shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(255,215,0,0.18)] transition hover:bg-[#FFD700]/[0.13] active:scale-[0.99]"
                  >
                    ▶ EASYモードで診断を始める
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStart("hard")}
                    className="w-full rounded-xl border border-cyan-300/[0.66] bg-cyan-400/[0.12] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(0,229,255,0.24)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
                  >
                    ▶ HARDモードで診断を始める
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="relative mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <span
                className="absolute right-4 top-4 rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-200/90 backdrop-blur-sm"
                style={{
                  border: "1px solid rgba(0,229,255,0.38)",
                  boxShadow: "0 0 10px rgba(0,229,255,0.16)",
                }}
              >
                {activeMode === "easy" ? "EASY" : "HARD"}
              </span>
              {!isCompleted && currentQuestion ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs tracking-wide text-white/70">
                      QUESTION {currentQuestionIndex + 1} / {totalQuestions}
                    </p>

                    <div className="grid grid-cols-12 gap-1">
                      {questionMasterV2.map((question, index) => {
                        const isActive = index === currentQuestionIndex;
                        const isPassed = index < currentQuestionIndex;

                        return (
                          <div
                            key={question.questionId}
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

                  <div className="-mx-3 rounded-xl border border-[#FFD700]/20 bg-gradient-to-b from-[#FFD700]/8 via-[#FFD700]/5 to-[#FFD700]/4 p-4">
                    <p className="font-mono text-[11px] tracking-[0.28em] text-[#FFD700]">
                      ◆ 設問
                    </p>

                    <div className="mt-4 space-y-3">
                      {currentQuestion.prompt[activeMode].split("\n").map((line, index) =>
                        line === "" ? (
                          <div key={`${currentQuestion.questionId}-blank-${index}`} className="h-2" />
                        ) : (
                          <p
                            key={`${currentQuestion.questionId}-line-${index}`}
                            className="text-sm leading-relaxed text-white/90"
                          >
                            {line}
                          </p>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="-mx-3 grid grid-cols-1 gap-3">
                    {currentDisplayOptions.map((option) => (
                      <button
                        key={`${currentQuestion.questionId}-${option.displayLabel}-${option.text}`}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className="w-full rounded-xl border border-white/[0.22] bg-black/[0.43] px-4 pb-3.5 pt-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34),0_0_26px_rgba(0,229,255,0.048)] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-black/44 hover:shadow-[0_6px_28px_rgba(0,0,0,0.45),0_0_26px_rgba(0,229,255,0.13)] active:translate-y-0 active:scale-[0.985] active:border-cyan-300/38 active:bg-black/32 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.4),0_0_16px_rgba(0,229,255,0.06)]"
                      >
                        <span className="block text-sm leading-relaxed text-white/85">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#FFD700]/30 bg-black/40 p-4">
                  <p className="font-mono text-sm text-[#FFD700]/90">
                    診断完了（12/12）
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    全12問の回答が完了しました。
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    これから結果の判定に進みます。
                  </p>

                  <button
                    type="button"
                    disabled={!diagnosisResult || selectedAnswers.length !== totalQuestions}
                    onClick={handleGoLoading}
                    className="mt-5 w-full rounded-xl border border-cyan-300/60 bg-cyan-400/10 px-4 py-3 font-mono text-sm tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.20)] transition hover:bg-cyan-400/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    結果へ進む
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


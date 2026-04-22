"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuestoriaBackground } from "@/components/questoria/QuestoriaBackground";
import { questionMaster, questionMasterV2 } from "@/data/questionMaster";
import { trackEvent } from "@/lib/analytics";
import { AXIS_HIGH_THRESHOLD, AXIS_MID_THRESHOLD } from "@/lib/diagnosisConstants";
import {
  clearStoredDiagnosisResult,
  clearStoredQuestoriaAnswers,
  QUESTORIA_ANSWERS_KEY,
  QUESTORIA_CHOICE_ORDER_KEY,
  QUESTORIA_QUESTION_ORDER_KEY,
  QUESTORIA_RESULT_KEY,
} from "@/lib/questoriaStorage";
import type {
  AnswerRecord,
  AxisLevels,
  AxisScores,
  DiagnosisMode,
  DiagnosisResult,
  OptionKey,
  ResultType,
} from "@/types";

/** `answer_progress` は途中経過のみ（1 / 4 / 8 問目完了）。12 問完了は `complete_diagnosis` に任せる */
const ANSWER_PROGRESS_MILESTONES = new Set([1, 4, 8]);

type DisplayChoice = {
  id: OptionKey;
  text: string;
  score: number;
  correct: boolean;
};

function getModeAccent(mode: DiagnosisMode) {
  const isLife = mode === "life";
  return {
    /** progress segments */
    progressPassed: isLife
      ? "bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.55)]"
      : "bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.55)]",
    progressActive: isLife
      ? "bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.55)]"
      : "bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.55)]",
    /** right-top badge */
    badgeText: isLife ? "text-[#FFFB00] font-bold" : "text-cyan-200/90",
    badgeBorder: isLife ? "rgba(255,251,0,0.55)" : "rgba(0,229,255,0.38)",
    badgeShadow: isLife ? "rgba(255,251,0,0.22)" : "rgba(0,229,255,0.16)",
    badgeBg: isLife ? "bg-[#FFFB00]/[0.06]" : "bg-black/50",
    /** question marker */
    questionMarkText: isLife ? "text-[#FFD700]" : "text-cyan-300",
    questionBoxBorder: isLife ? "border-[#FFD700]/20" : "border-cyan-300/20",
    questionBoxBg: isLife
      ? "bg-gradient-to-b from-[#FFD700]/8 via-[#FFD700]/5 to-[#FFD700]/4"
      : "bg-gradient-to-b from-cyan-400/[0.06] via-black/[0.36] to-black/[0.40]",
    /** option button accents */
    optionIconText: isLife ? "text-[#FFD700]/90" : "text-cyan-200/90",
    optionIconSelectedGlow: isLife
      ? "drop-shadow-[0_0_10px_rgba(255,215,0,0.55)] drop-shadow-[0_0_22px_rgba(255,215,0,0.22)]"
      : "drop-shadow-[0_0_10px_rgba(0,229,255,0.55)] drop-shadow-[0_0_22px_rgba(0,229,255,0.22)]",
    optionHoverBorder: isLife ? "hover:border-[#FFD700]/55" : "hover:border-cyan-300/60",
    optionHoverGlow: isLife
      ? "hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_18px_rgba(255,215,0,0.16),0_0_42px_rgba(255,215,0,0.10)]"
      : "hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_18px_rgba(0,229,255,0.16),0_0_42px_rgba(0,229,255,0.10)]",
    optionActiveBorder: isLife ? "active:border-[#FFD700]/46" : "active:border-cyan-300/48",
    optionActiveGlow: isLife
      ? "active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.45),0_0_16px_rgba(255,215,0,0.14)]"
      : "active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.45),0_0_16px_rgba(0,229,255,0.12)]",
    optionSelectedBorder: isLife ? "border-[#FFD700]/70" : "border-cyan-300/70",
    optionSelectedGlow: isLife
      ? "shadow-[0_14px_44px_rgba(0,0,0,0.54),0_0_26px_rgba(255,215,0,0.22),0_0_60px_rgba(255,215,0,0.12)]"
      : "shadow-[0_14px_44px_rgba(0,0,0,0.54),0_0_26px_rgba(0,229,255,0.22),0_0_60px_rgba(0,229,255,0.12)]",
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hasTooManyConsecutiveAxis(questionIds: string[], maxConsecutive: number): boolean {
  let runAxis: string | null = null;
  let runLen = 0;
  for (const qid of questionIds) {
    const axis = questionMaster.find((q) => q.id === qid)?.axis ?? "";
    if (axis && axis === runAxis) {
      runLen += 1;
    } else {
      runAxis = axis;
      runLen = 1;
    }
    if (runLen > maxConsecutive) return true;
  }
  return false;
}

function buildQuestionOrder(): string[] {
  const base = questionMaster.map((q) => q.id);
  // 軽い分散（同一axisが3連続しない）を優先しつつ、自然なランダム性を保つ
  for (let attempt = 0; attempt < 60; attempt++) {
    const candidate = shuffle(base);
    if (!hasTooManyConsecutiveAxis(candidate, 2)) return candidate;
  }
  return shuffle(base);
}

type ChoiceOrderMap = Record<string, OptionKey[]>;

function buildChoiceOrderMap(questionIds: string[]): ChoiceOrderMap {
  const out: ChoiceOrderMap = {};
  for (const qid of questionIds) {
    out[qid] = shuffle<OptionKey>(["A", "B", "C", "D"]);
  }
  return out;
}

function isValidQuestionOrder(maybe: unknown): maybe is string[] {
  if (!Array.isArray(maybe)) return false;
  const base = questionMaster.map((q) => q.id);
  if (maybe.length !== base.length) return false;
  const set = new Set(maybe);
  if (set.size !== base.length) return false;
  return base.every((id) => set.has(id));
}

function isValidChoiceOrderMap(maybe: unknown, questionOrder: string[]): maybe is ChoiceOrderMap {
  if (!maybe || typeof maybe !== "object") return false;
  const m = maybe as Record<string, unknown>;
  for (const qid of questionOrder) {
    const v = m[qid];
    if (!Array.isArray(v) || v.length !== 4) return false;
    const s = new Set(v);
    if (s.size !== 4) return false;
    for (const k of v) {
      if (k !== "A" && k !== "B" && k !== "C" && k !== "D") return false;
    }
  }
  return true;
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
  if (score >= AXIS_HIGH_THRESHOLD) return "HIGH";
  if (score >= AXIS_MID_THRESHOLD) return "MID";
  return "LOW";
}

function getResultType(normalizedScores: AxisScores): ResultType {
  const p = normalizedScores.purpose >= AXIS_HIGH_THRESHOLD;
  const d = normalizedScores.design >= AXIS_HIGH_THRESHOLD;
  const j = normalizedScores.decision >= AXIS_HIGH_THRESHOLD;

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
  if (raw === "work" || raw === "life") return raw;
  if (raw === "hard") return "work";
  if (raw === "easy") return "life";
  return "work";
}

export default function PlayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMode = parseMode(searchParams.get("mode"));
  const isFreshStart = searchParams.get("fresh") === "1";
  const isDebugPersist = searchParams.get("debugPersist") === "1";

  const [hasStarted, setHasStarted] = useState(false);
  const [activeMode, setActiveMode] = useState<DiagnosisMode>(urlMode);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerRecord[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectedFx, setSelectedFx] = useState<{ questionId: string; optionId: OptionKey } | null>(null);
  const [questionEnter, setQuestionEnter] = useState(false);
  const [questionOrder, setQuestionOrder] = useState<string[]>(() => questionMaster.map((q) => q.id));
  const [choiceOrderMap, setChoiceOrderMap] = useState<ChoiceOrderMap>({});

  useEffect(() => {
    if (hasStarted) return;
    setActiveMode(urlMode);
  }, [hasStarted, urlMode]);

  // トップCTA（fresh=1）からの遷移は、必ず新規開始として扱う
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isFreshStart) return;

    clearStoredQuestoriaAnswers();

    setSelectedAnswers([]);
    setDiagnosisResult(null);
    setHasStarted(false);
    setQuestionOrder(questionMaster.map((q) => q.id));
    setChoiceOrderMap({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFreshStart]);

  // 診断の途中復帰（回答・表示順を復元）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFreshStart) return;
    if (hasStarted) return;
    try {
      const rawAnswers = sessionStorage.getItem(QUESTORIA_ANSWERS_KEY);
      if (rawAnswers) {
        const parsed = JSON.parse(rawAnswers) as unknown;
        if (Array.isArray(parsed)) {
          setSelectedAnswers(parsed as AnswerRecord[]);
          setHasStarted(true);
        }
      }
    } catch {
      /* noop */
    }
  }, [hasStarted, isFreshStart]);

  // 表示順の復元（なければ初期化）
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawOrder = sessionStorage.getItem(QUESTORIA_QUESTION_ORDER_KEY);
      const parsedOrder = rawOrder ? (JSON.parse(rawOrder) as unknown) : null;
      const finalOrder = isValidQuestionOrder(parsedOrder) ? parsedOrder : questionOrder;

      const rawChoices = sessionStorage.getItem(QUESTORIA_CHOICE_ORDER_KEY);
      const parsedChoices = rawChoices ? (JSON.parse(rawChoices) as unknown) : null;
      const finalChoices = isValidChoiceOrderMap(parsedChoices, finalOrder)
        ? (parsedChoices as ChoiceOrderMap)
        : buildChoiceOrderMap(finalOrder);

      setQuestionOrder(finalOrder);
      setChoiceOrderMap(finalChoices);

      if (!isValidQuestionOrder(parsedOrder)) {
        sessionStorage.setItem(QUESTORIA_QUESTION_ORDER_KEY, JSON.stringify(finalOrder));
      }
      if (!isValidChoiceOrderMap(parsedChoices, finalOrder)) {
        sessionStorage.setItem(QUESTORIA_CHOICE_ORDER_KEY, JSON.stringify(finalChoices));
      }
    } catch {
      // 破損時は現状のstateを優先
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestionIndex = selectedAnswers.length;
  const totalQuestions = questionOrder.length;
  const isCompleted = currentQuestionIndex >= totalQuestions;

  const questionMapV2 = useMemo(() => new Map(questionMasterV2.map((q) => [q.questionId, q])), []);

  const currentQuestion = useMemo(() => {
    if (isCompleted) return null;
    const qid = questionOrder[currentQuestionIndex];
    return (qid ? questionMapV2.get(qid) : null) ?? null;
  }, [currentQuestionIndex, isCompleted, questionMapV2, questionOrder]);

  const currentDisplayOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const order = choiceOrderMap[currentQuestion.questionId] ?? ["A", "B", "C", "D"];
    const byId = new Map(
      currentQuestion.choices.map((c) => [
        c.id,
        { id: c.id, score: c.score, correct: c.correct, text: c.text[activeMode] } satisfies DisplayChoice,
      ]),
    );
    return order.map((id) => byId.get(id)).filter((c): c is DisplayChoice => Boolean(c));
  }, [activeMode, currentQuestion]);

  const accent = useMemo(() => getModeAccent(activeMode), [activeMode]);

  useEffect(() => {
    // Clear "selected" feedback when question advances.
    if (!currentQuestion) return;
    setSelecting(false);
    setSelectedFx(null);
    setQuestionEnter(false);
    const raf = window.requestAnimationFrame(() => setQuestionEnter(true));
    return () => window.cancelAnimationFrame(raf);
  }, [currentQuestion?.questionId]);

  const persistDiagnosisResult = (result: DiagnosisResult) => {
    if (isDebugPersist) {
      // eslint-disable-next-line no-console
      console.log("[Questoria] persistDiagnosisResult: enter", {
        resultType: result?.resultType,
        answersLength: Array.isArray(result?.answers) ? result.answers.length : null,
        hasRawScores: Boolean(result?.rawScores),
        hasNormalizedScores: Boolean(result?.normalizedScores),
        hasLevels: Boolean(result?.levels),
      });
    }
    try {
      const raw = JSON.stringify(result);
      if (isDebugPersist) {
        // eslint-disable-next-line no-console
        console.log("[Questoria] persistDiagnosisResult: JSON.stringify ok", { bytes: raw.length });
        // eslint-disable-next-line no-console
        console.log("[Questoria] persistDiagnosisResult: sessionStorage.setItem start");
      }
      sessionStorage.setItem(QUESTORIA_RESULT_KEY, raw);
      if (isDebugPersist) {
        // eslint-disable-next-line no-console
        console.log("[Questoria] persistDiagnosisResult: sessionStorage.setItem ok");
        // eslint-disable-next-line no-console
        console.log("[Questoria] persistDiagnosisResult: localStorage.setItem start");
      }
      // 最新1件を永続保持（タブを閉じても /result で見返せる）
      localStorage.setItem(QUESTORIA_RESULT_KEY, raw);
      if (isDebugPersist) {
        // eslint-disable-next-line no-console
        console.log("[Questoria] persistDiagnosisResult: localStorage.setItem ok");
      }
    } catch {
      if (isDebugPersist) {
        // eslint-disable-next-line no-console
        console.error("[Questoria] persistDiagnosisResult: failed");
      }
    }
  };

  // リロード等で 12/12 まで進んでいる場合は結果を復元
  useEffect(() => {
    if (!hasStarted) return;
    if (diagnosisResult) return;
    if (selectedAnswers.length !== totalQuestions) return;
    setDiagnosisResult(calculateDiagnosisResult(selectedAnswers, activeMode));
  }, [activeMode, diagnosisResult, hasStarted, selectedAnswers, totalQuestions]);

  const handleStart = (mode: DiagnosisMode) => {
    setSelectedAnswers([]);
    setDiagnosisResult(null);

    clearStoredQuestoriaAnswers();

    const newQuestionOrder = buildQuestionOrder();
    const newChoiceOrders = buildChoiceOrderMap(newQuestionOrder);
    setQuestionOrder(newQuestionOrder);
    setChoiceOrderMap(newChoiceOrders);
    try {
      sessionStorage.setItem(QUESTORIA_QUESTION_ORDER_KEY, JSON.stringify(newQuestionOrder));
      sessionStorage.setItem(QUESTORIA_CHOICE_ORDER_KEY, JSON.stringify(newChoiceOrders));
    } catch {
      // noop
    }

    setActiveMode(mode);
    if (isDebugPersist) {
      const params = new URLSearchParams();
      params.set("mode", mode);
      if (isFreshStart) params.set("fresh", "1");
      params.set("debugPersist", "1");
      router.replace(`/play?${params.toString()}`);
    } else {
      router.replace(`/play?mode=${mode}`);
    }
    setHasStarted(true);

    trackEvent("start_diagnosis", { mode });
  };

  const commitSelectOption = (option: DisplayChoice) => {
    if (!currentQuestion) return;
    if (selectedAnswers.length >= totalQuestions) return;

    const nextAnswer: AnswerRecord = {
      questionId: currentQuestion.questionId,
      selectedChoiceId: option.id,
      score: option.score,
    };

    const nextAnswers = [...selectedAnswers, nextAnswer];
    setSelectedAnswers(nextAnswers);

    try {
      sessionStorage.setItem(QUESTORIA_ANSWERS_KEY, JSON.stringify(nextAnswers));
    } catch {
      // noop
    }

    if (ANSWER_PROGRESS_MILESTONES.has(nextAnswers.length)) {
      trackEvent("answer_progress", {
        mode: activeMode,
        question_index: nextAnswers.length,
        question_id: currentQuestion.questionId,
      });
    }

    if (nextAnswers.length === totalQuestions) {
      const result = calculateDiagnosisResult(nextAnswers, activeMode);
      setDiagnosisResult(result);
      // 「結果へ進む」を押さずに離脱しても前回結果が残るよう、完了時点で永続化
      if (isDebugPersist) {
        // eslint-disable-next-line no-console
        console.log("[Questoria] complete branch", {
          nextAnswersLength: nextAnswers.length,
          totalQuestions,
          resultType: result?.resultType,
          resultAnswersLength: Array.isArray(result?.answers) ? result.answers.length : null,
        });
      }
      persistDiagnosisResult(result);
      trackEvent("complete_diagnosis", {
        mode: activeMode,
        result_type: result.resultType,
      });
    }
  };

  const handleSelectOption = (option: DisplayChoice) => {
    if (!currentQuestion) return;
    if (selecting) return;
    setSelecting(true);
    setSelectedFx({ questionId: currentQuestion.questionId, optionId: option.id });
    // Give a short visual feedback window (tap/selection) before advancing.
    window.setTimeout(() => {
      commitSelectOption(option);
    }, 200);
  };

  const handleGoLoading = () => {
    if (!diagnosisResult) return;
    if (selectedAnswers.length !== totalQuestions) return;

    persistDiagnosisResult(diagnosisResult);

    router.replace("/loading");
  };

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden px-4 py-6 text-white">
      <QuestoriaBackground blurAmount="blur-md" overlayOpacity="bg-black/60" showParticles={false} />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 p-5 shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_30px_rgba(0,229,255,0.08)] backdrop-blur-2xl">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
            aria-hidden
          />
          <div className="relative">
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
              <div className="mt-5 rounded-xl border border-cyan-300/20 bg-gradient-to-b from-white/5 via-slate-900/40 to-transparent p-4 shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_28px_rgba(0,229,255,0.075)] backdrop-blur-2xl">
                <p className="font-orbitron text-sm tracking-wide text-cyan-100 [text-shadow:0_0_14px_rgba(0,229,255,0.22)]">
                  <span className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.28)]" aria-hidden>
                    ◆
                  </span>
                  GUIDE
                </p>

                <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/85">
                  <p>
                    AIを使いこなすうえで重要なのは、
                    <br />
                    知識量そのものではなく、
                  </p>

                  <ul className="space-y-1.5 border-l-2 border-cyan-300/25 pl-3 text-white/86">
                    <li>何を解決するかを定める力</li>
                    <li>進め方を組み立てる力</li>
                    <li>出力を見極めて判断する力</li>
                  </ul>

                  <p>の3つです。</p>

                  <p className="text-white/82">
                    この診断では、設問への回答を通して、
                    <br />
                    AI活用に必要な
                    <span className="font-semibold text-white/90">「目的定義力」「設計力」「判断力」</span>
                    の3つのスキルを診断します。
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/20 bg-slate-900/35 p-4 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
                <h2 className="font-orbitron text-sm tracking-wide text-cyan-200">
                  <span className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.24)]" aria-hidden>
                    ◆
                  </span>
                  INFO
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>全12問・4択で進みます</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>所要時間は約3〜4分です</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>回答後すぐに結果を確認できます</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>知識量ではなく、考え方や進め方をみる診断です</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>LIFEは日常シチュエーションで答えるモードです</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>WORKは仕事シチュエーションで答えるモードです</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <div className="w-full">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleStart("life")}
                    className="w-full rounded-xl border border-[#FFD700]/55 bg-[#FFD700]/[0.10] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-[#fff6dc] shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(255,215,0,0.18)] transition hover:bg-[#FFD700]/[0.13] active:scale-[0.99]"
                  >
                    ▶ LIFEモードで診断を始める
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStart("work")}
                    className="w-full rounded-xl border border-cyan-300/[0.66] bg-cyan-400/[0.12] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(0,229,255,0.24)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
                  >
                    ▶ WORKモードで診断を始める
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/light?fresh=1")}
                    className="w-full rounded-xl border border-cyan-400/35 bg-slate-900/35 px-4 py-3 font-mono text-[13px] font-medium leading-snug tracking-wide text-white/80 shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_16px_rgba(0,229,255,0.06),inset_0_1px_0_rgba(255,255,255,0.06),0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-2xl opacity-80 transition hover:border-cyan-300/60 hover:bg-slate-900/40 hover:text-white/90 hover:shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_24px_rgba(0,229,255,0.14),0_10px_26px_rgba(0,0,0,0.35)] hover:opacity-100 active:scale-[0.99]"
                  >
                    ▶ 初回診断（LIGHT）をやり直す
                  </button>
                </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative mt-6 rounded-xl border border-white/20 bg-slate-900/35 p-4 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
              <span
                className={`absolute right-4 top-4 rounded-sm px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] backdrop-blur-sm ${accent.badgeBg} ${accent.badgeText}`}
                style={{
                  border: `1px solid ${accent.badgeBorder}`,
                  boxShadow: `0 0 10px ${accent.badgeShadow}`,
                }}
              >
                {activeMode === "life" ? "LIFE" : "WORK"}
              </span>
              {!isCompleted && currentQuestion ? (
                <div
                  className={`flex flex-col gap-4 transition-all duration-300 ease-out ${
                    questionEnter ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs tracking-wide text-white/70">
                      QUESTION {currentQuestionIndex + 1} / {totalQuestions}
                    </p>

                    <div className="rounded-xl border border-white/20 bg-slate-900/35 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
                      <div className="grid grid-cols-12 gap-1">
                      {questionOrder.map((questionId, index) => {
                        const isActive = index === currentQuestionIndex;
                        const isPassed = index < currentQuestionIndex;

                        return (
                          <div
                            key={questionId}
                            className={`h-2 rounded-full ${
                              isPassed
                                ? accent.progressPassed
                                : isActive
                                  ? "bg-white animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                  : "bg-white/16 border border-white/[0.10]"
                            }`}
                            aria-hidden="true"
                          />
                        );
                      })}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative -mx-3 overflow-hidden rounded-xl border p-4 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl ${accent.questionBoxBorder} bg-slate-900/35`}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                      aria-hidden
                    />
                    <div className="relative">
                    <p className={`font-mono text-[11px] tracking-[0.28em] ${accent.questionMarkText}`}>
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
                  </div>

                  <div className="-mx-3 grid grid-cols-1 gap-3">
                    {currentDisplayOptions.map((option) => (
                      (() => {
                        const isSelected =
                          selectedFx?.questionId === currentQuestion.questionId &&
                          selectedFx?.optionId === option.id;
                        return (
                      <button
                      key={`${currentQuestion.questionId}-${option.id}-${option.text}`}
                        type="button"
                        disabled={selecting}
                        onClick={() => handleSelectOption(option)}
                        className={`relative w-full overflow-hidden rounded-xl border bg-slate-900/45 px-6 pb-3.5 pt-4 shadow-[0_0_10px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-900/50 active:translate-y-0 active:scale-[0.985] active:bg-slate-900/40 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isSelected ? `${accent.optionSelectedBorder} ${accent.optionSelectedGlow}` : "border-white/20"
                        } ${accent.optionHoverBorder} ${accent.optionHoverGlow} ${accent.optionActiveBorder} ${accent.optionActiveGlow}`}
                      >
                        <span
                          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                          aria-hidden
                        />
                        <span className="relative flex w-full items-start justify-start gap-3">
                          <span
                            className={`mt-1 w-4 shrink-0 font-mono text-[12px] leading-none ${accent.optionIconText} ${
                              isSelected ? accent.optionIconSelectedGlow : ""
                            }`}
                            aria-hidden
                          >
                            ◆
                          </span>
                          <span className="min-w-0 flex-1 text-left text-sm leading-relaxed text-white/88">
                            {option.text}
                          </span>
                        </span>
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <p
                    className={`font-mono text-sm ${
                      activeMode === "life"
                        ? "font-bold text-[#FFFB00] drop-shadow-[0_0_8px_rgba(255,251,0,0.35)]"
                        : "font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.35)]"
                    }`}
                  >
                    診断完了 (12/12)
                  </p>

                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`complete-${index}`}
                        className={`h-2 rounded-full ${
                          activeMode === "life"
                              ? "bg-[#FFFB00] shadow-[0_0_14px_rgba(255,251,0,0.60)]"
                              : "bg-cyan-300 shadow-[0_0_14px_rgba(0,229,255,0.60)]"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <div className="space-y-2 text-center">
                    <p className="text-sm leading-relaxed text-white/90">
                      全ての質問への回答が完了しました。
                    </p>
                    <p className="text-sm leading-relaxed text-white/84">
                      回答内容に基づき、あなたのタイプを診断します。
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!diagnosisResult || selectedAnswers.length !== totalQuestions}
                    onClick={handleGoLoading}
                    className={`relative w-full overflow-hidden rounded-xl border bg-transparent px-6 py-5 shadow-[0_0_10px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40 ${
                      activeMode === "life"
                        ? "border-[#FFD700]/75 shadow-[0_0_14px_rgba(255,215,0,0.32),0_0_26px_rgba(255,215,0,0.16),0_0_10px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] hover:border-[#FFD700]/90 hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_18px_rgba(255,215,0,0.42),0_0_44px_rgba(255,215,0,0.22)]"
                        : "border-[#00FFFF]/70 shadow-[0_0_14px_rgba(0,255,255,0.30),0_0_26px_rgba(0,255,255,0.15),0_0_10px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] hover:border-[#00FFFF]/90 hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_18px_rgba(0,255,255,0.38),0_0_44px_rgba(0,255,255,0.20)]"
                    } motion-safe:animate-[pulse_2.2s_ease-in-out_infinite]`}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                      aria-hidden
                    />
                    <span className="relative flex w-full items-center justify-center gap-2">
                      <span
                        className={`w-4 shrink-0 font-mono text-[12px] leading-none ${
                          activeMode === "life" ? "text-[#FFD700]" : "text-[#00FFFF]"
                        } drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]`}
                        aria-hidden
                      >
                        ▶
                      </span>
                      <span
                        className={`text-sm font-medium tracking-[0.2em] ${
                          activeMode === "life" ? "text-[#FFD700]" : "text-[#00FFFF]"
                        } drop-shadow-[0_0_10px_rgba(255,255,255,0.16)]`}
                      >
                        診断結果を確認する
                      </span>
                    </span>
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


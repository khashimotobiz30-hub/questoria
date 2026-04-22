"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuestoriaBackground } from "@/components/questoria/QuestoriaBackground";
import {
  LIGHT_QUESTION_SET_ID,
  LIGHT_QUESTION_SET_VERSION,
  lightQuestionMaster,
} from "@/data/lightQuestionMaster";
import { trackEvent } from "@/lib/analytics";
import { createLightResponseLog, generateLightResponseId, setLastLightResponseId } from "@/lib/lightResponseLog";
import { createLightResponseLogSupabase } from "@/lib/lightResponseLogSupabase";
import { isDebugLogEnabled, syncDebugLogFromQueryParam } from "@/lib/debugLog";
import { buildLightDiagnosisResult, type LightSelectedAnswer } from "@/lib/questoria/lightScoring";
import { QUESTORIA_LIGHT_RESULT_KEY } from "@/lib/questoriaStorage";
import type { LightDiagnosisResult } from "@/types";

function persistLightResult(result: LightDiagnosisResult) {
  try {
    const raw = JSON.stringify(result);
    sessionStorage.setItem(QUESTORIA_LIGHT_RESULT_KEY, raw);
    localStorage.setItem(QUESTORIA_LIGHT_RESULT_KEY, raw);
  } catch {
    // noop
  }
}

export default function LightClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFreshStart = searchParams.get("fresh") === "1";
  const urlLog = searchParams.get("log");
  const [isDebugLog, setIsDebugLog] = useState(false);
  const completeSentRef = useRef(false);
  const insertPromiseRef = useRef<Promise<unknown> | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [selected, setSelected] = useState<LightSelectedAnswer[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [questionEnter, setQuestionEnter] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFx, setSelectedFx] = useState<{ questionId: string; optionId: string } | null>(
    null,
  );

  const currentIndex = selected.length;
  const total = lightQuestionMaster.length;
  const isCompleted = currentIndex >= total;

  useEffect(() => {
    if (!isFreshStart) return;
    setSelected([]);
    setHasStarted(false);
  }, [isFreshStart]);

  useEffect(() => {
    syncDebugLogFromQueryParam(urlLog);
    setIsDebugLog(isDebugLogEnabled());
  }, [urlLog]);

  const currentQuestion = useMemo(() => {
    if (isCompleted) return null;
    return lightQuestionMaster[currentIndex] ?? null;
  }, [currentIndex, isCompleted]);

  useEffect(() => {
    if (!currentQuestion) return;
    setSelecting(false);
    setSelectedFx(null);
    setQuestionEnter(false);
    const raf = window.requestAnimationFrame(() => setQuestionEnter(true));
    return () => window.cancelAnimationFrame(raf);
  }, [currentQuestion?.id]);

  const handleStart = () => {
    setSelected([]);
    setHasStarted(true);
    completeSentRef.current = false;
    trackEvent("start_light_diagnosis", {
      question_set_id: LIGHT_QUESTION_SET_ID,
      version: LIGHT_QUESTION_SET_VERSION,
      total_questions: total,
      fresh: isFreshStart,
    });
  };

  const handleSelect = (optionId: string) => {
    if (!currentQuestion) return;
    if (selected.length >= total) return;
    if (selecting) return;
    const opt = currentQuestion.options.find((o) => o.id === optionId);
    if (!opt) return;

    setSelecting(true);
    setSelectedFx({ questionId: currentQuestion.id, optionId });

    const next = [...selected, { questionId: currentQuestion.id, optionId }];
    window.setTimeout(() => {
      setSelected(next);
      if (next.length === total) {
        const result = buildLightDiagnosisResult(lightQuestionMaster, next);
        persistLightResult(result);
        const light_response_id = generateLightResponseId();
        setLastLightResponseId(light_response_id);
        if (isDebugLog) {
          // eslint-disable-next-line no-console
          console.log("[Questoria] LIGHT complete: generated light_response_id", light_response_id);
        }
        // Analysis log (best-effort, never block UI)
        createLightResponseLog({ result, light_response_id });
        insertPromiseRef.current = createLightResponseLogSupabase({ result, light_response_id });
        if (!completeSentRef.current) {
          completeSentRef.current = true;
          trackEvent("complete_light_diagnosis", {
            question_set_id: result.questionSetId,
            version: result.version,
            total_questions: result.answers.length,
            result_type: result.resultType,
            levels_purpose: result.levels.purpose,
            levels_design: result.levels.design,
            levels_judgment: result.levels.judgment,
          });
        }
      }
    }, 200);
  };

  const handleGoLoading = () => {
    if (!isCompleted) return;
    const result = buildLightDiagnosisResult(lightQuestionMaster, selected);
    persistLightResult(result);
    trackEvent("click_light_go_loading", {
      question_set_id: result.questionSetId,
      version: result.version,
      total_questions: result.answers.length,
      result_type: result.resultType,
    });
    setSaving(true);
    void (async () => {
      try {
        // Ensure Supabase insert is completed before leaving the LIGHT flow.
        // This reduces the chance of deep-start updates running before the row exists.
        const p = insertPromiseRef.current ?? createLightResponseLogSupabase({ result });
        insertPromiseRef.current = p;
        await p;
      } catch {
        // best-effort only (never block UI)
      } finally {
        setSaving(false);
        router.replace("/loading?src=light");
      }
    })();
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
              ENTRY DIAGNOSIS
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
                  LIGHT GUIDE
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
                    <span className="font-semibold text-white/90">
                      「目的定義力」「設計力」「判断力」
                    </span>
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
                    <span>全10問・選択式の設問で進みます</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>所要時間は約1〜2分です</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>回答後すぐに結果を確認できます</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>初回診断用の簡易モードです</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1 w-1 shrink-0 translate-y-[6px] rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>より詳しく知りたい方は、簡易診断後にWORK / LIFEモードを選べます</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full rounded-xl border border-cyan-300/[0.66] bg-cyan-400/[0.12] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(0,229,255,0.24)] transition hover:bg-cyan-400/15 hover:shadow-[0_0_40px_rgba(0,229,255,0.24)] active:scale-[0.99]"
                >
                  ▶ LIGHT診断を始める
                </button>
              </div>
            </>
          ) : (
            <div className="relative mt-6 rounded-xl border border-white/20 bg-slate-900/35 p-4 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
              <span
                className="absolute right-4 top-4 rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-cyan-200/90 backdrop-blur-sm"
                style={{
                  border: "1px solid rgba(0,229,255,0.38)",
                  boxShadow: "0 0 10px rgba(0,229,255,0.16)",
                }}
              >
                LIGHT
              </span>
              {!isCompleted && currentQuestion ? (
                <div
                  className={`flex flex-col gap-4 transition-all duration-300 ease-out ${
                    questionEnter ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs tracking-wide text-white/70">
                      QUESTION {currentIndex + 1} / {total}
                    </p>
                    <div className="rounded-xl border border-white/20 bg-slate-900/35 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
                      <div
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
                      >
                        {lightQuestionMaster.map((q, index) => {
                          const isActive = index === currentIndex;
                          const isPassed = index < currentIndex;
                          return (
                            <div
                              key={q.id}
                              className={`h-2 rounded-full ${
                                isPassed
                                  ? "bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.55)]"
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

                  <div className="relative -mx-3 overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900/35 p-4 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                      aria-hidden
                    />
                    <div className="relative">
                    <p className="font-mono text-[11px] tracking-[0.28em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.20)]">
                      ◆ 設問
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/90">
                      {currentQuestion.prompt}
                    </p>
                    </div>
                  </div>

                  <div className="-mx-3 grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((c) => {
                      const isSelected =
                        selectedFx?.questionId === currentQuestion.id &&
                        selectedFx?.optionId === c.id;
                      return (
                        <button
                          key={`${currentQuestion.id}-${c.id}`}
                          type="button"
                          disabled={selecting}
                          onClick={() => handleSelect(c.id)}
                          className={`relative w-full overflow-hidden rounded-xl border bg-slate-900/45 px-6 pb-3.5 pt-4 shadow-[0_0_10px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-slate-900/50 hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_18px_rgba(0,229,255,0.16),0_0_42px_rgba(0,229,255,0.10)] active:translate-y-0 active:scale-[0.985] active:border-cyan-300/48 active:bg-slate-900/40 active:shadow-[0_0_10px_rgba(255,255,255,0.04),inset_0_3px_10px_rgba(0,0,0,0.45),0_0_16px_rgba(0,229,255,0.12)] disabled:cursor-not-allowed disabled:opacity-60 ${
                            isSelected
                              ? "border-cyan-300/70 shadow-[0_14px_44px_rgba(0,0,0,0.54),0_0_26px_rgba(0,229,255,0.22),0_0_60px_rgba(0,229,255,0.12)]"
                              : "border-white/20"
                          }`}
                        >
                          <span
                            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                            aria-hidden
                          />
                          <span className="relative flex w-full items-start justify-start gap-3">
                            <span
                              className={`mt-1 w-4 shrink-0 font-mono text-[12px] leading-none text-cyan-400 ${
                                isSelected
                                  ? "drop-shadow-[0_0_10px_rgba(0,229,255,0.55)] drop-shadow-[0_0_22px_rgba(0,229,255,0.22)]"
                                  : ""
                              }`}
                              aria-hidden
                            >
                              ◆
                            </span>
                            <span className="min-w-0 flex-1 text-left text-sm leading-relaxed text-white/88">
                              {c.label}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="font-mono text-sm font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.35)]">
                    診断完了 ({total}/{total})
                  </p>

                  <div
                    className="grid gap-1"
                    style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: total }).map((_, index) => (
                      <div
                        key={`complete-${index}`}
                        className="h-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(0,229,255,0.60)]"
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
                    disabled={saving}
                    onClick={handleGoLoading}
                    className="relative w-full overflow-hidden rounded-xl border border-cyan-400/55 bg-transparent px-6 py-5 shadow-[0_0_8px_rgba(0,229,255,0.26),0_0_10px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-300/70 hover:shadow-[0_10px_34px_rgba(0,0,0,0.50),0_0_12px_rgba(0,229,255,0.18),0_0_26px_rgba(0,229,255,0.10)] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 motion-safe:animate-[pulse_2.2s_ease-in-out_infinite]"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                      aria-hidden
                    />
                    <span className="relative flex w-full items-center justify-center gap-2">
                      <span
                        className="w-4 shrink-0 font-mono text-[12px] leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.32)]"
                        aria-hidden
                      >
                        ▶
                      </span>
                      <span className="text-sm font-medium tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.26)]">
                        {saving ? "保存中…" : "診断結果を確認する"}
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


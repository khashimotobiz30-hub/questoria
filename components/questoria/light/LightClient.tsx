"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { lightQuestionMaster } from "@/data/lightQuestionMaster";
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

  const [hasStarted, setHasStarted] = useState(false);
  const [selected, setSelected] = useState<LightSelectedAnswer[]>([]);

  const currentIndex = selected.length;
  const total = lightQuestionMaster.length;
  const isCompleted = currentIndex >= total;

  useEffect(() => {
    if (!isFreshStart) return;
    setSelected([]);
    setHasStarted(false);
  }, [isFreshStart]);

  const currentQuestion = useMemo(() => {
    if (isCompleted) return null;
    return lightQuestionMaster[currentIndex] ?? null;
  }, [currentIndex, isCompleted]);

  const handleStart = () => {
    setSelected([]);
    setHasStarted(true);
  };

  const handleSelect = (optionId: string) => {
    if (!currentQuestion) return;
    if (selected.length >= total) return;
    const opt = currentQuestion.options.find((o) => o.id === optionId);
    if (!opt) return;

    const next = [...selected, { questionId: currentQuestion.id, optionId }];
    setSelected(next);

    if (next.length === total) {
      const result = buildLightDiagnosisResult(lightQuestionMaster, next);
      persistLightResult(result);
    }
  };

  const handleGoLoading = () => {
    if (!isCompleted) return;
    const result = buildLightDiagnosisResult(lightQuestionMaster, selected);
    persistLightResult(result);
    router.replace("/loading?src=light");
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
              ENTRY DIAGNOSIS
            </p>
            <h1 className="mt-2 font-orbitron text-2xl tracking-wide text-[#FFD700]">
              QUESTORIA
            </h1>
          </div>

          {!hasStarted ? (
            <>
              <div className="mt-5 rounded-xl border border-cyan-300/25 bg-gradient-to-b from-cyan-400/[0.055] via-black/[0.41] to-black/[0.44] p-4 shadow-[0_0_28px_rgba(0,229,255,0.075)]">
                <p className="font-orbitron text-sm tracking-wide text-cyan-100 [text-shadow:0_0_14px_rgba(0,229,255,0.22)]">
                  LIGHT GUIDE
                </p>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/85">
                  <p>
                    まずは入口のLIGHT診断で、
                    <br />
                    あなたの現在地を“自己申告”でスキャンします。
                  </p>
                  <p className="text-white/82">
                    深掘り（WORK/LIFE）は後から選べます。
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
                    <span>所要時間は約1〜2分です</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full rounded-xl border border-cyan-300/[0.66] bg-cyan-400/[0.12] px-4 py-3.5 font-mono text-sm font-medium tracking-wide text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.065),0_0_34px_rgba(0,229,255,0.24)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
                >
                  ▶ LIGHT診断を始める
                </button>
              </div>
            </>
          ) : (
            <div className="relative mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              {!isCompleted && currentQuestion ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs tracking-wide text-white/70">
                      QUESTION {currentIndex + 1} / {total}
                    </p>
                    <div className="grid grid-cols-12 gap-1">
                      {lightQuestionMaster.map((q, index) => {
                        const isActive = index === currentIndex;
                        const isPassed = index < currentIndex;
                        return (
                          <div
                            key={q.id}
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
                    <p className="mt-4 text-sm leading-relaxed text-white/90">
                      {currentQuestion.prompt}
                    </p>
                  </div>

                  <div className="-mx-3 grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((c) => (
                      <button
                        key={`${currentQuestion.id}-${c.id}`}
                        type="button"
                        onClick={() => handleSelect(c.id)}
                        className="w-full rounded-xl border border-white/[0.22] bg-black/[0.43] px-4 pb-3.5 pt-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_2px_5px_rgba(0,0,0,0.52),0_9px_22px_rgba(0,0,0,0.48),0_20px_44px_rgba(0,0,0,0.34),0_0_26px_rgba(0,229,255,0.048)] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-black/44 hover:shadow-[0_6px_28px_rgba(0,0,0,0.45),0_0_26px_rgba(0,229,255,0.13)] active:translate-y-0 active:scale-[0.985] active:border-cyan-300/38 active:bg-black/32 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.4),0_0_16px_rgba(0,229,255,0.06)]"
                      >
                        <span className="block text-sm leading-relaxed text-white/85">
                          {c.label}
                        </span>
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
                    これから結果の判定に進みます。
                  </p>
                  <button
                    type="button"
                    onClick={handleGoLoading}
                    className="mt-5 w-full rounded-xl border border-cyan-300/60 bg-cyan-400/10 px-4 py-3 font-mono text-sm tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.20)] transition hover:bg-cyan-400/15 active:scale-[0.99]"
                  >
                    ローディングへ進む
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


import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, X } from "lucide-react";

import {
  ResultCardDecor,
  resultCardShellClass,
  sectionLabelClass,
} from "@/components/questoria/result/resultCardTheme";
import type { ResultType } from "@/types";

function IconXSubtle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.75 5.75 17.25 18.25M17.25 5.75 6.75 18.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TryAgainSection({
  otherTypes,
  typeImageMap,
  typeNameJaByResultType,
  onRerun,
  source,
}: {
  otherTypes: ResultType[];
  typeImageMap: Record<ResultType, string>;
  typeNameJaByResultType: Record<ResultType, string>;
  onRerun: () => void;
  source?: "deep" | "light";
}) {
  const [typeListOpen, setTypeListOpen] = useState(false);

  useEffect(() => {
    if (!typeListOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTypeListOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typeListOpen]);

  const allTypes: ResultType[] = useMemo(
    () => ["hero", "sage", "hunter", "prophet", "artisan", "wizard", "pioneer", "origin"],
    [],
  );

  const typeBits: Record<
    ResultType,
    { purpose: "HIGH" | "LOW"; design: "HIGH" | "LOW"; decision: "HIGH" | "LOW" }
  > = useMemo(
    () => ({
      hero: { purpose: "HIGH", design: "HIGH", decision: "HIGH" },
      sage: { purpose: "HIGH", design: "HIGH", decision: "LOW" },
      hunter: { purpose: "HIGH", design: "LOW", decision: "HIGH" },
      prophet: { purpose: "HIGH", design: "LOW", decision: "LOW" },
      artisan: { purpose: "LOW", design: "HIGH", decision: "HIGH" },
      wizard: { purpose: "LOW", design: "HIGH", decision: "LOW" },
      pioneer: { purpose: "LOW", design: "LOW", decision: "HIGH" },
      origin: { purpose: "LOW", design: "LOW", decision: "LOW" },
    }),
    [],
  );

  const getTypeDisplay = (type: ResultType): { ja: string; en: string } => {
    const ja = typeNameJaByResultType[type] ?? type;
    return { ja, en: type.toUpperCase() };
  };

  const AxisBadge = ({ level }: { level: "HIGH" | "LOW" }) => (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] ${
        level === "HIGH"
          ? "border-cyan-300/55 bg-cyan-400/10 text-cyan-100/90"
          : "border-white/18 bg-black/25 text-white/60"
      }`}
    >
      {level}
    </span>
  );

  // light は「他タイプを見る」よりも、まず再診断が主導線になりがちなので控えめにする
  const showOtherTypes = source !== "light";

  return (
    <section className="space-y-5">
      <div className={resultCardShellClass("compare")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1] space-y-3 p-5">
          <p className={sectionLabelClass}>
            <span
              className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.22)]"
              aria-hidden
            >
              ◆
            </span>
            TRY AGAIN
          </p>

          {showOtherTypes ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2.5">
                {otherTypes.map((type) => (
                  <div key={type} className="flex min-w-0 flex-col items-center gap-1.5">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/14 bg-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
                      <Image
                        src={typeImageMap[type]}
                        alt={typeNameJaByResultType[type] ?? type}
                        fill
                        className="object-cover object-top"
                        style={{ filter: "brightness(0.96) saturate(0.94)" }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <span className="w-full truncate text-center text-xs font-medium leading-snug tracking-wide text-white/88">
                      {typeNameJaByResultType[type] ?? type}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[13px] leading-relaxed text-white/82 sm:text-sm sm:leading-relaxed">
                他にもこんなタイプがあります。ぜひチェックしてみてください。
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-1 font-mono text-[12px] tracking-[0.16em] text-cyan-300/85 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
                onClick={() => setTypeListOpen(true)}
              >
                8タイプ一覧を見る <span aria-hidden>→</span>
              </button>
            </>
          ) : (
            <p className="text-[13px] leading-relaxed text-white/75 sm:text-sm">
              別の回答でもう一度試すと、違う傾向が見えることがあります。
            </p>
          )}

          <button
            type="button"
            className="group mt-4 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-white/22 bg-gradient-to-b from-white/[0.09] to-black/36 px-4 py-3.5 text-sm font-medium tracking-wide text-white/80 shadow-[0_0_18px_rgba(255,255,255,0.06),0_0_22px_rgba(255,215,0,0.06)] transition hover:border-white/30 hover:from-white/[0.11] hover:to-black/42 hover:text-white/88 hover:shadow-[0_0_24px_rgba(255,255,255,0.07),0_0_30px_rgba(255,215,0,0.08)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
            onClick={onRerun}
          >
            <RotateCcw
              className="size-[13px] shrink-0 text-white/56 transition-colors group-hover:text-white/74"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            もう一度診断する
          </button>
        </div>
      </div>

      {typeListOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="type-list-modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTypeListOpen(false);
          }}
        >
          <div
            className="relative flex max-h-[min(88dvh,42rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#0f141c]/96 via-[#080c12]/98 to-[#05070c]/98 shadow-[0_0_38px_rgba(0,229,255,0.10),0_24px_48px_rgba(0,0,0,0.58)] backdrop-blur-md"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/[0.08] to-transparent"
              aria-hidden
            />
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4">
              <div className="min-w-0">
                <p className={sectionLabelClass}>
                  <span
                    className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.22)]"
                    aria-hidden
                  >
                    ◆
                  </span>
                  TYPE LIST
                </p>
                <h3
                  id="type-list-modal-title"
                  className="mt-1 font-orbitron text-lg font-bold tracking-wide text-white"
                >
                  8タイプ一覧
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/75 transition hover:border-white/25 hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                onClick={() => setTypeListOpen(false)}
                aria-label="閉じる"
              >
                <X className="size-[18px]" strokeWidth={1.75} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {allTypes.map((t) => {
                  const d = getTypeDisplay(t);
                  const bits = typeBits[t];
                  return (
                    <div
                      key={t}
                      className="rounded-xl border border-white/10 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-white/14 bg-black/40">
                          <Image
                            src={typeImageMap[t]}
                            alt={d.ja}
                            fill
                            className="object-cover object-top"
                            style={{ filter: "brightness(0.98) saturate(0.95)" }}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-orbitron text-[14px] font-bold tracking-wide text-white">
                            {d.ja}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] tracking-[0.2em] text-cyan-300/80">
                            {d.en}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5 text-[12px] text-white/75">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white/70">目的定義力</span>
                          <AxisBadge level={bits.purpose} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white/70">設計力</span>
                          <AxisBadge level={bits.design} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white/70">自律判断力</span>
                          <AxisBadge level={bits.decision} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}


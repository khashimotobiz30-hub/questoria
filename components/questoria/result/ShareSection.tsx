import Image from "next/image";
import React from "react";
import { RotateCcw, Share2 } from "lucide-react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";
import type { ResultType, ShareCompareCopy } from "@/types";

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

export function ShareSection({
  otherTypes,
  typeImageMap,
  typeNameJaByResultType,
  copy,
  onShareX,
  onInviteFriends,
  onRerun,
}: {
  otherTypes: ResultType[];
  typeImageMap: Record<ResultType, string>;
  typeNameJaByResultType: Record<ResultType, string>;
  copy: ShareCompareCopy;
  onShareX: () => void;
  onInviteFriends: () => void;
  onRerun: () => void;
}) {
  return (
    <section className="space-y-5">
      <div className={resultCardShellClass("emphasis")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1] space-y-4 p-5">
          <div>
            <p className={sectionLabelClass}>{"// SHARE / COMPARE //"}</p>
            <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
              シェアして比べる
            </h2>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <p className="text-sm leading-relaxed text-white/72">{copy.lead}</p>
            <p className="text-[13px] leading-relaxed text-white/58">{copy.compareHint}</p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-[#FFD700]/32 bg-gradient-to-b from-[#FFD700]/13 to-black/54 px-4 py-3.5 text-sm font-semibold tracking-wide text-white/93 shadow-[0_0_24px_rgba(255,215,0,0.11)] transition hover:border-[#FFD700]/42 hover:bg-black/58 hover:shadow-[0_0_30px_rgba(255,215,0,0.13)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={onInviteFriends}
            >
              <Share2 className="size-[15px] shrink-0 opacity-[0.82]" strokeWidth={1.5} aria-hidden="true" />
              友達にも診断してもらう
            </button>
            <button
              type="button"
              className="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl border border-sky-400/32 bg-gradient-to-b from-sky-500/14 via-cyan-500/6 to-black/46 px-4 py-2.5 text-[13px] font-semibold tracking-wide text-sky-50/90 shadow-[0_0_20px_rgba(56,189,248,0.10)] transition hover:border-sky-400/46 hover:from-sky-500/19 hover:via-cyan-500/9 hover:to-black/42 hover:shadow-[0_0_28px_rgba(56,189,248,0.14)] hover:text-white active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/38 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={onShareX}
            >
              <IconXSubtle className="size-[14px] shrink-0 opacity-[0.88]" />
              Xでシェア
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-0.5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.24em] text-white/55">OTHER TYPES</p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/14 to-transparent" />
      </div>

      <div className={resultCardShellClass("compare")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1] space-y-3 p-5">
          <p className="text-center text-[12px] leading-relaxed text-white/62">
            別タイプの雰囲気だけ、軽く把握しておくと比較の材料になります。
          </p>
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
                <span className="w-full truncate text-center text-[10px] font-medium leading-snug tracking-wide text-white/72">
                  {typeNameJaByResultType[type] ?? type}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="group mt-4 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-white/17 bg-gradient-to-b from-white/[0.07] to-black/38 px-4 py-3.5 text-sm font-medium tracking-wide text-white/74 transition hover:border-white/26 hover:from-white/[0.09] hover:to-black/44 hover:text-white/84 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
            onClick={onRerun}
          >
            <RotateCcw
              className="size-[13px] shrink-0 text-white/50 transition-colors group-hover:text-white/68"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            もう一度診断する
          </button>
        </div>
      </div>
    </section>
  );
}

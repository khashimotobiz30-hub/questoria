import Image from "next/image";
import React from "react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";
import type { ResultType, ShareCompareCopy } from "@/types";

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

          <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFD700]/28 bg-gradient-to-b from-[#FFD700]/14 to-black/55 px-4 py-3.5 text-sm font-semibold tracking-wide text-white/92 shadow-[0_0_28px_rgba(255,215,0,0.10)] transition hover:border-[#FFD700]/38 hover:bg-black/60"
              onClick={onInviteFriends}
            >
              友達にも診断してもらう
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/18 bg-black/35 px-4 py-3 text-[13px] font-semibold tracking-wide text-white/78 transition hover:border-cyan-300/35 hover:bg-black/45 hover:text-white/88"
              onClick={onShareX}
            >
              Xでシェア
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-0.5">
        <div className="h-px flex-1 bg-white/10" />
        <p className="font-mono text-[10px] tracking-[0.24em] text-white/40">OTHER TYPES</p>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className={resultCardShellClass("subtle")}>
        <ResultCardDecor withRail={false} />
        <div className="relative z-[1] p-4">
          <p className="mb-3 text-center text-[11px] leading-relaxed text-white/48">
            別タイプの雰囲気だけ、軽く把握しておくと比較の材料になります。
          </p>
          <div className="grid grid-cols-4 gap-2">
            {otherTypes.map((type) => (
              <div key={type} className="flex flex-col items-center gap-1">
                <div className="relative aspect-square w-full max-w-[4.5rem] overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  <Image
                    src={typeImageMap[type]}
                    alt={typeNameJaByResultType[type] ?? type}
                    fill
                    className="object-cover object-top"
                    style={{ filter: "brightness(0.95) saturate(0.92)" }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
                <span className="w-full truncate text-center text-[9px] leading-tight text-white/58">
                  {typeNameJaByResultType[type] ?? type}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 text-[13px] font-medium text-white/70 transition hover:border-white/20 hover:bg-black/40 hover:text-white/85"
            onClick={onRerun}
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </section>
  );
}

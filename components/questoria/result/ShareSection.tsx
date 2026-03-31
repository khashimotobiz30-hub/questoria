import Image from "next/image";
import React from "react";

import type { ResultType } from "@/types";

export function ShareSection({
  otherTypes,
  typeImageMap,
  onShareX,
  onInviteFriends,
  onRerun,
}: {
  otherTypes: ResultType[];
  typeImageMap: Record<ResultType, string>;
  onShareX: () => void;
  onInviteFriends: () => void;
  onRerun: () => void;
}) {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-white/6 to-transparent p-5 shadow-[0_0_40px_rgba(0,229,255,0.05)]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,215,0,0.10), rgba(0,229,255,0.08), transparent)",
            opacity: 0.7,
          }}
        />
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/60">
          {"// SHARE / COMPARE //"}
        </p>
        <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
          シェアして比べる
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          友達と結果を見比べると、強みの使い方が一気にわかります。
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFD700]/22 bg-gradient-to-b from-[#FFD700]/12 to-black/50 px-4 py-3 text-sm font-semibold tracking-wide text-white/92 shadow-[0_0_34px_rgba(255,215,0,0.10)] transition hover:border-[#FFD700]/32 hover:bg-black/60"
            onClick={onInviteFriends}
          >
            <span aria-hidden="true">▶</span>
            友達にも診断
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/22 bg-black/40 px-4 py-3 text-sm font-semibold tracking-wide text-white/80 shadow-[0_0_18px_rgba(0,229,255,0.06)] transition hover:border-cyan-300/40 hover:bg-black/50 hover:text-white/92"
            onClick={onShareX}
          >
            <span aria-hidden="true">▶</span>
            Xでシェア
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-1">
        <div className="h-px flex-1 bg-white/10" />
        <p className="font-mono text-[10px] tracking-[0.28em] text-white/45">COMPARE</p>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/4 to-transparent p-5">
        <p className="mb-4 font-mono text-[11px] tracking-[0.28em] text-white/50">
          {"// OTHER TYPES //"}
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {otherTypes.map((type) => (
            <div key={type} className="flex flex-col items-center gap-1.5">
              <div className="relative aspect-square w-[92%] overflow-hidden rounded-xl border border-white/10 bg-black/25 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
                <Image
                  src={typeImageMap[type]}
                  alt={type}
                  fill
                  className="object-cover object-top"
                  style={{ filter: "brightness(1.05) grayscale(0.08)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <span className="text-center font-mono text-[9px] uppercase leading-tight tracking-wider text-white/70">
                {type}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/14 bg-black/35 px-4 py-2.5 text-[13px] font-semibold text-white/75 transition hover:border-white/25 hover:bg-black/45 hover:text-white/90"
          onClick={onRerun}
        >
          <span aria-hidden="true">↻</span>
          他のタイプも気になる？ もう一度診断してみよう。
        </button>
      </div>
    </section>
  );
}


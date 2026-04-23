import Image from "next/image";
import React from "react";
import { Share2 } from "lucide-react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";
import type { ResultType, ShareCompareCopy } from "@/types";

export function ShareSection({
  otherTypes,
  typeImageMap,
  typeNameJaByResultType,
  copy: _copy,
  onShare,
  source,
  onDeeperDiagnosis,
  embedded,
}: {
  otherTypes: ResultType[];
  typeImageMap: Record<ResultType, string>;
  typeNameJaByResultType: Record<ResultType, string>;
  copy: ShareCompareCopy;
  onShare: () => void;
  source?: "deep" | "light";
  onDeeperDiagnosis?: () => void;
  /** 結果プレート内に埋め込む（外枠カードを弱める） */
  embedded?: boolean;
}) {
  const actions = (
    <div className="flex justify-center">
      <button
        type="button"
        className="group relative block w-full max-w-[15.5rem] overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/25 active:scale-[0.99] sm:max-w-[16.5rem]"
        onClick={onShare}
        aria-label="結果をシェア"
      >
        <div className="relative w-full [aspect-ratio:1024/300]">
          <Image
            src="/top/banners/share-result-plate.png"
            alt="結果をシェア"
            fill
            sizes="(min-width: 768px) 448px, 100vw"
            className="object-contain"
            style={{ filter: "contrast(1.02) saturate(0.98)" }}
            priority={false}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, rgba(230,197,90,0.07), rgba(0,229,255,0.045), transparent)",
          }}
          aria-hidden="true"
        />
      </button>
    </div>
  );

  const lightNote =
    source === "light" ? (
      <div className={embedded ? "mt-[2.8rem]" : "mt-[2.8rem]"}>
        <div className={embedded ? "space-y-3" : resultCardShellClass("action")}>
          {!embedded ? <ResultCardDecor withRail /> : null}
          <div className={embedded ? "space-y-3" : "relative z-[1] space-y-3 p-5"}>
            {!embedded ? (
              <p className={sectionLabelClass}>
                <span
                  className="mr-2 text-[0.9em] text-cyan-200/95 drop-shadow-[0_0_14px_rgba(0,229,255,0.16)]"
                  aria-hidden
                >
                  ◆
                </span>
                DEEPER DIAGNOSIS
              </p>
            ) : null}
            <h3 className="mt-2 text-center font-orbitron text-base font-bold tracking-wide text-white">
              <span className="inline-flex items-center justify-center gap-2">
                <span
                  className="text-[0.9em] text-cyan-200/95 drop-shadow-[0_0_14px_rgba(0,229,255,0.16)]"
                  aria-hidden="true"
                >
                  ◆
                </span>
                より詳細な診断を行う
              </span>
            </h3>
            <div
              className="mx-auto mt-3 h-px w-[14rem] max-w-prose opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(167,180,204,0.55), rgba(0,229,255,0.42), rgba(167,180,204,0.50), transparent)",
              }}
              aria-hidden="true"
            />
            <div className="space-y-2 pt-3 text-[13px] leading-relaxed text-white/82 sm:text-sm">
              <p>今回の設問と結果は、LIGHT診断モードによるものです。</p>
              <p>LIGHT診断は、今の傾向をつかむための簡易診断です。</p>
              <p>より正確に知りたい方は、以下よりWORK / LIFEモードをお試しください。</p>
            </div>
            <button
              type="button"
              className="group mt-4 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/55 bg-cyan-400/[0.10] px-4 py-3.5 text-sm font-medium tracking-wide text-cyan-100 shadow-[0_0_28px_rgba(0,229,255,0.18)] transition hover:bg-cyan-400/15 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={onDeeperDiagnosis}
            >
              WORK／LIFEモードで診断する
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <section className="space-y-5">
      {embedded ? (
        <div className="space-y-4">
          {actions}
          {lightNote}
        </div>
      ) : (
        <>
          <div className={resultCardShellClass("emphasis")}>
            <ResultCardDecor withRail />
            <div className="relative z-[1] space-y-4 p-5">
              {actions}
            </div>
          </div>
          {lightNote}
        </>
      )}
    </section>
  );
}

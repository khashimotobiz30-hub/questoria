import React from "react";

import {
  ResultCardDecor,
  resultCardShellClass,
  sectionLabelClass,
} from "@/components/questoria/result/resultCardTheme";
import type { DeeperGuideCopy } from "@/types";

export function DeeperGuideSection({
  copy,
  lineUrl,
  onLineCtaClick,
}: {
  copy: DeeperGuideCopy;
  lineUrl: string;
  onLineCtaClick?: () => void;
}) {
  const lineCtaClass =
    "inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-xl border border-[#FFD700]/40 bg-gradient-to-b from-[#FFD700]/17 via-[#FFD700]/7 to-black/48 px-4 py-4 text-sm font-bold tracking-wide text-white shadow-[0_0_32px_rgba(255,215,0,0.13),0_0_72px_rgba(255,215,0,0.05)] transition hover:border-[#FFD700]/52 hover:from-[#FFD700]/21 hover:shadow-[0_0_40px_rgba(255,215,0,0.17),0_0_88px_rgba(255,215,0,0.07)] hover:to-black/44 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

  return (
    <section className={resultCardShellClass("default")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        <div>
          <p className={sectionLabelClass}>DEEPER GUIDE</p>
          <h2 className="mt-2 font-orbitron text-base font-bold tracking-wide text-white sm:text-lg">
            {copy.title}
          </h2>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-white/72">{copy.description}</p>

          <div>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={lineCtaClass}
              onClick={() => onLineCtaClick?.()}
            >
              {copy.buttonLabel}
            </a>
          </div>

          {copy.footnote ? (
            <p className="text-[12px] leading-relaxed text-white/48">{copy.footnote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

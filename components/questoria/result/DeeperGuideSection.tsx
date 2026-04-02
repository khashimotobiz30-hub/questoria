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
  const btnClass =
    "inline-flex w-full items-center justify-center rounded-xl border px-4 py-3.5 text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

  return (
    <section className={resultCardShellClass("default")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        <div>
          <p className={sectionLabelClass}>{"// DEEPER GUIDE //"}</p>
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
              className={`${btnClass} border-[#FFD700]/28 bg-gradient-to-b from-[#FFD700]/10 to-black/50 text-white/90 shadow-[0_0_24px_rgba(255,215,0,0.08)] hover:border-[#FFD700]/38 hover:bg-black/55`}
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

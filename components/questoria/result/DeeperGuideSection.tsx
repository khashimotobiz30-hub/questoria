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
    "inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-xl border border-[#D2B03B]/85 bg-gradient-to-b from-[#E0C05C] via-[#C89B24] to-[#8A6A16] px-4 py-4 text-sm font-bold tracking-wide text-[#15130F] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-2px_0_rgba(0,0,0,0.28),0_14px_28px_rgba(0,0,0,0.42),0_0_18px_rgba(210,176,59,0.12)] transition-transform transition-shadow hover:from-[#E9CE73] hover:via-[#D2AA2D] hover:to-[#97761A] hover:border-[#E0C05C]/95 hover:-translate-y-[2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),inset_0_-2px_0_rgba(0,0,0,0.26),0_18px_36px_rgba(0,0,0,0.48),0_0_22px_rgba(210,176,59,0.16)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B03B]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

  return (
    <section className={resultCardShellClass("default")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        <div>
          <p className={sectionLabelClass}>
            <span className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.22)]" aria-hidden>
              ◆
            </span>
            DEEPER GUIDE
          </p>
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

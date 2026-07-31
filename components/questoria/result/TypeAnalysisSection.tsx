import React, { useMemo } from "react";

import {
  ResultCardDecor,
  reportBodyTextClass,
  reportHeadingTextClass,
  reportLabelGoldClass,
  reportMutedTextClass,
  resultCardShellClass,
} from "@/components/questoria/result/resultCardTheme";
import type { TypeAnalysisCopy } from "@/types";

type Item = {
  id: keyof TypeAnalysisCopy;
  title: string;
  body: string;
};

function splitIntoParagraphs(text: string): string[] {
  const t = text.trim();
  if (!t) return [];
  return t.split(/\n+/).map((b) => b.trim()).filter(Boolean);
}

export function TypeAnalysisSection({
  copy,
  embedded,
}: {
  copy: TypeAnalysisCopy;
  hideIntro?: boolean;
  hideGrowth?: boolean;
  hideTierLabel?: boolean;
  unifyItemTitleTone?: boolean;
  openRiskPointByDefault?: boolean;
  hideRiskPointClosedPreview?: boolean;
  embedded?: boolean;
}) {
  const items = useMemo<Item[]>(
    () =>
      [
        { id: "thinkingPattern" as const, title: "こんな考え方が多い", body: copy.thinkingPattern },
        { id: "workStyle" as const, title: "仕事だと、こう出やすい", body: copy.workStyle },
        { id: "essence" as const, title: "ひとことで言うと", body: copy.essence },
        { id: "strength" as const, title: "強み", body: copy.strength },
        { id: "riskPoint" as const, title: "つまずきやすい点", body: copy.riskPoint },
      ].filter((item) => item.body.trim().length > 0),
    [copy],
  );

  const header = (
    <header className={embedded ? "px-0 pb-2 pt-0" : "px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4"}>
      <h2
        className={`mt-2 text-center font-orbitron text-lg font-bold tracking-wide ${reportHeadingTextClass}`}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span
            className="text-[0.9em] text-cyan-200/95 drop-shadow-[0_0_14px_rgba(0,229,255,0.16)]"
            aria-hidden="true"
          >
            ◆
          </span>
          あなたの傾向
        </span>
      </h2>
      <div
        className="mx-auto mt-3 h-px w-[14rem] max-w-prose opacity-90"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(167,180,204,0.55), rgba(0,229,255,0.42), rgba(167,180,204,0.50), transparent)",
        }}
        aria-hidden="true"
      />
      <p className={`mx-auto mt-2.5 max-w-prose text-center text-[13px] leading-relaxed ${reportMutedTextClass}`}>
        回答から見える、あなたの考え方と進め方の特徴です。
      </p>
    </header>
  );

  const body = (
    <div className={embedded ? "space-y-5 pb-1 pt-3" : "space-y-5 pb-3 pt-3 px-4 sm:px-5"}>
      {items.map((item) => {
        const paras = splitIntoParagraphs(item.body);
        return (
          <div key={item.id} className="space-y-2">
            <h3 className={`text-[13px] font-bold tracking-wide ${reportLabelGoldClass}`}>
              {item.title}
            </h3>
            <div className="space-y-2">
              {paras.map((p, i) => (
                <p key={i} className={`text-[15px] leading-[1.85] ${reportBodyTextClass}`}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (embedded) {
    return (
      <section>
        {header}
        {body}
      </section>
    );
  }

  return (
    <section>
      <div className={resultCardShellClass("default")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1]">
          {header}
          {body}
        </div>
      </div>
    </section>
  );
}

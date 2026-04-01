import React from "react";

import {
  ResultCardDecor,
  resultCardNestedClass,
  resultCardShellClass,
  sectionLabelClass,
} from "@/components/questoria/result/resultCardTheme";

export function NextActionSection({
  nextActions,
  lead,
  note,
}: {
  nextActions?: readonly string[];
  lead?: string;
  note?: string;
}) {
  const items = (nextActions ?? []).slice(0, 3);

  const splitFirstSentence = (text: string) => {
    const idx = text.indexOf("。");
    if (idx === -1) return { first: text, rest: "" };
    const first = text.slice(0, idx + 1).trim();
    const rest = text.slice(idx + 1).trim();
    return { first, rest };
  };

  return (
    <section className={resultCardShellClass("action")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        <div>
          <p className={sectionLabelClass}>{"// NEXT ACTION //"}</p>
          <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">次の一歩</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            {lead ?? "読んで終わりにしないための、今日からできる3ステップ。"}
          </p>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-4">
          {items.length > 0 ? (
            items.map((text, i) => {
              const s = splitFirstSentence(text);
              const stepLabel = `${String(i + 1).padStart(2, "0")} STEP`;
              return (
                <div key={i} className={`${resultCardNestedClass} p-3.5`}>
                  <div className="space-y-2">
                    <p
                      className="font-mono text-[10px] tracking-[0.26em] text-[#FFD700]/75"
                      aria-label={stepLabel}
                    >
                      {stepLabel}
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-sm leading-relaxed text-white/90">{s.first}</p>
                      {s.rest ? (
                        <p className="text-[13px] leading-relaxed text-white/72">{s.rest}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/14 bg-black/25 p-4">
              <p className="text-sm text-white/60">TODO: nextActions を他タイプにも追加</p>
            </div>
          )}
        </div>

        {note ? (
          <p className="border-t border-white/10 pt-4 text-sm leading-relaxed text-white/70">{note}</p>
        ) : null}
      </div>
    </section>
  );
}

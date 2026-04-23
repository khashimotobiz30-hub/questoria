import React, { useMemo } from "react";

import {
  ResultCardDecor,
  reportBodyTextClass,
  reportHeadingTextClass,
  reportLabelGoldClass,
  reportMutedTextClass,
  resultCardShellClass,
  sectionLabelClass,
} from "@/components/questoria/result/resultCardTheme";
import type { TypeAnalysisCopy } from "@/types";

type Tier = "core" | "note";

type Item = {
  id: keyof TypeAnalysisCopy;
  title: string;
  body: string;
  defaultOpen: boolean;
  tier: Tier;
};

function splitIntoParagraphs(text: string): string[] {
  const t = text.trim();
  if (!t) return [];

  const byNl = t.split(/\n+/).map((b) => b.trim()).filter(Boolean);
  if (byNl.length > 1) return byNl;

  const sentences = t.match(/[^。]+(?:。|$)/g)?.map((s) => s.trim()) ?? [t];
  if (sentences.length <= 2) return sentences;

  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    out.push(sentences.slice(i, i + 2).join(""));
  }
  return out;
}

export function TypeAnalysisSection({
  copy,
  hideIntro,
  hideGrowth,
  hideTierLabel,
  unifyItemTitleTone,
  openRiskPointByDefault,
  hideRiskPointClosedPreview,
  /** レポート本文に埋め込む（外枠カードを外す） */
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
        {
          id: "essence",
          title: "ESSENCE（本質）",
          body: copy.essence,
          defaultOpen: true,
          tier: "core",
        },
        {
          id: "strength",
          title: "STRENGTH（強み）",
          body: copy.strength,
          defaultOpen: true,
          tier: "core",
        },
        {
          id: "riskPoint",
          title: "RISK POINT（注意点）",
          body: copy.riskPoint,
          defaultOpen: openRiskPointByDefault ?? false,
          tier: "note",
        },
        hideGrowth
          ? null
          : {
              id: "growth",
              title: "GROWTH（伸びしろ）",
              body: copy.growth,
              defaultOpen: true,
              tier: "core",
            },
      ].filter(Boolean) as Item[],
    [copy, hideGrowth, openRiskPointByDefault],
  );

  const header = (
    <header className={embedded ? "px-0 pb-3 pt-0" : "px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4"}>
      <h2
        className={`mt-2.5 text-center font-orbitron text-lg font-bold tracking-wide sm:mt-3 ${reportHeadingTextClass}`}
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
      {!hideIntro ? (
        <p className={`mx-auto mt-1.5 max-w-prose text-center text-sm leading-relaxed sm:mt-2 ${reportMutedTextClass}`}>
          あなたらしさは、こんな感じです。
        </p>
      ) : null}
    </header>
  );

  const body = (
    <div className={embedded ? "space-y-5 pb-1 pt-4" : "space-y-5 pb-3 pt-4 px-4 sm:px-5"}>
      {items.map((item) => {
        const paras = splitIntoParagraphs(item.body);
        const label = item.title
          .replace(/（.*?）/g, "")
          .trim();
        const jp = item.title.match(/（(.*?)）/)?.[1]?.trim();
        return (
          <div key={item.id} className="space-y-2.5">
            <h3 className={`font-mono text-[13px] font-bold tracking-[0.22em] ${reportLabelGoldClass} sm:text-[14px]`}>
              {label}
              {jp ? <span className={`ml-2 ${reportLabelGoldClass} opacity-80`}>（{jp}）</span> : null}
            </h3>
            <div className="space-y-2.5">
              {paras.length ? (
                paras.map((p, i) => (
                  <p key={i} className={`text-[14px] leading-[1.9] sm:text-[15px] ${reportBodyTextClass}`}>
                    {p}
                  </p>
                ))
              ) : (
                <p className={`text-[14px] leading-[1.9] sm:text-[15px] ${reportBodyTextClass}`}>{item.body}</p>
              )}
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

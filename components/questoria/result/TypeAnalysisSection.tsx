import React, { useMemo, useState } from "react";

import {
  ResultCardDecor,
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

function oneLinePreview(text: string, maxChars = 48) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars)}…`;
}

function AccordionItem({
  item,
  hideTierLabel,
  unifyTitleTone,
  hideClosedPreview,
}: {
  item: Item;
  hideTierLabel?: boolean;
  unifyTitleTone?: boolean;
  hideClosedPreview?: boolean;
}) {
  const [open, setOpen] = useState(item.defaultOpen);
  const isCore = item.tier === "core";
  const preview =
    !hideClosedPreview && !open && item.tier === "note"
      ? oneLinePreview(item.body.split("\n")[0] ?? item.body)
      : "";

  const paras = splitIntoParagraphs(item.body);
  const titleToneClass = unifyTitleTone
    ? "text-[#FFD700]"
    : isCore
      ? "text-[#FFD700]"
      : "text-white/78";

  return (
    <div>
      <button
        type="button"
        className="relative flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {!hideTierLabel ? (
              <span
                className={
                  isCore
                    ? "rounded-full border border-[#FFD700]/28 bg-[#FFD700]/12 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-[#FFD700]/95"
                    : "rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-white/52"
                }
              >
                {isCore ? "CORE" : "NOTE"}
              </span>
            ) : null}
            <p
              className={`text-sm font-semibold leading-snug tracking-[0.2em] ${titleToneClass}`}
            >
              {item.title}
            </p>
          </div>
          {!open && preview ? (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/64">
              {preview}
            </p>
          ) : null}
        </div>
        <span
          className={`mt-0.5 shrink-0 text-white/52 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 sm:px-5">
            <div className="space-y-2.5 border-t border-white/[0.07] pt-3">
              {paras.length ? (
                paras.map((p, i) => (
                  <p
                    key={i}
                    className={`text-[13px] leading-relaxed sm:text-sm ${
                      isCore ? "text-white/82" : "text-white/68"
                    }`}
                  >
                    {p}
                  </p>
                ))
              ) : (
                <p
                  className={`text-[13px] leading-relaxed ${
                    isCore ? "text-white/78" : "text-white/64"
                  }`}
                >
                  {item.body}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypeAnalysisSection({
  copy,
  hideIntro,
  hideGrowth,
  hideTierLabel,
  unifyItemTitleTone,
  openRiskPointByDefault,
  hideRiskPointClosedPreview,
}: {
  copy: TypeAnalysisCopy;
  hideIntro?: boolean;
  hideGrowth?: boolean;
  hideTierLabel?: boolean;
  unifyItemTitleTone?: boolean;
  openRiskPointByDefault?: boolean;
  hideRiskPointClosedPreview?: boolean;
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

  return (
    <section>
      <div className={resultCardShellClass("default")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1]">
          <header className="px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4">
            <p className={sectionLabelClass}>
              <span className="mr-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.22)]" aria-hidden>
                ◆
              </span>
              TYPE ANALYSIS
            </p>
            <h2 className="mt-2.5 font-orbitron text-lg font-bold tracking-wide text-white sm:mt-3">
              あなたの傾向
            </h2>
            {!hideIntro ? (
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/70 sm:mt-2">
                あなたらしさは、こんな感じです。
              </p>
            ) : null}
          </header>
          <div className="divide-y divide-white/[0.09] border-t border-white/[0.09] pb-3">
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                hideTierLabel={hideTierLabel}
                unifyTitleTone={unifyItemTitleTone}
                hideClosedPreview={hideRiskPointClosedPreview && item.id === "riskPoint"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

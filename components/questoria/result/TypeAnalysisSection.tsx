import React, { useMemo, useState } from "react";

import {
  ResultCardDecor,
  resultCardExpandedClass,
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

function AccordionItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(item.defaultOpen);
  const isCore = item.tier === "core";
  const preview =
    !open && item.tier === "note" ? oneLinePreview(item.body.split("\n")[0] ?? item.body) : "";

  const paras = splitIntoParagraphs(item.body);

  return (
    <div className={[resultCardShellClass("default"), open ? resultCardExpandedClass : ""].join(" ")}>
      <ResultCardDecor withRail />

      <button
        type="button"
        className="relative z-[1] flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                isCore
                  ? "rounded-full border border-[#FFD700]/28 bg-[#FFD700]/12 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-[#FFD700]/95"
                  : "rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-white/52"
              }
            >
              {isCore ? "CORE" : "NOTE"}
            </span>
            <p
              className={`text-sm font-semibold leading-snug ${
                isCore ? "text-[#FFD700]" : "text-white/78"
              }`}
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
          <div className="relative z-[1] px-4 pb-4 pt-0">
            <div className="space-y-2.5 border-t border-white/10 pt-3">
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

export function TypeAnalysisSection({ copy }: { copy: TypeAnalysisCopy }) {
  const items = useMemo<Item[]>(
    () => [
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
        id: "thinkingPattern",
        title: "THINKING PATTERN（思考パターン）",
        body: copy.thinkingPattern,
        defaultOpen: false,
        tier: "note",
      },
      {
        id: "workStyle",
        title: "WORK STYLE（働き方）",
        body: copy.workStyle,
        defaultOpen: false,
        tier: "note",
      },
      {
        id: "riskPoint",
        title: "RISK POINT（注意点）",
        body: copy.riskPoint,
        defaultOpen: false,
        tier: "note",
      },
      {
        id: "growth",
        title: "GROWTH（伸びしろ）",
        body: copy.growth,
        defaultOpen: true,
        tier: "core",
      },
    ],
    [copy],
  );

  return (
    <section className="space-y-2.5">
      <header className="px-0.5 pb-0.5">
        <p className={sectionLabelClass}>TYPE ANALYSIS</p>
        <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">あなたの傾向</h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">あなたらしさは、こんな感じです。</p>
      </header>

      <div className="space-y-2">
        {items.map((item) => (
          <AccordionItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

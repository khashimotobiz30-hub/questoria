"use client";

import React, { useState } from "react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";

type Props = {
  judgementReason?: string;
  highAxisReason?: string;
  lowAxisReason?: string;
  combinationInsight?: string;
  profileSummary?: string;
  summaryOverride?: string;
  hideCoreLabel?: boolean;
};

/** `TypeAnalysisSection` の AccordionItem（CORE）と同系のトグル＋矢印 */
function SummaryAccordion({ text, hideCoreLabel }: { text: string; hideCoreLabel?: boolean }) {
  const [open, setOpen] = useState(true);

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

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
            {!hideCoreLabel ? (
              <span className="rounded-full border border-[#FFD700]/28 bg-[#FFD700]/12 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-[#FFD700]/95">
                CORE
              </span>
            ) : null}
            <p className="text-sm font-semibold leading-snug tracking-[0.2em] text-[#FFD700]">
              SUMMARY（要約）
            </p>
          </div>
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
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="whitespace-pre-line text-[13px] leading-relaxed text-white/82 sm:text-sm"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhyThisTypeSection(props: Props) {
  const summaryOverride = props.summaryOverride?.trim();
  const body = summaryOverride
    ? summaryOverride
    : [
        props.judgementReason,
        props.highAxisReason,
        props.lowAxisReason,
        props.combinationInsight,
        props.profileSummary,
      ]
        .filter(Boolean)
        .join("\n\n");
  const hasAny = Boolean(body);

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
              WHY THIS TYPE
            </p>
            <h2 className="mt-2.5 font-orbitron text-lg font-bold tracking-wide text-white sm:mt-3">
              なぜこのタイプなのか
            </h2>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/70 sm:mt-2">
              あなたの回答傾向から、今回のタイプ判定はこのように導かれました。
            </p>
          </header>
          <div className="border-t border-white/[0.09] pb-3">
            {hasAny ? (
              <SummaryAccordion text={body} hideCoreLabel={props.hideCoreLabel} />
            ) : (
              <p className="px-4 pb-2 pt-3 text-sm leading-relaxed text-white/70 sm:px-5 sm:pb-3 sm:pt-4">
                このタイプの判定理由テキストは準備中です。
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

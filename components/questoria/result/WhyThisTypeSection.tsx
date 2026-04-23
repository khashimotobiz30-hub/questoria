"use client";

import React from "react";

import {
  ResultCardDecor,
  reportBodyTextClass,
  reportHeadingTextClass,
  reportMutedTextClass,
  resultCardShellClass,
} from "@/components/questoria/result/resultCardTheme";

type Props = {
  judgementReason?: string;
  highAxisReason?: string;
  lowAxisReason?: string;
  combinationInsight?: string;
  profileSummary?: string;
  summaryOverride?: string;
  hideCoreLabel?: boolean;
  /** レポート本文に埋め込む（外枠カードを外す） */
  embedded?: boolean;
};

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
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const header = (
    <header className={props.embedded ? "px-0 pb-3 pt-0" : "px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4"}>
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
          なぜこのタイプなのか
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
    </header>
  );

  const bodyNode = (
    <div className={props.embedded ? "pb-1" : "pb-3"}>
      {hasAny ? (
        <div className={props.embedded ? "pt-3" : ""}>
          {!props.hideCoreLabel ? (
            <p className="px-4 py-3 text-sm font-semibold leading-snug tracking-[0.2em] text-[#FFD700] sm:px-5 sm:py-4">
              SUMMARY（要約）
            </p>
          ) : null}
          <div
            className={
              props.embedded
                ? "mx-auto max-w-prose space-y-4 pt-1"
                : "mx-auto max-w-prose space-y-4 border-t border-white/[0.07] px-4 pb-4 pt-3 sm:px-5"
            }
          >
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`whitespace-pre-line text-[14px] leading-[1.9] sm:text-[15px] ${reportBodyTextClass}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p
          className={
            props.embedded
              ? `pb-2 pt-3 text-sm leading-relaxed ${reportMutedTextClass}`
              : `px-4 pb-2 pt-3 text-sm leading-relaxed sm:px-5 sm:pb-3 sm:pt-4 ${reportMutedTextClass}`
          }
        >
          このタイプの判定理由テキストは準備中です。
        </p>
      )}
    </div>
  );

  if (props.embedded) {
    return (
      <section>
        {header}
        {bodyNode}
      </section>
    );
  }

  return (
    <section>
      <div className={resultCardShellClass("default")}>
        <ResultCardDecor withRail />
        <div className="relative z-[1]">
          {header}
          {bodyNode}
        </div>
      </div>
    </section>
  );
}

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
  combinationInsight?: string;
  /** レポート本文に埋め込む（外枠カードを外す） */
  embedded?: boolean;
};

function Paras({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-prose space-y-3">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`whitespace-pre-line text-[15px] leading-[1.85] ${reportBodyTextClass}`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

export function WhyThisTypeSection(props: Props) {
  const judgement = props.judgementReason?.trim() ?? "";
  const combination = props.combinationInsight?.trim() ?? "";
  const hasAny = Boolean(judgement || combination);

  const header = (
    <header className={props.embedded ? "px-0 pb-2 pt-0" : "px-4 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4"}>
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
          なぜこの結果なのか
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
        今回の答え方のクセから見ると、こうなります。
      </p>
    </header>
  );

  const bodyNode = (
    <div className={props.embedded ? "space-y-4 pb-1 pt-3" : "space-y-4 px-4 pb-4 pt-3 sm:px-5"}>
      {hasAny ? (
        <>
          {judgement ? <Paras text={judgement} /> : null}
          {combination ? (
            <div className="rounded-xl border border-white/10 bg-black/25 px-3.5 py-3.5">
              <p className={`text-[13px] leading-relaxed ${reportMutedTextClass}`}>まとめ</p>
              <p className={`mt-1.5 whitespace-pre-line text-[15px] leading-[1.85] ${reportBodyTextClass}`}>
                {combination}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <p className={`text-sm leading-relaxed ${reportMutedTextClass}`}>
          判定理由テキストは準備中です。
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

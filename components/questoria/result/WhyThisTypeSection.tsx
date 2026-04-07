import React from "react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";

type Props = {
  judgementReason?: string;
  highAxisReason?: string;
  lowAxisReason?: string;
  combinationInsight?: string;
  profileSummary?: string;
};

function Block({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className={resultCardShellClass("default")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-3 p-4">
        <p className={sectionLabelClass}>{label}</p>
        <div className="space-y-3 border-t border-white/10 pt-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line text-sm leading-relaxed text-white/75">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WhyThisTypeSection(props: Props) {
  const insightText = [props.highAxisReason, props.lowAxisReason, props.combinationInsight]
    .filter(Boolean)
    .join("\n\n");

  const hasAny =
    props.judgementReason ||
    insightText ||
    props.profileSummary;

  return (
    <section className="space-y-4">
      <div className="px-0.5">
        <p className={sectionLabelClass}>WHY THIS TYPE</p>
        <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
          なぜこのタイプなのか
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          あなたの回答傾向から、今回のタイプ判定はこのように導かれました。
        </p>
      </div>

      {hasAny ? (
        <div className="space-y-3">
          <Block label="JUDGEMENT" text={props.judgementReason} />

          <Block label="INSIGHT" text={insightText} />

          <Block label="SUMMARY" text={props.profileSummary} />
        </div>
      ) : (
        <div className={resultCardShellClass("subtle")}>
          <ResultCardDecor withRail />
          <div className="relative z-[1] p-4">
            <p className="text-sm leading-relaxed text-white/70">
              このタイプの判定理由テキストは準備中です。
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useMemo } from "react";

import {
  ResultCardDecor,
  reportBodyTextClass,
  reportHeadingTextClass,
  reportLabelGoldClass,
  reportMutedTextClass,
  resultCardShellClass,
} from "@/components/questoria/result/resultCardTheme";
import { buildNextActionPrescription } from "@/lib/buildNextActionPrescription";

export function NextActionSection({
  title,
  riskPoint,
  growth,
  lead,
  nextActions,
  bodyOverride,
  immediateActionOverride,
  /** レポート本文に埋め込む（外枠カードを外す） */
  embedded,
}: {
  title?: string;
  riskPoint?: string;
  growth?: string;
  lead?: string;
  nextActions?: readonly string[];
  bodyOverride?: string;
  immediateActionOverride?: string;
  embedded?: boolean;
}) {
  const prescription = useMemo(() => {
    const body = bodyOverride?.trim();
    const immediateAction = immediateActionOverride?.trim();
    if (body || immediateAction) {
      return {
        body: body ?? "",
        immediateAction: immediateAction ?? "",
      };
    }
    return buildNextActionPrescription({
      riskPoint,
      growth,
      nextActionLead: lead,
      nextActions,
    });
  }, [bodyOverride, immediateActionOverride, riskPoint, growth, lead, nextActions]);

  const header = (
    <header className={embedded ? "space-y-0" : ""}>
      <h2 className={`mt-2 text-center font-orbitron text-lg font-bold tracking-wide ${reportHeadingTextClass}`}>
        <span className="inline-flex items-center justify-center gap-2">
          <span
            className="text-[0.9em] text-cyan-200/95 drop-shadow-[0_0_14px_rgba(0,229,255,0.16)]"
            aria-hidden="true"
          >
            ◆
          </span>
          {title ?? "今から意識するべきこと"}
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

  const body = (
    <div className="pt-4">
      {prescription ? (
        <div className="space-y-4">
          <p className={`mx-auto max-w-prose whitespace-pre-line text-[15px] leading-[1.9] sm:text-[15px] ${reportBodyTextClass}`}>
            {prescription.body}
          </p>

          <div className="rounded-xl border border-[#FFD700]/24 bg-[#FFD700]/[0.055] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,215,0,0.06)] sm:px-4 sm:py-4">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${reportLabelGoldClass}`}>
              今から始める NEXT ACTION は…
            </p>
            <p className={`mt-2.5 whitespace-pre-line text-[15px] font-medium leading-[1.85] tracking-[0.01em] sm:text-[15px] ${reportBodyTextClass}`}>
              {prescription.immediateAction}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/14 bg-black/25 p-4">
          <p className={`text-sm ${reportMutedTextClass}`}>TODO: nextActions を他タイプにも追加</p>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <section className="space-y-4">
        {header}
        {body}
      </section>
    );
  }

  return (
    <section className={resultCardShellClass("action")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        {header}
        {body}
      </div>
    </section>
  );
}

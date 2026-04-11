import React, { useMemo } from "react";

import { ResultCardDecor, resultCardShellClass, sectionLabelClass } from "@/components/questoria/result/resultCardTheme";
import { buildNextActionPrescription } from "@/lib/buildNextActionPrescription";

export function NextActionSection({
  riskPoint,
  growth,
  lead,
  nextActions,
}: {
  riskPoint?: string;
  growth?: string;
  lead?: string;
  nextActions?: readonly string[];
}) {
  const prescription = useMemo(
    () =>
      buildNextActionPrescription({
        riskPoint,
        growth,
        nextActionLead: lead,
        nextActions,
      }),
    [riskPoint, growth, lead, nextActions],
  );

  return (
    <section className={resultCardShellClass("action")}>
      <ResultCardDecor withRail />
      <div className="relative z-[1] space-y-4 p-5">
        <header>
          <p className={sectionLabelClass}>NEXT ACTION</p>
          <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
            今から意識するべきこと
          </h2>
        </header>

        <div className="border-t border-white/10 pt-4">
          {prescription ? (
            <div className="space-y-4">
              <p className="whitespace-pre-line text-[15px] leading-[1.75] text-white/82 sm:text-sm sm:leading-relaxed">
                {prescription.body}
              </p>

              <div className="rounded-xl border border-[#FFD700]/24 bg-[#FFD700]/[0.055] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,215,0,0.06)] sm:px-4 sm:py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFD700]/85">
                  今から始める NEXT ACTION は…
                </p>
                <p className="mt-2.5 whitespace-pre-line text-sm font-medium leading-relaxed tracking-[0.01em] text-white/[0.93]">
                  {prescription.immediateAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/14 bg-black/25 p-4">
              <p className="text-sm text-white/60">TODO: nextActions を他タイプにも追加</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

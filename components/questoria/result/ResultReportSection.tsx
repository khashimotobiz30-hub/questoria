import React from "react";

import { ResultCardDecor } from "@/components/questoria/result/resultCardTheme";

export function ResultReportSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.055] via-white/[0.03] to-black/[0.28] shadow-[0_0_26px_rgba(255,215,0,0.045),0_0_28px_rgba(0,229,255,0.05)] backdrop-blur-md">
      <ResultCardDecor withRail subdued />
      <div className="relative z-[1] px-5 pb-6 pt-5">
        <div className="divide-y divide-white/[0.10]">{children}</div>
      </div>
    </section>
  );
}


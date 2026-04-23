import React from "react";

import { ResultCardDecor } from "@/components/questoria/result/resultCardTheme";

export function ResultPlateSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-b from-[#121722]/92 via-[#0A0E16]/90 to-black/92 shadow-[0_0_26px_rgba(255,215,0,0.035),0_0_28px_rgba(0,229,255,0.045)] backdrop-blur-xl">
      <ResultCardDecor withRail subdued />
      {/* readability-first stone/panel texture (subtle) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(0,229,255,0.05), transparent 55%), radial-gradient(120% 90% at 50% 120%, rgba(255,215,0,0.045), transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 18%, rgba(0,0,0,0.18) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.035), rgba(255,255,255,0.035) 1px, transparent 1px, transparent 10px)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}


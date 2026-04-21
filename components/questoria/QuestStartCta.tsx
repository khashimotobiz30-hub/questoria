"use client";

import { useEffect, useState } from "react";

import { readStoredDiagnosisResult } from "@/lib/readStoredDiagnosisResult";
import { readStoredLightDiagnosisResult } from "@/lib/readStoredLightDiagnosisResult";
import { RitualLaunchLink } from "@/components/questoria/RitualPlate";

type Props = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

type Mode = "firstTime" | "afterLight" | "afterDeep";

export function QuestStartCta({ variant = "primary", children, className }: Props) {
  const [mode, setMode] = useState<Mode>("firstTime");

  useEffect(() => {
    const update = () => {
      const deep = readStoredDiagnosisResult();
      if (deep) {
        setMode("afterDeep");
        return;
      }
      const light = readStoredLightDiagnosisResult();
      if (light) {
        setMode("afterLight");
        return;
      }
      setMode("firstTime");
    };

    update();
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    window.addEventListener("storage", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
      window.removeEventListener("storage", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // Main CTA should never jump straight to /result.
  // - firstTime: LIGHT entry
  // - afterLight/afterDeep: go to deep diagnosis flow (WORK/LIFE) as the next step
  const href = mode === "firstTime" ? "/light?fresh=1" : "/play?fresh=1";

  return (
    <div className={className}>
      <RitualLaunchLink href={href} variant={variant}>
        {children}
      </RitualLaunchLink>
      {mode === "afterLight" && (
        <div className="mt-3 flex justify-center">
          <a
            href="/result?src=light"
            className="inline-flex items-center justify-center rounded-lg border border-cyan-300/25 bg-black/30 px-4 py-2 font-mono text-[12px] tracking-[0.14em] text-cyan-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:border-cyan-300/40 hover:bg-black/36 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
          >
            LIGHTの結果を見る
          </a>
        </div>
      )}
    </div>
  );
}


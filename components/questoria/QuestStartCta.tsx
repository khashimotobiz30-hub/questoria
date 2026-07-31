"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { readStoredDiagnosisResult } from "@/lib/readStoredDiagnosisResult";
import { RitualLaunchLink } from "@/components/questoria/RitualPlate";

type Props = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export function QuestStartCta({
  variant = "primary",
  children,
  className,
}: Props) {
  const [hasDeepResult, setHasDeepResult] = useState(false);

  useEffect(() => {
    const update = () => {
      setHasDeepResult(readStoredDiagnosisResult() !== null);
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

  return (
    <div className={className}>
      <RitualLaunchLink
        href="/play?fresh=1"
        variant={variant}
        onClick={() => {
          trackEvent("click_top_main_cta", {
            cta_id: "top_main",
            target_flow: "deep",
            has_deep_result: hasDeepResult,
            fresh: true,
            screen: "top",
          });
        }}
      >
        {children}
      </RitualLaunchLink>
    </div>
  );
}

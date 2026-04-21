"use client";

import type { LightDiagnosisResult } from "@/types";
import { parseStoredLightDiagnosisResult } from "@/lib/parseStoredLightDiagnosisResult";
import { QUESTORIA_LIGHT_RESULT_KEY } from "@/lib/questoriaStorage";

/**
 * Read the latest stored LIGHT diagnosis result (sessionStorage first, then localStorage),
 * and return a normalized/validated LightDiagnosisResult or null.
 */
export function readStoredLightDiagnosisResult(): LightDiagnosisResult | null {
  if (typeof window === "undefined") return null;

  const sources: Array<"sessionStorage" | "localStorage"> = ["sessionStorage", "localStorage"];
  for (const source of sources) {
    try {
      const raw =
        source === "sessionStorage"
          ? sessionStorage.getItem(QUESTORIA_LIGHT_RESULT_KEY)
          : localStorage.getItem(QUESTORIA_LIGHT_RESULT_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as unknown;
      const diagnosis = parseStoredLightDiagnosisResult(parsed);
      if (diagnosis) return diagnosis;
    } catch {
      // try next source
    }
  }
  return null;
}


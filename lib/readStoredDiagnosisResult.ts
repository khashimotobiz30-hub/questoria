"use client";

import type { DiagnosisResult } from "@/types";
import { parseStoredDiagnosisResult } from "@/lib/parseStoredDiagnosisResult";
import { QUESTORIA_RESULT_KEY } from "@/lib/questoriaStorage";

/**
 * Read the latest stored diagnosis result (sessionStorage first, then localStorage),
 * and return a normalized/validated DiagnosisResult or null.
 *
 * This function is the single source of truth for:
 * - `/result` page session read
 * - Top "前回の結果を見る" CTA visibility
 */
export function readStoredDiagnosisResult(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;

  const sources: Array<"sessionStorage" | "localStorage"> = ["sessionStorage", "localStorage"];
  for (const source of sources) {
    try {
      const raw =
        source === "sessionStorage"
          ? sessionStorage.getItem(QUESTORIA_RESULT_KEY)
          : localStorage.getItem(QUESTORIA_RESULT_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as unknown;
      const diagnosis = parseStoredDiagnosisResult(parsed);
      if (diagnosis) return diagnosis;
    } catch {
      // try next source
    }
  }
  return null;
}


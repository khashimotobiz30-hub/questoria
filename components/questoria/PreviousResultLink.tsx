"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { parseStoredDiagnosisResult } from "@/lib/parseStoredDiagnosisResult";

const SESSION_KEY_RESULT = "questoria_result";

function hasValidStoredResult(): boolean {
  try {
    const raw =
      sessionStorage.getItem(SESSION_KEY_RESULT) ??
      localStorage.getItem(SESSION_KEY_RESULT);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as unknown;
    return parseStoredDiagnosisResult(parsed) !== null;
  } catch {
    return false;
  }
}

export function PreviousResultLink({
  className,
}: {
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(hasValidStoredResult());
  }, []);

  if (!visible) return null;

  return (
    <div className={className}>
      <Link
        href="/result"
        className="inline-flex items-center justify-center rounded-lg border border-cyan-300/25 bg-black/30 px-4 py-2 font-mono text-[12px] tracking-[0.14em] text-cyan-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:border-cyan-300/40 hover:bg-black/36 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
      >
        前回の結果を見る
      </Link>
    </div>
  );
}


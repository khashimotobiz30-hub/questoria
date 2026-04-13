"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { readStoredDiagnosisResult } from "@/lib/readStoredDiagnosisResult";

export function PreviousResultLink({
  className,
}: {
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isTest =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("prevLinkTest") === "1";

    const update = () => {
      if (isTest) {
        setVisible(true);
        return;
      }
      setVisible(readStoredDiagnosisResult() !== null);
    };
    update();

    // SPA遷移/戻る操作でマウントが維持される場合があるため、
    // ページ復帰タイミングでも再判定して「あるのに出ない」を防ぐ。
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
  }, [pathname]);

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


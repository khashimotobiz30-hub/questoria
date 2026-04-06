import React from "react";

export type ResultCardVariant = "default" | "subtle" | "compare" | "action" | "emphasis";

/** 結果画面メインカード共通：角丸・枠・ベースグラデ・基本グロー */
export function resultCardShellClass(
  variant: ResultCardVariant = "default",
  extra?: string,
): string {
  const shellDefault =
    "relative overflow-hidden rounded-2xl border bg-gradient-to-b transition-all duration-200";
  const shellByVariant: Record<ResultCardVariant, string> = {
    default:
      `${shellDefault} border-white/10 shadow-[0_0_28px_rgba(255,215,0,0.055)]`,
    subtle:
      `${shellDefault} border-white/10 shadow-[0_0_28px_rgba(255,215,0,0.055)]`,
    /** OTHER TYPES など：主セクションより弱く、読みやすさ用に枠・陰影だけやや強める */
    compare: `${shellDefault} border-white/13 shadow-[0_8px_36px_rgba(0,0,0,0.48),0_0_24px_rgba(255,215,0,0.04)]`,
    action:
      `${shellDefault} border-white/10 shadow-[0_0_28px_rgba(255,215,0,0.055)]`,
    emphasis:
      `${shellDefault} border-white/10 shadow-[0_0_28px_rgba(255,215,0,0.055)]`,
  };
  const stops: Record<ResultCardVariant, string> = {
    default: "from-[#FFD700]/8 via-white/[0.04] to-black/35",
    subtle: "from-[#FFD700]/7 via-white/[0.03] to-black/[0.32]",
    compare: "from-[#FFD700]/6 via-white/[0.042] to-black/[0.36]",
    action: "from-[#FFD700]/9 via-cyan-300/[0.04] to-black/35",
    emphasis: "from-[#FFD700]/8 via-white/[0.045] to-black/35",
  };
  return [shellByVariant[variant], stops[variant], extra].filter(Boolean).join(" ");
}

/** アコーディオン等：開いた状態の共通リング＋グロー */
export const resultCardExpandedClass =
  "shadow-[0_0_36px_rgba(255,215,0,0.09)] ring-1 ring-[#FFD700]/16";

/** セクション見出し左の // LABEL // 系 */
export const sectionLabelClass =
  "font-mono text-[11px] tracking-[0.28em] text-[#FFD700]/70 [text-shadow:0_0_10px_rgba(255,215,0,0.18)]";

/** ネストカード（STEP、ダッシュ枠など） */
export const resultCardNestedClass =
  "rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm";

export function ResultCardDecor({
  withRail = true,
  /** LP content プレート等：上スウィープを浅くし「帯が載った」感を抑える */
  subdued = false,
}: {
  withRail?: boolean;
  subdued?: boolean;
}) {
  if (subdued) {
    return (
      <>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-7 opacity-[0.42]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,215,0,0.065), rgba(0,229,255,0.034), transparent)",
          }}
          aria-hidden="true"
        />
        {withRail ? (
          <div
            className="pointer-events-none absolute inset-y-4 left-0 w-0.5 rounded-full opacity-[0.86]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,215,0,0.0), rgba(255,215,0,0.4), rgba(0,229,255,0.12), rgba(255,215,0,0.0))",
              boxShadow: "0 0 10px rgba(255,215,0,0.11)",
            }}
            aria-hidden="true"
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10 opacity-[0.78]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,215,0,0.12), rgba(0,229,255,0.06), transparent)",
        }}
        aria-hidden="true"
      />
      {withRail ? (
        <div
          className="pointer-events-none absolute inset-y-3 left-0 w-0.5 rounded-full opacity-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,215,0,0.0), rgba(255,215,0,0.65), rgba(0,229,255,0.2), rgba(255,215,0,0.0))",
            boxShadow: "0 0 16px rgba(255,215,0,0.2)",
          }}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";

function CornerBrackets() {
  const L = "pointer-events-none absolute h-5 w-5 border-[#d4af37]/55 sm:h-6 sm:w-6";
  return (
    <>
      <span className={`${L} left-2.5 top-2.5 border-l-2 border-t-2 sm:left-3 sm:top-3`} aria-hidden />
      <span className={`${L} right-2.5 top-2.5 border-r-2 border-t-2 sm:right-3 sm:top-3`} aria-hidden />
      <span className={`${L} bottom-2.5 left-2.5 border-b-2 border-l-2 sm:bottom-3 sm:left-3`} aria-hidden />
      <span className={`${L} bottom-2.5 right-2.5 border-b-2 border-r-2 sm:bottom-3 sm:right-3`} aria-hidden />
    </>
  );
}

/** 神殿・古代端末風：重厚な儀式パネル（2・3画面目共通ラッパ） */
export function RitualPlate({
  children,
  density = "default",
}: {
  children: ReactNode;
  density?: "default" | "compact";
}) {
  const pad =
    density === "compact"
      ? "px-5 py-5 sm:px-6 sm:py-6"
      : "px-6 py-7 sm:px-7 sm:py-8";

  return (
    <div
      className="relative w-full max-w-md"
      style={{
        filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 48px rgba(0,229,255,0.05))",
      }}
    >
      <div className="rounded-sm p-[1px] bg-gradient-to-br from-[#e8c76a]/45 via-[#6b5344]/35 to-[#c9a227]/40">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-b from-[#0e353c]/93 via-[#0a262c]/91 to-[#051518]/94 backdrop-blur-[2px]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.12) 2px, rgba(0,229,255,0.12) 3px)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-cyan-400/14 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent"
            aria-hidden
          />
          <CornerBrackets />
          <div className={`relative z-[1] ${pad}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/** 古代端末のチャンネル表示風ヘッダ */
export function RitualTerminalHeader({
  channel,
  title,
  titleClassName,
}: {
  channel: string;
  title: string;
  titleClassName: string;
}) {
  return (
    <header className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-400/75 sm:text-[11px]">
          {channel}
        </p>
        <div
          className="h-px min-w-[1.5rem] flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent"
          aria-hidden
        />
      </div>
      <h2 className={titleClassName}>{title}</h2>
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a227]/35 to-transparent"
        aria-hidden
      />
    </header>
  );
}

const scanDotClass =
  "relative z-[1] box-border h-2.5 w-2.5 shrink-0 rounded-full border border-cyan-300/55 bg-[#0b2f38] shadow-[0_0_14px_rgba(34,211,238,0.55),inset_0_0_6px_rgba(34,211,238,0.25)] sm:h-[0.65rem] sm:w-[0.65rem]";

/** スキャン／解放ログ風リスト（マーカー固定幅＋テキスト列でズレにくく配置） */
export function RitualScanList({
  items,
  highlightLast = false,
  compact = false,
}: {
  items: string[];
  highlightLast?: boolean;
  compact?: boolean;
}) {
  const textCellPad = compact
    ? "py-[0.72rem] sm:py-[0.82rem]"
    : "py-[1.05rem] sm:py-5";

  return (
    <ul className="flex w-full min-w-0 flex-col">
      {items.map((text, i) => {
        const isLast = i === items.length - 1;
        const isHi = highlightLast && isLast;
        const rewardLines =
          isHi && text.includes("\n") ? text.split("\n").filter(Boolean) : null;

        return (
          <li
            key={i}
            className="flex w-full min-w-0 items-stretch gap-3 border-b border-cyan-400/[0.1] last:border-b-0 sm:gap-3.5"
          >
            <div
              className={`flex w-10 shrink-0 flex-col items-center border-l border-cyan-400/[0.28] ${textCellPad} sm:w-11`}
            >
              <span className={scanDotClass} aria-hidden />
            </div>
            <div className={`min-w-0 flex-1 ${textCellPad} pr-0.5`}>
              {rewardLines && rewardLines.length >= 2 ? (
                <span className="block">
                  <span className="font-[var(--font-noto)] text-[13px] font-medium leading-snug tracking-wide text-[#e8d9a4]/88 sm:text-sm">
                    {rewardLines[0]}
                  </span>
                  <span
                    className="my-2 block h-px w-10 bg-gradient-to-r from-[#f0dc82]/55 to-transparent sm:w-12"
                    aria-hidden
                  />
                  <span className="font-[var(--font-noto)] text-[16px] font-bold leading-snug tracking-wide text-[#fff8e1] [text-shadow:0_0_26px_rgba(255,215,0,0.42),0_0_48px_rgba(255,200,80,0.15)] sm:text-[17px]">
                    {rewardLines[1]}
                  </span>
                </span>
              ) : (
                <span
                  className={
                    isHi
                      ? "font-[var(--font-noto)] text-[15px] font-semibold leading-snug tracking-wide text-[#f0dc82]/95 [text-shadow:0_0_20px_rgba(255,215,0,0.28)] sm:text-base"
                      : "font-[var(--font-noto)] text-sm leading-relaxed tracking-wide text-white/86 sm:text-[15px]"
                  }
                >
                  {text}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const launchCorner = "pointer-events-none absolute h-3 w-3 border-[#d4af37]/60 sm:h-3.5 sm:w-3.5";
const launchCornerAux =
  "pointer-events-none absolute h-2 w-2 border-[#a89040]/55 sm:h-2.5 sm:w-2.5";

const ritualLaunchBase =
  "relative z-0 inline-flex items-center justify-center overflow-hidden font-[var(--font-orbitron)] font-bold tracking-[0.14em] text-[#f0dc82] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45";

const ritualLaunchGlow =
  "before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-300/75 before:to-transparent after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/[0.04] after:to-transparent";

const ritualLaunchGlowAux =
  "before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-300/50 before:to-transparent after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/[0.025] after:to-transparent";

export function RitualLaunchLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "auxiliary";
}) {
  const isAux = variant === "auxiliary";

  const sizing = isAux
    ? "border border-[#9a8040]/38 px-5 py-2.5 text-[11px] tracking-[0.11em] text-[#e0d4a8]/90 sm:px-6 sm:py-3 sm:text-xs"
    : variant === "primary"
      ? "border-2 border-[#c9a227]/55 px-9 py-4 text-[14px] sm:px-10 sm:text-[15px]"
      : "border-2 border-[#b8962e]/50 px-7 py-3.5 text-sm sm:px-8";

  const surface = isAux
    ? "bg-gradient-to-b from-[#0e3038]/85 via-[#081c22]/88 to-[#040e12]/92 shadow-[inset_0_1px_16px_rgba(0,0,0,0.38),0_0_0_1px_rgba(0,229,255,0.05),0_4px_18px_rgba(0,0,0,0.45)]"
    : variant === "primary"
      ? "bg-gradient-to-b from-[#143e45]/95 via-[#0d282e]/96 to-[#061316]/98 shadow-[inset_0_2px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,229,255,0.12),0_8px_32px_rgba(0,0,0,0.55),0_0_40px_rgba(201,162,39,0.08)]"
      : "bg-gradient-to-b from-[#123840]/92 via-[#0b2228]/94 to-[#050f12]/96 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,229,255,0.1),0_6px_28px_rgba(0,0,0,0.5)]";

  const glowLayer = isAux ? ritualLaunchGlowAux : ritualLaunchGlow;

  const hover = isAux
    ? "hover:border-[#b8962e]/48 hover:text-[#f5edd0] hover:shadow-[inset_0_1px_14px_rgba(0,0,0,0.3),0_0_18px_rgba(201,162,39,0.14)]"
    : "hover:border-[#e8c76a]/65 hover:text-[#fff8e6] hover:shadow-[inset_0_2px_24px_rgba(0,0,0,0.35),0_0_28px_rgba(201,162,39,0.22),0_0_0_1px_rgba(0,229,255,0.2)]";

  const C = isAux ? launchCornerAux : launchCorner;
  const edgeTL = isAux ? "border-l border-t" : "border-l-2 border-t-2";
  const edgeTR = isAux ? "border-r border-t" : "border-r-2 border-t-2";
  const edgeBL = isAux ? "border-b border-l" : "border-b-2 border-l-2";
  const edgeBR = isAux ? "border-b border-r" : "border-b-2 border-r-2";

  return (
    <Link
      href={href}
      className={`rounded-sm ${ritualLaunchBase} ${glowLayer} ${surface} ${sizing} ${hover}`}
    >
      <span className={`${C} left-1.5 top-1.5 ${edgeTL} sm:left-2 sm:top-2`} aria-hidden />
      <span className={`${C} right-1.5 top-1.5 ${edgeTR} sm:right-2 sm:top-2`} aria-hidden />
      <span className={`${C} bottom-1.5 left-1.5 ${edgeBL} sm:bottom-2 sm:left-2`} aria-hidden />
      <span className={`${C} bottom-1.5 right-1.5 ${edgeBR} sm:bottom-2 sm:right-2`} aria-hidden />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

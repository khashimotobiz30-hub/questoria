import type { ReactNode } from "react";
import Image from "next/image";
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

/** 神殿・古代端末風：重厚な儀式パネル。`tone="content"` は背景を透かした軽い情報レイヤー（LP 等） */
export function RitualPlate({
  children,
  density = "default",
  tone = "ritual",
}: {
  children: ReactNode;
  /** `readable`：情報パネル向け。上余白をやや厚めにしタイトル周りを締めずに見せる */
  density?: "default" | "compact" | "tight" | "readable";
  tone?: "ritual" | "content";
}) {
  const pad =
    density === "tight"
      ? "px-4 py-3 sm:px-5 sm:py-3.5"
      : density === "readable"
        ? "px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-3.5"
        : density === "compact"
          ? "px-5 py-5 sm:px-6 sm:py-6"
          : "px-6 py-7 sm:px-7 sm:py-8";

  if (tone === "content") {
    return (
      <div
        className="relative w-full max-w-md"
        style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.38))" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(4,8,12,0.46)] shadow-[0_0_28px_rgba(255,215,0,0.055)] backdrop-blur-[5px]">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-white/[0.026] to-black/12"
            aria-hidden
          />
          <div className={`relative z-[1] ${pad}`}>{children}</div>
        </div>
      </div>
    );
  }

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
  compactHeader = false,
  /** 透かし情報レイヤー用：ラインとチャンネル表現を控えめに */
  soft = false,
}: {
  channel: string;
  title: string;
  titleClassName: string;
  /** 2枚目など情報密度が高いパネル用 */
  compactHeader?: boolean;
  soft?: boolean;
}) {
  return (
    <header className={compactHeader ? "space-y-1.5 sm:space-y-2" : "space-y-3"}>
      <div className={`flex items-center ${compactHeader ? "gap-2" : "gap-3"}`}>
        <p
          className={
            soft
              ? "whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-[#40c0c0]/68 sm:text-[10px]"
              : compactHeader
                ? "whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-[#40c0c0]/85 sm:text-[10px]"
                : "whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-400/75 sm:text-[11px]"
          }
        >
          {channel}
        </p>
        <div
          className={`h-px min-w-[1rem] flex-1 bg-gradient-to-r ${soft ? "from-[#40c0c0]/22" : compactHeader ? "from-[#40c0c0]/45" : "from-cyan-400/40"} to-transparent`}
          aria-hidden
        />
      </div>
      <h2 className={titleClassName}>{title}</h2>
      <div
        className={`h-px w-full bg-gradient-to-r from-transparent ${soft ? "via-[#c9a227]/16" : "via-[#c9a227]/35"} to-transparent`}
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

/** 2枚目用：診断結果風ダミーバー（長さのみ内部計算・画面上は ??? のみ） */
export function RitualDummyAxisBars({
  light = false,
  /** 本文内で軽く主役に寄せる（`light` 時のみ・パネルに馴染む控えめなコントラスト） */
  prominent = false,
}: { light?: boolean; prominent?: boolean } = {}) {
  const rows = [
    { id: "def", label: "目的定義力", widthPct: 70 },
    { id: "design", label: "設計力", widthPct: 55 },
    { id: "auto", label: "自律判断力", widthPct: 82 },
  ] as const;

  const shell = !light
    ? "rounded-sm border border-[#40c0c0]/16 bg-[#0a0e14]/40 px-2 py-1.5 sm:px-2.5 sm:py-2"
    : prominent
      ? "rounded-md border border-white/[0.085] bg-black/[0.26] px-2.5 py-2 shadow-[0_6px_22px_rgba(0,0,0,0.28)] backdrop-blur-[3px] sm:px-2.5 sm:py-2.5"
      : "rounded-md border border-white/[0.09] bg-black/25 px-2 py-1.5 sm:px-2.5 sm:py-2";

  return (
    <div
      className={shell}
      role="img"
      aria-label="3軸診断のイメージ。スコアは非表示です。"
    >
      <ul className="space-y-1 sm:space-y-1.5">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-[4.25rem] shrink-0 font-mono text-[8px] leading-tight text-[#b0c0cc]/90 sm:w-[4.75rem] sm:text-[9px]">
              {row.label}
            </span>
            <div className="relative h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#0a0e14]/90 sm:h-1.5">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#c9a030] to-[#f0c040] shadow-[0_0_10px_rgba(240,192,64,0.35)]"
                style={{ width: `${row.widthPct}%` }}
              />
            </div>
            <span className="w-7 shrink-0 text-right font-mono text-[9px] tabular-nums text-[#f0c040]/85 sm:w-8 sm:text-[10px]">
              ???
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 3枚目用：結果画面スクショをスマホ縦フレーム内に表示（実画像のみ・モックHTMLは使わない） */
export function RitualResultPhonePreview({
  src,
  alt = "診断完了後に表示される結果画面のプレビュー",
  lightFrame = false,
  emphasis = false,
}: {
  src: string;
  alt?: string;
  /** 透かし情報レイヤー上では枠・発光を抑える */
  lightFrame?: boolean;
  /** LP等：モックを一段目立たせる */
  emphasis?: boolean;
}) {
  const figMax = emphasis ? "max-w-[224px] sm:max-w-[248px]" : "max-w-[196px] sm:max-w-[218px]";
  const imgSizes = emphasis ? "(max-width:640px) 224px, 248px" : "(max-width:640px) 196px, 218px";

  const shellDefault = emphasis
    ? "relative aspect-[9/17.5] w-full overflow-hidden rounded-[1.35rem] border border-[#f0c040]/42 bg-[#0a0e14] shadow-[0_18px_54px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.46),inset_0_0_0_1px_rgba(240,192,64,0.18),0_0_42px_rgba(240,192,64,0.16),0_0_78px_rgba(240,192,64,0.07)]"
    : "relative aspect-[9/17.5] w-full overflow-hidden rounded-[1.35rem] border border-[#40c0c0]/28 bg-[#0a0e14] shadow-[0_14px_44px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(240,192,64,0.12),0_0_28px_rgba(64,192,192,0.07)]";

  return (
    <figure className={`mx-auto w-full shrink-0 ${figMax}`}>
      <div
        className={
          lightFrame
            ? "relative aspect-[9/17.5] w-full overflow-hidden rounded-[1.35rem] border border-white/[0.16] bg-[#0b1016]/95 shadow-[0_8px_26px_rgba(0,0,0,0.52),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.11),inset_0_0_0_1px_rgba(255,255,255,0.07),0_16px_24px_-8px_rgba(0,0,0,0.42)]"
            : shellDefault
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={imgSizes}
          className={emphasis ? "object-cover object-center brightness-[1.08] contrast-[1.02] saturate-[1.04]" : "object-cover object-center"}
          priority={false}
        />
        <div
          className={
            lightFrame
              ? "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-transparent"
              : "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"
          }
          aria-hidden
        />
        <div
          className={
            lightFrame
              ? "pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#0a0e14]/38 via-[#0a0e14]/08 to-transparent"
              : "pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0a0e14]/90 via-[#0a0e14]/25 to-transparent"
          }
          aria-hidden
        />
        {lightFrame ? (
          <div
            className="pointer-events-none absolute inset-x-3 bottom-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/[0.13] to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
    </figure>
  );
}

const launchCorner = "pointer-events-none absolute h-3 w-3 border-[#d4af37]/60 sm:h-3.5 sm:w-3.5";
const launchCornerPrimary =
  "pointer-events-none absolute h-2.5 w-2.5 border-[#f0c040]/72 sm:h-3 sm:w-3";
const launchCornerAux =
  "pointer-events-none absolute h-2 w-2 border-[#a89040]/55 sm:h-2.5 sm:w-2.5";

const ritualLaunchBase =
  "relative z-0 inline-flex items-center justify-center overflow-hidden font-[var(--font-orbitron)] transition-[transform,box-shadow,colors,border-color,filter] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40c0c0]/50";

/** ヒーロー primary：黒い起動板。上端はごく弱いハイライト、下端にわずかな暖色（背景の灯りを受けるイメージ） */
const ritualLaunchGlowPrimary =
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,215,0,0.72)] before:to-transparent after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/[0.05] after:via-transparent after:to-[rgba(45,22,8,0.055)]";

const ritualLaunchGlow =
  "before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#40c0c0]/70 before:to-transparent after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/[0.04] after:to-transparent";

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
      ? "group border-2 border-[#e8c030] px-11 py-[1.125rem] text-[15px] font-extrabold tracking-[0.14em] text-[#FFD700] hover:-translate-y-0.5 hover:brightness-[1.03] active:translate-y-0 active:scale-[0.99] active:brightness-[0.98] sm:px-12 sm:py-[1.375rem] sm:text-[16px]"
      : "border-2 border-[#b8962e]/50 px-7 py-3.5 text-sm text-[#f0dc82] sm:px-8";

  const surface = isAux
    ? "bg-gradient-to-b from-[#0e3038]/85 via-[#081c22]/88 to-[#040e12]/92 shadow-[inset_0_1px_16px_rgba(0,0,0,0.38),0_0_0_1px_rgba(0,229,255,0.05),0_4px_18px_rgba(0,0,0,0.45)]"
    : variant === "primary"
      ? "bg-gradient-to-b from-[rgba(255,215,0,0.18)] via-[rgba(255,215,0,0.10)] to-[rgba(12,8,4,0.72)] backdrop-blur-[2px] shadow-[inset_0_1px_0_rgba(255,250,235,0.09),inset_0_1px_12px_rgba(0,0,0,0.28),inset_0_-4px_14px_rgba(0,0,0,0.18),inset_0_-1px_0_rgba(255,200,80,0.06),inset_0_0_0_1px_rgba(255,230,160,0.22),0_2px_4px_rgba(0,0,0,0.35),0_6px_16px_rgba(0,0,0,0.4),0_0_18px_rgba(255,215,0,0.28),0_0_32px_rgba(255,200,100,0.18),0_0_48px_rgba(201,160,48,0.10),0_0_72px_rgba(255,215,0,0.05)]"
      : "bg-gradient-to-b from-[#123840]/92 via-[#0b2228]/94 to-[#050f12]/96 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,229,255,0.1),0_6px_28px_rgba(0,0,0,0.5)]";

  const glowLayer =
    isAux ? ritualLaunchGlowAux : variant === "primary" ? ritualLaunchGlowPrimary : ritualLaunchGlow;

  const hover = isAux
    ? "hover:border-[#b8962e]/48 hover:text-[#f5edd0] hover:shadow-[inset_0_1px_14px_rgba(0,0,0,0.3),0_0_18px_rgba(201,162,39,0.14)]"
    : variant === "primary"
      ? "hover:border-[#fff0b0] hover:text-[#fff8dc] hover:shadow-[inset_0_1px_0_rgba(255,255,250,0.1),inset_0_1px_14px_rgba(0,0,0,0.26),inset_0_-4px_14px_rgba(0,0,0,0.12),inset_0_-1px_0_rgba(255,220,120,0.08),inset_0_0_0_1px_rgba(255,248,210,0.35),0_2px_6px_rgba(0,0,0,0.22),0_8px_20px_rgba(0,0,0,0.38),0_0_24px_rgba(255,225,130,0.38),0_0_40px_rgba(255,215,0,0.22),0_0_64px_rgba(220,180,64,0.12),0_0_88px_rgba(255,215,0,0.06)]"
      : "hover:border-[#e8c76a]/65 hover:text-[#fff8e6] hover:shadow-[inset_0_2px_24px_rgba(0,0,0,0.35),0_0_28px_rgba(201,162,39,0.22),0_0_0_1px_rgba(64,192,192,0.2)]";

  const C = isAux ? launchCornerAux : variant === "primary" ? launchCornerPrimary : launchCorner;
  const thickFrame = variant === "secondary";
  const edgeTL = thickFrame ? "border-l-2 border-t-2" : "border-l border-t";
  const edgeTR = thickFrame ? "border-r-2 border-t-2" : "border-r border-t";
  const edgeBL = thickFrame ? "border-b-2 border-l-2" : "border-b border-l";
  const edgeBR = thickFrame ? "border-b-2 border-r-2" : "border-b border-r";

  const fontClass =
    variant === "secondary" ? "font-bold tracking-[0.14em]" : variant === "primary" ? "" : "font-semibold";

  const roundClass = variant === "primary" ? "rounded-none" : "rounded-sm";

  return (
    <Link
      href={href}
      className={`${roundClass} ${ritualLaunchBase} ${fontClass} ${glowLayer} ${surface} ${sizing} ${hover}`}
    >
      {variant === "primary" ? (
        <span
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(0,0,0,0.04)] via-[rgba(0,0,0,0.10)] to-[rgba(0,0,0,0.15)] opacity-[0.97] transition-opacity duration-200 ease-out group-hover:opacity-[0.78]"
          aria-hidden
        />
      ) : null}
      {variant !== "primary" ? (
        <>
          <span className={`${C} left-1.5 top-1.5 ${edgeTL} sm:left-2 sm:top-2`} aria-hidden />
          <span className={`${C} right-1.5 top-1.5 ${edgeTR} sm:right-2 sm:top-2`} aria-hidden />
          <span className={`${C} bottom-1.5 left-1.5 ${edgeBL} sm:bottom-2 sm:left-2`} aria-hidden />
          <span className={`${C} bottom-1.5 right-1.5 ${edgeBR} sm:bottom-2 sm:right-2`} aria-hidden />
        </>
      ) : null}
      <span
        className={
          variant === "primary" ? "relative z-10 inline-flex -translate-y-px leading-none" : "relative z-10"
        }
      >
        {children}
      </span>
    </Link>
  );
}

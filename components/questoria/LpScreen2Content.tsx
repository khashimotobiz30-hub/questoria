"use client";

import type { LucideIcon } from "lucide-react";
import { Crosshair, GitBranch, Scale, X } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

type AxisId = "purpose" | "design" | "decision";

/** カード本文背後の極薄紋様（読字優先・世界観補助） */
function AxisCardWatermark({ axisId }: { axisId: AxisId }) {
  const stroke = "rgba(255,215,0,0.22)";
  const common =
    "pointer-events-none absolute bottom-0 right-0 z-[1] h-[min(42%,8.5rem)] w-[min(95%,13rem)] text-[#FFD700] opacity-[0.07] sm:opacity-[0.085]";
  if (axisId === "purpose") {
    return (
      <svg className={common} viewBox="0 0 120 120" fill="none" aria-hidden>
        <circle cx="60" cy="60" r="48" stroke={stroke} strokeWidth="0.6" />
        <circle cx="60" cy="60" r="28" stroke={stroke} strokeWidth="0.5" />
        <circle cx="60" cy="60" r="6" stroke={stroke} strokeWidth="0.45" />
        <path d="M60 12v96M12 60h96" stroke={stroke} strokeWidth="0.45" />
      </svg>
    );
  }
  if (axisId === "design") {
    return (
      <svg className={common} viewBox="0 0 120 120" fill="none" aria-hidden>
        <path
          d="M20 88 L44 52 L68 68 L92 32"
          stroke={stroke}
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="52" r="4" stroke={stroke} strokeWidth="0.5" />
        <circle cx="68" cy="68" r="4" stroke={stroke} strokeWidth="0.5" />
        <circle cx="92" cy="32" r="4" stroke={stroke} strokeWidth="0.5" />
        <circle cx="20" cy="88" r="4" stroke={stroke} strokeWidth="0.5" />
        <path d="M52 24h36M70 18v28" stroke={stroke} strokeWidth="0.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 120 120" fill="none" aria-hidden>
      <path d="M60 22 L60 42" stroke={stroke} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M60 42 L38 58 L38 88 L82 88 L82 58 Z" stroke={stroke} strokeWidth="0.45" strokeLinejoin="round" />
      <path d="M38 72h44" stroke={stroke} strokeWidth="0.4" />
      <ellipse cx="38" cy="96" rx="10" ry="5" stroke={stroke} strokeWidth="0.4" />
      <ellipse cx="82" cy="96" rx="10" ry="5" stroke={stroke} strokeWidth="0.4" />
    </svg>
  );
}

function LpScreen2SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 px-0.5 font-[var(--font-orbitron)] text-lg font-bold tracking-wide text-[#FFD700] [text-shadow:0_0_14px_rgba(255,215,0,0.22),0_1px_2px_rgba(0,0,0,0.88)] sm:text-xl">
      {children}
    </h3>
  );
}

const AXIS_CARDS: {
  id: AxisId;
  num: string;
  name: string;
  tagline: string;
  body: string;
  Icon: LucideIcon;
  /** `public/top/` 配下のスキルビジュアル（PNG） */
  imageSrc: string;
}[] = [
  {
    id: "purpose",
    num: "01",
    name: "目的定義力",
    tagline: "AIに何を任せるかを決める力",
    body: "課題の本質を捉え、AIに任せる部分と自分で考える部分を見極める力です。",
    Icon: Crosshair,
    imageSrc: "/top/skill1.png",
  },
  {
    id: "design",
    num: "02",
    name: "設計力",
    tagline: "複雑な課題を整理して進める力",
    body: "作業を分解し、順番を立てながらAIを途中工程に組み込めるかを見る軸です。",
    Icon: GitBranch,
    imageSrc: "/top/skill2.png",
  },
  {
    id: "decision",
    num: "03",
    name: "自律判断力",
    tagline: "AIの答えを自分で見極める力",
    body: "出力をうのみにせず、妥当性やリスクを踏まえて最後に判断する力です。",
    Icon: Scale,
    imageSrc: "/top/skill3.png",
  },
];

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/72 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lp-screen2-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex max-h-[min(88dvh,34rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#FFD700]/28 bg-gradient-to-b from-[#0f141c]/96 via-[#080c12]/98 to-[#05070c]/98 shadow-[0_0_40px_rgba(255,215,0,0.12),0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-md"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/[0.08] to-transparent"
          aria-hidden
        />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4">
          <h3 id="lp-screen2-modal-title" className="font-[var(--font-orbitron)] text-lg font-bold tracking-wide text-[#FFD700]">
            {title}
          </h3>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/75 transition hover:border-white/25 hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/45"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-4">{children}</div>
      </div>
    </div>
  );
}

function AxisModalBody({ axisId }: { axisId: AxisId }) {
  if (axisId === "purpose") {
    return (
      <div className="space-y-5 font-[var(--font-noto)] text-[15px] leading-relaxed text-white/85">
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">その軸の意味</p>
          <p className="text-[14px] leading-[1.65] text-white/82">
            AI活用では、いきなりツールを触る前に、「何を達成したいのか」「どこにAIを使うべきか」を決めることが重要です。この軸は、課題の本質を捉え、AIに任せる範囲と自分で考える範囲を見極める力を表します。
          </p>
        </section>
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">仕事や日常での具体例</p>
          <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
            <li>資料作成で、いきなり文章を書かせる前に「何を伝える資料か」を整理する</li>
            <li>業務効率化で、手当たり次第にAIを使うのではなく、どの作業を任せるべきかを考える</li>
            <li>日常でも、調べものをするときに「何を知りたいのか」を先に明確にする</li>
          </ul>
        </section>
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">診断で見ている観点</p>
          <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
            <li>課題の目的を先に捉えようとするか</li>
            <li>AIに任せるべき部分を切り分けられるか</li>
            <li>手段から入らず、目的から考えられるか</li>
          </ul>
        </section>
      </div>
    );
  }
  if (axisId === "design") {
    return (
      <div className="space-y-5 font-[var(--font-noto)] text-[15px] leading-relaxed text-white/85">
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">その軸の意味</p>
          <p className="text-[14px] leading-[1.65] text-white/82">
            AIをうまく使う人は、複雑な課題をそのまま投げるのではなく、作業を分解し、順序立てて進めます。この軸は、進め方を整理し、AIを工程の中にうまく組み込む力を表します。
          </p>
        </section>
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">仕事や日常での具体例</p>
          <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
            <li>企画書を作るときに、構成案 → 下書き → 調整 のように段階を分ける</li>
            <li>情報収集でも、最初に論点を分けてからAIに整理させる</li>
            <li>日常のタスクでも、まとめて考えるのではなく順番を決めて進める</li>
          </ul>
        </section>
        <section className="space-y-2">
          <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">診断で見ている観点</p>
          <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
            <li>作業を分解して考えられるか</li>
            <li>順番や進め方を組み立てられるか</li>
            <li>AIを一発回答の道具ではなく、工程の一部として使えるか</li>
          </ul>
        </section>
      </div>
    );
  }
  return (
    <div className="space-y-5 font-[var(--font-noto)] text-[15px] leading-relaxed text-white/85">
      <section className="space-y-2">
        <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">その軸の意味</p>
        <p className="text-[14px] leading-[1.65] text-white/82">
          AIの出力は便利ですが、常に正しいとは限りません。そのため、答えをそのまま採用するのではなく、妥当性やリスクを踏まえて最後に自分で判断することが重要です。この軸は、AIの答えをうのみにせず、見極めて使う力を表します。
        </p>
      </section>
      <section className="space-y-2">
        <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">仕事や日常での具体例</p>
        <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
          <li>AIが作った文章を、そのまま出さずに事実関係や違和感を確認する</li>
          <li>提案内容がもっともらしく見えても、目的に合っているかを見直す</li>
          <li>日常でも、AIの答えを参考にしつつ、自分の状況に合うかを考える</li>
        </ul>
      </section>
      <section className="space-y-2">
        <p className="font-[var(--font-orbitron)] text-[11px] font-semibold tracking-[0.18em] text-cyan-300/85">診断で見ている観点</p>
        <ul className="list-disc space-y-1.5 pl-[1.15rem] text-[14px] text-white/78">
          <li>AIの出力をそのまま受け入れないか</li>
          <li>妥当性やリスクを確認しようとするか</li>
          <li>最後に自分で判断する姿勢があるか</li>
        </ul>
      </section>
    </div>
  );
}

export function LpScreen2Content() {
  const [axisModal, setAxisModal] = useState<AxisId | null>(null);
  const [exampleOpen, setExampleOpen] = useState(false);

  const closeAxis = useCallback(() => setAxisModal(null), []);
  const closeExample = useCallback(() => setExampleOpen(false), []);

  useEffect(() => {
    if (!axisModal && !exampleOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [axisModal, exampleOpen]);

  const axisTitle = axisModal ? AXIS_CARDS.find((a) => a.id === axisModal)?.name ?? "" : "";

  return (
    <div className="w-full">
      {/* 導入（帯下・補足文程度のトーンで主役は3軸カードへ） */}
      <div className="px-0.5 font-[var(--font-noto)] text-[13px] leading-[1.45] text-white/72">
        <p>
          AIを使える人は、知識が多い人ではなく、目的を定め、整理し、判断できる人です。この診断では、その3つの力を測定します。
        </p>
      </div>

      {/* 3軸：中段でプレート面より一段手前に浮かせる */}
      <div className="relative z-[5] mt-4">
        <LpScreen2SectionHeading>
          <span className="text-balance text-[15px] leading-snug sm:text-[17px] sm:leading-snug">
            AI活用における重要な3つのスキル
          </span>
        </LpScreen2SectionHeading>
        <div className="-mx-4 translate-y-0.5 px-4">
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-visible pb-2 pl-0 pr-1 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {AXIS_CARDS.map((axis) => {
            const Icon = axis.Icon;
            return (
              <article
                key={axis.id}
                className="snap-center snap-always shrink-0"
                style={{ width: "min(51vw, 13.75rem)" }}
              >
                <button
                  type="button"
                  onClick={() => setAxisModal(axis.id)}
                  className="group relative flex aspect-[3/4] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#FFD700]/50 bg-gradient-to-b from-[#141c26]/92 via-[#0a1018]/94 to-[#05080e]/96 text-left shadow-[0_24px_48px_rgba(0,0,0,0.52),0_12px_28px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.32),0_0_40px_rgba(255,215,0,0.14),0_0_80px_rgba(255,215,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.32)] outline-none backdrop-blur-[14px] transition duration-300 ease-out hover:border-[#FFD700]/58 hover:shadow-[0_28px_56px_rgba(0,0,0,0.54),0_14px_32px_rgba(0,0,0,0.44),0_6px_14px_rgba(0,0,0,0.34),0_0_48px_rgba(255,215,0,0.18),0_0_90px_rgba(255,215,0,0.08),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.34)] focus-visible:ring-2 focus-visible:ring-[#FFD700]/45"
                >
                  {/* ガラス：上〜中央の反射（視認できる強さ）+ 面の厚み */}
                  <div
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
                    aria-hidden
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(162deg,rgba(255,250,245,0.14)_0%,rgba(255,215,0,0.065)_16%,rgba(255,215,0,0.02)_30%,transparent_54%)] opacity-95 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-[min(52%,9rem)] bg-gradient-to-b from-white/[0.09] via-[#FFD700]/[0.05] to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-px rounded-[15px] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-22px_44px_rgba(0,0,0,0.38),inset_0_0_0_1px_rgba(255,215,0,0.07)]" />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#FFD700]/42 via-[#fff9e6]/35 to-transparent [box-shadow:0_1px_16px_rgba(255,215,0,0.18),0_0_24px_rgba(255,215,0,0.12)]"
                    aria-hidden
                  />
                  {/* 内側サブフレーム */}
                  <div
                    className="pointer-events-none absolute inset-[6px] z-[1] rounded-[0.9rem] border border-[#FFD700]/25 shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-14px_28px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,215,0,0.08)]"
                    aria-hidden
                  />
                  {/* 下部左右のみ（上部角装飾は省略してすっきりさせる） */}
                  <span
                    className="pointer-events-none absolute bottom-[11px] left-[11px] z-[1] h-4 w-4 border-b border-l border-[#FFD700]/20"
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute bottom-[11px] right-[11px] z-[1] h-4 w-4 border-b border-r border-[#FFD700]/20"
                    aria-hidden
                  />

                  {/* ── 上部ブロック：識別（01 + 軸名）→ その下に画像ビジュアル枠 ── */}
                  <div className="relative z-[2] w-full shrink-0 px-2 pt-2 sm:px-2.5">
                    <div className="flex min-h-[2.1rem] shrink-0 items-center gap-1.5 border-b border-[#FFD700]/26 bg-black/[0.08] pb-1 pt-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-6px_12px_rgba(0,0,0,0.18)] sm:gap-2">
                      <span className="shrink-0 font-mono text-[10px] font-bold tabular-nums tracking-[0.14em] text-[#FFD700]/92 sm:text-[11px]">
                        {axis.num}
                      </span>
                      <span className="h-3.5 w-px shrink-0 bg-[#FFD700]/22" aria-hidden />
                      <p className="min-w-0 flex-1 truncate font-[var(--font-orbitron)] text-[11.5px] font-bold tracking-[0.06em] text-white/90 sm:text-[12.5px] sm:tracking-[0.05em]">
                        {axis.name}
                      </p>
                      <Icon
                        className="size-[14px] shrink-0 text-[#FFD700]/75 drop-shadow-[0_0_6px_rgba(255,215,0,0.25)] sm:size-[15px]"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>

                    <div className="mt-1">
                      <div className="relative overflow-hidden rounded-t-[0.7rem] rounded-b-[0.45rem] border border-[#FFD700]/40 bg-[#02060a] shadow-[0_10px_22px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,215,0,0.1),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-12px_28px_rgba(0,0,0,0.48)] transition-[border-color,box-shadow] duration-300 ease-out group-hover:border-[#FFD700]/50 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.52),0_0_28px_rgba(255,215,0,0.12),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-12px_28px_rgba(0,0,0,0.5)]">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={axis.imageSrc}
                            alt={`${axis.name}を象徴するビジュアル`}
                            fill
                            className="object-cover object-[50%_32%]"
                            sizes="(max-width: 640px) 53vw, 224px"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,248,0.1)_0%,rgba(255,215,0,0.03)_26%,transparent_48%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                            aria-hidden
                          />
                          <div
                            className="pointer-events-none absolute inset-0 shadow-[inset_0_3px_12px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(0,0,0,0.22),inset_0_-14px_32px_rgba(0,0,0,0.42)]"
                            aria-hidden
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <AxisCardWatermark axisId={axis.id} />

                  {/* ── 中段〜下段：要約 → 補足（2行）→ 余白 → 導線 ── */}
                  <div className="relative z-[2] flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#05080c]/98 via-[#040608]/98 to-[#030508]/99 px-2 pb-2.5 pt-1.5 shadow-[inset_0_14px_20px_-14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.045)] sm:px-2.5 sm:pb-3">
                    {/* 見出し（要約） */}
                    <p
                      className="flex h-[2rem] w-full shrink-0 items-center justify-center text-center font-[var(--font-noto)] text-[11.5px] font-bold leading-none tracking-[0.04em] text-[#fff6dc] [text-shadow:0_0_16px_rgba(255,215,0,0.1),0_1px_2px_rgba(0,0,0,0.82)] sm:h-[2.15rem] sm:text-[12.5px] sm:tracking-[0.045em]"
                      title={axis.tagline}
                    >
                      <span className="block max-w-full truncate px-0.5">
                        {axis.tagline}
                      </span>
                    </p>

                    <p
                      className="mt-1 line-clamp-2 min-h-[2.1rem] shrink-0 overflow-hidden text-pretty font-[var(--font-noto)] text-[9px] leading-[1.22] text-white/[0.68] sm:min-h-[2.2rem] sm:text-[9.75px] sm:leading-[1.26]"
                      title={axis.body}
                    >
                      {axis.body}
                    </p>

                    <div className="min-h-0 flex-1" aria-hidden />

                    <div className="shrink-0 border-t border-white/[0.08] pt-1.5">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] text-cyan-300/78 transition group-hover:text-cyan-200/95 sm:text-[11px]">
                        詳しく見る
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
          </div>
        </div>
      </div>

      {/* 診断方法：下段に一体収め、上のカードと重なる余白でレイヤー感 */}
      <div className="relative z-[1] -mt-6 border-t border-white/10 bg-black/22 px-1 pb-1 pt-8 backdrop-blur-[1px]">
        <LpScreen2SectionHeading>
          <span className="text-balance text-[15px] leading-snug sm:text-[17px] sm:leading-snug">診断方法</span>
        </LpScreen2SectionHeading>
        <div className="flex flex-wrap gap-2">
          {["全12問", "4択形式", "約3〜4分", "無料"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-cyan-400/22 bg-cyan-500/[0.06] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] text-cyan-100/88 sm:px-3 sm:text-[11px] sm:tracking-[0.12em]"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-2 font-[var(--font-noto)] text-[13px] leading-[1.5] text-white/72">
          知識問題ではなく、実際の場面でどう考え、どう進め、どう判断するかを見る診断です。
        </p>
        <button
          type="button"
          onClick={() => setExampleOpen(true)}
          className="mt-2 inline-flex items-center gap-1 px-0 py-1 font-mono text-[11px] tracking-[0.14em] text-cyan-300/85 transition hover:text-cyan-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
        >
          出題イメージを見る
          <span aria-hidden>→</span>
        </button>
      </div>

      {axisModal ? (
        <ModalShell title={axisTitle} onClose={closeAxis}>
          <AxisModalBody axisId={axisModal} />
        </ModalShell>
      ) : null}

      {exampleOpen ? (
        <ModalShell title="例題" onClose={closeExample}>
          <div className="space-y-4 font-[var(--font-noto)] text-[14px] leading-relaxed text-white/82">
            <p className="font-medium text-white/92">AIで業務を効率化したいとき、最初に考えるべきことはどれですか？</p>
            <ul className="space-y-2 border-l-2 border-[#FFD700]/35 pl-3.5 text-[13px] text-white/78">
              <li>とりあえず有名なAIツールを使ってみる</li>
              <li>まず目的と成果物を明確にする</li>
              <li>できる作業をすべてAIに任せる</li>
              <li>出てきた結果を後から調整する</li>
            </ul>
            <p className="text-[13px] leading-relaxed text-white/68">
              このように、知識そのものではなく、実際の場面での考え方や進め方、判断の傾向を見ていきます。
            </p>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";

import GlitchText from "@/components/questoria/GlitchText";
import { LpScreen2Content } from "@/components/questoria/LpScreen2Content";
import ParticleField from "@/components/questoria/ParticleField";
import { PreviousResultLink } from "@/components/questoria/PreviousResultLink";
import { ResultCardDecor, resultCardShellClass } from "@/components/questoria/result/resultCardTheme";
import { RitualLaunchLink, RitualResultPhonePreview } from "@/components/questoria/RitualPlate";

/** 村人（typeId: origin）結果画面スクショ — ファイル名は後から差し替え可 */
const RESULT_PREVIEW_ORIGIN_SRC = "/top/result-preview-origin.png";
/** FB文言プレビュー用（public/top/result-preview-origin2.png） */
const RESULT_PREVIEW_ORIGIN2_SRC = "/top/result-preview-origin2.png";

/** LP カード・セクションタイトル：当該画面では最上段の見出し（本文小見出しより一段大きく・同色ゴールド） */
const homePlateSectionTitleClass =
  "font-[var(--font-noto)] text-[14px] font-bold leading-snug tracking-[0.1em] text-[#FFD700] sm:text-[16px] sm:tracking-[0.11em] [text-shadow:0_1px_3px_rgba(0,0,0,0.92),0_0_16px_rgba(255,215,0,0.42),0_0_28px_rgba(255,190,0,0.15)]";

/** LP カード本文内の小見出し（ orbitron ）：階層整理のため白ベース */
const homePlateBodySubheadClass =
  "font-[var(--font-orbitron)] text-sm font-semibold tracking-wide text-white";

/**
 * LP：結果カードの枠・デコは共通、中身だけ「タイトル帯」と「本文面」を明確に分離する。
 * 本文は帯より下をひと続きの黒透過エリアにまとめる（説明文だけ個別ブロックにしない）。
 */
function HomeResultStyleCard({
  sectionLabel,
  children,
  bandTitleClassName,
  bodyClassName,
}: {
  sectionLabel: string;
  children: ReactNode;
  /** 帯タイトルが長い画面用（省略可） */
  bandTitleClassName?: string;
  /** 本文エリアの追加クラス（省略可） */
  bodyClassName?: string;
}) {
  return (
    <div className="w-full max-w-md" style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.38))" }}>
      <div className={resultCardShellClass("default")}>
        <ResultCardDecor withRail subdued />
        <div className="relative z-[1] flex flex-col">
          <div className="border-b border-[#FFD700]/28 bg-gradient-to-b from-[#FFD700]/20 via-[#2a2210]/94 to-[#15120a]/96 px-4 pb-3.5 pt-3.5 shadow-[inset_0_1px_0_rgba(255,215,0,0.14)] sm:pb-4 sm:pt-4">
            <p className={bandTitleClassName ?? homePlateSectionTitleClass}>{sectionLabel}</p>
          </div>
          <div
            className={`space-y-3 bg-black/50 px-4 pb-4 pt-4 backdrop-blur-[2px] sm:pb-5 ${bodyClassName ?? ""}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 各スクリーン共通：主役は文言、▶ は控えめな進行補助 */
function QuestStartCtaLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-inherit sm:gap-1.5">
      <span
        className="translate-y-[0.06em] select-none text-[0.8em] font-medium leading-none opacity-[0.93]"
        aria-hidden
      >
        ▶
      </span>
      <span className="leading-none">クエストを始める</span>
    </span>
  );
}

function HomeScrollCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8">
      <div className="pointer-events-none flex flex-col items-center" aria-hidden>
        <div
          className="flex flex-col items-center"
          style={{ animation: "questoriaScrollCuePulse 2s ease-in-out infinite" }}
        >
          <p className="font-mono text-[13px] tracking-[0.4em] text-cyan-400/80">SCROLL</p>
          <div className="relative mt-1 h-7 w-[2px] overflow-hidden rounded-full bg-cyan-400/20">
            <div
              className="absolute inset-x-0 top-0 h-full w-full origin-top bg-cyan-400/80"
              style={{ animation: "questoriaScrollLineFlow 1.5s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative h-[100dvh] h-screen overflow-hidden text-white">
      {/* 固定背景 */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/top/bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <ParticleField />
      </div>

      {/* 前景：scroll-snap（自然スクロール + セクション単位で停止） */}
      <div className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain">
        {/* 1画面目：HERO */}
        <section className="relative flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8">
          <div className="w-full max-w-md text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className="h-px w-10"
                  style={{
                    background: "linear-gradient(to right, transparent, rgba(64,192,192,0.85))",
                  }}
                />
                <p
                  className="font-mono text-[13px] font-bold tracking-[0.45em] text-[#5ee0e0] sm:text-[14px] sm:tracking-[0.48em]"
                  style={{
                    textShadow:
                      "0 0 12px rgba(94,224,224,0.9), 0 0 24px rgba(64,192,192,0.5), 0 0 1px rgba(0,0,0,0.8)",
                  }}
                >
                  AI SKILL DIAGNOSIS
                </p>
                <div
                  className="h-px w-10"
                  style={{
                    background: "linear-gradient(to left, transparent, rgba(64,192,192,0.85))",
                  }}
                />
              </div>

              <h1
                className="mt-3 font-[var(--font-orbitron)] text-[clamp(2.5rem,10vw,5rem)] font-black tracking-[0.18em] text-[#f0c040]"
                style={{
                  textShadow: "0 0 28px rgba(240,192,64,0.55), 0 0 56px rgba(240,192,64,0.22)",
                }}
              >
                <GlitchText>QUESTORIA</GlitchText>
              </h1>

              <div
                className="mt-5 flex w-full flex-col items-center px-4 py-1 sm:mt-6"
                role="presentation"
              >
                <div className="flex w-full max-w-[22rem] flex-col items-center">
                  <p
                    className="w-full text-center font-[var(--font-noto)] text-[17px] font-bold leading-[1.35] tracking-[0.4em] text-[#f4fcfe] sm:text-[19px] sm:tracking-[0.44em]"
                    style={{
                      textShadow:
                        "0 0 2px rgba(160,238,248,0.85), 0 0 18px rgba(120,230,240,0.45), 0 0 36px rgba(64,192,200,0.28), 0 0 56px rgba(40,160,175,0.14), 0 3px 6px rgba(0,0,0,0.78), 0 8px 22px rgba(0,0,0,0.48), 0 14px 36px rgba(0,0,0,0.22)",
                    }}
                  >
                    AI活用スキル診断
                  </p>
                  <div
                    className="relative mt-2.5 h-px w-[66%] max-w-[15.25rem] sm:mt-2.5 sm:w-[68%] sm:max-w-[15.5rem]"
                    aria-hidden
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#f2e8a8]/92 to-transparent shadow-[0_0_6px_rgba(252,236,180,0.65),0_0_16px_rgba(230,195,95,0.32)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center sm:mt-12">
              <RitualLaunchLink href="/play" variant="primary">
                <QuestStartCtaLabel />
              </RitualLaunchLink>
            </div>
            <PreviousResultLink className="mt-3 flex justify-center" />
          </div>
          <HomeScrollCue />
        </section>

        {/* 2画面目：AI活用スキルと診断方法（スクリーン3と同系の大枠プレート） */}
        <section className="relative flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8">
          <div className="flex w-full max-w-md flex-col items-center">
            <HomeResultStyleCard
              sectionLabel="AI活用スキルとその診断方法"
              bandTitleClassName={`${homePlateSectionTitleClass} text-[12px] leading-snug tracking-[0.06em] sm:text-[14px] sm:tracking-[0.08em]`}
              bodyClassName="overflow-visible pb-5 pt-5"
            >
              <LpScreen2Content />
            </HomeResultStyleCard>

            <div className="mt-10 flex justify-center sm:mt-12">
              <RitualLaunchLink href="/play" variant="primary">
                <QuestStartCtaLabel />
              </RitualLaunchLink>
            </div>
          </div>
          <HomeScrollCue />
        </section>

        {/* 3画面目：この診断でわかること（モックで結果の雰囲気、本文はメリットを短く） */}
        <section className="relative flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8">
          <div className="flex w-full max-w-md flex-col items-center">
            <HomeResultStyleCard sectionLabel="この診断でわかること">
              <div className="flex w-full flex-row flex-wrap items-start justify-center gap-5 pb-6 pt-0.5 sm:flex-nowrap sm:gap-6 sm:pb-7 sm:pt-1">
                <div className="w-full max-w-[150px] shrink-0 sm:max-w-[168px]">
                  <RitualResultPhonePreview src={RESULT_PREVIEW_ORIGIN_SRC} emphasis />
                </div>
                <div className="w-full max-w-[150px] shrink-0 translate-y-[18px] sm:max-w-[168px] sm:translate-y-[20px]">
                  <RitualResultPhonePreview
                    src={RESULT_PREVIEW_ORIGIN2_SRC}
                    alt="診断完了後に表示されるフィードバック文言のプレビュー"
                    emphasis
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-white/10 pt-3 font-[var(--font-noto)] text-[14px] leading-relaxed text-white/78 sm:text-[15px]">
                <p className="font-semibold text-white/88">
                  この診断を受けることで、自分の強みだけでなく、つまずきやすいポイントや伸ばすべき力が見えてきます。
                </p>
                <p className="text-white/88">
                  まずは今の現在地を知ることから始めてみてください。
                </p>
              </div>
            </HomeResultStyleCard>

            <div className="mt-10 flex justify-center sm:mt-12">
              <RitualLaunchLink href="/play" variant="primary">
                <QuestStartCtaLabel />
              </RitualLaunchLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import GlitchText from "@/components/questoria/GlitchText";
import ParticleField from "@/components/questoria/ParticleField";
import {
  RitualDummyAxisBars,
  RitualLaunchLink,
  RitualPlate,
  RitualResultPhonePreview,
  RitualTerminalHeader,
} from "@/components/questoria/RitualPlate";

/** 村人（typeId: origin）結果画面スクショ — ファイル名は後から差し替え可 */
const RESULT_PREVIEW_ORIGIN_SRC = "/top/result-preview-origin.png";
/** FB文言プレビュー用（public/top/result-preview-origin2.png） */
const RESULT_PREVIEW_ORIGIN2_SRC = "/top/result-preview-origin2.png";

function HomeScrollCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8">
      <div className="pointer-events-none flex flex-col items-center" aria-hidden>
        <div
          className="flex flex-col items-center"
          style={{ animation: "questoriaScrollCuePulse 2s ease-in-out infinite" }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/60">SCROLL</p>
          <div className="relative mt-1 h-6 w-px overflow-hidden rounded-full bg-cyan-400/20">
            <div
              className="absolute inset-x-0 top-0 h-full w-full origin-top bg-cyan-400/60"
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
                <span className="inline-flex items-center gap-2 text-inherit sm:gap-2.5">
                  <span className="text-[0.82em] leading-none" aria-hidden>
                    ▶
                  </span>
                  クエストを始める
                </span>
              </RitualLaunchLink>
            </div>
          </div>
          <HomeScrollCue />
        </section>

        {/* 2画面目：この診断でわかること */}
        <section className="relative flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-8">
          <RitualPlate density="tight">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <RitualTerminalHeader
                compactHeader
                channel="ANALYSIS NODE · CH-02"
                title="この診断でわかること"
                titleClassName="font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#40c0c0] sm:text-base"
              />

              <div className="space-y-1.5 font-[var(--font-noto)] text-[11px] leading-snug text-[#b0c0cc] sm:text-xs sm:leading-relaxed">
                <p className="text-[#e0e0e0]">AI活用の差は、知識量だけでは決まりません。</p>
                <p>この診断では、AIを使う上で大切な3つの力を見ていきます。</p>
              </div>

              <div className="shrink-0 opacity-90 sm:opacity-95">
                <RitualDummyAxisBars />
              </div>

              <ul className="mt-0.5 space-y-1.5 border-t border-[#40c0c0]/14 pt-2 sm:space-y-2 sm:pt-2.5">
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    目的を決める力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    AIに何をさせるべきかを考えられるか。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    整理して進める力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    複雑な課題を分解し、進め方を組み立てられるか。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    自分で判断する力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    AIの答えをうのみにせず、自分で良し悪しを判断できるか。
                  </p>
                </li>
              </ul>

              <p className="pt-0.5 text-center font-mono text-[8px] tracking-[0.16em] text-[#b0c0cc]/80 sm:text-[9px] sm:tracking-[0.2em]">
                全12問　約3〜4分　無料
              </p>

              <div className="flex justify-center border-t border-[#40c0c0]/12 pt-2 sm:pt-2.5">
                <RitualLaunchLink href="/play" variant="auxiliary">
                  ▶ クエストを始める
                </RitualLaunchLink>
              </div>
            </div>
          </RitualPlate>
          <HomeScrollCue />
        </section>

        {/* 3画面目：この診断で受け取れるもの */}
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-7">
          <RitualPlate density="tight">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <RitualTerminalHeader
                compactHeader
                channel="QUEST BRIEF · CH-03"
                title="この診断で受け取れるもの"
                titleClassName="font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#f0c040] sm:text-base"
              />

              <div className="flex w-full flex-row flex-wrap items-start justify-center gap-6 pt-1 sm:flex-nowrap sm:pt-1.5">
                <div className="w-full max-w-[130px] shrink-0 sm:max-w-[145px]">
                  <RitualResultPhonePreview src={RESULT_PREVIEW_ORIGIN_SRC} />
                </div>
                <div className="w-full max-w-[130px] shrink-0 translate-y-[6px] sm:max-w-[145px]">
                  <RitualResultPhonePreview
                    src={RESULT_PREVIEW_ORIGIN2_SRC}
                    alt="診断完了後に表示されるフィードバック文言のプレビュー"
                  />
                </div>
              </div>

              <ul className="space-y-1.5 border-t border-[#40c0c0]/14 pt-2 sm:space-y-2 sm:pt-2.5">
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    8つのタイプ診断
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    あなたがどのタイプに近いかがわかります。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    3つの思考スコア
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    目的設定・設計・判断の強さを数値で確認できます。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    結果に応じたアドバイス
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    次に伸ばすべきポイントがわかります。
                  </p>
                </li>
              </ul>

              <p className="font-[var(--font-noto)] text-[10px] leading-relaxed text-[#b0c0cc]/88 sm:text-[11px]">
                ※ 結果は8タイプのいずれかに分類されます
              </p>

              <div className="flex justify-center border-t border-[#40c0c0]/12 pt-2 sm:pt-2.5">
                <RitualLaunchLink href="/play" variant="auxiliary">
                  ▶ クエストを始める
                </RitualLaunchLink>
              </div>
            </div>
          </RitualPlate>
        </section>
      </div>
    </main>
  );
}

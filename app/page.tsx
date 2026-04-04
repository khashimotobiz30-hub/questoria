import GlitchText from "@/components/questoria/GlitchText";
import ParticleField from "@/components/questoria/ParticleField";
import {
  RitualDummyAxisBars,
  RitualLaunchLink,
  RitualPlate,
  RitualResultPhonePreview,
  RitualTerminalHeader,
} from "@/components/questoria/RitualPlate";

/** はじまりの者（ORIGIN）結果画面スクショ — ファイル名は後から差し替え可 */
const RESULT_PREVIEW_ORIGIN_SRC = "/top/result-preview-origin.png";

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
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8">
          <div className="w-full max-w-md text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div
                  className="h-px w-10"
                  style={{
                    background: "linear-gradient(to right, transparent, rgba(64,192,192,0.85))",
                  }}
                />
                <p
                  className="font-mono text-[13px] font-bold tracking-[0.45em] text-[#40c0c0]"
                  style={{
                    textShadow:
                      "0 0 10px rgba(64,192,192,0.85), 0 0 20px rgba(64,192,192,0.45)",
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

              <p className="mt-2 font-[var(--font-noto)] text-sm font-normal tracking-[1em] text-[#b0c0cc]">
                AIスキル診断
              </p>

              <div className="mt-6 h-px w-36 bg-gradient-to-r from-transparent via-[#f0c040]/55 to-transparent" />

              <p className="mt-6 font-[var(--font-orbitron)] text-lg font-bold leading-snug tracking-wide text-[#e0e0e0] sm:text-xl">
                あなたのAI思考力を、証明せよ。
              </p>
            </div>

            <div className="mt-12 flex justify-center sm:mt-14">
              <RitualLaunchLink href="/play" variant="primary">
                ▶ クエストを始める
              </RitualLaunchLink>
            </div>
          </div>
        </section>

        {/* 2画面目：この診断が測るもの */}
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-8">
          <RitualPlate density="tight">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <RitualTerminalHeader
                compactHeader
                channel="ANALYSIS NODE · CH-02"
                title="この診断が測るもの"
                titleClassName="font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#40c0c0] sm:text-base"
              />

              <div className="space-y-1 font-[var(--font-noto)] text-[11px] leading-snug text-[#b0c0cc] sm:text-xs sm:leading-relaxed">
                <p>AIを使いこなせる人間と、そうでない人間の差は</p>
                <p className="text-[#e0e0e0]">
                  知識量ではない。思考の構造にある。
                </p>
              </div>

              <div className="shrink-0 opacity-90 sm:opacity-95">
                <RitualDummyAxisBars />
              </div>

              <ul className="mt-0.5 space-y-1.5 border-t border-[#40c0c0]/14 pt-2 sm:space-y-2 sm:pt-2.5">
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    目的を定義する力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    AIに何を解かせるべきか。問いを立てられるか。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    構造的に設計する力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    複雑な課題を分解し、筋道を組み立てられるか。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    自分で判断する力
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    AIの出力を鵜呑みにせず、自ら意思決定できるか。
                  </p>
                </li>
              </ul>

              <p className="pt-0.5 text-center font-mono text-[8px] tracking-[0.16em] text-[#b0c0cc]/80 sm:text-[9px] sm:tracking-[0.2em]">
                ── 全12問 · 約3〜4分 · 無料 ──
              </p>

              <div className="flex justify-center border-t border-[#40c0c0]/12 pt-2 sm:pt-2.5">
                <RitualLaunchLink href="/play" variant="auxiliary">
                  ▶ クエストを始める
                </RitualLaunchLink>
              </div>
            </div>
          </RitualPlate>
        </section>

        {/* 3画面目：クエストの報酬 */}
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-7">
          <RitualPlate density="tight">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <RitualTerminalHeader
                compactHeader
                channel="QUEST BRIEF · CH-03"
                title="クエストの報酬"
                titleClassName="font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#f0c040] sm:text-base"
              />

              <RitualResultPhonePreview src={RESULT_PREVIEW_ORIGIN_SRC} />

              <p className="px-0.5 text-center font-[var(--font-noto)] text-[11px] font-medium leading-snug tracking-wide text-[#e0e0e0] sm:text-xs">
                12の問いに答えた先に、あなたの「型」が明かされる。
              </p>

              <ul className="space-y-1.5 border-t border-[#40c0c0]/14 pt-2 sm:space-y-2 sm:pt-2.5">
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    8種のアーキタイプ診断
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    勇者、賢者、冒険者、はじまりの者——あなたはどの型か。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    3軸の思考スコア
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    目的定義・設計・判断、それぞれの強度が数値で見える。
                  </p>
                </li>
                <li className="min-w-0">
                  <p className="font-[var(--font-orbitron)] text-[12px] font-bold tracking-wide text-[#e0e0e0] sm:text-sm">
                    あなたへの処方箋
                  </p>
                  <p className="mt-1 pl-0.5 font-[var(--font-noto)] text-[11px] leading-relaxed text-[#b0c0cc] sm:text-xs">
                    型に応じた、次に鍛えるべき思考が示される。
                  </p>
                </li>
              </ul>

              <p className="font-[var(--font-noto)] text-[10px] leading-relaxed text-[#b0c0cc]/88 sm:text-[11px]">
                ※ 結果は8種のアーキタイプに分岐します
              </p>

              <div className="flex justify-center border-t border-[#40c0c0]/14 pt-2 sm:pt-2.5">
                <RitualLaunchLink href="/play" variant="secondary">
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

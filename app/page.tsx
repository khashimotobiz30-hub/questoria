import GlitchText from "@/components/questoria/GlitchText";
import ParticleField from "@/components/questoria/ParticleField";
import {
  RitualLaunchLink,
  RitualPlate,
  RitualScanList,
  RitualTerminalHeader,
} from "@/components/questoria/RitualPlate";

const measureItems = ["目的を定義する力", "構造的に設計する力", "自分で判断する力"];

const questItems = [
  "全12問の選択式",
  "実戦型の問いで、3つの力を診断",
  "約3〜4分で完了",
  "無料ですぐに試せる",
  "8種のアーキタイプから、\nあなたの型が明かされる",
];

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
                    background: "linear-gradient(to right, transparent, rgba(0,229,255,0.8))",
                  }}
                />
                <p
                  className="font-mono text-[13px] font-bold tracking-[0.45em] text-cyan-300"
                  style={{
                    textShadow:
                      "0 0 10px rgba(0,229,255,0.9), 0 0 20px rgba(0,229,255,0.5)",
                  }}
                >
                  AI SKILL DIAGNOSIS
                </p>
                <div
                  className="h-px w-10"
                  style={{
                    background: "linear-gradient(to left, transparent, rgba(0,229,255,0.8))",
                  }}
                />
              </div>

              <h1
                className="mt-3 font-[var(--font-orbitron)] text-[clamp(2.5rem,10vw,5rem)] font-black tracking-[0.18em] text-[#FFD700]"
                style={{
                  textShadow: "0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)",
                }}
              >
                <GlitchText>QUESTORIA</GlitchText>
              </h1>

              <p className="mt-2 font-[var(--font-noto)] text-sm font-normal tracking-[1em] text-white">
                AIスキル診断
              </p>

              <div className="mt-6 h-px w-36 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />

              <p className="mt-6 font-[var(--font-orbitron)] text-lg font-bold leading-snug tracking-wide text-white sm:text-xl">
                あなたのAI思考力を、証明せよ。
              </p>

              <p className="mt-4 font-[var(--font-noto)] text-sm leading-relaxed text-white/80">
                AIを使える人と、使いこなせない人の差は、
                <br />
                知識ではなく、課題設定・設計・判断にある。
              </p>
            </div>

            <div className="mt-10 flex justify-center">
              <RitualLaunchLink href="/play" variant="primary">
                ▶ クエストを始める
              </RitualLaunchLink>
            </div>
          </div>
        </section>

        {/* 2画面目：この診断が測るもの */}
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <RitualPlate density="compact">
            <div className="flex flex-col gap-4 sm:gap-[1.05rem]">
              <RitualTerminalHeader
                channel="ANALYSIS NODE · CH-02"
                title="この診断が測るもの"
                titleClassName="font-[var(--font-orbitron)] text-base font-bold tracking-[0.14em] text-cyan-50/95 sm:text-lg"
              />
              <div className="flex flex-col gap-2 sm:gap-2">
                <p className="font-[var(--font-noto)] text-sm leading-relaxed tracking-wide text-white/78 sm:text-[15px]">
                  測るのは、知識ではなく思考。
                </p>
                <RitualScanList compact items={measureItems} />
              </div>

              <div className="mt-1 flex justify-center border-t border-cyan-400/14 pt-3 sm:mt-1.5 sm:pt-3.5">
                <RitualLaunchLink href="/play" variant="auxiliary">
                  ▶ クエストを始める
                </RitualLaunchLink>
              </div>
            </div>
          </RitualPlate>
        </section>

        {/* 3画面目：クエストの概要 + 再CTA */}
        <section className="flex min-h-[100dvh] min-h-screen snap-start snap-always flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <RitualPlate>
            <div className="flex flex-col gap-4 sm:gap-5">
              <RitualTerminalHeader
                channel="QUEST BRIEF · CH-03"
                title="クエストの概要"
                titleClassName="font-[var(--font-orbitron)] text-base font-bold tracking-[0.14em] text-[#f0dc82]/95 sm:text-lg"
              />
              <RitualScanList items={questItems} highlightLast />

              <div className="mt-2 flex justify-center border-t border-cyan-400/18 pt-4 sm:mt-2.5 sm:pt-5">
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

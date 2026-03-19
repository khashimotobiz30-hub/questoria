import Link from "next/link";
import GlitchText from "@/components/questoria/GlitchText";
import ParticleField from "@/components/questoria/ParticleField";
import StatusPanel from "@/components/questoria/StatusPanel";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/top/bg.jpg')" }}
        aria-hidden="true"
      />
      {/* オーバーレイを弱める */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        aria-hidden="true"
      />

      <ParticleField />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="flex flex-col items-center">

            {/* AI SKILL DIAGNOSIS ラインつき */}
            <div className="flex items-center gap-3">
  <div className="h-px w-10"
    style={{ background:"linear-gradient(to right, transparent, rgba(0,229,255,0.8))" }} />
  <p className="font-mono text-[13px] font-bold tracking-[0.45em] text-cyan-300"
    style={{ textShadow:"0 0 10px rgba(0,229,255,0.9), 0 0 20px rgba(0,229,255,0.5)" }}>
    AI SKILL DIAGNOSIS
  </p>
  <div className="h-px w-10"
    style={{ background:"linear-gradient(to left, transparent, rgba(0,229,255,0.8))" }} />
</div>

            {/* QUESTORIAロゴ → ゴールド */}
            <h1
              className="mt-3 font-[var(--font-orbitron)] text-[clamp(2.5rem,10vw,5rem)] font-black tracking-[0.18em] text-[#FFD700]"
              style={{ textShadow:"0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)" }}
            >
              <GlitchText>QUESTORIA</GlitchText>
            </h1>

            <p className="mt-2 font-[var(--font-noto)] text-sm font-normal tracking-[1em] text-white">
  AIスキル診断
</p>
            <div className="mt-4 h-px w-36 bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent" />
            <p className="mt-4 font-[var(--font-share-tech)] text-[11px] tracking-[0.28em] text-[#FFD700]">
  AI時代の新しいスキルテスト
</p>
          </div>

          <StatusPanel />

          {/* CTAボタン → 枠線スタイル */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/quest"
              className="inline-flex items-center justify-center border border-[#FFD700]/70 bg-black/40 px-8 py-4 font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#FFD700] backdrop-blur-sm transition hover:border-[#FFD700] hover:bg-[#FFD700]/10 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] focus-visible:outline-none"
              style={{ boxShadow:"0 0 15px rgba(255,215,0,0.1)" }}
            >
              ▶ クエストを始める
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
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
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"
        aria-hidden="true"
      />

      <ParticleField />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="flex flex-col items-center">
            <p
              className="font-[var(--font-share-tech)] text-[11px] tracking-[0.45em] text-[#00E5FF]"
            >
              AI SKILL DIAGNOSIS
            </p>
            <h1
              className="mt-3 font-[var(--font-orbitron)] text-[clamp(2.5rem,10vw,5rem)] font-black tracking-[0.18em] text-[#EAF7FF] drop-shadow-[0_0_14px_rgba(0,229,255,0.25)]"
            >
              <GlitchText>QUESTORIA</GlitchText>
            </h1>
            <p
              className="mt-2 font-[var(--font-noto)] text-base tracking-[0.35em] text-[#FFD700]"
            >
              AIスキル診断
            </p>
            <div className="mt-4 h-px w-36 bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent" />
            <p
              className="mt-4 font-[var(--font-share-tech)] text-[11px] tracking-[0.28em] text-white/60"
            >
              AI時代の新しいスキルテスト
            </p>
          </div>

          <StatusPanel />

          <div className="mt-8 flex justify-center">
            <Link
              href="/quest"
              className="inline-flex items-center justify-center rounded-xl bg-[#00E5FF] px-8 py-4 font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#0A0A0F] shadow-[0_10px_28px_rgba(0,229,255,0.25)] transition-colors hover:bg-[#FFD700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              ▶ クエストを始める
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
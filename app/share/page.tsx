import type { Metadata } from "next";

import { QuestoriaBackground } from "@/components/questoria/QuestoriaBackground";
import { typeMaster } from "@/data/typeMaster";
import type { ResultType } from "@/types";

function pickType(v: string | null): ResultType {
  const s = (v ?? "").trim() as ResultType;
  if (s in typeMaster) return s;
  return "hero";
}

function pickMode(v: string | null): "WORK" | "LIFE" | "LIGHT" {
  const s = (v ?? "").trim().toUpperCase();
  if (s === "LIFE") return "LIFE";
  if (s === "LIGHT") return "LIGHT";
  return "WORK";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const type = pickType(typeof sp.type === "string" ? sp.type : null);
  const mode = pickMode(typeof sp.mode === "string" ? sp.mode : null);
  const td = typeMaster[type];
  const title = `QUESTORIA | ${td.nameJa}`;
  const og = `/api/og/result?type=${encodeURIComponent(type)}&mode=${encodeURIComponent(mode)}`;

  return {
    title,
    openGraph: {
      title,
      description: "AIスキル診断の結果をシェアしました。",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "AIスキル診断の結果をシェアしました。",
      images: [og],
    },
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const type = pickType(typeof sp.type === "string" ? sp.type : null);
  const mode = pickMode(typeof sp.mode === "string" ? sp.mode : null);
  const td = typeMaster[type];

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden text-white">
      <QuestoriaBackground blurAmount="blur-md" overlayOpacity="bg-black/60" showParticles={false} />
      <div className="relative z-10 mx-auto w-full max-w-md px-4 pb-14 pt-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-black/[0.28] p-6 shadow-[0_0_26px_rgba(0,229,255,0.06)] backdrop-blur-md">
          <h1 className="mt-3 font-orbitron text-3xl font-black tracking-wide text-[#FFD700]">{td.nameJa}</h1>
          <p className="mt-2 font-mono text-[12px] tracking-[0.24em] text-white/55">— {td.nameEn} —</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/22 bg-black/35 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-cyan-200/85">
            MODE: {mode}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-white/72">
            このページはシェア用のプレビューです。診断すると、あなたの結果レポートを確認できます。
          </p>

          <a
            href="/"
            className="mt-6 inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-xl border border-[#D2B03B]/78 bg-gradient-to-b from-[#DEC05A] via-[#C2931F] to-[#7F5F12] px-4 py-3 text-sm font-bold tracking-wide text-[#15130F] shadow-[inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-2px_0_rgba(0,0,0,0.26),0_14px_26px_rgba(0,0,0,0.40),0_0_14px_rgba(210,176,59,0.08)] transition hover:from-[#E6CD70] hover:via-[#CEA52B] hover:to-[#8B6C18] hover:border-[#E0C05C]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B03B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
          >
            診断して自分の結果を見る
          </a>
        </div>
      </div>
    </main>
  );
}


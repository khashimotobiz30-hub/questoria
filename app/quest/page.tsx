"use client";

import Link from "next/link";
import { useState } from "react";

import type { QuestType } from "@/types";

const quests = [
  {
    id: "daily",
    nameEn: "DAILY QUEST",
    nameJa: "日常クエスト",
    description:
      "身近な課題や生活の中の判断を通して、思考の筋道を見ていくクエスト",
  },
  {
    id: "business",
    nameEn: "BUSINESS QUEST",
    nameJa: "ビジネスクエスト",
    description:
      "仕事や事業の判断をテーマに、優先順位と意思決定の力を見ていくクエスト",
  },
] as const satisfies ReadonlyArray<{
  id: QuestType;
  nameEn: string;
  nameJa: string;
  description: string;
}>;

export default function QuestSelectPage() {
  const [selectedQuestId, setSelectedQuestId] = useState<QuestType | null>(null);
  const isCtaActive = selectedQuestId !== null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(0,229,255,0.12),transparent_60%),radial-gradient(60%_50%_at_50%_100%,rgba(255,215,0,0.08),transparent_62%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-10">
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#00E5FF]/25 bg-[#00E5FF]/5 px-3 py-2 font-[var(--font-share-tech)] text-xs tracking-[0.22em] text-[#00E5FF] transition-colors hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            ← BACK
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="font-[var(--font-share-tech)] text-[11px] tracking-[0.45em] text-[#00E5FF]">
            QUEST SELECT
          </p>
          <h1 className="mt-3 font-[var(--font-noto)] text-2xl font-bold tracking-[0.08em] text-white">
            挑戦するクエストを選択
          </h1>
          <p className="mt-4 font-[var(--font-noto)] text-sm leading-7 text-white/60">
            これからあなたは、ひとつのクエストに挑みます。クエストごとに題材は異なりますが、問われるのは知識量ではなく、思考の筋道です。
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-[var(--font-share-tech)] text-[11px] tracking-[0.35em] text-[#00E5FF]">
              RUNE MESSAGE
            </p>
            <p className="font-[var(--font-share-tech)] text-[11px] tracking-[0.25em] text-[#FFD700]">
              ルーン
            </p>
          </div>
          <p className="mt-3 font-[var(--font-noto)] text-sm leading-7 text-white/70">
            まずは、挑戦するクエストを選んでください。日常の判断を見るか、ビジネスの判断を見るかで、あなたの旅路は変わります。
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="font-[var(--font-share-tech)] text-[11px] tracking-[0.45em] text-[#00E5FF]">
            SELECT YOUR QUEST
          </p>
          <p className="mt-2 font-[var(--font-noto)] text-sm text-white/60">
            今回は2つのクエストから選択します
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {quests.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelectedQuestId(q.id)}
              className={`w-full rounded-2xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                selectedQuestId === q.id
                  ? "border-[#00E5FF]/80 bg-[#00E5FF]/12 shadow-[0_0_22px_rgba(0,229,255,0.18)]"
                  : "border-[#00E5FF]/30 bg-[#00E5FF]/5 hover:border-[#00E5FF]/45 hover:bg-[#00E5FF]/8"
              }`}
              aria-pressed={selectedQuestId === q.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-[var(--font-share-tech)] text-[11px] tracking-[0.4em] text-[#00E5FF]">
                    {q.nameEn}
                  </p>
                  <h2 className="mt-2 font-[var(--font-noto)] text-xl font-bold tracking-[0.06em] text-white">
                    {q.nameJa}
                  </h2>
                </div>
                {selectedQuestId === q.id ? (
                  <div className="shrink-0 rounded-lg border border-[#FFD700]/55 bg-[#FFD700]/10 px-3 py-2 font-[var(--font-orbitron)] text-xs font-bold tracking-[0.22em] text-[#FFD700] shadow-[0_0_16px_rgba(255,215,0,0.15)]">
                    SELECTED
                  </div>
                ) : (
                  <div className="shrink-0 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-[var(--font-orbitron)] text-xs font-bold tracking-[0.22em] text-white/50">
                    SELECT
                  </div>
                )}
              </div>
              <p className="mt-3 font-[var(--font-noto)] text-sm leading-7 text-white/60">
                {q.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isCtaActive ? (
            <Link
              href={`/play/${selectedQuestId}`}
              onClick={() =>
                sessionStorage.setItem("questoria_questType", selectedQuestId!)
              }
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#00E5FF] px-6 py-4 font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-[#0A0A0F] shadow-[0_10px_28px_rgba(0,229,255,0.22)] transition-colors hover:bg-[#FFD700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              ▶ このクエストで進む
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-white/10 px-6 py-4 font-[var(--font-orbitron)] text-[15px] font-bold tracking-[0.12em] text-white/40 opacity-70 shadow-[0_10px_28px_rgba(0,229,255,0.22)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-disabled="true"
            >
              ▶ このクエストで進む
            </button>
          )}
          <p className="mt-3 text-center font-[var(--font-share-tech)] text-[10px] tracking-[0.28em] text-white/40">
            ※ この先の診断ページは別STEPで実装します
          </p>
        </div>
      </div>
    </main>
  );
}


import Image from "next/image";
import React from "react";

import { reportBodyTextClass, reportHeadingTextClass, reportMutedTextClass } from "@/components/questoria/result/resultCardTheme";

const DEFAULT_BODY = `あなたがこの強みを成果につなげるには、
「考えること」と「前へ進めること」を同時に扱わないことが重要です。
このタイプは、整理する力がある一方で、問いを深めるほど着手が遅れやすくなります。
本来は、AIに触る前に先に決めておくべきポイントがありますが――`;

export function LockedGuidePreviewSection({
  title = "この先のガイド",
  body = DEFAULT_BODY,
  footnote = "",
  lineUrl,
  lockedPlateSrc = "/top/banners/locked-line-plate.png",
  embedded,
}: {
  title?: string;
  body?: string;
  footnote?: string;
  /** 画像プレート自体をLINE導線にする */
  lineUrl?: string;
  /** LOCKEDプレート画像（差し替えやすいように） */
  lockedPlateSrc?: string;
  /** レポート面に埋め込む（外枠カードを弱める） */
  embedded?: boolean;
}) {
  const inner = (
    <div className={embedded ? "relative" : "relative p-5"}>
      <div className="space-y-3">
        <div>
          <h3 className={`mt-2 text-center font-orbitron text-lg font-bold tracking-wide ${reportHeadingTextClass}`}>
            <span className="inline-flex items-center justify-center gap-2">
              <span
                className="text-[0.9em] text-cyan-200/95 drop-shadow-[0_0_14px_rgba(0,229,255,0.16)]"
                aria-hidden="true"
              >
                ◆
              </span>
              {title}
            </span>
          </h3>
          <div
            className="mx-auto mt-3 h-px w-[14rem] max-w-prose opacity-90"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(167,180,204,0.55), rgba(0,229,255,0.42), rgba(167,180,204,0.50), transparent)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <p className={`mx-auto max-w-prose whitespace-pre-line text-[14px] leading-[1.9] sm:text-[15px] ${reportBodyTextClass}`}>
            {body}
          </p>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,15,0) 0%, rgba(10,10,15,0.35) 35%, rgba(10,10,15,0.78) 72%, rgba(10,10,15,0.98) 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(120% 70% at 50% 100%, rgba(0,229,255,0.10), rgba(255,215,0,0.05), transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* LOCKEDプレート（解放予告＋LINE導線） */}
          {lineUrl ? (
            <div className="absolute inset-x-0 bottom-14 flex justify-center">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full max-w-prose px-2"
                aria-label="LINE登録で続きを見る"
              >
                {/* 画像内の下向き矢印は不要なので、下側を軽くクリップ */}
                <div className="questoria-locked-float relative mx-auto w-full max-w-[18rem] rounded-2xl">
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: "1024/260",
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 86%, rgba(0,0,0,0) 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 86%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <Image
                      src={lockedPlateSrc}
                      alt="LINE登録で続きを見る"
                      fill
                      sizes="(min-width: 768px) 448px, 100vw"
                      className="object-contain"
                      style={{ filter: "contrast(1.03) saturate(0.98)" }}
                      priority={false}
                    />
                  </div>
                  {/* subtle hover/active without button-ish feel */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(230,197,90,0.08), rgba(0,229,255,0.05), transparent)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {footnote ? (
        <p className={`mt-5 text-[13px] leading-relaxed ${reportMutedTextClass}`}>{footnote}</p>
      ) : null}
    </div>
  );

  if (embedded) return <section>{inner}</section>;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] via-white/[0.03] to-black/[0.24] shadow-[0_0_18px_rgba(0,229,255,0.05)] backdrop-blur-sm">
      {inner}
    </section>
  );
}


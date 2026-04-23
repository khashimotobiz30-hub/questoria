import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Link2, X } from "lucide-react";

import { sectionLabelClass } from "@/components/questoria/result/resultCardTheme";

type Props = {
  open: boolean;
  onClose: () => void;
  preview: {
    typeNameJa: string;
    typeNameEn: string;
    imageSrc: string;
    tagline?: string;
  };
  onShareX: () => void;
  onCopyLink: () => Promise<void> | void;
  onSaveImage: () => Promise<void> | void;
};

export function ShareModal({ open, onClose, preview, onShareX, onCopyLink, onSaveImage }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const resetTimersRef = useRef<{ copy?: number; save?: number }>({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    setSaved(false);
    const timers = resetTimersRef.current;
    if (timers.copy) window.clearTimeout(timers.copy);
    if (timers.save) window.clearTimeout(timers.save);
    resetTimersRef.current = {};
  }, [open]);

  useEffect(() => {
    return () => {
      const timers = resetTimersRef.current;
      if (timers.copy) window.clearTimeout(timers.copy);
      if (timers.save) window.clearTimeout(timers.save);
    };
  }, []);

  const actionLabelCopy = useMemo(() => (copied ? "リンクをコピーしました" : "リンクをコピー"), [copied]);
  const actionLabelSave = useMemo(() => (saved ? "画像を保存しました" : "画像を保存"), [saved]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="questoria-share-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#0f141c]/96 via-[#080c12]/98 to-[#05070c]/98 shadow-[0_0_38px_rgba(0,229,255,0.10),0_24px_48px_rgba(0,0,0,0.58)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/[0.08] to-transparent" aria-hidden />

        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 pb-2.5 pt-3.5">
          <div className="min-w-0">
            <h2 id="questoria-share-modal-title" className="font-orbitron text-lg font-bold tracking-wide text-white">
              結果をシェア
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/75 transition hover:border-white/25 hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="size-[18px]" strokeWidth={1.75} />
          </button>
        </header>

        <div className="px-4 pb-4 pt-3.5">
          <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="relative w-full [aspect-ratio:4/5]">
              <Image
                src={preview.imageSrc}
                alt={preview.typeNameJa}
                fill
                sizes="(min-width: 768px) 448px, 100vw"
                className="object-cover"
                style={{ objectPosition: "center 15%", filter: "brightness(1.08) contrast(1.05)" }}
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className={sectionLabelClass}>QUESTORIA RESULT</p>
                <p className="mt-2 font-orbitron text-2xl font-black tracking-wide text-[#FFD700] drop-shadow-[0_0_28px_rgba(255,215,0,0.20)]">
                  {preview.typeNameJa}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.24em] text-white/55">— {preview.typeNameEn} —</p>
                {preview.tagline ? (
                  <p className="mt-3 line-clamp-3 whitespace-pre-line border-l-2 border-cyan-400/55 pl-3 text-[12px] leading-relaxed text-white/78">
                    {preview.tagline}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4.5 space-y-2.5">
            <button
              type="button"
              className="inline-flex min-h-[3.1rem] w-full items-center justify-center gap-2 rounded-xl border border-[#D2B03B]/78 bg-gradient-to-b from-[#DEC05A] via-[#C2931F] to-[#7F5F12] px-4 py-3 text-[13px] font-bold tracking-wide text-[#15130F] shadow-[inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-2px_0_rgba(0,0,0,0.26),0_14px_26px_rgba(0,0,0,0.40),0_0_14px_rgba(210,176,59,0.08)] transition hover:from-[#E6CD70] hover:via-[#CEA52B] hover:to-[#8B6C18] hover:border-[#E0C05C]/90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B03B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={onShareX}
            >
              Xでシェア
            </button>

            <button
              type="button"
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-white/14 bg-black/28 px-4 py-3 text-[13px] font-semibold tracking-wide text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-black/36 hover:text-white/85 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/18 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={async () => {
                await onCopyLink();
                setCopied(true);
                const timers = resetTimersRef.current;
                if (timers.copy) window.clearTimeout(timers.copy);
                timers.copy = window.setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Link2 className="size-[16px] opacity-75" strokeWidth={1.7} aria-hidden />
              {actionLabelCopy}
            </button>

            <button
              type="button"
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-white/18 bg-black/22 px-4 py-3 text-[13px] font-semibold tracking-wide text-white/74 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/24 hover:bg-black/30 hover:text-white/86 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              onClick={async () => {
                await onSaveImage();
                setSaved(true);
                const timers = resetTimersRef.current;
                if (timers.save) window.clearTimeout(timers.save);
                timers.save = window.setTimeout(() => setSaved(false), 1500);
              }}
            >
              <Download className="size-[16px] opacity-90" strokeWidth={1.7} aria-hidden />
              {actionLabelSave}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


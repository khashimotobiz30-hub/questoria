"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_KEY_RESULT = "questoria_result";

export default function LoadingPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
      if (!raw) {
        router.replace("/quest");
        return;
      }
    } catch {
      router.replace("/quest");
      return;
    }

    setIsReady(true);

    const timerId = window.setTimeout(() => {
      router.replace("/result");
    }, 5500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  if (!isReady) return null;

  return (
    <main className="min-h-[100svh] w-full bg-[#0A0A0F] px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-cyan-400/30 bg-black/30 p-6 shadow-[0_0_30px_rgba(0,229,255,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 text-center">
            <p className="font-mono text-xs tracking-[0.28em] text-cyan-300/90">
              ANALYZING
            </p>
            <h1 className="font-orbitron text-2xl tracking-wide text-[#FFD700]">
              解析中
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-white/75">
              AIがあなたの思考を解析しています。
              <br />
              最適なタイプを算出中…
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-300/80 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-cyan-300/60 animate-pulse [animation-delay:200ms]" />
              <span className="h-2 w-2 rounded-full bg-cyan-300/40 animate-pulse [animation-delay:400ms]" />
            </div>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full border border-cyan-300/20 bg-black/50">
                <div className="h-full w-1/2 animate-[loadingbar_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/70 to-cyan-400/0" />
              </div>
              <p className="mt-3 text-center font-mono text-xs tracking-wide text-white/60">
                ギルドマスターが審査を開始する…
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loadingbar {
          0% {
            transform: translateX(-80%);
          }
          50% {
            transform: translateX(80%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </main>
  );
}


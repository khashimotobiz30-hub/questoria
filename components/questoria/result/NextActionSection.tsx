import React from "react";

export function NextActionSection({
  nextActions,
  message,
}: {
  nextActions?: string[];
  message?: string;
}) {
  const items = (nextActions ?? []).slice(0, 3);

  return (
    <section className="rounded-2xl border border-[#FFD700]/18 bg-gradient-to-b from-[#FFD700]/10 via-cyan-300/6 to-[#0A0A0F] p-5 shadow-[0_0_35px_rgba(255,215,0,0.06)]">
      <p
        className="font-mono text-[11px] tracking-[0.28em] text-[#FFD700]"
        style={{ textShadow: "0 0 10px rgba(255,215,0,0.3)" }}
      >
        {"// NEXT ACTION //"}
      </p>
      <h2 className="mt-2 font-orbitron text-lg font-bold tracking-wide text-white">
        次の一歩（実用編）
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-white/70">
        読んで終わりにしないための、今日からできる3ステップ。
      </p>

      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((text, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/35 p-3.5 backdrop-blur"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-9 w-9 rounded-xl border border-[#FFD700]/28 bg-black/60 shadow-[0_0_18px_rgba(255,215,0,0.08)]"
                      aria-hidden="true"
                    >
                      <div className="flex h-full w-full items-center justify-center font-orbitron text-sm font-black text-[#FFD700]">
                        {i + 1}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.22em] text-white/55">
                      STEP
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-white/85">{text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4">
            <p className="text-sm text-white/60">
              TODO: nextActions を他タイプにも追加
            </p>
          </div>
        )}
      </div>

      {message ? (
        <p className="mt-4 text-sm leading-relaxed text-white/70">{message}</p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          小さく始めて、うまくいった型だけを残していきましょう。
        </p>
      )}
    </section>
  );
}


import React from "react";

export function ResultBackplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Experimental: ultra-subtle background layers behind content */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            background:
              "radial-gradient(700px 520px at 20% 8%, rgba(0,229,255,0.26), transparent 62%), radial-gradient(620px 460px at 84% 18%, rgba(255,215,0,0.16), transparent 64%), radial-gradient(560px 520px at 50% 96%, rgba(255,215,0,0.12), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.22] blur-[10px]"
          style={{
            background:
              "radial-gradient(480px 520px at 12% 68%, rgba(0,229,255,0.18), transparent 62%), radial-gradient(520px 560px at 88% 76%, rgba(255,215,0,0.12), transparent 64%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.0), rgba(10,10,15,0.32) 35%, rgba(10,10,15,0.62) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16] blur-[0.5px]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.035) 6px, rgba(255,255,255,0.035) 7px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,229,255,0.075) 30px, rgba(0,229,255,0.075) 31px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 64px, rgba(255,215,0,0.10) 64px, transparent 84px)",
            maskImage:
              "radial-gradient(900px 520px at 50% 0%, black 0%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(900px 520px at 50% 0%, black 0%, transparent 72%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.22]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1000px 420px at 50% -10%, rgba(255,255,255,0.10), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 650px at 50% 60%, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      </div>

      {children}
    </div>
  );
}


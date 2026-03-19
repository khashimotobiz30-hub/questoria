"use client";

type Props = {
  children: string;
  className?: string;
};

export default function GlitchText({ children, className }: Props) {
  const durationSec = 4; // 8→4で頻度2倍

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span
        className="relative"
        style={{
          animation: `glitch ${durationSec}s infinite`,
          willChange: "transform, clip-path, opacity",
        }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 translate-x-[1px] text-[#FFD700] opacity-20"
        style={{
          animation: `glitch ${durationSec}s infinite`,
          willChange: "transform, clip-path, opacity",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute inset-0 -translate-x-[1px] text-[#FFD700] opacity-15"
        style={{
          animation: `glitch ${durationSec}s infinite`,
          willChange: "transform, clip-path, opacity",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}
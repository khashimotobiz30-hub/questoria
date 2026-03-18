"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  leftPct: number;
  topPct: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  opacity: number;
};

export default function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const count = 28;
    const nextParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const sizePx = 1 + Math.floor(Math.random() * 3);
      return {
        id: i,
        leftPct: Math.random() * 100,
        topPct: Math.random() * 100,
        sizePx,
        durationSec: 18 + Math.random() * 14,
        delaySec: Math.random() * 10,
        opacity: 0.12 + Math.random() * 0.18,
      };
    });

    setParticles(nextParticles);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#FFD700]"
          style={{
            left: `${p.leftPct}%`,
            top: `${p.topPct}%`,
            width: `${p.sizePx}px`,
            height: `${p.sizePx}px`,
            opacity: p.opacity,
            animation: `float-particle ${p.durationSec}s linear ${p.delaySec}s infinite`,
            transform: "translate3d(0,0,0)",
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

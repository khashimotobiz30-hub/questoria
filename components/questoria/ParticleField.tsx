"use client";

type Particle = {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  opacity: number;
};

const PARTICLES: Particle[] = [
  { id: 1, left: "8%", top: "14%", size: "2px", delay: "0s", duration: "9s", opacity: 0.32 },
  { id: 2, left: "18%", top: "28%", size: "3px", delay: "1.2s", duration: "11s", opacity: 0.42 },
  { id: 3, left: "27%", top: "10%", size: "2px", delay: "2.4s", duration: "10s", opacity: 0.28 },
  { id: 4, left: "35%", top: "22%", size: "4px", delay: "0.8s", duration: "12s", opacity: 0.38 },
  { id: 5, left: "44%", top: "12%", size: "2px", delay: "3.1s", duration: "8s", opacity: 0.3 },
  { id: 6, left: "52%", top: "30%", size: "3px", delay: "1.7s", duration: "13s", opacity: 0.46 },
  { id: 7, left: "61%", top: "16%", size: "2px", delay: "2.9s", duration: "9s", opacity: 0.27 },
  { id: 8, left: "70%", top: "24%", size: "3px", delay: "0.4s", duration: "10s", opacity: 0.4 },
  { id: 9, left: "79%", top: "11%", size: "2px", delay: "1.9s", duration: "11s", opacity: 0.33 },
  { id: 10, left: "88%", top: "20%", size: "4px", delay: "2.6s", duration: "12s", opacity: 0.44 },
  { id: 11, left: "12%", top: "52%", size: "2px", delay: "0.6s", duration: "10s", opacity: 0.29 },
  { id: 12, left: "24%", top: "62%", size: "3px", delay: "2.2s", duration: "9s", opacity: 0.41 },
  { id: 13, left: "39%", top: "56%", size: "2px", delay: "1.4s", duration: "11s", opacity: 0.34 },
  { id: 14, left: "53%", top: "68%", size: "4px", delay: "3.3s", duration: "12s", opacity: 0.39 },
  { id: 15, left: "66%", top: "58%", size: "2px", delay: "0.9s", duration: "8s", opacity: 0.26 },
  { id: 16, left: "74%", top: "72%", size: "3px", delay: "2.7s", duration: "10s", opacity: 0.43 },
  { id: 17, left: "84%", top: "61%", size: "2px", delay: "1.1s", duration: "9s", opacity: 0.31 },
  { id: 18, left: "92%", top: "78%", size: "3px", delay: "2.1s", duration: "11s", opacity: 0.36 },
];

export default function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-[#FFD700]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animation: `particleFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
            boxShadow: "0 0 12px rgba(255,215,0,0.45)",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.15);
            opacity: 0.9;
          }
          100% {
            transform: translate3d(0, -28px, 0) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
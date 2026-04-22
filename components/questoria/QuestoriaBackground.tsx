import Image from "next/image";

import ParticleField from "@/components/questoria/ParticleField";

type Props = {
  /** Tailwind blur class (e.g. "blur-md") */
  blurAmount?: string;
  /** Tailwind bg opacity class (e.g. "bg-black/60") */
  overlayOpacity?: string;
  /** Show ParticleField layer */
  showParticles?: boolean;
};

export function QuestoriaBackground({
  blurAmount = "blur-md",
  overlayOpacity = "bg-black/60",
  showParticles = true,
}: Props) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <div className={`absolute inset-0 ${blurAmount}`}>
        <Image
          src="/top/bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65" />
      {showParticles ? <ParticleField /> : null}
    </div>
  );
}


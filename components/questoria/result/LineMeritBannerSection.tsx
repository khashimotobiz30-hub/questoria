import Image from "next/image";
import React from "react";

export function LineMeritBannerSection({
}: {
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-black/10">
      <Image
        src="/top/banners/line-benefit-banner-wide.png"
        alt="LINE限定特典の案内"
        width={1592}
        height={685}
        sizes="(min-width: 768px) 448px, 100vw"
        className="h-auto w-full object-contain"
        style={{ filter: "saturate(1.02) contrast(1.02)" }}
        priority={false}
      />
    </section>
  );
}


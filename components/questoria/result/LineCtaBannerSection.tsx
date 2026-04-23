import Image from "next/image";
import React from "react";

export function LineCtaBannerSection({
  lineUrl,
  onClick,
  label = "LINEで続きのガイドを受け取る",
}: {
  lineUrl: string;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <section className="pt-2">
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/35"
        onClick={() => onClick?.()}
      >
        <Image
          src="/top/banners/line-benefit-banner-cta.png"
          alt="LINEで続きのガイドを受け取る"
          width={1209}
          height={1301}
          sizes="(min-width: 768px) 448px, 100vw"
          className="h-auto w-full object-contain"
          style={{ filter: "saturate(1.02) contrast(1.03)" }}
          priority={false}
        />
      </a>
    </section>
  );
}


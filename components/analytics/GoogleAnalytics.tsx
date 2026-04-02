"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect } from "react";

import { GA_MEASUREMENT_ID, isGaEnabled, trackPageView } from "@/lib/analytics";

function GaPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGaEnabled()) return;
    const q = searchParams?.toString();
    const path = q ? `${pathname}?${q}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!isGaEnabled()) return null;

  const gaDebugMode = process.env.NODE_ENV === "development";
  const configOptions = gaDebugMode
    ? "{ send_page_view: false, debug_mode: true }"
    : "{ send_page_view: false }";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', ${configOptions});
        `}
      </Script>
      <Suspense fallback={null}>
        <GaPageViews />
      </Suspense>
    </>
  );
}

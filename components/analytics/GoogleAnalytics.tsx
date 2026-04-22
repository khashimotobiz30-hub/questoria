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

  // Enable DebugView:
  // - always in development
  // - or when `?ga_debug=1` is present (useful even in production)
  const gaDebugMode = process.env.NODE_ENV === "development";

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
          var __gaDebug = ${gaDebugMode ? "true" : "false"} || (String(window.location && window.location.search || '').indexOf('ga_debug=1') !== -1);
          gtag('config', '${GA_MEASUREMENT_ID}', __gaDebug ? { send_page_view: false, debug_mode: true } : { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GaPageViews />
      </Suspense>
    </>
  );
}

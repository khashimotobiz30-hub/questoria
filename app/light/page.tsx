import { Suspense } from "react";

import LightClient from "@/components/questoria/light/LightClient";

export default function LightPage() {
  return (
    <Suspense fallback={null}>
      <LightClient />
    </Suspense>
  );
}


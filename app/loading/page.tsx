import { Suspense } from "react";

import LoadingClient from "@/app/loading/LoadingClient";

export default function LoadingPage() {
  return (
    <Suspense fallback={null}>
      <LoadingClient />
    </Suspense>
  );
}
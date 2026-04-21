import { Suspense } from "react";

import ResultClient from "@/app/result/ResultClient";

export default function ResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultClient />
    </Suspense>
  );
}

import { Suspense } from "react";

import PlayClient from "@/components/questoria/play/PlayClient";

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <PlayClient />
    </Suspense>
  );
}
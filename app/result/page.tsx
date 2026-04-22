import { Suspense } from "react";

import ResultClient from "@/app/result/ResultClient";
import { QuestoriaBackground } from "@/components/questoria/QuestoriaBackground";

export default function ResultPage() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden text-white">
      <QuestoriaBackground blurAmount="blur-md" overlayOpacity="bg-black/60" showParticles={false} />
      <div className="relative z-10">
        <Suspense fallback={null}>
          <ResultClient />
        </Suspense>
      </div>
    </main>
  );
}

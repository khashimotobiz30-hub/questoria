"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { DiagnosisResult, ResultType } from "@/types";

const SESSION_KEY_RESULT = "questoria_result";

const ALL_TYPES: ResultType[] = [
  "hero","sage","berserker","oracle",
  "artisan","wizard","pioneer","origin"
];

function pickRandom3(exclude: ResultType): ResultType[] {
  const pool = ALL_TYPES.filter(t => t !== exclude);
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

const CORRUPT_MSGS = [
  ["ERR_SIGNAL_SYNC :: INITIALIZING","SKILL_MATRIX_CALC :: [██░░░░] 28%","D4T4_STR34M :: READING..."],
  ["NEURAL_PATH :: MAPPING","SKILL_MATRIX_CALC :: [████░░] 55%","TYPE_RESOLVE :: SCANNING..."],
  ["∆∆∆ OVERRIDE :: ACTIVATED ∆∆∆","SKILL_MATRIX_CALC :: [██████] 97%","!!! GUILD_MASTER :: JUDGING !!!"],
];

type Stage = "random" | "reveal" | "done";

export default function LoadingPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [resultType, setResultType] = useState<ResultType>("hero");
  const [randomTypes, setRandomTypes] = useState<ResultType[]>([]);

  const [stage, setStage] = useState<Stage>("random");
  const [phase, setPhase] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [revealScale, setRevealScale] = useState(1.15);
  const [revealOpacity, setRevealOpacity] = useState(0);

  const [corruptMsg, setCorruptMsg] = useState(CORRUPT_MSGS[0][0]);
  const [corruptColor, setCorruptColor] = useState("rgba(0,229,255,0.35)");
  const [titleShake, setTitleShake] = useState(false);
  const [noiseBlocks, setNoiseBlocks] = useState<{id:number;style:React.CSSProperties}[]>([]);
  const [glitchSlices, setGlitchSlices] = useState<{id:number;style:React.CSSProperties}[]>([]);
  const [scanY, setScanY] = useState(-60);
  const [showTypeName, setShowTypeName] = useState(false);

  const noiseIdRef = useRef(0);
  const sliceIdRef = useRef(0);
  const rafRef = useRef<number>(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const addInterval = useCallback((fn: () => void, ms: number) => {
    const id = setInterval(fn, ms);
    intervalsRef.current.push(id);
    return id;
  }, []);

  // セッション確認
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY_RESULT);
      if (!raw) { router.replace("/quest"); return; }
      const parsed = JSON.parse(raw) as DiagnosisResult;
      setResultType(parsed.resultType);
      setRandomTypes(pickRandom3(parsed.resultType));
      setIsReady(true);
    } catch {
      router.replace("/quest");
    }
  }, [router]);

  // スキャンバー
  useEffect(() => {
    if (!isReady) return;
    let y = -60;
    const tick = () => {
      y += 2.5;
      if (y > 520) y = -60;
      setScanY(y);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isReady]);

  // ノイズ・スライス生成
  const spawnEffects = useCallback((p: number) => {
    const noiseInterval = p === 0 ? 400 : p === 1 ? 180 : 60;
    const sliceCount = p === 0 ? 1 : p === 1 ? 3 : 7;

    const nId = addInterval(() => {
      const id = noiseIdRef.current++;
      const isRed = Math.random() > 0.5;
      setNoiseBlocks(prev => [...prev, {
        id,
        style: {
          position:"absolute", width:`${Math.random()*140+20}px`,
          height:`${Math.random()*3+1}px`, top:`${Math.random()*100}%`,
          left:`${Math.random()*80}%`,
          background:`rgba(${isRed?"255,0,60":"0,229,255"},${0.08+Math.random()*0.18})`,
          pointerEvents:"none",
        }
      }]);
      setTimeout(() => setNoiseBlocks(prev => prev.filter(b => b.id !== id)), 120+Math.random()*150);
    }, noiseInterval);

    const sId = addInterval(() => {
      const slices = Array.from({length:sliceCount}, () => {
        const id = sliceIdRef.current++;
        const dx = (Math.random()-0.5)*(p===2?28:8);
        return { id, style: {
          position:"absolute" as const, left:0, right:0,
          top:`${Math.random()*100}%`, height:`${Math.random()*8+2}px`,
          transform:`translateX(${dx}px)`,
          opacity:0.3+Math.random()*0.4,
          background:`rgba(${Math.random()>0.5?"255,215,0":"0,229,255"},0.08)`,
          pointerEvents:"none" as const,
        }};
      });
      setGlitchSlices(slices);
      setTimeout(() => setGlitchSlices([]), 80+Math.random()*100);
    }, noiseInterval*1.5);

    return () => {
      clearInterval(nId);
      clearInterval(sId);
      intervalsRef.current = intervalsRef.current.filter(id => id !== nId && id !== sId);
    };
  }, [addInterval]);

  // REVEAL演出
  const startReveal = useCallback(() => {
    setStage("reveal");
    setImgOpacity(0);

    addTimer(() => {
      setRevealOpacity(1);
      setRevealScale(1.15);
      addTimer(() => setRevealScale(1.0), 50);
    }, 300);

    addTimer(() => {
      setShowTypeName(true);
      setCorruptMsg("!!! TYPE DETERMINED :: REDIRECTING !!!");
      setCorruptColor("#FF003C");
    }, 1200);

    addTimer(() => {
      for (let i = 0; i < 5; i++) {
        addTimer(() => {
          const slices = Array.from({length:10}, () => {
            const id = sliceIdRef.current++;
            return { id, style: {
              position:"absolute" as const, left:0, right:0,
              top:`${Math.random()*100}%`, height:`${Math.random()*15+3}px`,
              transform:`translateX(${(Math.random()-0.5)*40}px)`,
              opacity:0.5+Math.random()*0.5,
              background:`rgba(${Math.random()>0.5?"255,0,60":"0,229,255"},0.2)`,
              pointerEvents:"none" as const,
            }};
          });
          setGlitchSlices(slices);
          setTimeout(() => setGlitchSlices([]), 60);
        }, i * 80);
      }
    }, 1800);

    addTimer(() => {
      setStage("done");
      router.replace("/result");
    }, 2400);
  }, [addTimer, router]);

  // メインフロー
  useEffect(() => {
    if (!isReady) return;

    const runPhase = (p: number) => {
      setPhase(p);
      setTitleShake(p === 2);
      setCorruptColor(p === 2 ? "rgba(255,0,60,0.7)" : "rgba(0,229,255,0.35)");

      setImgOpacity(0);
      addTimer(() => setImgOpacity(1), 200);

      let ci = 0;
      const cId = addInterval(() => {
        ci = (ci+1) % CORRUPT_MSGS[p].length;
        setCorruptMsg(CORRUPT_MSGS[p][ci]);
      }, 600);

      const cleanEffects = spawnEffects(p);

      if (p < 2) {
        addTimer(() => {
          clearInterval(cId);
          cleanEffects();
          runPhase(p+1);
        }, 1700);
      } else {
        addTimer(() => {
          clearInterval(cId);
          cleanEffects();
          startReveal();
        }, 1700);
      }
    };

    runPhase(0);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [isReady, addTimer, addInterval, spawnEffects, startReveal]);

  if (!isReady) return null;

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#0A0A0F]">

      {/* ランダム画像 */}
      {stage === "random" && randomTypes.length > 0 && (
        <div className="absolute inset-0 transition-opacity duration-200" style={{opacity: imgOpacity}}>
          <Image
            src={`/top/${randomTypes[Math.min(phase, randomTypes.length-1)]}.jpg`}
            alt="" fill className="object-cover object-center" priority
          />
        </div>
      )}

      {/* 結果キャラ REVEAL */}
      {stage !== "random" && (
        <div
          className="absolute inset-0"
          style={{
            opacity: revealOpacity,
            transform: `scale(${revealScale})`,
            transition: "opacity 0.4s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Image src={`/top/${resultType}.jpg`} alt="" fill
            className="object-cover object-center" priority />
          <div className="absolute inset-0 pointer-events-none"
            style={{background:"radial-gradient(ellipse 50% 50% at 50% 60%, rgba(255,215,0,0.15) 0%, transparent 70%)"}} />
        </div>
      )}

      {/* 共通オーバーレイ */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"radial-gradient(ellipse 55% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.95) 100%)"}} />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* スキャンライン */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,229,255,0.025) 3px,rgba(0,229,255,0.025) 4px)"}} />
      <div className="absolute inset-x-0 h-16 pointer-events-none"
        style={{top:`${scanY}px`,background:"linear-gradient(180deg,transparent,rgba(0,229,255,0.06),transparent)"}} />

      {/* ノイズ・スライス */}
      {noiseBlocks.map(b => <div key={b.id} style={b.style} />)}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {glitchSlices.map(s => <div key={s.id} style={s.style} />)}
      </div>

      {/* フェーズ表示 */}
      {stage === "random" && (
        <div className="absolute top-4 right-4 z-10 font-mono text-[10px] tracking-[0.15em] text-cyan-400/50">
          PHASE {phase+1}/3
        </div>
      )}

      {/* TYPE DETERMINED */}
      {showTypeName && (
        <div className="absolute inset-x-0 top-1/3 z-20 text-center px-4"
          style={{animation:"glitchIn 0.3s ease forwards"}}>
          <p className="font-mono text-xs tracking-[0.3em] text-cyan-300/80 mb-2">TYPE DETERMINED</p>
          <p className="font-mono text-4xl font-black tracking-widest text-[#FFD700]"
            style={{textShadow:"0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)"}}>
            {resultType.toUpperCase()}
          </p>
        </div>
      )}

      {/* ボトムUI */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end pb-14 px-4">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] text-cyan-300/80 mb-1">ANALYZING</p>
          <h1 className="font-mono text-2xl font-black tracking-widest text-[#FFD700] mb-2"
            style={titleShake ? {animation:"titleShake 0.1s infinite"} : {}}>
            解析中
          </h1>
          <p className="text-xs text-white/55 mb-3">
            AIがあなたの思考を解析しています。<br />最適なタイプを算出中…
          </p>
          <div className="h-[2px] w-48 mx-auto overflow-hidden bg-cyan-300/15 mb-2">
            <div className="h-full w-2/5 animate-[loadingbar_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          </div>
          <p className="font-mono text-[9px] tracking-wide h-4 transition-colors duration-300"
            style={{color:corruptColor}}>
            {corruptMsg}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loadingbar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes titleShake {
          0%   { transform: translate(0,0) skewX(0deg); color: #FFD700; }
          20%  { transform: translate(-3px,1px) skewX(-2deg); }
          40%  { transform: translate(3px,-1px) skewX(2deg); }
          60%  { transform: translate(-2px,2px) skewX(-1deg); color: #FF003C; }
          80%  { transform: translate(2px,-2px) skewX(1deg); color: #FFD700; }
          100% { transform: translate(0,0) skewX(0deg); }
        }
        @keyframes glitchIn {
          0%   { opacity: 0; transform: translateX(-8px) skewX(-3deg); }
          50%  { opacity: 1; transform: translateX(4px) skewX(1deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0deg); }
        }
      `}</style>
    </main>
  );
}
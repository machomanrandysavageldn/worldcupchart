"use client";
import { useEffect, useRef, useState } from "react";
import type { LiveState } from "@/lib/types";
import { Confetti } from "./Confetti";

export function LiveScore({ matchId }: { matchId: string }) {
  const [state, setState] = useState<LiveState | null>(null);
  const [boom, setBoom] = useState(0);
  const prevTotal = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const r = await fetch(`/api/live/${matchId}`, { cache: "no-store" });
        if (!r.ok) return;
        const data: LiveState = await r.json();
        if (cancelled) return;
        const total = data.homeScore + data.awayScore;
        if (prevTotal.current !== null && total > prevTotal.current) {
          setBoom((n) => n + 1);
        }
        prevTotal.current = total;
        setState(data);
      } catch {}
    }
    tick();
    const isFinished = state?.status === "finished";
    if (isFinished) return;
    const interval = setInterval(tick, 30000);
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, state?.status]);

  if (!state || state.status === "scheduled") return null;

  const dotClass =
    state.status === "live" ? "bg-wc-magenta animate-pulse" :
    state.status === "halftime" ? "bg-wc-gold" :
    "bg-wc-pitch";

  return (
    <>
      <Confetti trigger={boom} />
      <div className="chunky-card p-5 bg-wc-ink text-wc-cream">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          <span className={`inline-block w-2 h-2 rounded-full ${dotClass}`} />
          {state.status === "live" && <span>Live · {state.minute}&apos;</span>}
          {state.status === "halftime" && <span>Half-time</span>}
          {state.status === "finished" && <span>Full-time</span>}
        </div>
        <div className="font-display text-5xl mt-2 text-center">
          {state.homeScore} <span className="opacity-50 mx-2">-</span> {state.awayScore}
        </div>
      </div>
    </>
  );
}

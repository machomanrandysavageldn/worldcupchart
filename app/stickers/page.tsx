"use client";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { TEAMS } from "@/lib/teams";
import { loadStickers, saveStickers, type StickerState } from "@/lib/stickers";
import { Confetti } from "@/components/Confetti";

export default function StickerBook() {
  const [state, setState] = useState<StickerState>({ collected: {} });
  const [hydrated, setHydrated] = useState(false);
  const [boom, setBoom] = useState(0);
  const [flipping, setFlipping] = useState<string | null>(null);

  useEffect(() => {
    setState(loadStickers());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStickers(state);
  }, [state, hydrated]);

  const teams = TEAMS.filter((t) => t.qualified);
  const collected = Object.keys(state.collected).length;

  function collect(code: string) {
    if (state.collected[code]) return;
    setFlipping(code);
    setTimeout(() => {
      setState({ collected: { ...state.collected, [code]: Date.now() } });
      setBoom((n) => n + 1);
      setFlipping(null);
    }, 350);
  }

  function reset() {
    if (!confirm("Empty the sticker book?")) return;
    setState({ collected: {} });
  }

  return (
    <Section title="Sticker book" kicker={`${collected} / ${teams.length} stickers · tap to collect`}>
      <Confetti trigger={boom} count={50} />
      <div className="chunky-card p-4 bg-white mb-6 flex items-center gap-4">
        <div className="font-display text-3xl flex-1">
          {collected === teams.length ? "Full house! ⚽✨" : `Collect them all`}
        </div>
        <div className="w-48 h-3 bg-wc-ink/10 rounded-full overflow-hidden">
          <div className="h-full bg-wc-magenta transition-all" style={{ width: `${(collected / teams.length) * 100}%` }} />
        </div>
        <button onClick={reset} className="text-xs underline text-wc-deep/60">Reset</button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {teams.map((t, i) => {
          const has = !!state.collected[t.code];
          const isFlipping = flipping === t.code;
          return (
            <button
              key={t.code}
              onClick={() => collect(t.code)}
              disabled={has}
              className="relative aspect-[3/4] perspective-[600px] focus:outline-none"
              style={{ perspective: 600 }}
              aria-label={`Sticker for ${t.name}`}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: has || isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Back (foil) */}
                <div
                  className="absolute inset-0 chunky-card flex items-center justify-center text-wc-cream font-display text-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    background: `linear-gradient(135deg, hsl(${(i * 32) % 360} 80% 30%), hsl(${(i * 32 + 60) % 360} 80% 50%))`,
                  }}
                >
                  ?
                </div>
                {/* Front (team) */}
                <div
                  className="absolute inset-0 chunky-card bg-white p-2 flex flex-col items-center justify-center text-center"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="text-4xl">{t.flag}</div>
                  <div className="text-xs font-bold mt-1 leading-tight">{t.name}</div>
                  {has && (
                    <div className="text-[9px] uppercase tracking-widest font-bold text-wc-magenta mt-1">Got it!</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-wc-deep/70 mt-6">
        During the tournament, stickers will auto-unlock as each team plays their first match.
        For now, tap to collect — the sticker flips, the confetti goes off.
      </p>
    </Section>
  );
}

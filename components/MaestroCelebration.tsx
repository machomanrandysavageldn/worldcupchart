"use client";
import { useEffect, useState } from "react";
import { Confetti } from "./Confetti";

// The video to embed when a family member nails the champion pick.
// Per requirements: https://www.youtube.com/watch?v=aTquMwTpuqg
const VIDEO_ID = "aTquMwTpuqg";

export function MaestroCelebration({
  open,
  memberName,
  onClose,
}: {
  open: boolean;
  memberName: string;
  onClose: () => void;
}) {
  const [confettiTick, setConfettiTick] = useState(0);
  const [explosionTick, setExplosionTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    setConfettiTick((t) => t + 1);
    // Re-fire the cannons a few times to feel like an "explosion" sequence.
    const a = setTimeout(() => setConfettiTick((t) => t + 1), 700);
    const b = setTimeout(() => setConfettiTick((t) => t + 1), 1500);
    const c = setTimeout(() => setExplosionTick((t) => t + 1), 200);
    const d = setTimeout(() => setExplosionTick((t) => t + 1), 1100);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); clearTimeout(d); };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <Confetti trigger={confettiTick} count={140} />
      <div className="fixed inset-0 z-50 bg-wc-ink/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl chunky-card bg-wc-gold p-6 md:p-8 text-wc-ink text-center animate-pop">
          {/* Explosion bursts (CSS-only stars radiating from centre) */}
          <Explosions tick={explosionTick} />

          <div className="text-5xl mb-2">🏆🎉🎆</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            YOU ARE A WORLD CUP MAESTRO!!
          </h2>
          <p className="mt-2 font-bold text-lg">
            Well played, {memberName} — you called the champion.
          </p>

          <div className="mt-5 chunky-card overflow-hidden bg-black aspect-video">
            {/* autoplay so the celebration fires automatically; muted to satisfy browser autoplay policies */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="World Cup Maestro celebration"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          <button
            onClick={onClose}
            className="chunky-btn bg-wc-magenta text-white px-6 py-3 font-bold mt-5"
          >
            Take a bow →
          </button>
        </div>
      </div>
    </>
  );
}

function Explosions({ tick }: { tick: number }) {
  // Cheap "explosion" — radiating coloured rays from the centre that fade out.
  const rays = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div key={tick} className="pointer-events-none absolute inset-0 overflow-hidden">
      {rays.map((i) => {
        const angle = (i / rays.length) * 360;
        const colors = ["#E5006D", "#FFC83D", "#1A4FFF", "#00B7E0", "#7E3CFF", "#FF5A3C"];
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              width: "60%",
              height: 4,
              transform: `translate(-0%, -50%) rotate(${angle}deg)`,
              background: `linear-gradient(90deg, ${colors[i % colors.length]} 0%, transparent 100%)`,
              opacity: 0,
              animation: `confetti-fall 0.001s, ray-burst 900ms ease-out forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes ray-burst {
          0% { opacity: 0; transform: translate(-0%, -50%) rotate(var(--a, 0deg)) scaleX(0.2); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(-0%, -50%) rotate(var(--a, 0deg)) scaleX(1.4); }
        }
      `}</style>
    </div>
  );
}

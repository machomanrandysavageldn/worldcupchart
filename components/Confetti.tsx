"use client";
import { useEffect, useState } from "react";

const COLORS = ["#E5006D", "#FFC83D", "#1A4FFF", "#0E7C3A", "#FF5A3C", "#7E3CFF", "#00B7E0", "#C8FF1C"];

export function Confetti({ trigger, count = 80 }: { trigger: number; count?: number }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; size: number; rot: number }[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const id = trigger;
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: id * 1000 + i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        rot: Math.random() * 360,
      }))
    );
    const t = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!pieces.length) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${1.6 + Math.random() * 1.6}s ${p.delay}s linear forwards`,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

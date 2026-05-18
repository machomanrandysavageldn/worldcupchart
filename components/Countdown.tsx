"use client";
import { useEffect, useState } from "react";
import { countdown } from "@/lib/format";

export function Countdown({ iso, label }: { iso: string; label?: string }) {
  const [c, setC] = useState(() => countdown(iso));
  useEffect(() => {
    const t = setInterval(() => setC(countdown(iso)), 1000);
    return () => clearInterval(t);
  }, [iso]);

  const cells = [
    { v: c.days, l: "days" },
    { v: c.hours, l: "hrs" },
    { v: c.minutes, l: "min" },
    { v: c.seconds, l: "sec" },
  ];

  return (
    <div className="flex flex-col items-start gap-2">
      {label && <span className="text-xs uppercase tracking-widest font-bold text-wc-gold">{label}</span>}
      <div className="flex gap-2">
        {cells.map((x) => (
          <div key={x.l} className="chunky-card px-3 py-2 min-w-[68px] text-center bg-wc-cream">
            <div className="font-display text-4xl leading-none text-wc-ink">{x.v.toString().padStart(2, "0")}</div>
            <div className="text-[11px] uppercase tracking-widest text-wc-ink font-bold mt-0.5">{x.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

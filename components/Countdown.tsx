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
      {label && <span className="text-xs uppercase tracking-widest font-bold text-wc-deep/70">{label}</span>}
      <div className="flex gap-2">
        {cells.map((x) => (
          <div key={x.l} className="chunky-card px-3 py-2 min-w-[64px] text-center bg-white">
            <div className="font-display text-3xl leading-none">{x.v.toString().padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-widest text-wc-deep/60 font-semibold">{x.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

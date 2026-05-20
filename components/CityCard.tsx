"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Venue } from "@/lib/venues";
import type { WikiSummary } from "@/lib/wiki";

export function CityCard({ venue, wiki }: { venue: Venue; wiki: WikiSummary | null }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const POPUP_EST = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    setPlacement(spaceBelow < POPUP_EST && rect.top > POPUP_EST ? "top" : "bottom");
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((x) => !x)}
        className="chunky-card p-3 text-white text-left w-full hover:translate-y-[-2px] transition flex items-center gap-3"
        style={{ backgroundColor: venue.color }}
        aria-expanded={open}
      >
        <div className="text-2xl shrink-0">{venue.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-tight truncate">{venue.city}</div>
          <div className="text-[11px] font-semibold opacity-95 truncate">{venue.stadium}</div>
        </div>
      </button>

      <AnimatePresence>
        {open && wiki && (
          <motion.div
            initial={{ opacity: 0, y: placement === "bottom" ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "bottom" ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 z-30 chunky-card bg-white text-wc-ink p-3 max-w-sm ${
              placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
            }`}
            style={{ boxShadow: "8px 8px 0 0 #0B132B" }}
          >
            {wiki.thumbnail?.source && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wiki.thumbnail.source}
                alt={`${venue.city}`}
                className="w-full h-32 object-cover rounded-md border-2 border-wc-ink"
              />
            )}
            <div className="font-display text-xl mt-2">{wiki.title}</div>
            <p className="text-sm mt-1 leading-snug">{trim(wiki.extract, 240)}</p>
            <a
              href={wiki.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-wc-magenta mt-2 inline-block hover:underline"
            >
              More on Wikipedia →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function trim(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

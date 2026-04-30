"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Venue } from "@/lib/venues";
import type { WikiSummary } from "@/lib/wiki";

export function CityCard({ venue, wiki }: { venue: Venue; wiki: WikiSummary | null }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((x) => !x)}
        className="chunky-card p-4 text-white text-left w-full hover:translate-y-[-3px] transition"
        style={{ backgroundColor: venue.color }}
        aria-expanded={open}
      >
        <div className="text-3xl">{venue.emoji}</div>
        <div className="font-display text-2xl leading-none mt-2">{venue.city}</div>
        <div className="text-xs uppercase tracking-widest font-bold mt-1 opacity-90">{venue.country}</div>
        <div className="text-sm mt-2 font-semibold opacity-95">{venue.stadium}</div>
        <div className="text-[10px] mt-2 opacity-80 uppercase tracking-widest">Hover for info →</div>
      </button>

      <AnimatePresence>
        {open && wiki && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-30 chunky-card bg-white text-wc-ink p-3 max-w-sm"
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

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENUES } from "@/lib/venues";
import type { WikiSummary } from "@/lib/wiki";
import { CANADA_PATH, USA_PATH, MEXICO_PATH } from "@/lib/north-america-paths";

// Per-city label tweaks: shorter labels where the full name overflows, and
// label position offsets where markers cluster (NE US, Mexico's two cities).
// Default position is "below" the football.
type LabelPos = "above" | "below" | "right" | "left";
const LABEL_OVERRIDES: Record<string, { short?: string; pos?: LabelPos }> = {
  "New York/New Jersey": { short: "NY/NJ", pos: "right" },
  "San Francisco Bay Area": { short: "SF Bay", pos: "left" },
  Philadelphia: { short: "Philly", pos: "below" },
  Boston: { pos: "right" },
  Toronto: { pos: "above" },
  Vancouver: { pos: "left" },
  Seattle: { pos: "left" },
  "Mexico City": { pos: "right" },
  Guadalajara: { pos: "left" },
};

// Stylized cartoon map of North America. Not geographically accurate to the
// inch — the country outlines are simplified hand-drawn polygons in the same
// chunky-card aesthetic as the rest of the site. The value is the spatial
// arrangement of the 16 host cities, not topographic precision.

const VIEW_W = 800;
const VIEW_H = 700;
const LNG_MIN = -130;
const LNG_MAX = -65;
const LAT_MIN = 14;
const LAT_MAX = 58;

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VIEW_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
  return { x, y };
}

// Country path data comes from lib/north-america-paths.ts — real outlines
// projected from Natural Earth 110m boundaries.

// Great Lakes — Natural Earth boundaries run straight through the lakes
// (international border lies in their middle), so without these overlays
// the lakes would render as solid land. Approximate positions and sizes.
const LAKES: { cx: number; cy: number; rx: number; ry: number }[] = [
  { cx: 510, cy: 245, rx: 28, ry: 8 }, // Lake Superior
  { cx: 545, cy: 270, rx: 8, ry: 18 }, // Lake Michigan
  { cx: 567, cy: 252, rx: 12, ry: 8 }, // Lake Huron
  { cx: 595, cy: 268, rx: 14, ry: 5 }, // Lake Erie
  { cx: 620, cy: 258, rx: 11, ry: 4 }, // Lake Ontario
];

export function HostCitiesMap({
  wikis,
}: {
  wikis: Record<string, WikiSummary | null>;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="chunky-card bg-white p-2 md:p-3 mb-8 relative overflow-visible">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 w-full h-full block"
          aria-label="Map of FIFA World Cup 2026 host cities across Canada, USA and Mexico"
        >
          {/* Ocean */}
          <rect width={VIEW_W} height={VIEW_H} fill="#D9EAF7" />

          {/* Countries — restrained map-style palette, each with its own
              fill so the eye reads three countries, thin border. */}
          <g stroke="#5C6B7A" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round" fillRule="evenodd">
            <path d={CANADA_PATH} fill="#E8E2CF" />
            <path d={USA_PATH} fill="#EFEAD8" />
            <path d={MEXICO_PATH} fill="#E8E2CF" />
          </g>

          {/* International borders — slightly darker line tracing the same
              shapes, no fill, to give the borders presence over neighbouring
              countries. */}
          <g stroke="#3F4A55" strokeWidth="1.2" fill="none" strokeLinejoin="round">
            <path d={CANADA_PATH} />
            <path d={USA_PATH} />
            <path d={MEXICO_PATH} />
          </g>

          {/* Great Lakes */}
          <g stroke="#5C6B7A" strokeWidth="0.6" fill="#D9EAF7">
            {LAKES.map((l, i) => (
              <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} />
            ))}
          </g>

          {/* Country labels — restrained, classic-map style */}
          <g
            fontFamily='"Inter", "Helvetica Neue", system-ui, sans-serif'
            textAnchor="middle"
            fill="#3F4A55"
            fontWeight="600"
            letterSpacing="6"
          >
            <text x="370" y="95" fontSize="20" opacity="0.55">CANADA</text>
            <text x="380" y="345" fontSize="22" opacity="0.55">UNITED STATES</text>
            <text x="280" y="540" fontSize="18" opacity="0.55">MEXICO</text>
          </g>
        </svg>

        {/* Markers — HTML overlay so tooltips can use rich content (image,
            text, link). Positioned in percent so they scale with the SVG. */}
        {VENUES.map((v) => {
          const { x, y } = project(v.lat, v.lng);
          const xPct = (x / VIEW_W) * 100;
          const yPct = (y / VIEW_H) * 100;
          const isActive = active === v.city;
          const wiki = wikis[v.city];
          // Pop the tooltip above the marker for cities in the southern half
          // (otherwise it can fall off the bottom of the map).
          const popAbove = yPct > 60;
          return (
            <div
              key={v.city}
              className="absolute"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setActive(v.city)}
              onMouseLeave={() => setActive(null)}
            >
              <button
                onClick={() => setActive(isActive ? null : v.city)}
                className="block relative group"
                aria-label={`${v.city} — ${v.stadium}`}
                aria-expanded={isActive}
              >
                <div
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-wc-ink flex items-center justify-center text-sm md:text-base shadow-sm hover:scale-125 transition cursor-pointer ${
                    isActive ? "scale-125 ring-2 ring-wc-gold" : ""
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <span aria-hidden>⚽</span>
                </div>
                <div
                  className={`absolute text-[10px] md:text-xs font-bold whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded border-2 border-wc-ink pointer-events-none ${
                    isActive ? "block" : "hidden md:block"
                  }`}
                  style={labelStyle(LABEL_OVERRIDES[v.city]?.pos ?? "below")}
                >
                  {LABEL_OVERRIDES[v.city]?.short ?? v.city}
                </div>
              </button>

              <AnimatePresence>
                {isActive && wiki && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute z-40 chunky-card bg-white text-wc-ink p-3 w-56 md:w-64 left-1/2 -translate-x-1/2 ${
                      popAbove ? "bottom-full mb-6" : "top-full mt-8"
                    }`}
                    style={{ boxShadow: "8px 8px 0 0 #0B132B" }}
                  >
                    {wiki.thumbnail?.source && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={wiki.thumbnail.source}
                        alt={v.city}
                        className="w-full h-24 object-cover rounded-md border-2 border-wc-ink"
                      />
                    )}
                    <div className="font-display text-lg mt-2 leading-tight">
                      {wiki.title}
                    </div>
                    <p className="text-xs mt-1 leading-snug">
                      {trim(wiki.extract, 180)}
                    </p>
                    <div
                      className="text-[10px] font-bold mt-2 uppercase tracking-widest"
                      style={{ color: v.color }}
                    >
                      {v.stadium}
                    </div>
                    <a
                      href={wiki.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-wc-magenta mt-1 inline-block hover:underline"
                    >
                      More on Wikipedia →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-wc-deep/60 mt-3 px-2">
        16 host cities across Canada, USA and Mexico — hover or tap a football
        for details. Outlines are stylized, not to scale.
      </p>
    </div>
  );
}

function trim(s: string | undefined, n: number) {
  if (!s) return "";
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

function labelStyle(pos: LabelPos): React.CSSProperties {
  switch (pos) {
    case "above":
      return { bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)" };
    case "right":
      return { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" };
    case "left":
      return { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" };
    case "below":
    default:
      return { top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)" };
  }
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENUES } from "@/lib/venues";
import type { WikiSummary } from "@/lib/wiki";

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

// Three country polygons. The USA top edge / Canada bottom edge are mirrored,
// and likewise USA bottom / Mexico top — so the borders overlap visually
// (which renders as a clean shared border under the same stroke).

const CANADA_PATH =
  "M 40,60 L 80,50 L 170,35 L 300,25 L 430,22 L 560,28 L 660,45 L 720,70 L 750,100 L 775,135 L 785,170 L 780,200 L 770,220 L 740,232 L 705,220 L 670,225 L 640,240 L 620,250 L 600,240 L 560,220 L 500,205 L 400,205 L 300,200 L 210,195 L 130,175 L 86,143 L 78,108 L 65,75 L 50,60 Z";

const USA_PATH =
  "M 86,143 L 130,175 L 210,195 L 300,200 L 400,205 L 500,205 L 560,220 L 600,240 L 620,250 L 640,240 L 670,225 L 705,220 L 740,232 L 740,265 L 725,295 L 720,335 L 710,370 L 690,405 L 665,440 L 640,468 L 622,492 L 628,515 L 630,540 L 625,562 L 620,568 L 615,548 L 605,528 L 595,510 L 580,498 L 555,485 L 520,478 L 480,475 L 445,478 L 425,505 L 390,478 L 355,455 L 320,440 L 270,425 L 220,412 L 200,405 L 141,381 L 92,323 L 74,265 L 74,191 L 86,143 Z";

const MEXICO_PATH =
  "M 200,405 L 220,412 L 270,425 L 320,440 L 355,455 L 390,478 L 425,505 L 440,498 L 455,510 L 465,535 L 475,548 L 488,545 L 495,530 L 488,515 L 465,525 L 445,548 L 430,575 L 415,608 L 395,625 L 365,628 L 335,620 L 305,602 L 275,580 L 245,555 L 220,520 L 200,478 L 185,440 L 195,418 L 200,405 Z";

// Great Lakes — five simplified ovals positioned roughly. Pure decoration
// that helps the map "read" as North America.
const LAKES: { cx: number; cy: number; rx: number; ry: number }[] = [
  { cx: 530, cy: 215, rx: 28, ry: 9 }, // Superior
  { cx: 565, cy: 225, rx: 12, ry: 7 }, // Michigan-ish top
  { cx: 565, cy: 235, rx: 9, ry: 12 }, // Michigan body
  { cx: 595, cy: 230, rx: 14, ry: 6 }, // Huron-Erie blob
  { cx: 625, cy: 235, rx: 9, ry: 4 }, // Ontario
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
          <rect width={VIEW_W} height={VIEW_H} fill="#CCE6F7" />

          {/* Countries — same family of greens to feel like one connected
              landmass, but each gets its own fill so the eye reads three
              countries. */}
          <g stroke="#0B132B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <path d={CANADA_PATH} fill="#9BD8B3" />
            <path d={USA_PATH} fill="#B5E2C4" />
            <path d={MEXICO_PATH} fill="#9BD8B3" />
          </g>

          {/* Great Lakes — pure decoration to anchor the visual */}
          <g stroke="#0B132B" strokeWidth="1.5" fill="#CCE6F7">
            {LAKES.map((l, i) => (
              <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} />
            ))}
          </g>

          {/* Country labels — large, faded so they don't compete with the markers */}
          <g
            fontFamily='"Bebas Neue", system-ui, sans-serif'
            textAnchor="middle"
            fill="#0B132B"
            fontWeight="700"
          >
            <text x="350" y="100" fontSize="42" opacity="0.35" letterSpacing="2">
              CANADA
            </text>
            <text x="380" y="340" fontSize="48" opacity="0.35" letterSpacing="2">
              USA
            </text>
            <text x="300" y="595" fontSize="36" opacity="0.35" letterSpacing="2">
              MEXICO
            </text>
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
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-wc-ink flex items-center justify-center text-base md:text-xl shadow-[3px_3px_0_0_#0B132B] hover:scale-110 hover:shadow-[4px_4px_0_0_#0B132B] transition cursor-pointer ${
                    isActive ? "scale-110 ring-4 ring-wc-gold" : ""
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

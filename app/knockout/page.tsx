import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { matchesByStage } from "@/lib/fixtures";
import { ukDate, ukTime } from "@/lib/format";
import { teamFlag, teamName } from "@/lib/teams";
import Link from "next/link";
import { Fragment } from "react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Knockout stages",
  description: "Full World Cup 2026 knockout bracket — Round of 32 through to the Final, with UK kickoff times and BBC/ITV viewing.",
  alternates: { canonical: "/knockout" },
};

const STAGES: { stage: any; title: string; color: string }[] = [
  { stage: "round-of-32", title: "Round of 32", color: "bg-wc-cyan" },
  { stage: "round-of-16", title: "Round of 16", color: "bg-wc-cobalt" },
  { stage: "quarter-final", title: "Quarter-finals", color: "bg-wc-purple" },
  { stage: "semi-final", title: "Semi-finals", color: "bg-wc-coral" },
  { stage: "final", title: "Final", color: "bg-wc-gold" },
];

export default async function KnockoutPage() {
  const stages = await Promise.all(
    STAGES.map(async (s) => ({ ...s, matches: await matchesByStage(s.stage) }))
  );
  const thirdPlace = await matchesByStage("third-place");

  return (
    <Section title="Knockout stages" kicker="Win or go home">
      <div className="overflow-x-auto">
        {/*
          Bracket layout. Each stage column uses justify-around so each match
          centers in its own equal vertical slice. Between columns we render a
          dedicated connector column that draws the ⊐-shaped bracket joining
          each pair of feeding matches to the next round's match.
        */}
        <div className="flex pb-4 min-w-max items-stretch" style={{ minHeight: "1600px" }}>
          {stages.map(({ stage, title, color, matches }, colIdx) => (
            <Fragment key={stage}>
              <div className="flex flex-col w-[220px] shrink-0">
                <div className={`chunky-card p-2 ${color} text-white text-center font-display text-xl mb-4`}>
                  {title}
                </div>
                <div className="flex-1 flex flex-col justify-around gap-3">
                  {matches.map((m) => <BracketCard key={m.id} m={m} />)}
                </div>
              </div>
              {colIdx < stages.length - 1 && stages[colIdx].matches.length >= 2 && (
                <BracketConnectorColumn pairCount={stages[colIdx].matches.length / 2} />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {thirdPlace.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-2xl mb-3">Third-place play-off</h3>
          <div className="grid md:grid-cols-2 gap-3 max-w-2xl">
            {thirdPlace.map((m) => <BracketCard key={m.id} m={m} />)}
          </div>
        </div>
      )}

      <p className="text-sm text-wc-cream/90 bg-wc-ink/80 inline-block px-3 py-1.5 rounded mt-6">
        The bracket fills in as the group stage finishes. Click any tie to open the match page.
      </p>
    </Section>
  );
}

// A connector column with one bracket per pair of feeding matches. The column
// mirrors the stage column's vertical structure (invisible header spacer +
// flex-1 area) so connectors line up with the match cards beside them.
function BracketConnectorColumn({ pairCount }: { pairCount: number }) {
  return (
    <div className="flex flex-col w-12 sm:w-16 shrink-0" aria-hidden>
      <div className="invisible chunky-card p-2 font-display text-xl mb-4">.</div>
      <div className="flex-1 relative">
        {Array.from({ length: pairCount }).map((_, i) => {
          const top = `${(i / pairCount) * 100}%`;
          const height = `${(1 / pairCount) * 100}%`;
          return (
            <div key={i} className="absolute left-0 right-0" style={{ top, height }}>
              {/* horizontal in from top match */}
              <div className="absolute left-0 w-1/2 h-[3px] bg-wc-ink" style={{ top: "25%" }} />
              {/* horizontal in from bottom match */}
              <div className="absolute left-0 w-1/2 h-[3px] bg-wc-ink" style={{ top: "75%" }} />
              {/* vertical joiner */}
              <div className="absolute w-[3px] bg-wc-ink" style={{ left: "calc(50% - 1.5px)", top: "25%", bottom: "25%" }} />
              {/* horizontal out to next match */}
              <div className="absolute h-[3px] bg-wc-ink" style={{ left: "50%", right: 0, top: "50%" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BracketCard({ m }: { m: any }) {
  return (
    <Link
      href={`/match/${m.id}`}
      className="relative block chunky-card p-3 bg-white hover:translate-y-[-2px] transition"
    >
      <div className="text-[10px] uppercase tracking-widest font-bold text-wc-deep/70">
        #{m.matchNumber} · {ukDate(m.kickoffUtc)} · {ukTime(m.kickoffUtc)}
      </div>
      <div className="font-bold mt-1 text-sm flex items-center gap-1">
        <span className="text-lg">{teamFlag(m.home.code)}</span>
        <span className="truncate">{m.home.code ? teamName(m.home.code) : (m.home.placeholder ?? "TBD")}</span>
      </div>
      <div className="text-xs text-wc-magenta font-display">vs</div>
      <div className="font-bold text-sm flex items-center gap-1">
        <span className="text-lg">{teamFlag(m.away.code)}</span>
        <span className="truncate">{m.away.code ? teamName(m.away.code) : (m.away.placeholder ?? "TBD")}</span>
      </div>
      <div className="text-[10px] mt-1 text-wc-deep/70">📍 {m.venue.city}</div>
    </Link>
  );
}

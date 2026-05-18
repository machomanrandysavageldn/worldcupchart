import { Section } from "@/components/Section";
import { matchesByStage } from "@/lib/fixtures";
import { ukDate, ukTime } from "@/lib/format";
import { teamFlag, teamName } from "@/lib/teams";
import Link from "next/link";

export const revalidate = 3600;

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
          Bracket layout. Each column is a flex-column that justifies its matches
          evenly across a shared height — so a Round-of-16 card lines up vertically
          between the two Round-of-32 cards that feed it. Each card draws a short
          horizontal connector to the right via ::after, and each column past the
          first draws an incoming connector via ::before, which together produce
          the bracket lines the requirements asked for.
        */}
        <div className="flex gap-8 pb-4 min-w-max items-stretch" style={{ minHeight: "1600px" }}>
          {stages.map(({ stage, title, color, matches }, colIdx) => (
            <div key={stage} className="flex flex-col w-[220px]">
              <div className={`chunky-card p-2 ${color} text-white text-center font-display text-xl mb-4`}>
                {title}
              </div>
              <div className="flex-1 flex flex-col justify-around gap-3">
                {matches.map((m) => (
                  <BracketCard key={m.id} m={m} isFirst={colIdx === 0} isLast={colIdx === stages.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {thirdPlace.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-2xl mb-3">Third-place play-off</h3>
          <div className="grid md:grid-cols-2 gap-3 max-w-2xl">
            {thirdPlace.map((m) => <BracketCard key={m.id} m={m} isFirst isLast />)}
          </div>
        </div>
      )}

      <p className="text-sm text-wc-cream/90 bg-wc-ink/80 inline-block px-3 py-1.5 rounded mt-6">
        The bracket fills in as the group stage finishes. Click any tie to open the match page.
      </p>
    </Section>
  );
}

function BracketCard({ m, isFirst, isLast }: { m: any; isFirst: boolean; isLast: boolean }) {
  return (
    <Link
      href={`/match/${m.id}`}
      className={`bracket-card relative block chunky-card p-3 bg-white hover:translate-y-[-2px] transition ${
        isFirst ? "bracket-first" : ""
      } ${isLast ? "bracket-last" : ""}`}
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

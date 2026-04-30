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
  { stage: "third-place", title: "Third-place play-off", color: "bg-wc-mint" },
  { stage: "final", title: "Final", color: "bg-wc-gold" },
];

export default async function KnockoutPage() {
  const stages = await Promise.all(
    STAGES.map(async (s) => ({ ...s, matches: await matchesByStage(s.stage) }))
  );

  return (
    <Section title="Knockout bracket" kicker="32 matches · win or go home">
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[260px] gap-4 pb-4 min-w-max">
          {stages.map(({ stage, title, color, matches }) => (
            <div key={stage}>
              <div className={`chunky-card p-2 ${color} text-white text-center font-display text-xl mb-3`}>{title}</div>
              <div className="space-y-3">
                {matches.map((m) => (
                  <Link key={m.id} href={`/match/${m.id}`} className="block chunky-card p-3 bg-white hover:translate-y-[-2px] transition">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-wc-deep/60">
                      #{m.matchNumber} · {ukDate(m.kickoffUtc)} · {ukTime(m.kickoffUtc)}
                    </div>
                    <div className="font-bold mt-1 text-sm flex items-center gap-1">
                      <span className="text-lg">{teamFlag(m.home.code)}</span>
                      {m.home.code ? teamName(m.home.code) : (m.home.placeholder ?? "TBD")}
                    </div>
                    <div className="text-xs text-wc-magenta font-display">vs</div>
                    <div className="font-bold text-sm flex items-center gap-1">
                      <span className="text-lg">{teamFlag(m.away.code)}</span>
                      {m.away.code ? teamName(m.away.code) : (m.away.placeholder ?? "TBD")}
                    </div>
                    <div className="text-[10px] mt-1 text-wc-deep/60">📍 {m.venue.city}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-wc-deep/70 mt-4">
        The bracket fills in as the group stage finishes. Click any tie to open the match page.
      </p>
    </Section>
  );
}

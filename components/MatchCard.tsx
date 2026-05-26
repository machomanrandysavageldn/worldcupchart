import Link from "next/link";
import type { Match } from "@/lib/types";
import { teamFlag, teamName } from "@/lib/teams";
import { BroadcasterBadge } from "./BroadcasterBadge";
import { LocalDate, LocalTime } from "./LocalTime";

export function MatchCard({ m, compact = false }: { m: Match; compact?: boolean }) {
  const homeName = m.home.code ? teamName(m.home.code) : m.home.placeholder ?? "TBD";
  const awayName = m.away.code ? teamName(m.away.code) : m.away.placeholder ?? "TBD";

  return (
    <Link href={`/match/${m.id}`} className="block group">
      <div className="chunky-card p-4 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#0B132B] transition">
        <div className="flex items-center justify-between text-xs font-semibold text-wc-deep/70 mb-2">
          <span className="uppercase tracking-widest">
            {m.stage === "group" ? `Group ${m.group}` : labelForStage(m.stage)} · #{m.matchNumber}
          </span>
          <span><LocalDate iso={m.kickoffUtc} /> · <LocalTime iso={m.kickoffUtc} /></span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <TeamSide flag={teamFlag(m.home.code)} name={homeName} score={m.home.score} align="right" />
          <span className="font-display text-2xl text-wc-magenta">vs</span>
          <TeamSide flag={teamFlag(m.away.code)} name={awayName} score={m.away.score} align="left" />
        </div>
        {!compact && (
          <div className="mt-3 flex items-center justify-between text-xs text-wc-deep/70">
            <span>📍 {m.venue.city} · {m.venue.stadium}</span>
            <span className="flex gap-1">
              {m.uk?.broadcaster.map((b) => <BroadcasterBadge key={b} broadcaster={b} />)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function TeamSide({ flag, name, score, align }: { flag: string; name: string; score?: number; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {align === "left" && <span className="text-2xl">{flag}</span>}
      <span className="font-bold text-sm md:text-base truncate">{name}</span>
      {typeof score === "number" && <span className="font-display text-xl">{score}</span>}
      {align === "right" && <span className="text-2xl">{flag}</span>}
    </div>
  );
}

function labelForStage(s: Match["stage"]) {
  return {
    "round-of-32": "Round of 32",
    "round-of-16": "Round of 16",
    "quarter-final": "Quarter Final",
    "semi-final": "Semi Final",
    "third-place": "3rd Place",
    "final": "Final",
    "group": "Group",
  }[s];
}

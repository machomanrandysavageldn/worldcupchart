"use client";
import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import { GROUP_LIST } from "@/lib/groups";
import { MatchCard } from "@/components/MatchCard";
import { TEAMS } from "@/lib/teams";

const STAGES = [
  { v: "all", l: "All" },
  { v: "group", l: "Group" },
  { v: "round-of-32", l: "R32" },
  { v: "round-of-16", l: "R16" },
  { v: "quarter-final", l: "QF" },
  { v: "semi-final", l: "SF" },
  { v: "third-place", l: "3rd" },
  { v: "final", l: "Final" },
];

export function FixturesFilter({ matches }: { matches: Match[] }) {
  const [stage, setStage] = useState<string>("all");
  const [group, setGroup] = useState<string>("all");
  const [team, setTeam] = useState<string>("all");
  const [bcast, setBcast] = useState<string>("all");

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "all" && m.stage !== stage) return false;
      if (group !== "all" && m.group !== group) return false;
      if (team !== "all" && m.home.code !== team && m.away.code !== team) return false;
      if (bcast !== "all" && !m.uk?.broadcaster.includes(bcast as any)) return false;
      return true;
    });
  }, [matches, stage, group, team, bcast]);

  const grouped = useMemo(() => {
    const map: Record<string, Match[]> = {};
    for (const m of filtered) {
      const k = m.kickoffUtc.slice(0, 10);
      (map[k] ||= []).push(m);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <>
      <div className="chunky-card p-4 bg-white mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Filter label="Stage" value={stage} onChange={setStage} options={STAGES.map((s) => ({ v: s.v, l: s.l }))} />
        <Filter label="Group" value={group} onChange={setGroup} options={[{ v: "all", l: "All" }, ...GROUP_LIST.map((g) => ({ v: g, l: `Group ${g}` }))]} />
        <Filter
          label="Team"
          value={team}
          onChange={setTeam}
          options={[{ v: "all", l: "All teams" }, ...TEAMS.filter((t) => t.qualified).map((t) => ({ v: t.code, l: `${t.flag} ${t.name}` }))]}
        />
        <Filter label="UK TV" value={bcast} onChange={setBcast} options={[
          { v: "all", l: "All" },
          { v: "BBC", l: "BBC" },
          { v: "ITV", l: "ITV" },
          { v: "TBC", l: "TBC" },
        ]} />
      </div>

      <div className="space-y-8">
        {grouped.map(([day, ms]) => (
          <div key={day}>
            <div className="font-display text-2xl text-wc-deep mb-3">
              {new Date(day).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ms.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </div>
        ))}
        {!filtered.length && <div className="chunky-card p-6 bg-white">No matches match those filters.</div>}
      </div>
    </>
  );
}

function Filter({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="flex flex-col text-xs font-bold uppercase tracking-widest text-wc-deep/70">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 chunky-btn bg-wc-cream px-3 py-2 text-sm font-semibold text-wc-ink">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}

import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { TEAM_BY_CODE, TEAMS } from "@/lib/teams";
import { matchesForTeam } from "@/lib/fixtures";
import { MatchCard } from "@/components/MatchCard";
import { GROUPS } from "@/lib/groups";
import Link from "next/link";

export const revalidate = 3600;

export function generateStaticParams() {
  return TEAMS.filter((t) => t.qualified).map((t) => ({ code: t.code }));
}

export default async function TeamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const team = TEAM_BY_CODE[code.toUpperCase()];
  if (!team) return notFound();
  const matches = await matchesForTeam(team.code);
  const group = Object.entries(GROUPS).find(([, codes]) => codes.includes(team.code))?.[0];

  return (
    <Section title={team.name} kicker={`Team profile · ${matches.length} matches`}>
      <div className="chunky-card p-6 bg-white mb-6 flex items-center gap-6">
        <div className="text-7xl">{team.flag}</div>
        <div>
          <div className="font-display text-4xl">{team.name}</div>
          {group && (
            <Link href={`/groups/${group}`} className="text-wc-magenta font-bold hover:underline">
              Group {group}
            </Link>
          )}
        </div>
      </div>

      <h3 className="font-display text-2xl mb-3">Fixtures</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => <MatchCard key={m.id} m={m} />)}
      </div>
    </Section>
  );
}

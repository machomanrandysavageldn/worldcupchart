import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { GROUPS, GROUP_COLORS, GROUP_LIST } from "@/lib/groups";
import { matchesForGroup } from "@/lib/fixtures";
import { teamFlag, teamName } from "@/lib/teams";
import { MatchCard } from "@/components/MatchCard";
import Link from "next/link";

export const revalidate = 3600;

export function generateStaticParams() {
  return GROUP_LIST.map((code) => ({ code }));
}

export default async function GroupPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const teams = GROUPS[upper];
  if (!teams) return notFound();
  const matches = await matchesForGroup(upper);

  return (
    <Section title={`Group ${upper}`} kicker={`${teams.length} teams · ${matches.length} matches`}>
      <div className={`chunky-card p-6 mb-6 ${GROUP_COLORS[upper]} text-white`}>
        <div className="font-display text-5xl">Group {upper}</div>
        <div className="opacity-90 mt-1">Tap a team to see their fixtures.</div>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-6">
        <div>
          <h3 className="font-display text-2xl mb-3">Standings</h3>
          <div className="chunky-card overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-wc-ink text-wc-cream font-display">
                <tr>
                  <th className="text-left px-3 py-2">Team</th>
                  <th className="px-2">P</th><th className="px-2">W</th><th className="px-2">D</th>
                  <th className="px-2">L</th><th className="px-2">GD</th><th className="px-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t} className="border-t-2 border-wc-ink/10">
                    <td className="px-3 py-2 font-bold">
                      <Link href={`/teams/${t}`} className="flex items-center gap-2 hover:underline">
                        <span className="text-xl">{teamFlag(t)}</span>{teamName(t)}
                      </Link>
                    </td>
                    <td className="text-center">0</td>
                    <td className="text-center">0</td>
                    <td className="text-center">0</td>
                    <td className="text-center">0</td>
                    <td className="text-center">0</td>
                    <td className="text-center font-display">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-wc-deep/60 mt-2">Standings update during the tournament once matches are played.</p>
        </div>

        <div>
          <h3 className="font-display text-2xl mb-3">Matches</h3>
          <div className="space-y-3">
            {matches.map((m) => <MatchCard key={m.id} m={m} compact />)}
          </div>
        </div>
      </div>
    </Section>
  );
}

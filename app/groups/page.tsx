import Link from "next/link";
import { Section } from "@/components/Section";
import { GROUPS, GROUP_LIST, GROUP_COLORS } from "@/lib/groups";
import { teamFlag, teamName } from "@/lib/teams";

export default function GroupsIndex() {
  return (
    <Section title="Group stage" kicker="12 groups · 4 teams each">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GROUP_LIST.map((g) => (
          <Link key={g} href={`/groups/${g}`} className="chunky-card p-5 bg-white hover:translate-y-[-3px] transition">
            <div className={`inline-flex font-display text-3xl px-3 py-0.5 rounded ${GROUP_COLORS[g]} text-white`}>Group {g}</div>
            <ul className="mt-4 space-y-2">
              {GROUPS[g].map((code) => (
                <li key={code} className="flex items-center gap-3">
                  <span className="text-2xl">{teamFlag(code)}</span>
                  <span className="font-bold">{teamName(code)}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </Section>
  );
}

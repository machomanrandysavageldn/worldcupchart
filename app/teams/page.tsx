import Link from "next/link";
import { Section } from "@/components/Section";
import { TEAMS } from "@/lib/teams";

export default function TeamsIndex() {
  const qualified = TEAMS.filter((t) => t.qualified).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Section title="Teams" kicker={`${qualified.length} confirmed teams`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {qualified.map((t) => (
          <Link key={t.code} href={`/teams/${t.code}`} className="chunky-card bg-white p-3 hover:bg-wc-cream transition text-center">
            <div className="text-4xl">{t.flag}</div>
            <div className="font-bold mt-1 text-sm truncate">{t.name}</div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

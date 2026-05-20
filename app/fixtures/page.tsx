import type { Metadata } from "next";
import { getAllMatches } from "@/lib/fixtures";
import { Section } from "@/components/Section";
import { FixturesFilter } from "./FixturesFilter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fixtures",
  description: "All 104 FIFA World Cup 2026 matches in UK time, with BBC and ITV viewing badges.",
  alternates: { canonical: "/fixtures" },
  openGraph: { title: "World Cup 2026 fixtures (UK time)", description: "Every match in UK time with BBC/ITV badges." },
};

export default async function FixturesPage() {
  const matches = await getAllMatches();
  return (
    <Section title="Fixtures" kicker={`${matches.length} matches · UK times`}>
      <FixturesFilter matches={matches} />
    </Section>
  );
}

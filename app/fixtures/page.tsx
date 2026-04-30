import { getAllMatches } from "@/lib/fixtures";
import { Section } from "@/components/Section";
import { FixturesFilter } from "./FixturesFilter";

export const revalidate = 3600;

export default async function FixturesPage() {
  const matches = await getAllMatches();
  return (
    <Section title="Fixtures" kicker={`${matches.length} matches · UK times`}>
      <FixturesFilter matches={matches} />
    </Section>
  );
}

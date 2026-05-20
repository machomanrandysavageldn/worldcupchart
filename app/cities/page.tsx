import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { VENUES } from "@/lib/venues";
import { getWikiSummary } from "@/lib/wiki";
import { CityCard } from "@/components/CityCard";
import { HostCitiesMap } from "@/components/HostCitiesMap";

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: "Host cities",
  description: "The 16 host cities of the 2026 FIFA World Cup across Canada, Mexico and the United States — with Wikipedia summaries for each.",
  alternates: { canonical: "/cities" },
};

export default async function CitiesPage() {
  const wikis = await Promise.all(VENUES.map((v) => getWikiSummary(v.wiki)));
  const wikiByCity: Record<string, (typeof wikis)[number]> = Object.fromEntries(
    VENUES.map((v, i) => [v.city, wikis[i]])
  );

  return (
    <Section title="Host cities" kicker="3 countries · 16 venues · hover a football">
      <HostCitiesMap wikis={wikiByCity} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VENUES.map((v, i) => (
          <CityCard key={v.city} venue={v} wiki={wikis[i]} />
        ))}
      </div>
      <p className="text-xs text-wc-deep/60 mt-4">City info from Wikipedia, refreshed daily.</p>
    </Section>
  );
}

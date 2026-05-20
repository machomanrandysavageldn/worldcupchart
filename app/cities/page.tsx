import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { VENUES } from "@/lib/venues";
import { getWikiSummary } from "@/lib/wiki";
import { CityCard } from "@/components/CityCard";

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: "Host cities",
  description: "The 16 host cities of the 2026 FIFA World Cup across Canada, Mexico and the United States — with Wikipedia summaries for each.",
  alternates: { canonical: "/cities" },
};

export default async function CitiesPage() {
  const wikis = await Promise.all(VENUES.map((v) => getWikiSummary(v.wiki)));

  return (
    <Section title="Host cities" kicker="3 countries · 16 venues · hover for info">
      {/* Header image kept moderate — ~max-w-4xl, centred. */}
      <div className="chunky-card p-2 bg-white mb-8 max-w-4xl mx-auto">
        <Image src="/fifa/host-cities-grid.jpg" alt="Host city logos" width={1600} height={800} className="rounded-md w-full" />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VENUES.map((v, i) => (
          <CityCard key={v.city} venue={v} wiki={wikis[i]} />
        ))}
      </div>
      <p className="text-xs text-wc-deep/60 mt-4">City info from Wikipedia, refreshed daily.</p>
    </Section>
  );
}

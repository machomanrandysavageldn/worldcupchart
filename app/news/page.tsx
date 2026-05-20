import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { getNews } from "@/lib/news";
import { formatDistanceToNow } from "date-fns";
import type { NewsItem } from "@/lib/types";

export const revalidate = 1800; // 30 mins

export const metadata: Metadata = {
  title: "News",
  description: "Latest FIFA World Cup 2026 news, aggregated from BBC Sport, Sky Sports, the Guardian and FIFA. Refreshed every 30 minutes.",
  alternates: { canonical: "/news" },
};

function safeAgo(d: string) {
  const t = new Date(d);
  if (isNaN(+t)) return "";
  try { return formatDistanceToNow(t, { addSuffix: true }); } catch { return ""; }
}

const SOURCE_COLOR: Record<string, string> = {
  "BBC Sport": "bg-wc-magenta",
  "Sky Sports": "bg-wc-cobalt",
  "Guardian Football": "bg-wc-coral",
  FIFA: "bg-wc-purple",
};

function sourceColor(s: string) {
  return SOURCE_COLOR[s] ?? "bg-wc-deep";
}

export default async function NewsPage() {
  const news = await getNews(40);

  if (news.length === 0) {
    return (
      <Section title="News" kicker="UK and global · refreshed every 30 mins">
        <div className="chunky-card p-6 bg-white">
          <p className="font-bold">News feed is currently empty.</p>
          <p className="text-sm text-wc-deep/70 mt-1">
            Sources include BBC Sport, Sky Sports, Guardian Football and FIFA. Check back shortly.
          </p>
        </div>
      </Section>
    );
  }

  const [hero, second, third, ...rest] = news;
  const featured = [second, third].filter(Boolean) as NewsItem[];

  return (
    <Section title="News" kicker="UK and global · refreshed every 30 mins">
      {/* Hero featured story */}
      <a
        href={hero.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block chunky-card overflow-hidden bg-wc-ink text-white mb-6 hover:translate-y-[-3px] transition"
      >
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[320px] bg-wc-deep">
            {hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-7xl">⚽</div>
            )}
            <span className={`absolute top-3 left-3 ${sourceColor(hero.source)} text-white text-[10px] tracking-widest font-bold uppercase px-2 py-1 rounded`}>
              {hero.source}
            </span>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em] font-bold text-wc-gold">Top story</div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mt-2">{hero.title}</h2>
            {hero.summary && <p className="text-wc-cream/90 mt-3 text-sm leading-snug">{hero.summary}</p>}
            <div className="mt-4 text-sm font-bold text-wc-gold">Read on {hero.source} →</div>
            <div className="text-xs text-wc-cream/60 mt-1">{safeAgo(hero.pubDate)}</div>
          </div>
        </div>
      </a>

      {/* Two-up featured row */}
      {featured.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {featured.map((n) => (
            <FeatureCard key={n.id} n={n} />
          ))}
        </div>
      )}

      {/* Tiled rest */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((n) => <TileCard key={n.id} n={n} />)}
      </div>
    </Section>
  );

}

function FeatureCard({ n }: { n: NewsItem }) {
  return (
    <a
      href={n.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block chunky-card overflow-hidden bg-white hover:translate-y-[-3px] transition"
    >
      {n.image ? (
        <div className="relative aspect-[16/9] bg-wc-deep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={n.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <span className={`absolute top-3 left-3 ${sourceColor(n.source)} text-white text-[10px] tracking-widest font-bold uppercase px-2 py-1 rounded`}>
            {n.source}
          </span>
        </div>
      ) : (
        <div className={`px-3 py-1.5 text-[10px] tracking-widest font-bold uppercase text-white ${sourceColor(n.source)}`}>
          {n.source}
        </div>
      )}
      <div className="p-4">
        <div className="font-display text-2xl leading-tight">{n.title}</div>
        {n.summary && <p className="mt-2 text-sm text-wc-deep/80">{n.summary}</p>}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-bold text-wc-magenta">Read on {n.source} →</span>
          <span className="text-wc-deep/60">{safeAgo(n.pubDate)}</span>
        </div>
      </div>
    </a>
  );
}

function TileCard({ n }: { n: NewsItem }) {
  return (
    <a
      href={n.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block chunky-card overflow-hidden bg-white hover:translate-y-[-3px] transition"
    >
      <div className={`px-3 py-1.5 text-[10px] tracking-widest font-bold uppercase text-white ${sourceColor(n.source)} flex items-center justify-between`}>
        <span>{n.source}</span>
        <span className="opacity-80 font-semibold normal-case tracking-normal">{safeAgo(n.pubDate)}</span>
      </div>
      {n.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.image} alt="" className="w-full aspect-[16/9] object-cover" />
      )}
      <div className="p-3">
        <div className="font-display text-lg leading-tight">{n.title}</div>
        {n.summary && <p className="mt-1 text-xs text-wc-deep/70 line-clamp-3">{n.summary}</p>}
      </div>
    </a>
  );
}

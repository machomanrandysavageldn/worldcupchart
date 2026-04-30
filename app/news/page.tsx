import { Section } from "@/components/Section";
import { getNews } from "@/lib/news";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 1800; // 30 mins

function safeAgo(d: string) {
  const t = new Date(d);
  if (isNaN(+t)) return "";
  try { return formatDistanceToNow(t, { addSuffix: true }); } catch { return ""; }
}

export default async function NewsPage() {
  const news = await getNews(40);
  return (
    <Section title="News" kicker="UK and global · refreshed every 30 mins">
      {news.length === 0 ? (
        <div className="chunky-card p-6 bg-white">
          <p className="font-bold">News feed is currently empty.</p>
          <p className="text-sm text-wc-deep/70 mt-1">
            Sources include BBC Sport, Sky Sports, Guardian Football and FIFA. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {news.map((n) => (
            <a key={n.id} href={n.link} target="_blank" rel="noopener noreferrer"
               className="chunky-card p-4 bg-white hover:translate-y-[-3px] transition block">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold text-wc-magenta">
                <span>{n.source}</span>
                <span className="text-wc-deep/60">{safeAgo(n.pubDate)}</span>
              </div>
              <div className="font-display text-xl mt-2 leading-tight">{n.title}</div>
              {n.summary && <p className="mt-2 text-sm text-wc-deep/80">{n.summary}</p>}
              <div className="mt-2 text-sm font-bold">Read on {n.source} →</div>
            </a>
          ))}
        </div>
      )}
    </Section>
  );
}

import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "./types";

const FEEDS = [
  { source: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { source: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
  { source: "Guardian Football", url: "https://www.theguardian.com/football/rss" },
  { source: "FIFA", url: "https://www.fifa.com/rss-feeds/news" },
];

const KEYWORDS = [
  "world cup", "world cup 26", "fifa", "qualifying", "qualifier",
  "england", "wales", "scotland", "n. ireland", "ireland",
  "argentina", "france", "brazil", "portugal", "spain", "germany",
  "messi", "mbappé", "mbappe", "ronaldo", "bellingham", "kane", "haaland",
  "tournament", "draw", "group stage",
];

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

async function fetchFeed(source: string, url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "WorldCupTrackerFamily/1.0 (personal use)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items =
      parsed?.rss?.channel?.item ??
      parsed?.feed?.entry ??
      [];
    const arr = Array.isArray(items) ? items : [items];
    return arr.map((it: any, i: number): NewsItem => ({
      id: `${source}-${it.guid?.["#text"] ?? it.guid ?? it.link ?? i}`,
      title: typeof it.title === "string" ? it.title : it.title?.["#text"] ?? "",
      link: typeof it.link === "string" ? it.link : it.link?.["@_href"] ?? it.link?.["#text"] ?? "",
      source,
      pubDate: it.pubDate ?? it.published ?? it.updated ?? new Date().toISOString(),
      summary: typeof it.description === "string" ? stripHtml(it.description) : it.summary ?? "",
      image: extractImage(it),
    }));
  } catch {
    return [];
  }
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 240);
}

function extractImage(it: any): string | undefined {
  // RSS feeds expose images in many shapes; check the common ones.
  const mediaThumb = it["media:thumbnail"];
  if (mediaThumb) {
    if (Array.isArray(mediaThumb)) return mediaThumb[0]?.["@_url"];
    return mediaThumb["@_url"];
  }
  const mediaContent = it["media:content"];
  if (mediaContent) {
    if (Array.isArray(mediaContent)) return mediaContent[0]?.["@_url"];
    return mediaContent["@_url"];
  }
  const enclosure = it.enclosure;
  if (enclosure?.["@_url"] && /image/.test(enclosure?.["@_type"] ?? "")) return enclosure["@_url"];
  // Last resort: scrape the first <img src> from description HTML.
  const desc = typeof it.description === "string" ? it.description : "";
  const m = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
}

function isRelevant(item: NewsItem) {
  const hay = `${item.title} ${item.summary ?? ""}`.toLowerCase();
  return KEYWORDS.some((k) => hay.includes(k));
}

export async function getNews(limit = 30): Promise<NewsItem[]> {
  const all = (await Promise.all(FEEDS.map((f) => fetchFeed(f.source, f.url)))).flat();
  const filtered = all.filter(isRelevant);
  const seen = new Set<string>();
  const deduped = filtered.filter((it) => {
    const k = it.title.toLowerCase().slice(0, 80);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  deduped.sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));
  return deduped.slice(0, limit);
}

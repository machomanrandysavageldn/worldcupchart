export interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  url: string;
}

export async function getWikiSummary(title: string): Promise<WikiSummary | null> {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        next: { revalidate: 86400 },
        headers: { "User-Agent": "WorldCupTrackerFamily/1.0 (personal)" },
      }
    );
    if (!r.ok) return null;
    const j = await r.json();
    return {
      title: j.title,
      extract: j.extract ?? "",
      thumbnail: j.thumbnail,
      url: j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
    };
  } catch {
    return null;
  }
}

// Fetch player metadata (thumbnail + summary) from Wikipedia's REST summary
// endpoint. Wikipedia images are stable, freely licensed and don't need to be
// re-hosted — which matches the brief's "hot-link, don't download" requirement
// and avoids burdening official federation servers (whose pages often block
// hot-linking anyway).

export type PlayerInfo = {
  name: string;
  thumbnail?: string;
  extract?: string;
  url?: string;
};

const ENDPOINT = "https://en.wikipedia.org/api/rest_v1/page/summary/";

export async function getPlayerInfo(name: string, wikiTitle?: string): Promise<PlayerInfo> {
  const title = (wikiTitle ?? name).replace(/ /g, "_");
  try {
    const res = await fetch(ENDPOINT + encodeURIComponent(title), {
      next: { revalidate: 86400 }, // refresh daily
      headers: { "User-Agent": "WorldCupTrackerFamily/1.0 (personal use)" },
    });
    if (!res.ok) return { name };
    const data = await res.json();
    return {
      name,
      thumbnail: data?.thumbnail?.source,
      extract: data?.extract,
      url: data?.content_urls?.desktop?.page,
    };
  } catch {
    return { name };
  }
}

export async function getPlayersInfo(figures: { name: string; wiki?: string }[]): Promise<PlayerInfo[]> {
  return Promise.all(figures.map((f) => getPlayerInfo(f.name, f.wiki)));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

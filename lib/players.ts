// Fetch player metadata (thumbnail + summary) from Wikipedia.
//
// Two-stage lookup: try the direct REST summary endpoint first (cheap, one
// request, accurate when we hand-curate a wiki title). If that misses a
// thumbnail, fall back to Wikipedia's search API with the player's name plus
// "footballer" — this catches players whose default article title clashes with
// other notable people (footballer (born YYYY) disambiguators, etc.). All
// results are cached daily so this stays well within Wikipedia's etiquette.

export type PlayerInfo = {
  name: string;
  thumbnail?: string;
  extract?: string;
  url?: string;
};

const SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const SEARCH = "https://en.wikipedia.org/w/api.php";
const UA = "WorldCupWatch/1.0 (personal use)";

async function fetchSummary(title: string): Promise<PlayerInfo | null> {
  try {
    const res = await fetch(SUMMARY + encodeURIComponent(title.replace(/ /g, "_")), {
      next: { revalidate: 86400 },
      headers: { "User-Agent": UA },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.type === "disambiguation") return null;
    return {
      name: title,
      thumbnail: data?.thumbnail?.source,
      extract: data?.extract,
      url: data?.content_urls?.desktop?.page,
    };
  } catch {
    return null;
  }
}

async function searchTitle(query: string): Promise<string | null> {
  const url = `${SEARCH}?action=query&list=search&format=json&srlimit=1&origin=*&srsearch=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": UA },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.query?.search?.[0]?.title ?? null;
  } catch {
    return null;
  }
}

export async function getPlayerInfo(name: string, wikiTitle?: string): Promise<PlayerInfo> {
  // 1) Direct lookup using curated title or raw name.
  const first = await fetchSummary(wikiTitle ?? name);
  if (first?.thumbnail) return { ...first, name };

  // 2) Search Wikipedia with "footballer" hint to disambiguate.
  const found = await searchTitle(`${name} footballer`);
  if (found && found !== (wikiTitle ?? name)) {
    const second = await fetchSummary(found);
    if (second?.thumbnail || (second?.url && !first?.url)) {
      return { ...second, name };
    }
  }

  // 3) Last resort: whatever the direct lookup gave (URL but no thumb),
  //    or just the name with a Wikipedia search link so the click still
  //    goes somewhere useful instead of nowhere.
  if (first) return { ...first, name };
  return {
    name,
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`,
  };
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

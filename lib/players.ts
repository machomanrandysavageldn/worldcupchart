// Fetch player metadata (thumbnail + summary) from Wikipedia.
//
// Multi-stage resolver designed to maximise hit-rate for footballer headshots:
//
//   1. Curated `wiki` title via REST summary (cheap, accurate when hand-set).
//   2. Raw name via REST summary (skip if it's a disambiguation page).
//   3. Search generator with `pageimages` — pass "<name> footballer <country>";
//      walk results in relevance order and return the first one that has a
//      thumbnail. This catches the vast majority of squad players whose
//      canonical article title is "Foo (footballer, born 1996)" or similar.
//   4. Looser fallback: same search but country-only as a hint
//      ("<name> footballer"). Helps for names where a country-qualified
//      search returns the national team article instead of the player.
//   5. Last resort: link to a Wikipedia search page so the card still goes
//      somewhere useful.
//
// All requests cached for 24 hours.
//
// Wikipedia user-agent etiquette: identify ourselves and provide a contact URL.

export type PlayerInfo = {
  name: string;
  thumbnail?: string;
  extract?: string;
  url?: string;
};

const SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const API = "https://en.wikipedia.org/w/api.php";
const UA = "WorldCupWatch/1.0 (https://worldcupchart.vercel.app; personal use)";

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

type SearchHit = { title: string; thumbnail?: string; url?: string; index: number };

async function searchPageImages(query: string): Promise<SearchHit[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrlimit: "5",
    gsrsearch: query,
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "240",
    inprop: "url",
    format: "json",
    origin: "*",
  });
  try {
    const res = await fetch(`${API}?${params.toString()}`, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": UA },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    const hits: SearchHit[] = Object.values<any>(pages).map((p) => ({
      title: p.title as string,
      thumbnail: p?.thumbnail?.source,
      url: p?.fullurl ?? p?.canonicalurl,
      index: typeof p?.index === "number" ? p.index : 999,
    }));
    return hits.sort((a, b) => a.index - b.index);
  } catch {
    return [];
  }
}

// Heuristic: ignore obvious non-player articles that the search sometimes
// returns alongside the player (national team article, club article, etc.).
function isLikelyPlayerHit(title: string): boolean {
  const t = title.toLowerCase();
  if (t.includes("national football team")) return false;
  if (t.includes("national team")) return false;
  if (/\bfootball club\b/.test(t)) return false;
  if (/\bsquad\b/.test(t)) return false;
  return true;
}

export async function getPlayerInfo(
  name: string,
  wikiTitle?: string,
  country?: string
): Promise<PlayerInfo> {
  // 1) Curated wiki title (if provided) → direct REST summary.
  if (wikiTitle) {
    const curated = await fetchSummary(wikiTitle);
    if (curated?.thumbnail) return { ...curated, name };
  }

  // 2) Raw name → REST summary.
  const direct = await fetchSummary(name);
  if (direct?.thumbnail) return { ...direct, name };

  // 3) Search with pageimages — strongest fallback. Country-qualified.
  const countryQ = country ? ` ${country}` : "";
  const hitsA = await searchPageImages(`${name} footballer${countryQ}`);
  const fromA = hitsA.find((h) => isLikelyPlayerHit(h.title) && h.thumbnail);
  if (fromA) return { name, thumbnail: fromA.thumbnail, url: fromA.url };

  // 4) Search without country (some names get crowded out by team articles).
  if (country) {
    const hitsB = await searchPageImages(`${name} footballer`);
    const fromB = hitsB.find((h) => isLikelyPlayerHit(h.title) && h.thumbnail);
    if (fromB) return { name, thumbnail: fromB.thumbnail, url: fromB.url };
  }

  // 5) No photo found — return the best URL we can so the card still links
  //    somewhere. Prefer the direct summary URL, then the first search hit's
  //    URL, then a Wikipedia search page.
  const fallbackUrl =
    direct?.url ??
    hitsA.find((h) => isLikelyPlayerHit(h.title))?.url ??
    `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name + " footballer")}`;
  return { name, url: fallbackUrl };
}

export async function getPlayersInfo(
  figures: { name: string; wiki?: string }[],
  country?: string
): Promise<PlayerInfo[]> {
  return Promise.all(figures.map((f) => getPlayerInfo(f.name, f.wiki, country)));
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

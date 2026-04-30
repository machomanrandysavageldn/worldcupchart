import type { Match, MatchStage, MatchStatus } from "./types";
import { VENUES } from "./venues";
import { GROUPS } from "./groups";

const API_BASE = "https://api.football-data.org/v4";

const STAGE_MAP: Record<string, MatchStage> = {
  GROUP_STAGE: "group",
  LAST_32: "round-of-32",
  LAST_16: "round-of-16",
  QUARTER_FINALS: "quarter-final",
  SEMI_FINALS: "semi-final",
  THIRD_PLACE: "third-place",
  FINAL: "final",
};

const STATUS_MAP: Record<string, MatchStatus> = {
  TIMED: "scheduled",
  SCHEDULED: "scheduled",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "finished",
  POSTPONED: "tbd",
  SUSPENDED: "tbd",
  CANCELLED: "tbd",
};

interface ApiTeam {
  id: number | null;
  name: string | null;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
}

interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score?: { fullTime?: { home: number | null; away: number | null } };
}

function pickVenue(matchNumber: number) {
  return VENUES[matchNumber % VENUES.length];
}

function broadcasterFor(matchNumber: number, stage: MatchStage): ("BBC" | "ITV" | "TBC")[] {
  if (stage === "final" || stage === "third-place") return ["BBC", "ITV"];
  return matchNumber % 2 === 0 ? ["ITV"] : ["BBC"];
}

function placeholderForKnockout(stage: MatchStage, indexInStage: number, side: "home" | "away"): string {
  const idx = indexInStage;
  switch (stage) {
    case "round-of-32":
      return side === "home" ? `1st/2nd Group ${String.fromCharCode(65 + idx)}` : `2nd/3rd Group ${String.fromCharCode(65 + ((idx + 6) % 12))}`;
    case "round-of-16":
      return `Winner R32 ${idx * 2 + (side === "home" ? 1 : 2)}`;
    case "quarter-final":
      return `Winner R16 ${idx * 2 + (side === "home" ? 1 : 2)}`;
    case "semi-final":
      return `Winner QF ${idx * 2 + (side === "home" ? 1 : 2)}`;
    case "third-place":
      return side === "home" ? "Loser SF1" : "Loser SF2";
    case "final":
      return side === "home" ? "Winner SF1" : "Winner SF2";
    default:
      return "TBD";
  }
}

function mapMatch(api: ApiMatch, matchNumber: number, indexInStage: number): Match {
  const stage = STAGE_MAP[api.stage] ?? "group";
  const status = STATUS_MAP[api.status] ?? "scheduled";
  const venue = pickVenue(matchNumber);
  const homeTla = api.homeTeam.tla;
  const awayTla = api.awayTeam.tla;
  const groupCode = api.group ? api.group.replace("GROUP_", "") : undefined;
  const home = homeTla
    ? { code: homeTla, score: api.score?.fullTime?.home ?? undefined }
    : { code: null as null, placeholder: placeholderForKnockout(stage, indexInStage, "home") };
  const away = awayTla
    ? { code: awayTla, score: api.score?.fullTime?.away ?? undefined }
    : { code: null as null, placeholder: placeholderForKnockout(stage, indexInStage, "away") };

  return {
    id: `M${matchNumber.toString().padStart(3, "0")}`,
    stage,
    group: groupCode,
    matchNumber,
    kickoffUtc: api.utcDate,
    venue: { city: venue.city, country: venue.country, stadium: venue.stadium },
    home,
    away,
    status,
    uk: { broadcaster: broadcasterFor(matchNumber, stage) },
  };
}

// Track the most recent rate-limit signal from Football-Data.
// The free tier is 10 req/min. The API returns:
//   X-RequestsAvailable    — remaining calls before block
//   X-RequestCounter-Reset — seconds until the counter resets
let nextEarliestFetchMs = 0;

async function fetchApi<T>(path: string, revalidateSeconds: number): Promise<T | null> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return null;

  // Respect any cooldown from the previous response.
  const now = Date.now();
  if (now < nextEarliestFetchMs) {
    const waitS = Math.ceil((nextEarliestFetchMs - now) / 1000);
    console.warn(`[football-data] in cooldown, ${waitS}s remaining; serving cached/null`);
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: revalidateSeconds },
    });

    const remaining = parseInt(res.headers.get("X-RequestsAvailable") ?? "", 10);
    const resetIn = parseInt(res.headers.get("X-RequestCounter-Reset") ?? "", 10);
    if (Number.isFinite(remaining) && Number.isFinite(resetIn)) {
      // If we're nearly at the limit, defer further calls until the counter resets.
      if (remaining <= 1) {
        nextEarliestFetchMs = Date.now() + (resetIn + 1) * 1000;
        console.warn(`[football-data] low quota: ${remaining} left, deferring next fetch by ${resetIn}s`);
      }
    }

    if (res.status === 429) {
      const retryAfter = Number.isFinite(resetIn) ? resetIn + 1 : 60;
      nextEarliestFetchMs = Date.now() + retryAfter * 1000;
      console.warn(`[football-data] 429 rate-limited; backing off ${retryAfter}s`);
      return null;
    }

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn("[football-data] fetch failed", err);
    return null;
  }
}

export async function fetchWcMatches(): Promise<Match[] | null> {
  const data = await fetchApi<{ matches: ApiMatch[] }>("/competitions/WC/matches", 3600);
  if (!data?.matches?.length) return null;

  // Sort by date so match numbering is stable
  const sorted = [...data.matches].sort((a, b) => a.utcDate.localeCompare(b.utcDate));
  const stageCounters: Record<string, number> = {};
  return sorted.map((api, i) => {
    const stage = STAGE_MAP[api.stage] ?? "group";
    const indexInStage = (stageCounters[stage] ?? 0);
    stageCounters[stage] = indexInStage + 1;
    return mapMatch(api, i + 1, indexInStage);
  });
}

import type { Match } from "./types";
import { VENUES } from "./venues";
import { GROUPS } from "./groups";
import { fetchWcMatches } from "./football-data";

const TOURNAMENT_START = new Date("2026-06-11T20:00:00Z");
const KICKOFFS_UTC = [16, 19, 22, 1];

function pickVenue(idx: number) { return VENUES[idx % VENUES.length]; }

function isoOffsetDays(start: Date, days: number, hourUtc: number) {
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d.toISOString();
}

function broadcasterForMatch(matchNumber: number): ("BBC" | "ITV" | "TBC")[] {
  if (matchNumber === 104 || matchNumber === 103) return ["BBC", "ITV"];
  return matchNumber % 2 === 0 ? ["ITV"] : ["BBC"];
}

// Mock generator — used as fallback when the Football-Data token is missing or the API is unreachable.
function buildMock(): Match[] {
  const matches: Match[] = [];
  let n = 1;
  let dayOffset = 0;
  const groupCodes = Object.keys(GROUPS);
  for (const g of groupCodes) {
    const teams = GROUPS[g];
    const pairs: [string, string][] = [
      [teams[0], teams[1]], [teams[2], teams[3]],
      [teams[0], teams[2]], [teams[1], teams[3]],
      [teams[0], teams[3]], [teams[1], teams[2]],
    ];
    pairs.forEach((p, i) => {
      const venue = pickVenue(n);
      matches.push({
        id: `M${n.toString().padStart(3, "0")}`,
        stage: "group", group: g, matchNumber: n,
        kickoffUtc: isoOffsetDays(TOURNAMENT_START, dayOffset + Math.floor(i / 2), KICKOFFS_UTC[n % KICKOFFS_UTC.length]),
        venue: { city: venue.city, country: venue.country, stadium: venue.stadium },
        home: { code: p[0] }, away: { code: p[1] },
        status: "scheduled",
        uk: { broadcaster: broadcasterForMatch(n) },
      });
      n++;
    });
    dayOffset += 1;
  }
  const stages: { stage: Match["stage"]; count: number; baseDay: number }[] = [
    { stage: "round-of-32", count: 16, baseDay: 17 },
    { stage: "round-of-16", count: 8, baseDay: 23 },
    { stage: "quarter-final", count: 4, baseDay: 28 },
    { stage: "semi-final", count: 2, baseDay: 32 },
    { stage: "third-place", count: 1, baseDay: 36 },
    { stage: "final", count: 1, baseDay: 38 },
  ];
  for (const s of stages) {
    for (let i = 0; i < s.count; i++) {
      const venue = pickVenue(n);
      matches.push({
        id: `M${n.toString().padStart(3, "0")}`,
        stage: s.stage, matchNumber: n,
        kickoffUtc: isoOffsetDays(TOURNAMENT_START, s.baseDay + Math.floor(i / 2), KICKOFFS_UTC[i % KICKOFFS_UTC.length]),
        venue: { city: venue.city, country: venue.country, stadium: venue.stadium },
        home: { code: null }, away: { code: null },
        status: "scheduled",
        uk: { broadcaster: broadcasterForMatch(n) },
      });
      n++;
    }
  }
  return matches;
}

let cached: Match[] | null = null;
let cachedSource: "live" | "mock" = "mock";

export async function getAllMatches(): Promise<Match[]> {
  if (cached) return cached;
  const live = await fetchWcMatches();
  if (live && live.length) {
    cached = live;
    cachedSource = "live";
  } else {
    cached = buildMock();
    cachedSource = "mock";
  }
  return cached;
}

export function getMatchesSource() { return cachedSource; }

export async function matchesForGroup(group: string) {
  return (await getAllMatches()).filter((m) => m.group === group);
}

export async function matchesByStage(stage: Match["stage"]) {
  return (await getAllMatches()).filter((m) => m.stage === stage);
}

export async function nextMatch(now = new Date()): Promise<Match | undefined> {
  const all = await getAllMatches();
  return all
    .filter((m) => new Date(m.kickoffUtc) > now)
    .sort((a, b) => +new Date(a.kickoffUtc) - +new Date(b.kickoffUtc))[0];
}

export async function matchesOnDay(dateIso: string): Promise<Match[]> {
  const d = new Date(dateIso);
  const start = new Date(d); start.setUTCHours(0, 0, 0, 0);
  const end = new Date(d); end.setUTCHours(23, 59, 59, 999);
  return (await getAllMatches()).filter((m) => {
    const k = +new Date(m.kickoffUtc);
    return k >= +start && k <= +end;
  });
}

export async function matchesForTeam(code: string): Promise<Match[]> {
  return (await getAllMatches()).filter((m) => m.home.code === code || m.away.code === code);
}

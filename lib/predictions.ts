"use client";

export type PredictionsState = {
  members: { id: string; name: string; emoji: string; color: string }[];
  active: string | null;
  picks: Record<string, MemberPicks>;
  // Once the tournament ends, the household sets the actual champion here.
  // Any member whose `champion` pick matches gets the confetti + YouTube celebration.
  actualChampion?: string | null;
};

export type MemberPicks = {
  groupWinners: Record<string, string>;
  runnersUp: Record<string, string>;
  semiFinalists: (string | null)[]; // length 4; placeholders to fill as tournament progresses
  finalists: [string | null, string | null];
  champion: string | null;
  goldenBoot: string | null;
};

// v2 adds semiFinalists + actualChampion. v1 data is migrated lazily on load.
export const KEY = "wct.predictions.v2";
const LEGACY_KEY = "wct.predictions.v1";

export const EMOJIS = ["⚽", "🦁", "🐯", "🦊", "🐼", "🐧", "🦄", "🐙", "🐵", "🦔", "🐨", "🐲"];
export const COLORS = ["#E5006D", "#1A4FFF", "#FFC83D", "#0E7C3A", "#FF5A3C", "#7E3CFF", "#00B7E0", "#34D6B6"];

export function emptyPicks(): MemberPicks {
  return {
    groupWinners: {},
    runnersUp: {},
    semiFinalists: [null, null, null, null],
    finalists: [null, null],
    champion: null,
    goldenBoot: null,
  };
}

function migratePicks(p: any): MemberPicks {
  return {
    groupWinners: p?.groupWinners ?? {},
    runnersUp: p?.runnersUp ?? {},
    semiFinalists: Array.isArray(p?.semiFinalists) && p.semiFinalists.length === 4
      ? p.semiFinalists
      : [null, null, null, null],
    finalists: Array.isArray(p?.finalists) && p.finalists.length === 2 ? p.finalists : [null, null],
    champion: p?.champion ?? null,
    goldenBoot: p?.goldenBoot ?? null,
  };
}

export function loadState(): PredictionsState {
  if (typeof window === "undefined") return { members: [], active: null, picks: {} };
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return { members: [], active: null, picks: {} };
    const parsed = JSON.parse(raw);
    const migratedPicks: Record<string, MemberPicks> = {};
    for (const [id, p] of Object.entries(parsed.picks ?? {})) {
      migratedPicks[id] = migratePicks(p);
    }
    return {
      members: parsed.members ?? [],
      active: parsed.active ?? null,
      picks: migratedPicks,
      actualChampion: parsed.actualChampion ?? null,
    };
  } catch {
    return { members: [], active: null, picks: {} };
  }
}

export function saveState(s: PredictionsState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

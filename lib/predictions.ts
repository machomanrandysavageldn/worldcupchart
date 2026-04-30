"use client";

export type PredictionsState = {
  members: { id: string; name: string; emoji: string; color: string }[];
  active: string | null;
  // member id -> { groupWinners: { [group]: teamCode }, runnersUp: { [group]: teamCode }, finalist: [code|null, code|null], champion: code|null, golden: code|null }
  picks: Record<string, MemberPicks>;
};

export type MemberPicks = {
  groupWinners: Record<string, string>;
  runnersUp: Record<string, string>;
  finalists: [string | null, string | null];
  champion: string | null;
  goldenBoot: string | null;
};

export const KEY = "wct.predictions.v1";

export const EMOJIS = ["⚽", "🦁", "🐯", "🦊", "🐼", "🐧", "🦄", "🐙", "🐵", "🦔", "🐨", "🐲"];
export const COLORS = ["#E5006D", "#1A4FFF", "#FFC83D", "#0E7C3A", "#FF5A3C", "#7E3CFF", "#00B7E0", "#34D6B6"];

export function emptyPicks(): MemberPicks {
  return { groupWinners: {}, runnersUp: {}, finalists: [null, null], champion: null, goldenBoot: null };
}

export function loadState(): PredictionsState {
  if (typeof window === "undefined") return { members: [], active: null, picks: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { members: [], active: null, picks: {} };
    return JSON.parse(raw);
  } catch {
    return { members: [], active: null, picks: {} };
  }
}

export function saveState(s: PredictionsState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

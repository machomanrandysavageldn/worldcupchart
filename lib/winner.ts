// Detect the World Cup winner from the news feed.
//
// Strategy: scan the (already cached) news headlines and summaries for phrases
// that clearly state a team has won the tournament — and only count it if the
// item is dated on or after the scheduled final (19 July 2026), so a pre-
// tournament prediction headline like "Could England win the World Cup?"
// doesn't trigger it.

import { getNews } from "./news";
import { TEAMS } from "./teams";
import type { Team } from "./types";

// Earliest moment a "team won the World Cup" claim could be real.
const FINAL_DATE_ISO = "2026-07-19T00:00:00Z";

// Strong winner phrases. The team name is inserted with `re` quoting and
// surrounding word boundaries so we don't false-match substrings.
const WINNER_PATTERNS = [
  /\bwin(s|ning)? the (2026 )?world cup\b/i,
  /\bare (the )?(2026 )?world cup champions\b/i,
  /\bcrowned (the )?(2026 )?world (cup )?champions\b/i,
  /\blift(s|ed)? the (world cup |2026 )?trophy\b/i,
  /\bworld cup winners?\b/i,
];

export type WinnerInfo = {
  team: Team;
  headline: string;
  source: string;
  url: string;
  detectedAt: string;
};

export async function detectWinner(): Promise<WinnerInfo | null> {
  // Skip entirely until the final has been played — saves the news scan and
  // means pre-tournament "could X win?" headlines can't accidentally fire.
  if (Date.now() < new Date(FINAL_DATE_ISO).getTime()) return null;

  const news = await getNews(40);
  for (const item of news) {
    const published = new Date(item.pubDate).getTime();
    if (isNaN(published) || published < new Date(FINAL_DATE_ISO).getTime()) continue;

    const hay = `${item.title} ${item.summary ?? ""}`;
    const hasWinnerPhrase = WINNER_PATTERNS.some((re) => re.test(hay));
    if (!hasWinnerPhrase) continue;

    // Find a qualified team named in the same headline/summary.
    const team = TEAMS.find((t) => t.qualified && nameMatches(t.name, hay));
    if (team) {
      return {
        team,
        headline: item.title,
        source: item.source,
        url: item.link,
        detectedAt: item.pubDate,
      };
    }
  }
  return null;
}

function nameMatches(name: string, hay: string): boolean {
  // Whole-word, case-insensitive match. Escape regex special chars in the team name.
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(hay);
}

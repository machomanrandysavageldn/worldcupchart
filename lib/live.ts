import type { Match, LiveState } from "./types";

export function computeLiveState(m: Match): LiveState {
  const kickoff = +new Date(m.kickoffUtc);
  const now = Date.now();
  const elapsed = (now - kickoff) / 60000;
  const events: LiveState["events"] = [];

  if (elapsed < 0) {
    return { id: m.id, status: "scheduled", minute: null, homeScore: 0, awayScore: 0, events, fetchedAt: new Date().toISOString() };
  }
  if (elapsed > 105) {
    const seed = m.id.charCodeAt(2) + m.id.charCodeAt(3);
    return {
      id: m.id,
      status: "finished",
      minute: 90,
      homeScore: seed % 4,
      awayScore: (seed * 3) % 4,
      events,
      fetchedAt: new Date().toISOString(),
    };
  }
  if (elapsed >= 45 && elapsed < 60) {
    return { id: m.id, status: "halftime", minute: 45, homeScore: 0, awayScore: 0, events, fetchedAt: new Date().toISOString() };
  }
  const minute = Math.min(90, Math.floor(elapsed >= 60 ? elapsed - 15 : elapsed));
  const seed = (m.id.charCodeAt(2) + m.id.charCodeAt(3)) % 7;
  const homeScore = Math.floor(minute / 30) === 0 ? 0 : seed % 3;
  const awayScore = Math.floor(minute / 25) === 0 ? 0 : (seed + 1) % 3;
  return {
    id: m.id,
    status: "live",
    minute,
    homeScore,
    awayScore,
    events,
    fetchedAt: new Date().toISOString(),
  };
}

export type TeamCode = string;

export interface Team {
  code: TeamCode;
  name: string;
  flag: string;
  group?: string;
  qualified?: boolean;
  fifaRank?: number;
}

export type MatchStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export type MatchStatus = "scheduled" | "live" | "finished" | "tbd";

export interface Match {
  id: string;
  stage: MatchStage;
  group?: string;
  matchNumber: number;
  kickoffUtc: string;
  venue: { city: string; country: "USA" | "CAN" | "MEX"; stadium: string };
  home: { code: TeamCode | null; placeholder?: string; score?: number };
  away: { code: TeamCode | null; placeholder?: string; score?: number };
  status: MatchStatus;
  uk?: { broadcaster: ("BBC" | "ITV" | "Sky" | "TBC")[]; channel?: string };
}

export interface GroupStanding {
  team: TeamCode;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  summary?: string;
  image?: string;
}

export interface LiveState {
  id: string;
  status: "scheduled" | "live" | "halftime" | "finished";
  minute: number | null;
  homeScore: number;
  awayScore: number;
  events: { minute: number; team: "home" | "away"; type: "goal" | "yellow" | "red"; player?: string }[];
  fetchedAt: string;
}

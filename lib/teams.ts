import type { Team } from "./types";

// Team list aligned with Football-Data.org WC competition TLAs.
// All 48 qualified for the 2026 tournament.
export const TEAMS: Team[] = [
  // Hosts
  { code: "CAN", name: "Canada", flag: "🇨🇦", qualified: true },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", qualified: true },
  { code: "USA", name: "United States", flag: "🇺🇸", qualified: true },
  // CONMEBOL
  { code: "ARG", name: "Argentina", flag: "🇦🇷", qualified: true },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", qualified: true },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", qualified: true },
  { code: "COL", name: "Colombia", flag: "🇨🇴", qualified: true },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", qualified: true },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾", qualified: true },
  // CONCACAF
  { code: "PAN", name: "Panama", flag: "🇵🇦", qualified: true },
  { code: "HAI", name: "Haiti", flag: "🇭🇹", qualified: true },
  { code: "CUR", name: "Curaçao", flag: "🇨🇼", qualified: true },
  // AFC
  { code: "JPN", name: "Japan", flag: "🇯🇵", qualified: true },
  { code: "IRN", name: "Iran", flag: "🇮🇷", qualified: true },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", qualified: true },
  { code: "AUS", name: "Australia", flag: "🇦🇺", qualified: true },
  { code: "JOR", name: "Jordan", flag: "🇯🇴", qualified: true },
  { code: "UZB", name: "Uzbekistan", flag: "🇺🇿", qualified: true },
  { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", qualified: true },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", qualified: true },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶", qualified: true },
  // CAF
  { code: "MAR", name: "Morocco", flag: "🇲🇦", qualified: true },
  { code: "TUN", name: "Tunisia", flag: "🇹🇳", qualified: true },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", qualified: true },
  { code: "ALG", name: "Algeria", flag: "🇩🇿", qualified: true },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", qualified: true },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", qualified: true },
  { code: "CIV", name: "Ivory Coast", flag: "🇨🇮", qualified: true },
  { code: "CPV", name: "Cape Verde", flag: "🇨🇻", qualified: true },
  { code: "RSA", name: "South Africa", flag: "🇿🇦", qualified: true },
  { code: "COD", name: "DR Congo", flag: "🇨🇩", qualified: true },
  // OFC
  { code: "NZL", name: "New Zealand", flag: "🇳🇿", qualified: true },
  // UEFA
  { code: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", qualified: true },
  { code: "FRA", name: "France", flag: "🇫🇷", qualified: true },
  { code: "GER", name: "Germany", flag: "🇩🇪", qualified: true },
  { code: "ESP", name: "Spain", flag: "🇪🇸", qualified: true },
  { code: "POR", name: "Portugal", flag: "🇵🇹", qualified: true },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", qualified: true },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", qualified: true },
  { code: "CRO", name: "Croatia", flag: "🇭🇷", qualified: true },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", qualified: true },
  { code: "AUT", name: "Austria", flag: "🇦🇹", qualified: true },
  { code: "NOR", name: "Norway", flag: "🇳🇴", qualified: true },
  { code: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", qualified: true },
  { code: "CZE", name: "Czechia", flag: "🇨🇿", qualified: true },
  { code: "TUR", name: "Türkiye", flag: "🇹🇷", qualified: true },
  { code: "SWE", name: "Sweden", flag: "🇸🇪", qualified: true },
  { code: "BIH", name: "Bosnia & Herzegovina", flag: "🇧🇦", qualified: true },
];

export const TEAM_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t])
);

export function teamName(code: string | null | undefined, fallback = "TBD") {
  if (!code) return fallback;
  return TEAM_BY_CODE[code]?.name ?? fallback;
}

export function teamFlag(code: string | null | undefined) {
  if (!code) return "❔";
  return TEAM_BY_CODE[code]?.flag ?? "❔";
}

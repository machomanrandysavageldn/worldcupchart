export interface Venue {
  city: string;
  country: "USA" | "CAN" | "MEX";
  stadium: string;
  color: string;
  emoji: string;
  wiki: string; // Wikipedia page title for summary lookup
}

export const VENUES: Venue[] = [
  { city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", color: "#0E7C3A", emoji: "🍑", wiki: "Atlanta" },
  { city: "Boston", country: "USA", stadium: "Gillette Stadium", color: "#FF8A1F", emoji: "🦞", wiki: "Boston" },
  { city: "Dallas", country: "USA", stadium: "AT&T Stadium", color: "#C8FF1C", emoji: "🤠", wiki: "Dallas" },
  { city: "Guadalajara", country: "MEX", stadium: "Estadio Akron", color: "#34D6B6", emoji: "🇲🇽", wiki: "Guadalajara" },
  { city: "Houston", country: "USA", stadium: "NRG Stadium", color: "#1A4FFF", emoji: "🚀", wiki: "Houston" },
  { city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", color: "#E5006D", emoji: "🎷", wiki: "Kansas_City,_Missouri" },
  { city: "Los Angeles", country: "USA", stadium: "SoFi Stadium", color: "#FF5A3C", emoji: "🌴", wiki: "Los_Angeles" },
  { city: "Mexico City", country: "MEX", stadium: "Estadio Azteca", color: "#7E3CFF", emoji: "🌋", wiki: "Mexico_City" },
  { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", color: "#FFB3D6", emoji: "🌊", wiki: "Miami" },
  { city: "Monterrey", country: "MEX", stadium: "Estadio BBVA", color: "#34D6B6", emoji: "⛰️", wiki: "Monterrey" },
  { city: "New York/New Jersey", country: "USA", stadium: "MetLife Stadium", color: "#102542", emoji: "🗽", wiki: "New_York_City" },
  { city: "Philadelphia", country: "USA", stadium: "Lincoln Financial Field", color: "#1A4FFF", emoji: "🔔", wiki: "Philadelphia" },
  { city: "San Francisco Bay Area", country: "USA", stadium: "Levi's Stadium", color: "#FF5A3C", emoji: "🌉", wiki: "San_Francisco_Bay_Area" },
  { city: "Seattle", country: "USA", stadium: "Lumen Field", color: "#C8FF1C", emoji: "☕", wiki: "Seattle" },
  { city: "Toronto", country: "CAN", stadium: "BMO Field", color: "#1A4FFF", emoji: "🍁", wiki: "Toronto" },
  { city: "Vancouver", country: "CAN", stadium: "BC Place", color: "#0E7C3A", emoji: "🏔️", wiki: "Vancouver" },
];

export const VENUE_BY_CITY = Object.fromEntries(VENUES.map((v) => [v.city, v]));

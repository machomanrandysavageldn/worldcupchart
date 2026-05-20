export interface Venue {
  city: string;
  country: "USA" | "CAN" | "MEX";
  stadium: string;
  color: string;
  emoji: string;
  wiki: string; // Wikipedia page title for summary lookup
  lat: number;
  lng: number;
}

export const VENUES: Venue[] = [
  { city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", color: "#0E7C3A", emoji: "🍑", wiki: "Atlanta", lat: 33.75, lng: -84.39 },
  { city: "Boston", country: "USA", stadium: "Gillette Stadium", color: "#FF8A1F", emoji: "🦞", wiki: "Boston", lat: 42.36, lng: -71.06 },
  { city: "Dallas", country: "USA", stadium: "AT&T Stadium", color: "#C8FF1C", emoji: "🤠", wiki: "Dallas", lat: 32.78, lng: -96.80 },
  { city: "Guadalajara", country: "MEX", stadium: "Estadio Akron", color: "#34D6B6", emoji: "🇲🇽", wiki: "Guadalajara", lat: 20.67, lng: -103.35 },
  { city: "Houston", country: "USA", stadium: "NRG Stadium", color: "#1A4FFF", emoji: "🚀", wiki: "Houston", lat: 29.76, lng: -95.37 },
  { city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", color: "#E5006D", emoji: "🎷", wiki: "Kansas_City,_Missouri", lat: 39.10, lng: -94.58 },
  { city: "Los Angeles", country: "USA", stadium: "SoFi Stadium", color: "#FF5A3C", emoji: "🌴", wiki: "Los_Angeles", lat: 34.05, lng: -118.24 },
  { city: "Mexico City", country: "MEX", stadium: "Estadio Azteca", color: "#7E3CFF", emoji: "🌋", wiki: "Mexico_City", lat: 19.43, lng: -99.13 },
  { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", color: "#FFB3D6", emoji: "🌊", wiki: "Miami", lat: 25.76, lng: -80.19 },
  { city: "Monterrey", country: "MEX", stadium: "Estadio BBVA", color: "#34D6B6", emoji: "⛰️", wiki: "Monterrey", lat: 25.69, lng: -100.32 },
  { city: "New York/New Jersey", country: "USA", stadium: "MetLife Stadium", color: "#102542", emoji: "🗽", wiki: "New_York_City", lat: 40.71, lng: -74.01 },
  { city: "Philadelphia", country: "USA", stadium: "Lincoln Financial Field", color: "#1A4FFF", emoji: "🔔", wiki: "Philadelphia", lat: 39.95, lng: -75.16 },
  { city: "San Francisco Bay Area", country: "USA", stadium: "Levi's Stadium", color: "#FF5A3C", emoji: "🌉", wiki: "San_Francisco_Bay_Area", lat: 37.78, lng: -122.42 },
  { city: "Seattle", country: "USA", stadium: "Lumen Field", color: "#C8FF1C", emoji: "☕", wiki: "Seattle", lat: 47.60, lng: -122.33 },
  { city: "Toronto", country: "CAN", stadium: "BMO Field", color: "#1A4FFF", emoji: "🍁", wiki: "Toronto", lat: 43.65, lng: -79.38 },
  { city: "Vancouver", country: "CAN", stadium: "BC Place", color: "#0E7C3A", emoji: "🏔️", wiki: "Vancouver", lat: 49.28, lng: -123.12 },
];

export const VENUE_BY_CITY = Object.fromEntries(VENUES.map((v) => [v.city, v]));

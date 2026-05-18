// Squad data for 2026 World Cup teams.
//
// Honest scope: full final squads aren't named until late May / early June 2026,
// and federations can change managers and captains at short notice. So we hold:
//   - Key figures (manager, captain, top scorer) for the teams where this is
//     reliably known mid-2026.
//   - A list of widely-recognised first-team regulars per team ("notable").
// Photos for each player are not stored — they are looked up at render time via
// the Wikipedia summary API so we don't bundle or re-host imagery. See lib/players.ts.
//
// Any team without an entry falls back to a "Key figures to be confirmed" card —
// which is the right answer when we don't have stable data.

export type KeyFigure = { name: string; wiki?: string; position?: string };
export type SquadInfo = {
  manager?: KeyFigure;
  captain?: KeyFigure;
  topScorer?: KeyFigure;
  // Optional notable subset shown when no full squad has been announced yet.
  notable?: KeyFigure[];
  // Full 26-player squad once announced. When present, the team page renders
  // the full list instead of just the notable subset.
  fullSquad?: KeyFigure[];
  // ISO date when the federation is expected to announce its final squad.
  // Used to message users honestly until the list lands.
  squadAnnouncementDue?: string;
  note?: string;
};

// `wiki` defaults to `name` if omitted. Override when the Wikipedia page title
// differs from the display name (accents, disambiguation suffixes, etc.).
export const SQUADS: Record<string, SquadInfo> = {
  ENG: {
    manager: { name: "Thomas Tuchel" },
    captain: { name: "Harry Kane" },
    topScorer: { name: "Harry Kane" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Jude Bellingham" },
      { name: "Phil Foden" },
      { name: "Bukayo Saka" },
      { name: "Declan Rice" },
      { name: "Cole Palmer" },
      { name: "Jordan Pickford" },
      { name: "John Stones" },
      { name: "Kobbie Mainoo" },
    ],
  },
  FRA: {
    manager: { name: "Didier Deschamps" },
    captain: { name: "Kylian Mbappé", wiki: "Kylian_Mbappé" },
    topScorer: { name: "Kylian Mbappé", wiki: "Kylian_Mbappé" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Antoine Griezmann" },
      { name: "Aurélien Tchouaméni", wiki: "Aurélien_Tchouaméni" },
      { name: "Eduardo Camavinga" },
      { name: "Mike Maignan" },
      { name: "William Saliba" },
      { name: "Jules Koundé", wiki: "Jules_Koundé" },
      { name: "Ousmane Dembélé", wiki: "Ousmane_Dembélé" },
      { name: "Michael Olise" },
    ],
  },
  ARG: {
    manager: { name: "Lionel Scaloni" },
    captain: { name: "Lionel Messi" },
    topScorer: { name: "Lionel Messi" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Emiliano Martínez", wiki: "Emiliano_Martínez_(footballer,_born_1992)" },
      { name: "Nicolás Otamendi", wiki: "Nicolás_Otamendi" },
      { name: "Rodrigo De Paul" },
      { name: "Alexis Mac Allister" },
      { name: "Enzo Fernández", wiki: "Enzo_Fernández" },
      { name: "Julián Álvarez", wiki: "Julián_Álvarez" },
      { name: "Lautaro Martínez", wiki: "Lautaro_Martínez" },
    ],
  },
  BRA: {
    manager: { name: "Carlo Ancelotti" },
    captain: { name: "Marquinhos" },
    topScorer: { name: "Neymar" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Vinícius Júnior", wiki: "Vinícius_Júnior" },
      { name: "Rodrygo" },
      { name: "Raphinha" },
      { name: "Casemiro" },
      { name: "Bruno Guimarães", wiki: "Bruno_Guimarães" },
      { name: "Alisson", wiki: "Alisson_Becker" },
      { name: "Éder Militão", wiki: "Éder_Militão" },
    ],
  },
  ESP: {
    manager: { name: "Luis de la Fuente" },
    captain: { name: "Álvaro Morata", wiki: "Álvaro_Morata" },
    topScorer: { name: "Álvaro Morata", wiki: "Álvaro_Morata" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Lamine Yamal" },
      { name: "Rodri", wiki: "Rodri_(footballer,_born_2002)" },
      { name: "Pedri" },
      { name: "Gavi" },
      { name: "Nico Williams" },
      { name: "Dani Carvajal" },
      { name: "Unai Simón", wiki: "Unai_Simón" },
    ],
  },
  POR: {
    manager: { name: "Roberto Martínez", wiki: "Roberto_Martínez_(footballer)" },
    captain: { name: "Cristiano Ronaldo" },
    topScorer: { name: "Cristiano Ronaldo" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Bernardo Silva" },
      { name: "Bruno Fernandes" },
      { name: "Rafael Leão", wiki: "Rafael_Leão" },
      { name: "Diogo Jota" },
      { name: "Rúben Dias", wiki: "Rúben_Dias" },
      { name: "João Cancelo", wiki: "João_Cancelo" },
    ],
  },
  GER: {
    manager: { name: "Julian Nagelsmann" },
    captain: { name: "Joshua Kimmich" },
    topScorer: { name: "Kai Havertz" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Florian Wirtz" },
      { name: "Jamal Musiala" },
      { name: "Antonio Rüdiger", wiki: "Antonio_Rüdiger" },
      { name: "Manuel Neuer" },
      { name: "İlkay Gündoğan", wiki: "İlkay_Gündoğan" },
      { name: "Leroy Sané", wiki: "Leroy_Sané" },
    ],
  },
  NED: {
    manager: { name: "Ronald Koeman" },
    captain: { name: "Virgil van Dijk" },
    topScorer: { name: "Memphis Depay" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Frenkie de Jong" },
      { name: "Cody Gakpo" },
      { name: "Xavi Simons" },
      { name: "Denzel Dumfries" },
      { name: "Nathan Aké", wiki: "Nathan_Aké" },
    ],
  },
  BEL: {
    manager: { name: "Rudi Garcia" },
    captain: { name: "Kevin De Bruyne" },
    topScorer: { name: "Romelu Lukaku" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Thibaut Courtois" },
      { name: "Jérémy Doku", wiki: "Jérémy_Doku" },
      { name: "Youri Tielemans" },
      { name: "Amadou Onana" },
    ],
  },
  USA: {
    manager: { name: "Mauricio Pochettino" },
    captain: { name: "Christian Pulisic" },
    topScorer: { name: "Christian Pulisic" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Weston McKennie" },
      { name: "Tyler Adams" },
      { name: "Folarin Balogun" },
      { name: "Gio Reyna" },
      { name: "Matt Turner", wiki: "Matt_Turner_(soccer)" },
    ],
  },
  MEX: {
    manager: { name: "Javier Aguirre" },
    captain: { name: "Edson Álvarez", wiki: "Edson_Álvarez" },
    topScorer: { name: "Raúl Jiménez", wiki: "Raúl_Jiménez" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Hirving Lozano" },
      { name: "Guillermo Ochoa" },
      { name: "Santiago Giménez", wiki: "Santiago_Giménez" },
    ],
  },
  CAN: {
    manager: { name: "Jesse Marsch" },
    captain: { name: "Alphonso Davies" },
    topScorer: { name: "Jonathan David" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Cyle Larin" },
      { name: "Stephen Eustáquio", wiki: "Stephen_Eustáquio" },
      { name: "Tajon Buchanan" },
    ],
  },
  CRO: {
    manager: { name: "Zlatko Dalić" },
    captain: { name: "Luka Modrić", wiki: "Luka_Modrić" },
    topScorer: { name: "Luka Modrić", wiki: "Luka_Modrić" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Mateo Kovačić", wiki: "Mateo_Kovačić" },
      { name: "Joško Gvardiol", wiki: "Joško_Gvardiol" },
      { name: "Andrej Kramarić", wiki: "Andrej_Kramarić" },
    ],
  },
  MAR: {
    captain: { name: "Achraf Hakimi" },
    topScorer: { name: "Youssef En-Nesyri" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Hakim Ziyech" },
      { name: "Sofyan Amrabat" },
      { name: "Yassine Bounou" },
    ],
  },
  SEN: {
    captain: { name: "Kalidou Koulibaly" },
    topScorer: { name: "Sadio Mané", wiki: "Sadio_Mané" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Édouard Mendy", wiki: "Édouard_Mendy" },
      { name: "Ismaïla Sarr", wiki: "Ismaïla_Sarr" },
    ],
  },
  JPN: {
    manager: { name: "Hajime Moriyasu" },
    captain: { name: "Wataru Endo" },
    topScorer: { name: "Takefusa Kubo" },
    squadAnnouncementDue: "late May 2026",
    notable: [
      { name: "Kaoru Mitoma" },
      { name: "Daichi Kamada" },
      { name: "Takehiro Tomiyasu" },
    ],
  },
  KOR: {
    captain: { name: "Son Heung-min" },
    topScorer: { name: "Son Heung-min" },
    squadAnnouncementDue: "late May 2026",
    notable: [{ name: "Lee Kang-in" }, { name: "Kim Min-jae", wiki: "Kim_Min-jae_(footballer,_born_1996)" }],
  },
  AUS: {
    captain: { name: "Mathew Ryan" },
    squadAnnouncementDue: "late May 2026",
    notable: [{ name: "Aaron Mooy" }, { name: "Mitchell Duke" }],
  },
};

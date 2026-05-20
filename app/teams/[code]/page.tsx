import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { TEAM_BY_CODE, TEAMS } from "@/lib/teams";
import { matchesForTeam } from "@/lib/fixtures";
import { MatchCard } from "@/components/MatchCard";
import { GROUPS } from "@/lib/groups";
import { SQUADS, type KeyFigure } from "@/lib/squads";
import { getPlayerInfo, getPlayersInfo, initials, type PlayerInfo } from "@/lib/players";
import Link from "next/link";

// Short revalidate so Wikipedia photo updates (and freshly added full squads) appear within an hour.
export const revalidate = 3600;

export function generateStaticParams() {
  return TEAMS.filter((t) => t.qualified).map((t) => ({ code: t.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const team = TEAM_BY_CODE[code.toUpperCase()];
  if (!team) return {};
  return {
    title: `${team.name} squad & fixtures`,
    description: `${team.name} at the 2026 FIFA World Cup — manager, captain, top scorer, squad and all fixtures in UK time.`,
    alternates: { canonical: `/teams/${team.code}` },
    openGraph: {
      title: `${team.name} at the 2026 World Cup`,
      description: `Squad, key figures and fixtures for ${team.name}.`,
    },
  };
}

export default async function TeamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const team = TEAM_BY_CODE[code.toUpperCase()];
  if (!team) return notFound();
  const matches = await matchesForTeam(team.code);
  const group = Object.entries(GROUPS).find(([, codes]) => codes.includes(team.code))?.[0];
  const squad = SQUADS[team.code];

  // Resolve photos for key figures and notable players in parallel.
  const [manager, captain, topScorer] = await Promise.all([
    squad?.manager ? getPlayerInfo(squad.manager.name, squad.manager.wiki) : null,
    squad?.captain ? getPlayerInfo(squad.captain.name, squad.captain.wiki) : null,
    squad?.topScorer ? getPlayerInfo(squad.topScorer.name, squad.topScorer.wiki) : null,
  ]);
  // Prefer the full squad when announced; otherwise fall back to the notable subset.
  const roster = squad?.fullSquad ?? squad?.notable ?? [];
  const rosterInfo = roster.length ? await getPlayersInfo(roster) : [];
  const isFullSquad = !!squad?.fullSquad?.length;

  return (
    <Section title={team.name} kicker={`Team profile · ${matches.length} matches`}>
      <Link
        href="/teams"
        className="chunky-btn inline-flex items-center gap-2 bg-white text-wc-ink px-4 py-2 font-bold text-sm mb-4 hover:bg-wc-gold"
      >
        <span aria-hidden>←</span> Back to teams
      </Link>
      <div className="chunky-card p-6 bg-white mb-6 flex items-center gap-6">
        <div className="text-7xl">{team.flag}</div>
        <div>
          <div className="font-display text-4xl">{team.name}</div>
          {group && (
            <Link href={`/groups/${group}`} className="text-wc-magenta font-bold hover:underline">
              Group {group}
            </Link>
          )}
        </div>
      </div>

      {squad ? (
        <>
          <h3 className="font-display text-2xl mb-3">Key figures</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <KeyFigureCard label="Manager" emoji="🧠" color="bg-wc-cobalt" figure={squad.manager} info={manager} />
            <KeyFigureCard label="Captain" emoji="🎖️" color="bg-wc-magenta" figure={squad.captain} info={captain} />
            <KeyFigureCard label="Top scorer" emoji="⚽" color="bg-wc-coral" figure={squad.topScorer} info={topScorer} />
          </div>

          {roster.length > 0 && (
            <>
              <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                <h3 className="font-display text-2xl">
                  {isFullSquad ? `Full squad (${roster.length})` : "Notable players"}
                </h3>
                {!isFullSquad && (
                  <span className="text-xs text-wc-cream bg-wc-ink/80 px-2 py-0.5 rounded">
                    {squad.squadAnnouncementDue
                      ? `Full 26-player squad expected ${squad.squadAnnouncementDue}`
                      : "Full 26-player squad to be announced"}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {roster.map((p, i) => (
                  <PlayerCard key={p.name} figure={p} info={rosterInfo[i]} />
                ))}
              </div>
            </>
          )}

          <p className="text-xs text-wc-cream bg-wc-ink/80 inline-block px-3 py-1.5 rounded mb-6">
            {isFullSquad
              ? "Final 26-player squad as announced by the federation. Player photos are sourced live from Wikipedia."
              : "Final squads are announced shortly before the tournament — this page will switch to the full 26-player list as soon as the federation publishes it. Player photos are sourced live from Wikipedia."}
          </p>
        </>
      ) : (
        <div className="chunky-card p-5 bg-white mb-6">
          <div className="font-display text-2xl">Key figures</div>
          <p className="text-sm text-wc-deep/70 mt-1">
            Manager, captain and top scorer to be confirmed closer to the tournament.
          </p>
        </div>
      )}

      <h3 className="font-display text-2xl mb-3">Fixtures</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => <MatchCard key={m.id} m={m} />)}
      </div>
    </Section>
  );
}

function KeyFigureCard({
  label,
  emoji,
  color,
  figure,
  info,
}: {
  label: string;
  emoji: string;
  color: string;
  figure?: KeyFigure;
  info: PlayerInfo | null;
}) {
  if (!figure) {
    return (
      <div className={`chunky-card p-4 ${color} text-white`}>
        <div className="text-xs uppercase tracking-widest font-bold opacity-90">{label}</div>
        <div className="font-display text-xl mt-1 opacity-80">{emoji} To be confirmed</div>
      </div>
    );
  }
  return (
    <div className={`chunky-card p-4 ${color} text-white flex gap-3 items-center`}>
      <PlayerAvatar name={figure.name} thumbnail={info?.thumbnail} size={68} />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest font-bold opacity-90">{label}</div>
        <div className="font-display text-xl leading-tight">{figure.name}</div>
        {info?.url && (
          <a href={info.url} target="_blank" rel="noopener noreferrer" className="text-[11px] underline opacity-90">
            Wikipedia →
          </a>
        )}
      </div>
    </div>
  );
}

function PlayerCard({ figure, info }: { figure: KeyFigure; info?: PlayerInfo }) {
  // Only render a link when we actually have a destination AND a photo —
  // otherwise the click feels broken (opens a new tab to a generic search or
  // a thin stub article). Without a photo, keep it as a static card.
  const linkable = !!(info?.url && info?.thumbnail);
  const inner = (
    <>
      <PlayerAvatar name={figure.name} thumbnail={info?.thumbnail} size={80} />
      <div className="font-bold text-sm mt-2 leading-tight">{figure.name}</div>
    </>
  );
  if (linkable) {
    return (
      <a
        href={info!.url}
        target="_blank"
        rel="noopener noreferrer"
        className="chunky-card p-3 bg-white hover:translate-y-[-2px] transition flex flex-col items-center text-center"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="chunky-card p-3 bg-white flex flex-col items-center text-center" aria-label={figure.name}>
      {inner}
    </div>
  );
}

function PlayerAvatar({ name, thumbnail, size }: { name: string; thumbnail?: string; size: number }) {
  if (thumbnail) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnail}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover border-2 border-wc-ink shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-wc-cream text-wc-ink border-2 border-wc-ink font-display flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size / 2.4 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

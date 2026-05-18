import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { TEAM_BY_CODE, TEAMS } from "@/lib/teams";
import { matchesForTeam } from "@/lib/fixtures";
import { MatchCard } from "@/components/MatchCard";
import { GROUPS } from "@/lib/groups";
import { SQUADS, type KeyFigure } from "@/lib/squads";
import { getPlayerInfo, getPlayersInfo, initials, type PlayerInfo } from "@/lib/players";
import Link from "next/link";

export const revalidate = 86400;

export function generateStaticParams() {
  return TEAMS.filter((t) => t.qualified).map((t) => ({ code: t.code }));
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
  const notable = squad?.notable ? await getPlayersInfo(squad.notable) : [];

  return (
    <Section title={team.name} kicker={`Team profile · ${matches.length} matches`}>
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

          {squad.notable && squad.notable.length > 0 && (
            <>
              <h3 className="font-display text-2xl mb-3">Notable players</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {squad.notable.map((p, i) => (
                  <PlayerCard key={p.name} figure={p} info={notable[i]} />
                ))}
              </div>
            </>
          )}

          <p className="text-xs text-wc-cream bg-wc-ink/80 inline-block px-3 py-1.5 rounded mb-6">
            Squad information is provisional — final squads are announced shortly before the tournament.
            Player photos are sourced live from Wikipedia.
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
  return (
    <a
      href={info?.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="chunky-card p-3 bg-white hover:translate-y-[-2px] transition flex flex-col items-center text-center"
    >
      <PlayerAvatar name={figure.name} thumbnail={info?.thumbnail} size={80} />
      <div className="font-bold text-sm mt-2 leading-tight">{figure.name}</div>
    </a>
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

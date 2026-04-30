import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";
import { getAllMatches } from "@/lib/fixtures";
import { teamFlag, teamName } from "@/lib/teams";
import { ukDate, ukTime } from "@/lib/format";
import { Countdown } from "@/components/Countdown";
import { BroadcasterBadge } from "@/components/BroadcasterBadge";
import { LiveScore } from "@/components/LiveScore";
import { CelebrateButton } from "@/components/CelebrateButton";

export const revalidate = 3600;

export async function generateStaticParams() {
  const matches = await getAllMatches();
  return matches.map((m) => ({ id: m.id }));
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matches = await getAllMatches();
  const m = matches.find((x) => x.id === id);
  if (!m) return notFound();

  const homeName = m.home.code ? teamName(m.home.code) : m.home.placeholder ?? "TBD";
  const awayName = m.away.code ? teamName(m.away.code) : m.away.placeholder ?? "TBD";

  return (
    <Section title={`${homeName} v ${awayName}`} kicker={`Match #${m.matchNumber}`}>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="chunky-card p-8 bg-white">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <div className="text-7xl">{teamFlag(m.home.code)}</div>
              <div className="font-display text-3xl mt-2">{homeName}</div>
              {m.home.code && <Link className="text-wc-magenta font-bold hover:underline" href={`/teams/${m.home.code}`}>Team page</Link>}
            </div>
            <div>
              <div className="font-display text-6xl text-wc-magenta">vs</div>
              <div className="text-xs uppercase tracking-widest font-bold text-wc-deep/70 mt-3">
                {ukDate(m.kickoffUtc)}<br />{ukTime(m.kickoffUtc)} UK
              </div>
            </div>
            <div>
              <div className="text-7xl">{teamFlag(m.away.code)}</div>
              <div className="font-display text-3xl mt-2">{awayName}</div>
              {m.away.code && <Link className="text-wc-magenta font-bold hover:underline" href={`/teams/${m.away.code}`}>Team page</Link>}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <LiveScore matchId={m.id} />
          <div className="chunky-card p-5 bg-wc-gold">
            <div className="text-xs uppercase tracking-widest font-bold text-wc-deep/70">Kick-off in</div>
            <div className="mt-2"><Countdown iso={m.kickoffUtc} /></div>
          </div>
          <CelebrateButton />
          <div className="chunky-card p-5 bg-white">
            <div className="text-xs uppercase tracking-widest font-bold text-wc-deep/70 mb-1">Watch on UK TV</div>
            <div className="flex gap-2">
              {m.uk?.broadcaster.map((b) => <BroadcasterBadge key={b} broadcaster={b} />)}
            </div>
            <p className="text-xs text-wc-deep/60 mt-2">UK rights typically split between BBC and ITV. Final pairings confirmed by broadcasters closer to the tournament.</p>
          </div>
          <div className="chunky-card p-5 bg-white">
            <div className="text-xs uppercase tracking-widest font-bold text-wc-deep/70 mb-1">Venue</div>
            <div className="font-bold">{m.venue.stadium}</div>
            <div className="text-sm">{m.venue.city}, {m.venue.country}</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

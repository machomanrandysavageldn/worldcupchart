import Image from "next/image";
import Link from "next/link";
import { getAllMatches, nextMatch, matchesOnDay } from "@/lib/fixtures";
import { Countdown } from "@/components/Countdown";
import { MatchCard } from "@/components/MatchCard";
import { Mascot } from "@/components/Mascot";
import { Section } from "@/components/Section";
import { GROUP_LIST, GROUP_COLORS, GROUPS } from "@/lib/groups";
import { teamFlag, teamName } from "@/lib/teams";
import { detectWinner } from "@/lib/winner";

export const revalidate = 3600;

export default async function HomePage() {
  const all = await getAllMatches();
  const upcoming = await nextMatch();
  const today = await matchesOnDay(new Date().toISOString());
  const opener = all[0];
  const final = all[all.length - 1];
  const winner = await detectWinner();

  return (
    <>
      {winner && (
        <section className="bg-wc-gold border-b-[3px] border-wc-ink relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none dotted opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14 text-center">
            <div className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-wc-magenta">
              World Cup 2026 · Champions
            </div>
            <div className="text-6xl md:text-7xl mt-2">🏆</div>
            <h2 className="font-display text-5xl md:text-8xl leading-[0.95] mt-2 text-wc-ink">
              <span className="text-5xl md:text-7xl mr-2">{winner.team.flag}</span>
              {winner.team.name.toUpperCase()}
            </h2>
            <p className="font-display text-2xl md:text-4xl mt-2 text-wc-magenta">
              are your World Cup champions!
            </p>
            <Link
              href="/predictions"
              className="chunky-btn inline-block mt-5 bg-wc-magenta text-white px-6 py-3 font-bold text-lg"
            >
              Update your predictions →
            </Link>
            <div className="text-xs text-wc-ink/70 mt-3">
              Detected via {winner.source}.{" "}
              <a className="underline" href={winner.url} target="_blank" rel="noopener noreferrer">
                Read the story
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-b-[3px] border-wc-ink pitch-markings">
        <div className="absolute inset-0 dotted opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="chunky-card bg-wc-cream/95 p-6 md:p-8">
            <div className="text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-wc-magenta mb-2">
              11 June – 19 July 2026 · Canada · Mexico · USA
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.9]">
              World Cup<br />
              <span className="text-wc-magenta">Watch.</span>
            </h1>
            <p className="mt-4 text-lg max-w-xl">
              Every fixture in UK time, who&rsquo;s on the BBC or ITV, group tables, the knockout
              stages, the latest news and a family predictions game. Built for the sofa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/fixtures" className="chunky-btn bg-wc-magenta text-white px-5 py-2 font-bold">See all fixtures</Link>
              <Link href="/predictions" className="chunky-btn bg-wc-gold text-wc-ink px-5 py-2 font-bold">Play predictions</Link>
              <Link href="/groups" className="chunky-btn bg-white text-wc-ink px-5 py-2 font-bold">Group tables</Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-6 -left-6 hidden md:block"><Mascot size={120} /></div>
            <div className="chunky-card p-4 bg-white">
              <Image src="/fifa/emblem.jpg" alt="World Cup 26 emblem" width={300} height={420} className="rounded-lg" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-wc-ink text-wc-cream border-b-[3px] border-wc-ink">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-wc-gold font-bold">Counting down to</div>
            <div className="font-display text-3xl">
              {opener.home.code ? `${teamName(opener.home.code)} v ${teamName(opener.away.code ?? "")}` : "Opening match"}
            </div>
          </div>
          <div className="ml-auto"><Countdown iso={opener.kickoffUtc} /></div>
        </div>
      </section>

      {upcoming && (
        <Section title="Next up" kicker="Family viewing">
          <div className="grid md:grid-cols-2 gap-4">
            <MatchCard m={upcoming} />
            <div className="chunky-card p-6 bg-wc-gold">
              <div className="text-xs uppercase tracking-widest font-bold text-wc-deep/70 mb-1">Tonight on the sofa</div>
              <p className="text-lg font-bold">
                Pick your players, place your bets in the predictions game and grab the snacks.
                We&rsquo;ll show you what&rsquo;s on the BBC and ITV in UK time.
              </p>
              <Link href="/predictions" className="chunky-btn inline-block mt-3 bg-white px-4 py-2 font-bold">Open predictions →</Link>
            </div>
          </div>
        </Section>
      )}

      <Section title="Today's matches" kicker={today.length ? `${today.length} match${today.length === 1 ? "" : "es"}` : "Tournament off-day"}>
        {today.length === 0 ? (
          <div className="chunky-card p-6 bg-white max-w-2xl">
            <p className="text-lg">No matches today. Check the <Link className="underline font-bold" href="/fixtures">full fixtures list</Link> for what&rsquo;s coming up.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{today.map((m) => <MatchCard key={m.id} m={m} />)}</div>
        )}
      </Section>

      <Section title="Groups" kicker="12 groups · 48 teams">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GROUP_LIST.map((g) => (
            <Link key={g} href={`/groups/${g}`} className="chunky-card p-4 bg-white hover:bg-wc-cream transition">
              <div className={`inline-flex font-display text-2xl px-3 py-0.5 rounded ${GROUP_COLORS[g]} text-white`}>Group {g}</div>
              <ul className="mt-3 space-y-1 text-sm font-semibold">
                {GROUPS[g].slice(0, 4).map((code) => (
                  <li key={code} className="flex items-center gap-2">
                    <span className="text-lg">{teamFlag(code)}</span>
                    <span className="truncate">{teamName(code)}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </Section>

      <section className="border-y-[3px] border-wc-ink bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-[1fr_1.4fr] gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-wc-magenta">16 host cities</div>
            <h2 className="font-display text-4xl md:text-5xl mt-1"><span className="scribble-underline">From Vancouver to Mexico City</span></h2>
            <p className="mt-3 text-lg">Every city brings its own colours and feel. See where each match is played and which stadium your team is heading to.</p>
            <Link href="/cities" className="chunky-btn inline-block mt-4 bg-wc-cyan text-white px-5 py-2 font-bold">Explore host cities →</Link>
          </div>
          <div className="chunky-card p-2 bg-white">
            <Image src="/fifa/host-cities-grid.jpg" alt="Host city logos" width={1000} height={500} className="rounded-md" />
          </div>
        </div>
      </section>

      <Section title="The road to the final" kicker={`${all.length} matches`}>
        <div className="grid md:grid-cols-3 gap-4">
          <CtaCard color="bg-wc-cyan" title="The bracket" desc="See how the knockout slots into place." href="/knockout" />
          <CtaCard color="bg-wc-coral" title="Latest news" desc="UK and global headlines, deduped." href="/news" />
          <CtaCard color="bg-wc-purple" title="The final" desc={`${new Date(final.kickoffUtc).toUTCString().slice(0, 16)} · MetLife Stadium`} href={`/match/${final.id}`} />
        </div>
      </Section>
    </>
  );
}

function CtaCard({ color, title, desc, href }: { color: string; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className={`chunky-card p-6 ${color} text-white hover:translate-y-[-3px] transition block`}>
      <div className="font-display text-3xl">{title}</div>
      <p className="opacity-90 mt-1">{desc}</p>
      <div className="mt-3 font-bold">Open →</div>
    </Link>
  );
}

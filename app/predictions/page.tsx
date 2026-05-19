"use client";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/Section";
import { GROUP_LIST, GROUPS, GROUP_COLORS } from "@/lib/groups";
import { TEAMS, teamFlag, teamName } from "@/lib/teams";
import { COLORS, EMOJIS, emptyPicks, loadState, saveState, type MemberPicks, type PredictionsState } from "@/lib/predictions";
import { Mascot } from "@/components/Mascot";
import { MaestroCelebration } from "@/components/MaestroCelebration";

const FAMOUS_SCORERS = ["Mbappé", "Haaland", "Bellingham", "Kane", "Vinícius Jr", "Lamine Yamal", "Lautaro Martínez", "Salah", "Pulisic", "Kvaratskhelia"];

export default function PredictionsPage() {
  const [state, setState] = useState<PredictionsState>({ members: [], active: null, picks: {} });
  const [hydrated, setHydrated] = useState(false);
  const [newName, setNewName] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const active = state.active ? state.members.find((m) => m.id === state.active) ?? null : null;
  const picks: MemberPicks = active ? state.picks[active.id] ?? emptyPicks() : emptyPicks();

  // Auto-fire celebration once when an active member's champion pick matches the actual champion.
  const isWinner = !!(active && state.actualChampion && picks.champion === state.actualChampion);
  useEffect(() => {
    if (isWinner) setShowCelebration(true);
  }, [isWinner, active?.id]);

  function update(p: MemberPicks) {
    if (!active) return;
    setState({ ...state, picks: { ...state.picks, [active.id]: p } });
  }

  function addMember() {
    if (!newName.trim()) return;
    const id = Math.random().toString(36).slice(2, 9);
    const m = {
      id,
      name: newName.trim(),
      emoji: EMOJIS[state.members.length % EMOJIS.length],
      color: COLORS[state.members.length % COLORS.length],
    };
    setState({
      ...state,
      members: [...state.members, m],
      active: id,
      picks: { ...state.picks, [id]: emptyPicks() },
    });
    setNewName("");
  }

  function removeMember(id: string) {
    const remaining = state.members.filter((m) => m.id !== id);
    const { [id]: _, ...rest } = state.picks;
    setState({ ...state, members: remaining, active: remaining[0]?.id ?? null, picks: rest });
  }

  const filled = countFilled(picks);
  const totalSlots = GROUP_LIST.length * 2 + 4 + 2 + 1 + 1; // groups + semis + finalists + champion + golden boot

  const qualifiedCodes = useMemo(() => TEAMS.filter((t) => t.qualified).map((t) => t.code), []);

  return (
    <Section title="Predictions" kicker="One sheet per player · saved locally">
      <MaestroCelebration
        open={showCelebration}
        memberName={active?.name ?? "Champ"}
        onClose={() => setShowCelebration(false)}
      />

      {!state.members.length ? (
        <div className="chunky-card p-6 bg-white max-w-2xl">
          <div className="flex items-center gap-4">
            <Mascot size={72} />
            <div>
              <div className="font-display text-3xl">Add your first player</div>
              <p className="text-sm text-wc-deep/70">Each player gets their own sheet. Picks are saved on this device.</p>
            </div>
          </div>
          <AddMemberInput value={newName} onChange={setNewName} onAdd={addMember} />
        </div>
      ) : (
        <>
          <div className="chunky-card p-4 bg-white mb-6 flex flex-wrap items-center gap-2">
            {state.members.map((m) => (
              <button
                key={m.id}
                onClick={() => setState({ ...state, active: m.id })}
                className={`chunky-btn px-4 py-2 font-bold flex items-center gap-2 ${state.active === m.id ? "ring-4 ring-wc-gold" : ""}`}
                style={{ background: m.color, color: "white" }}
              >
                <span className="text-xl">{m.emoji}</span>{m.name}
              </button>
            ))}
            <AddMemberInput value={newName} onChange={setNewName} onAdd={addMember} compact />
            {active && (
              <button onClick={() => removeMember(active.id)} className="ml-auto text-xs underline text-wc-deep/60">
                Remove {active.name}
              </button>
            )}
          </div>

          {active && (
            <>
              <div className="chunky-card p-5 bg-wc-gold mb-6 flex items-center gap-4">
                <div className="text-4xl">{active.emoji}</div>
                <div className="flex-1">
                  <div className="font-display text-2xl">{active.name}&rsquo;s sheet</div>
                  <div className="text-sm">
                    {filled} / {totalSlots} predictions filled
                  </div>
                  <div className="mt-2 h-2 bg-wc-ink/10 rounded-full overflow-hidden">
                    <div className="h-full bg-wc-magenta" style={{ width: `${(filled / totalSlots) * 100}%` }} />
                  </div>
                </div>
                {isWinner && (
                  <button
                    onClick={() => setShowCelebration(true)}
                    className="chunky-btn bg-wc-magenta text-white px-4 py-2 font-bold"
                  >
                    🏆 Replay celebration
                  </button>
                )}
              </div>

              <h3 className="font-display text-2xl mb-3">Group winners &amp; runners-up</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GROUP_LIST.map((g) => (
                  <div key={g} className="chunky-card p-4 bg-white">
                    <div className={`inline-flex font-display text-xl px-2 ${GROUP_COLORS[g]} text-white rounded`}>Group {g}</div>
                    <Picker
                      label="1st"
                      teams={GROUPS[g]}
                      value={picks.groupWinners[g] ?? null}
                      onChange={(v) => update({ ...picks, groupWinners: { ...picks.groupWinners, [g]: v ?? "" } })}
                    />
                    <Picker
                      label="2nd"
                      teams={GROUPS[g].filter((t) => t !== picks.groupWinners[g])}
                      value={picks.runnersUp[g] ?? null}
                      onChange={(v) => update({ ...picks, runnersUp: { ...picks.runnersUp, [g]: v ?? "" } })}
                    />
                  </div>
                ))}
              </div>

              <h3 className="font-display text-2xl mt-8 mb-3">Semi-finalists</h3>
              <p className="text-sm text-wc-cream bg-wc-ink/80 inline-block px-3 py-1.5 rounded mb-3">
                Pick the four teams you reckon will reach the semis. Placeholders fill in as the
                tournament progresses.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="chunky-card p-4 bg-wc-coral text-white">
                    <div className="font-display text-xl">Semi #{i + 1}</div>
                    <Picker
                      label="Team"
                      teams={qualifiedCodes}
                      value={picks.semiFinalists[i] ?? null}
                      onChange={(v) => {
                        const next = [...picks.semiFinalists];
                        next[i] = v;
                        update({ ...picks, semiFinalists: next });
                      }}
                    />
                  </div>
                ))}
              </div>

              <h3 className="font-display text-2xl mt-8 mb-3">The grand prizes</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="chunky-card p-4 bg-wc-cyan text-white">
                  <div className="font-display text-2xl mb-2">Finalists</div>
                  <Picker
                    label="Finalist 1"
                    teams={qualifiedCodes}
                    value={picks.finalists[0]}
                    onChange={(v) => update({ ...picks, finalists: [v, picks.finalists[1]] })}
                  />
                  <Picker
                    label="Finalist 2"
                    teams={qualifiedCodes}
                    value={picks.finalists[1]}
                    onChange={(v) => update({ ...picks, finalists: [picks.finalists[0], v] })}
                  />
                </div>
                <div className="chunky-card p-4 bg-wc-magenta text-white">
                  <div className="font-display text-2xl mb-2">Champion 🏆</div>
                  <Picker
                    label="Winner"
                    teams={qualifiedCodes}
                    value={picks.champion}
                    onChange={(v) => update({ ...picks, champion: v })}
                  />
                </div>
                <div className="chunky-card p-4 bg-wc-purple text-white">
                  <div className="font-display text-2xl mb-2">Golden boot ⚽</div>
                  <select
                    value={picks.goldenBoot ?? ""}
                    onChange={(e) => update({ ...picks, goldenBoot: e.target.value || null })}
                    className="w-full chunky-btn bg-white text-wc-ink px-3 py-2 font-semibold"
                  >
                    <option value="">— pick a player —</option>
                    {FAMOUS_SCORERS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-8 chunky-card p-5 bg-white">
                <div className="font-display text-2xl mb-2">Leaderboard</div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {state.members.map((m) => {
                    const f = countFilled(state.picks[m.id] ?? emptyPicks());
                    const won = state.actualChampion && state.picks[m.id]?.champion === state.actualChampion;
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: `${m.color}20` }}>
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="font-bold flex-1">{m.name}{won && " 🏆"}</span>
                        <span className="font-display text-xl">{f}/{totalSlots}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-wc-deep/60 mt-3">
                  Scores tally up automatically as the tournament progresses: 3 pts per correct group winner, 2 pts per runner-up, 4 pts per semi-finalist, 5 pts per finalist, 10 pts for the champion, 5 pts for golden boot.
                </p>
              </div>

              {/* Result reveal — bright, centred, hard to miss once the final whistle blows. */}
              <div className="mt-10 mx-auto max-w-3xl chunky-card p-8 md:p-10 bg-wc-magenta text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20 dotted" />
                <div className="relative">
                  <div className="text-5xl mb-2">🏆</div>
                  <div className="font-display text-3xl md:text-5xl leading-tight">
                    When the tournament ends…
                  </div>
                  <p className="text-base md:text-lg mt-3 max-w-xl mx-auto">
                    Pick the actual champion below to reveal who got it right.
                    Anyone whose pick matches gets the full <strong>Maestro</strong> celebration —
                    confetti, fireworks, the lot.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
                    <select
                      value={state.actualChampion ?? ""}
                      onChange={(e) => setState({ ...state, actualChampion: e.target.value || null })}
                      className="chunky-btn bg-wc-gold text-wc-ink px-5 py-3 font-bold text-lg"
                    >
                      <option value="">— pick the world champion —</option>
                      {qualifiedCodes.map((c) => (
                        <option key={c} value={c}>{teamFlag(c)} {teamName(c)}</option>
                      ))}
                    </select>
                    {state.actualChampion && (
                      <button
                        onClick={() => setState({ ...state, actualChampion: null })}
                        className="chunky-btn bg-white text-wc-ink px-4 py-2 font-bold text-sm"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Section>
  );
}

function countFilled(p: MemberPicks) {
  let n = 0;
  n += Object.values(p.groupWinners).filter(Boolean).length;
  n += Object.values(p.runnersUp).filter(Boolean).length;
  n += p.semiFinalists.filter(Boolean).length;
  n += p.finalists.filter(Boolean).length;
  if (p.champion) n++;
  if (p.goldenBoot) n++;
  return n;
}

function AddMemberInput({
  value,
  onChange,
  onAdd,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${compact ? "" : "mt-4"}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder="Player name"
        className="chunky-btn bg-white px-3 py-2 font-semibold flex-1 min-w-[160px]"
      />
      <button onClick={onAdd} className="chunky-btn bg-wc-magenta text-white px-4 py-2 font-bold">
        Add
      </button>
    </div>
  );
}

function Picker({
  label,
  teams,
  value,
  onChange,
}: {
  label: string;
  teams: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="block mt-2">
      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{label}</div>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-1 w-full chunky-btn bg-white text-wc-ink px-3 py-2 font-semibold"
      >
        <option value="">— pick a team —</option>
        {teams.map((c) => (
          <option key={c} value={c}>
            {teamFlag(c)} {teamName(c)}
          </option>
        ))}
      </select>
    </label>
  );
}

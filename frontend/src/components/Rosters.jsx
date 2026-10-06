import { money, SKILL_LABEL, teamColor } from '../lib/format'

function TeamSheet({ team, mine }) {
  const color = teamColor(team.id)
  const left = (team.remaining_budget / team.total_budget) * 100
  return (
    <article
      style={{ borderLeftColor: color }}
      className={`rounded-md border border-l-4 bg-pitch-900 p-4 ${mine ? 'border-sun/70' : 'border-pitch-700'}`}
    >
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="truncate font-display text-xl font-bold">{team.name}</h3>
        <span className="shrink-0 text-sm text-chalk-muted">
          {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
        </span>
      </header>
      <p className="mt-1 text-sm">
        <span className="font-semibold tabular-nums">{money(team.remaining_budget)}</span>
        <span className="text-chalk-muted"> left of {money(team.total_budget)}</span>
      </p>
      <div
        role="progressbar"
        aria-label={`${team.name} budget left`}
        aria-valuemin={0}
        aria-valuemax={team.total_budget}
        aria-valuenow={team.remaining_budget}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-plate"
      >
        <div className="h-full rounded-full" style={{ width: `${left}%`, backgroundColor: color }} />
      </div>
      {team.players.length > 0 && (
        <ul className="mt-3 divide-y divide-pitch-700/60 text-sm">
          {team.players.map((p) => (
            <li key={p.id} className="flex items-baseline justify-between gap-2 py-1.5">
              <span className="min-w-0 truncate">
                {p.name} <span className="text-chalk-muted">({SKILL_LABEL[p.skill]})</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{money(p.sold_price)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function Rosters({ teams, myTeamId, className = '' }) {
  return (
    <section aria-labelledby="team-sheets" className={className}>
      <h2 id="team-sheets" className="mb-3 font-display text-2xl font-extrabold leading-none">
        Team sheets
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {teams.map((t) => (
          <TeamSheet key={t.id} team={t} mine={t.id === myTeamId} />
        ))}
      </div>
    </section>
  )
}

import { TeamDot } from './ui'

function RoleButton({ title, subtitle, teamId, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-amber-400/60 focus-visible:outline-2 focus-visible:outline-amber-400"
    >
      <span className="flex items-center gap-2 font-semibold">
        {teamId && <TeamDot teamId={teamId} />}
        {title}
      </span>
      <span className="mt-1 block text-sm text-slate-400">{subtitle}</span>
    </button>
  )
}

export default function RolePicker({ teams, onChoose }) {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-4 py-10">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-amber-400">IIT Goa Premier League</p>
        <h1 className="mt-1 text-3xl font-bold">Player Auction</h1>
        <p className="mt-2 text-slate-400">Pick your role to join. No password needed, this is a demo.</p>
      </header>
      <RoleButton
        title="Auctioneer"
        subtitle="Put players up, accept or reject bids"
        onClick={() => onChoose({ role: 'auctioneer' })}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {teams.map((t) => (
          <RoleButton
            key={t.id}
            teamId={t.id}
            title={t.name}
            subtitle="Team manager: place bids"
            onClick={() => onChoose({ role: 'manager', teamId: t.id })}
          />
        ))}
      </div>
      <RoleButton
        title="Spectator"
        subtitle="Watch the auction and rosters"
        onClick={() => onChoose({ role: 'viewer' })}
      />
    </main>
  )
}

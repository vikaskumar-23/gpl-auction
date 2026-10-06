import { teamColor } from '../lib/format'

function RoleButton({ title, subtitle, teamId, onClick }) {
  return (
    <button
      onClick={onClick}
      style={teamId ? { borderLeftColor: teamColor(teamId) } : undefined}
      className={`w-full rounded-md border border-pitch-700 bg-pitch-900 px-4 py-3 text-left transition hover:bg-pitch-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun ${teamId ? 'border-l-4' : ''}`}
    >
      <span className="block font-display text-xl font-bold">{title}</span>
      <span className="block text-sm text-chalk-muted">{subtitle}</span>
    </button>
  )
}

function Group({ label, children }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-chalk-muted">{label}</h2>
      {children}
    </div>
  )
}

export default function RolePicker({ teams, onChoose }) {
  return (
    <main className="mx-auto max-w-xl space-y-8 px-4 py-12">
      <header>
        <p className="text-chalk-muted">IIT Goa Premier League</p>
        <h1 className="font-display text-6xl font-extrabold leading-none">Player Auction</h1>
        <p className="mt-3 text-chalk-muted">Choose how you are joining. There is no password; this is a demo.</p>
      </header>
      <Group label="Run the room">
        <RoleButton
          title="Auctioneer"
          subtitle="Put players up, then sell to the highest bid or reject the round"
          onClick={() => onChoose({ role: 'auctioneer' })}
        />
      </Group>
      <Group label="Bid for a team">
        <div className="grid gap-2 sm:grid-cols-2">
          {teams.map((t) => (
            <RoleButton
              key={t.id}
              teamId={t.id}
              title={t.name}
              subtitle="Team manager"
              onClick={() => onChoose({ role: 'manager', teamId: t.id })}
            />
          ))}
        </div>
      </Group>
      <Group label="Just watching">
        <RoleButton
          title="Spectator"
          subtitle="Follow the bids and team sheets"
          onClick={() => onChoose({ role: 'viewer' })}
        />
      </Group>
    </main>
  )
}

import { useState } from 'react'
import Header from './components/Header'
import RolePicker from './components/RolePicker'
import { loadSession, saveSession } from './lib/session'
import { useLiveState } from './lib/useLiveState'

export default function App() {
  const { state, connected } = useLiveState()
  const [session, setSession] = useState(loadSession)

  function choose(next) {
    saveSession(next)
    setSession(next)
  }

  if (!state) {
    return <p className="grid min-h-dvh place-items-center text-slate-400">Connecting to the auction…</p>
  }

  const myTeam = session?.role === 'manager' ? state.teams.find((t) => t.id === session.teamId) : null
  if (!session || (session.role === 'manager' && !myTeam)) {
    return <RolePicker teams={state.teams} onChoose={choose} />
  }

  const who = session.role === 'auctioneer' ? 'Auctioneer' : myTeam ? `${myTeam.name} · Manager` : 'Spectator'

  return (
    <div className="min-h-dvh">
      <Header who={who} connected={connected} onSwitch={() => choose(null)} />
      <main className="mx-auto max-w-7xl p-4">{/* board: next commit */}</main>
    </div>
  )
}

import { useState } from 'react'
import AuctioneerPanel from './components/AuctioneerPanel'
import AuctionStage from './components/AuctionStage'
import BidBox from './components/BidBox'
import Header from './components/Header'
import PlayerList from './components/PlayerList'
import Rosters from './components/Rosters'
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
    return <p className="grid min-h-dvh place-items-center text-chalk-muted">Connecting to the auction…</p>
  }

  const myTeam = session?.role === 'manager' ? state.teams.find((t) => t.id === session.teamId) : null
  if (!session || (session.role === 'manager' && !myTeam)) {
    return <RolePicker teams={state.teams} onChoose={choose} />
  }

  const who =
    session.role === 'auctioneer' ? 'Running the auction' : myTeam ? `Managing ${myTeam.name}` : 'Watching as a spectator'

  return (
    <div className="min-h-dvh">
      <Header who={who} connected={connected} onSwitch={() => choose(null)} />
      {/* Phone: stage, pool, teams stacked. Desktop: pool | stage | teams. */}
      <main className="mx-auto grid max-w-7xl items-start gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
        <AuctionStage auction={state.auction} className="lg:order-2">
          {/* keyed by player: a new player on the block resets the amount and any error */}
          {myTeam && <BidBox key={state.auction.player?.id ?? 'idle'} team={myTeam} auction={state.auction} />}
          {session.role === 'auctioneer' && (
            <AuctioneerPanel key={state.auction.player?.id ?? 'idle'} auction={state.auction} />
          )}
        </AuctionStage>
        <PlayerList
          className="lg:order-1"
          players={state.players}
          canStart={session.role === 'auctioneer'}
          auctionActive={!!state.auction.player}
        />
        <Rosters className="lg:order-3" teams={state.teams} myTeamId={myTeam?.id} />
      </main>
    </div>
  )
}

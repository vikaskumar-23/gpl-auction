import { useState } from 'react'
import { api } from '../lib/api'
import { money } from '../lib/format'
import { Board, Button, ErrorText, SkillTag } from './ui'

export default function PlayerList({ players, canStart, auctionActive, className = '' }) {
  const [error, setError] = useState('')
  const available = players.filter((p) => p.status === 'available')

  async function start(player) {
    setError('')
    try {
      await api.start(player.id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Board
      title="Player pool"
      aside={<span className="text-sm text-chalk-muted">{available.length} unsold</span>}
      className={className}
    >
      <ErrorText>{error}</ErrorText>
      {available.length === 0 ? (
        <p className="text-chalk-muted">Every player has been sold.</p>
      ) : (
        <ul className="-my-2 divide-y divide-pitch-700/60">
          {available.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-2 text-sm text-chalk-muted">
                  <SkillTag skill={p.skill} />
                  Base {money(p.base_price)}
                </p>
              </div>
              {canStart && (
                <Button variant="ghost" className="shrink-0" disabled={auctionActive} onClick={() => start(p)}>
                  Start
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Board>
  )
}

import { useState } from 'react'
import { api } from '../lib/api'
import { money } from '../lib/format'
import { Button, ErrorText } from './ui'

export default function AuctioneerPanel({ auction }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { player, bids } = auction
  const top = bids[0]

  // confirm() is the browser's own dialog: enough to stop a misclick on a sale
  async function run(action, question) {
    if (!window.confirm(question)) return
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-5 border-t border-pitch-700 pt-4">
      <h3 className="mb-3 font-display text-xl font-bold">Auctioneer</h3>
      {!player ? (
        <p className="text-chalk-muted">Choose a player from the pool and press Start to open bidding.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            disabled={busy || !top}
            onClick={() =>
              run(() => api.accept(top.id), `Sell ${player.name} to ${top.team_name} for ${money(top.amount)}?`)
            }
          >
            {top ? `Sell to ${top.team_name} for ${money(top.amount)}` : 'No bids to accept yet'}
          </Button>
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => run(api.reject, `Reject this round? ${player.name} goes back to the pool unsold.`)}
          >
            Reject round
          </Button>
        </div>
      )}
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

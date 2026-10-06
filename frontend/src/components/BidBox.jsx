import { useState } from 'react'
import { api } from '../lib/api'
import { money } from '../lib/format'
import { Button, ErrorText } from './ui'

const RAISES = [5, 10, 25, 50]

// The server is the only judge of the bid rules; this box shows its message as-is.
// No min/max attributes on purpose: the browser's own validation would hide that message.
export default function BidBox({ team, auction }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { player, bids } = auction
  const top = bids[0]
  const toBeat = player ? Math.max(player.base_price, top?.amount ?? 0) : 0

  const waiting = !player
    ? 'Waiting for the auctioneer to put a player up.'
    : top?.team_id === team.id
      ? 'You hold the highest bid. Wait for another team to bid.'
      : null

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.bid(team.id, Number(amount))
      setAmount('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-5 border-t border-pitch-700 pt-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold">Your bid</h3>
        <span className="text-sm text-chalk-muted">
          {team.name} have <span className="font-semibold text-chalk">{money(team.remaining_budget)}</span> left
        </span>
      </div>
      {waiting ? (
        <p className="text-chalk-muted">{waiting}</p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="bid-amount" className="block text-sm text-chalk-muted">
            Amount in ₹ lakh, more than {toBeat} ({money(toBeat)})
          </label>
          <div className="flex gap-2">
            <input
              id="bid-amount"
              type="number"
              inputMode="numeric"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(toBeat + 5)}
              className="min-h-11 w-full min-w-0 appearance-none rounded-md border border-pitch-700 bg-plate px-3 text-base tabular-nums text-chalk [-moz-appearance:textfield] placeholder:text-chalk-muted/60 focus:border-sun focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button type="submit" disabled={busy || !amount} className="shrink-0">
              Place bid
            </Button>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Quick amounts">
            {RAISES.map((r) => (
              <Button
                key={r}
                type="button"
                variant="ghost"
                className="min-h-9 px-3 text-sm"
                onClick={() => setAmount(String(toBeat + r))}
              >
                +{r} L
              </Button>
            ))}
          </div>
        </form>
      )}
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

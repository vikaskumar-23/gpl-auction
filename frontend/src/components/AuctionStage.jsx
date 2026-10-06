import { money } from '../lib/format'
import { Board, ScorePlates, SkillTag, TeamDot } from './ui'

// Role panels arrive as children and sit between the price and the bid log,
// so on a phone the bid box is right under the number you are trying to beat.
export default function AuctionStage({ auction, className = '', children }) {
  const { player, bids } = auction
  const top = bids[0]

  if (!player) {
    return (
      <Board title="On the block" className={className}>
        <p className="py-6 text-chalk-muted">No player on the block yet.</p>
        {children}
      </Board>
    )
  }

  return (
    <Board title="On the block" aside={<SkillTag skill={player.skill} />} className={className}>
      <p className="font-display text-4xl font-extrabold leading-none sm:text-5xl">{player.name}</p>
      <p className="mt-1 text-chalk-muted">Base price {money(player.base_price)}</p>

      <div className="mt-5" aria-live="polite">
        {top ? (
          <>
            <ScorePlates key={top.id} lakh={top.amount} />
            <p className="mt-2 flex items-center gap-2">
              <TeamDot teamId={top.team_id} />
              {top.team_name} lead
            </p>
          </>
        ) : (
          <p className="text-lg text-chalk-muted">No bids yet. The opening bid must beat {money(player.base_price)}.</p>
        )}
      </div>

      {children}

      {bids.length > 0 && (
        <div className="mt-5 border-t border-pitch-700 pt-4">
          <h3 className="mb-2 text-sm font-medium text-chalk-muted">Bids this round ({bids.length})</h3>
          <ol className="max-h-72 divide-y divide-pitch-700/60 overflow-y-auto">
            {bids.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-1.5">
                <span className="flex min-w-0 items-center gap-2">
                  <TeamDot teamId={b.team_id} />
                  <span className="truncate">{b.team_name}</span>
                </span>
                <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                  <time dateTime={b.created_at} className="hidden text-xs text-chalk-muted min-[400px]:inline">
                    {new Date(b.created_at).toLocaleTimeString()}
                  </time>
                  <span className="font-semibold">{money(b.amount)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Board>
  )
}

export default function Header({ who, connected, onSwitch }) {
  return (
    <header className="sticky top-0 z-10 border-b border-pitch-700 bg-pitch-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <p className="font-display text-2xl font-extrabold leading-none">GPL Auction</p>
          <p className="truncate text-sm text-chalk-muted">{who}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <span aria-live="polite" className="flex items-center gap-1.5 text-chalk-muted">
            <span className={`size-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-laterite'}`} />
            {connected ? 'Live' : 'Reconnecting…'}
          </span>
          <button
            onClick={onSwitch}
            className="rounded-md border border-pitch-700 px-3 py-1.5 hover:border-chalk-muted focus-visible:outline-2 focus-visible:outline-sun"
          >
            Switch role
          </button>
        </div>
      </div>
    </header>
  )
}

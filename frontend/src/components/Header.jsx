export default function Header({ who, connected, onSwitch }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-amber-400">GPL Auction</p>
          <p className="truncate font-semibold">{who}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <span aria-live="polite" className={connected ? 'text-emerald-400' : 'text-slate-500'}>
            {connected ? '● Live' : '○ Reconnecting…'}
          </span>
          <button onClick={onSwitch} className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/15">
            Switch role
          </button>
        </div>
      </div>
    </header>
  )
}

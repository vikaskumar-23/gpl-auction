import { SKILL_LABEL, teamColor } from '../lib/format'

export function Card({ title, aside, className = '', children }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-slate-900/70 p-4 ${className}`}>
      {title && (
        <header className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h2>
          {aside}
        </header>
      )}
      {children}
    </section>
  )
}

const BUTTON = {
  primary: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
  ghost: 'bg-white/10 text-slate-100 hover:bg-white/15',
  danger: 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/25',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`min-h-11 rounded-xl px-4 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  )
}

export function SkillBadge({ skill }) {
  return <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{SKILL_LABEL[skill]}</span>
}

export function TeamDot({ teamId }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: teamColor(teamId) }}
    />
  )
}

export function ErrorText({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
      {children}
    </p>
  )
}

import { money, moneyParts, SKILL_LABEL, teamColor } from '../lib/format'

export function Board({ title, aside, className = '', children }) {
  return (
    <section className={`rounded-lg border border-pitch-700 bg-pitch-900 ${className}`}>
      <header className="flex items-baseline justify-between gap-3 border-b border-pitch-700 px-4 py-3">
        <h2 className="font-display text-2xl font-extrabold leading-none">{title}</h2>
        {aside}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

const BUTTON = {
  primary: 'bg-sun text-plate hover:brightness-110',
  ghost: 'border border-pitch-700 text-chalk hover:border-chalk-muted',
  danger: 'border border-laterite/70 text-laterite hover:bg-laterite/10',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`min-h-11 rounded-md px-4 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  )
}

export function SkillTag({ skill }) {
  return (
    <span className="rounded border border-pitch-700 px-1.5 py-px text-xs text-chalk-muted">{SKILL_LABEL[skill]}</span>
  )
}

export function TeamDot({ teamId }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2.5 shrink-0 rounded-sm"
      style={{ backgroundColor: teamColor(teamId) }}
    />
  )
}

// The price as scoreboard plates; `key` it by bid id so a new bid flips them in.
export function ScorePlates({ lakh }) {
  const { value, unit } = moneyParts(lakh)
  return (
    <p className="flex items-end gap-1.5">
      <span className="sr-only">{money(lakh)}</span>
      <span aria-hidden className="mr-1 self-center font-display text-3xl font-bold text-chalk-muted">
        ₹
      </span>
      {[...value].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{ animationDelay: `${i * 70}ms` }}
          className={`plate grid h-16 place-items-center rounded-[3px] bg-plate font-display text-5xl font-extrabold text-sun sm:h-20 sm:text-6xl ${ch === '.' ? 'w-4' : 'w-11 sm:w-14'}`}
        >
          {ch}
        </span>
      ))}
      <span aria-hidden className="ml-1 font-display text-3xl font-extrabold">
        {unit}
      </span>
    </p>
  )
}

export function ErrorText({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-3 border-l-2 border-laterite bg-laterite/10 px-3 py-2 text-sm">
      {children}
    </p>
  )
}

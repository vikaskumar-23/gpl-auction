// Money is whole ₹ lakh: 75 -> ₹75 L, 150 -> ₹1.5 Cr, 1000 -> ₹10 Cr
export function moneyParts(lakh) {
  return lakh >= 100 ? { value: String(+(lakh / 100).toFixed(2)), unit: 'Cr' } : { value: String(lakh), unit: 'L' }
}

export function money(lakh) {
  const { value, unit } = moneyParts(lakh)
  return `₹${value} ${unit}`
}

export const SKILL_LABEL = { batting: 'Batter', bowling: 'Bowler', both: 'All-rounder' }

// Picked to stay distinct from each other and readable on the green boards.
const TEAM_COLORS = ['#f07167', '#74a7fe', '#c59bf0', '#4fd8c4']
export const teamColor = (teamId) => TEAM_COLORS[(teamId - 1) % TEAM_COLORS.length]

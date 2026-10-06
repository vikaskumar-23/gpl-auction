// Money is whole ₹ lakh: 75 -> "₹75 L", 150 -> "₹1.5 Cr", 1000 -> "₹10 Cr"
export const money = (lakh) => (lakh >= 100 ? `₹${+(lakh / 100).toFixed(2)} Cr` : `₹${lakh} L`)

export const SKILL_LABEL = { batting: 'Batter', bowling: 'Bowler', both: 'All-rounder' }

const TEAM_COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6']
export const teamColor = (teamId) => TEAM_COLORS[(teamId - 1) % TEAM_COLORS.length]

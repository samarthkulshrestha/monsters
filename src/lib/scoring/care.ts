import type { Act } from './types'

export function computeCareScore(acts: Act[]): number {
  if (acts.length === 0) return 1.0
  const careScores = acts.map(act =>
    act.power_differential * act.relationship_proximity * act.victim_vulnerability
  )
  const mean = careScores.reduce((sum, c) => sum + c, 0) / careScores.length
  return 1 - mean
}

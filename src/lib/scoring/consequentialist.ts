import type { Act } from './types'

function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * (x - midpoint)))
}

export function computeHarm(acts: Act[]): number {
  return acts.reduce((sum, act) => {
    return sum + act.severity * Math.log2(act.victim_count + 1) * act.duration * act.reversibility
  }, 0)
}

export function computeConsequentialistScore(acts: Act[]): number {
  if (acts.length === 0) return 1.0
  const H = computeHarm(acts)
  return 1 - sigmoid(H, 2.0, 1.5)
}

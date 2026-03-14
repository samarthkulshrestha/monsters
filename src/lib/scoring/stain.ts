import type { Act } from './types'

const K = 1.5

export function computeStain(acts: Act[]): number {
  if (acts.length === 0) return 0
  const totalSeverity = acts.reduce((sum, act) => sum + act.severity, 0)
  return 1 - Math.exp(-K * totalSeverity)
}

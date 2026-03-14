import type { AccountabilityEvent } from './types'

const ALPHA = 0.15
const TAU = 50
const GAMMA = 0.05

export function computeTemporalFactor(yearOfPrimaryAct: number, currentYear: number): number {
  const t = currentYear - yearOfPrimaryAct
  if (t <= 0) return 1.0
  return Math.max(0, Math.min(1, 1 - ALPHA * Math.log(1 + t / TAU)))
}

export function computeAccountabilityFactor(
  events: (AccountabilityEvent | string)[], harmH: number, yearOfPrimaryAct: number, currentYear: number
): number {
  if (harmH === 0) return 1.0
  const t = currentYear - yearOfPrimaryAct
  let remainingDebt = harmH * Math.exp(-GAMMA * t)
  for (const event of events) {
    // Skip string entries (legacy format without structured data)
    if (typeof event === 'string') continue
    const eventAge = currentYear - event.year
    remainingDebt -= event.magnitude * Math.exp(-GAMMA * eventAge)
  }
  remainingDebt = Math.max(0, remainingDebt)
  return 1 - remainingDebt / harmH
}

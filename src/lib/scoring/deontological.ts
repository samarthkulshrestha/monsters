import type { Act, CategoricalViolation } from './types'

export const VIOLATION_WEIGHTS: Record<CategoricalViolation, number> = {
  acts_against_children: 0.95,
  bodily_autonomy: 0.90,
  sexual_exploitation: 0.90,
  violence: 0.85,
  coercion: 0.80,
  collaboration_with_oppression: 0.75,
  hate_speech: 0.70,
  fraud_or_theft: 0.60,
}

export function computeDeontologicalScore(acts: Act[]): number {
  const allViolations = acts.flatMap(act => act.categorical_violations)
  if (allViolations.length === 0) return 1.0
  const maxWeight = Math.max(...allViolations.map(v => VIOLATION_WEIGHTS[v] ?? 0))
  return 1 - maxWeight
}

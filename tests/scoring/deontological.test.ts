import { describe, it, expect } from 'vitest'
import { computeDeontologicalScore, VIOLATION_WEIGHTS } from '../../src/lib/scoring/deontological'
import type { Act } from '../../src/lib/scoring/types'

function makeAct(violations: Act['categorical_violations'] = []): Act {
  return {
    description: 'test act',
    severity: 0.5,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0.5,
    relationship_proximity: 0.5,
    victim_vulnerability: 0.5,
    categorical_violations: violations,
  }
}

describe('computeDeontologicalScore', () => {
  it('returns 1.0 for empty acts array', () => {
    expect(computeDeontologicalScore([])).toBe(1.0)
  })

  it('returns 1.0 for acts with no violations', () => {
    const acts = [makeAct([]), makeAct([])]
    expect(computeDeontologicalScore(acts)).toBe(1.0)
  })

  it('returns 0.05 for acts_against_children violation', () => {
    const acts = [makeAct(['acts_against_children'])]
    expect(computeDeontologicalScore(acts)).toBeCloseTo(1 - 0.95)
  })

  it('uses worst violation across multiple acts', () => {
    const acts = [
      makeAct(['fraud_or_theft']),          // weight 0.60
      makeAct(['acts_against_children']),   // weight 0.95
    ]
    // Should use the max weight (0.95) from acts_against_children
    expect(computeDeontologicalScore(acts)).toBeCloseTo(1 - 0.95)
  })

  it('uses worst violation within a single act with multiple violations', () => {
    const acts = [makeAct(['hate_speech', 'bodily_autonomy'])]
    // hate_speech=0.70, bodily_autonomy=0.90 → max=0.90
    expect(computeDeontologicalScore(acts)).toBeCloseTo(1 - 0.90)
  })

  it('returns lower score for more severe violation category', () => {
    const childActs = [makeAct(['acts_against_children'])]
    const fraudActs = [makeAct(['fraud_or_theft'])]
    expect(computeDeontologicalScore(childActs)).toBeLessThan(
      computeDeontologicalScore(fraudActs)
    )
  })

  it('all violation weights are defined and between 0 and 1', () => {
    for (const [, weight] of Object.entries(VIOLATION_WEIGHTS)) {
      expect(weight).toBeGreaterThan(0)
      expect(weight).toBeLessThanOrEqual(1)
    }
  })

  it('score is always between 0 and 1', () => {
    const allViolations: Act['categorical_violations'] = [
      'acts_against_children',
      'bodily_autonomy',
      'sexual_exploitation',
      'violence',
      'coercion',
      'collaboration_with_oppression',
      'hate_speech',
      'fraud_or_theft',
    ]
    const acts = [makeAct(allViolations)]
    const score = computeDeontologicalScore(acts)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(1)
  })
})

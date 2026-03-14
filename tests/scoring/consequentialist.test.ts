import { describe, it, expect } from 'vitest'
import { computeHarm, computeConsequentialistScore } from '../../src/lib/scoring/consequentialist'
import type { Act } from '../../src/lib/scoring/types'

function makeAct(overrides: Partial<Act> = {}): Act {
  return {
    description: 'test act',
    severity: 0.5,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0.5,
    relationship_proximity: 0.5,
    victim_vulnerability: 0.5,
    categorical_violations: [],
    ...overrides,
  }
}

describe('computeHarm', () => {
  it('returns 0 for empty acts', () => {
    expect(computeHarm([])).toBe(0)
  })

  it('returns positive harm for a single act', () => {
    const act = makeAct({ severity: 0.8, victim_count: 10, duration: 0.9, reversibility: 0.9 })
    expect(computeHarm([act])).toBeGreaterThan(0)
  })

  it('scales logarithmically with victim count', () => {
    const act1 = makeAct({ severity: 1, duration: 1, reversibility: 1, victim_count: 1 })
    const act10 = makeAct({ severity: 1, duration: 1, reversibility: 1, victim_count: 10 })
    const act100 = makeAct({ severity: 1, duration: 1, reversibility: 1, victim_count: 100 })

    const h1 = computeHarm([act1])
    const h10 = computeHarm([act10])
    const h100 = computeHarm([act100])

    // Logarithmic: h10 - h1 ≈ h100 - h10 is not true, but h100 < 10 * h10
    expect(h10).toBeGreaterThan(h1)
    expect(h100).toBeGreaterThan(h10)
    // Confirm sub-linear: doubling victims does not double harm linearly
    expect(h100).toBeLessThan(10 * h10)
  })

  it('sums harm across multiple acts', () => {
    const act = makeAct({ severity: 0.5, victim_count: 5, duration: 0.5, reversibility: 0.5 })
    const singleHarm = computeHarm([act])
    const doubleHarm = computeHarm([act, act])
    expect(doubleHarm).toBeCloseTo(2 * singleHarm)
  })
})

describe('computeConsequentialistScore', () => {
  it('returns 1.0 for empty acts', () => {
    expect(computeConsequentialistScore([])).toBe(1.0)
  })

  it('returns a value between 0 and 1 for any acts', () => {
    const acts = [makeAct({ severity: 0.9, victim_count: 1000, duration: 1.0, reversibility: 1.0 })]
    const score = computeConsequentialistScore(acts)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(1)
  })

  it('returns a low score for severe acts with many victims', () => {
    const severeActs = [
      makeAct({ severity: 1.0, victim_count: 500, duration: 1.0, reversibility: 1.0 }),
      makeAct({ severity: 0.9, victim_count: 200, duration: 0.9, reversibility: 0.9 }),
    ]
    const score = computeConsequentialistScore(severeActs)
    expect(score).toBeLessThan(0.3)
  })

  it('multiple severe acts produce lower score than a single severe act', () => {
    const singleAct = [makeAct({ severity: 0.9, victim_count: 50, duration: 1.0, reversibility: 1.0 })]
    const multipleActs = [
      makeAct({ severity: 0.9, victim_count: 50, duration: 1.0, reversibility: 1.0 }),
      makeAct({ severity: 0.8, victim_count: 30, duration: 0.8, reversibility: 0.8 }),
    ]
    expect(computeConsequentialistScore(multipleActs)).toBeLessThan(
      computeConsequentialistScore(singleAct)
    )
  })

  it('mild acts return a relatively high score', () => {
    const mildActs = [makeAct({ severity: 0.1, victim_count: 1, duration: 0.1, reversibility: 0.1 })]
    const score = computeConsequentialistScore(mildActs)
    expect(score).toBeGreaterThan(0.5)
  })
})

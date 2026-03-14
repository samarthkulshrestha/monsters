import { describe, it, expect } from 'vitest'
import { computeCareScore } from '../../src/lib/scoring/care'
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

describe('computeCareScore', () => {
  it('returns 1.0 for empty acts', () => {
    expect(computeCareScore([])).toBe(1.0)
  })

  it('returns 1.0 when power_differential is 0', () => {
    const acts = [makeAct({ power_differential: 0, relationship_proximity: 1.0, victim_vulnerability: 1.0 })]
    expect(computeCareScore(acts)).toBe(1.0)
  })

  it('returns 1.0 when relationship_proximity is 0', () => {
    const acts = [makeAct({ power_differential: 1.0, relationship_proximity: 0, victim_vulnerability: 1.0 })]
    expect(computeCareScore(acts)).toBe(1.0)
  })

  it('returns 1.0 when victim_vulnerability is 0', () => {
    const acts = [makeAct({ power_differential: 1.0, relationship_proximity: 1.0, victim_vulnerability: 0 })]
    expect(computeCareScore(acts)).toBe(1.0)
  })

  it('returns a low score when all care factors are high', () => {
    const acts = [makeAct({ power_differential: 1.0, relationship_proximity: 1.0, victim_vulnerability: 1.0 })]
    // mean = 1.0, score = 0
    expect(computeCareScore(acts)).toBeCloseTo(0.0)
  })

  it('averages care scores across multiple acts', () => {
    const act1 = makeAct({ power_differential: 1.0, relationship_proximity: 1.0, victim_vulnerability: 1.0 })
    const act2 = makeAct({ power_differential: 0.0, relationship_proximity: 0.0, victim_vulnerability: 0.0 })
    // mean = (1.0 + 0.0) / 2 = 0.5
    expect(computeCareScore([act1, act2])).toBeCloseTo(0.5)
  })

  it('lower power differential yields higher score', () => {
    const highPower = [makeAct({ power_differential: 0.9, relationship_proximity: 0.8, victim_vulnerability: 0.8 })]
    const lowPower = [makeAct({ power_differential: 0.1, relationship_proximity: 0.8, victim_vulnerability: 0.8 })]
    expect(computeCareScore(lowPower)).toBeGreaterThan(computeCareScore(highPower))
  })

  it('score is always between 0 and 1 for valid inputs', () => {
    const testCases = [
      [makeAct({ power_differential: 0.5, relationship_proximity: 0.5, victim_vulnerability: 0.5 })],
      [makeAct({ power_differential: 1.0, relationship_proximity: 1.0, victim_vulnerability: 1.0 })],
      [makeAct({ power_differential: 0.0, relationship_proximity: 0.0, victim_vulnerability: 0.0 })],
    ]
    for (const acts of testCases) {
      const score = computeCareScore(acts)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { computeVirtueScore } from '../../src/lib/scoring/virtue'
import type { Character } from '../../src/lib/scoring/types'

describe('computeVirtueScore', () => {
  it('returns 1.0 for perfectly virtuous and consistent character', () => {
    const character: Character = { virtue_score: 1.0, consistency: 1.0 }
    expect(computeVirtueScore(character)).toBe(1.0)
  })

  it('returns a high score for virtuous and consistent character', () => {
    const character: Character = { virtue_score: 0.9, consistency: 0.9 }
    const score = computeVirtueScore(character)
    expect(score).toBeGreaterThan(0.8)
  })

  it('returns a low score for low virtue with high consistency', () => {
    const character: Character = { virtue_score: 0.1, consistency: 1.0 }
    const score = computeVirtueScore(character)
    // V = (1 - 0.1) * 1.0 = 0.9, score = 1 - 0.9 = 0.1
    expect(score).toBeCloseTo(0.1)
  })

  it('returns a moderate score for low virtue with low consistency', () => {
    const character: Character = { virtue_score: 0.1, consistency: 0.2 }
    const score = computeVirtueScore(character)
    // V = 0.9 * 0.2 = 0.18, score = 0.82
    expect(score).toBeCloseTo(0.82)
    expect(score).toBeGreaterThan(0.5)
  })

  it('returns 1.0 when consistency is 0 regardless of virtue_score', () => {
    // V = (1 - virtue_score) * 0 = 0, score = 1
    const character: Character = { virtue_score: 0.0, consistency: 0.0 }
    expect(computeVirtueScore(character)).toBe(1.0)
  })

  it('returns lower score for lower virtue given same consistency', () => {
    const highVirtue: Character = { virtue_score: 0.8, consistency: 0.7 }
    const lowVirtue: Character = { virtue_score: 0.2, consistency: 0.7 }
    expect(computeVirtueScore(highVirtue)).toBeGreaterThan(computeVirtueScore(lowVirtue))
  })

  it('returns lower score for higher consistency given same low virtue', () => {
    const lowConsistency: Character = { virtue_score: 0.2, consistency: 0.3 }
    const highConsistency: Character = { virtue_score: 0.2, consistency: 0.9 }
    // Higher consistency amplifies bad virtue → lower score
    expect(computeVirtueScore(highConsistency)).toBeLessThan(computeVirtueScore(lowConsistency))
  })

  it('score is always between 0 and 1 for valid inputs', () => {
    const testCases: Character[] = [
      { virtue_score: 0.0, consistency: 1.0 },
      { virtue_score: 1.0, consistency: 0.0 },
      { virtue_score: 0.5, consistency: 0.5 },
      { virtue_score: 0.0, consistency: 0.0 },
      { virtue_score: 1.0, consistency: 1.0 },
    ]
    for (const character of testCases) {
      const score = computeVirtueScore(character)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { computeArtMerit } from '../../src/lib/scoring/art-merit'
import type { ArtData } from '../../src/lib/scoring/types'

function makeArt(overrides: Partial<ArtData> = {}): ArtData {
  return {
    significance: 5,
    influence: 5,
    replaceability: 5,
    notable_works: [],
    summary: '',
    medium_aura: 0.5,
    contamination: 0.5,
    separability: 0.5,
    ...overrides,
  }
}

const CURRENT_YEAR = 2026
const OLD_WORKS = [1960, 1965, 1970]   // ~60 years ago
const RECENT_WORKS = [2020, 2022, 2024] // ~4 years ago

describe('computeArtMerit', () => {
  it('returns a higher score for higher significance', () => {
    const low = computeArtMerit(makeArt({ significance: 2 }), OLD_WORKS, CURRENT_YEAR)
    const high = computeArtMerit(makeArt({ significance: 9 }), OLD_WORKS, CURRENT_YEAR)
    expect(high).toBeGreaterThan(low)
  })

  it('returns a higher score for higher influence', () => {
    const low = computeArtMerit(makeArt({ influence: 2 }), OLD_WORKS, CURRENT_YEAR)
    const high = computeArtMerit(makeArt({ influence: 9 }), OLD_WORKS, CURRENT_YEAR)
    expect(high).toBeGreaterThan(low)
  })

  it('returns a higher score for lower replaceability (harder to replace)', () => {
    const easyReplace = computeArtMerit(makeArt({ replaceability: 9 }), OLD_WORKS, CURRENT_YEAR)
    const hardReplace = computeArtMerit(makeArt({ replaceability: 1 }), OLD_WORKS, CURRENT_YEAR)
    expect(hardReplace).toBeGreaterThan(easyReplace)
  })

  it('older works have higher logistic factor (cultural age scales up)', () => {
    const oldScore = computeArtMerit(makeArt(), OLD_WORKS, CURRENT_YEAR)
    const recentScore = computeArtMerit(makeArt(), RECENT_WORKS, CURRENT_YEAR)
    expect(oldScore).toBeGreaterThan(recentScore)
  })

  it('returns a value between 0 and 1', () => {
    const score = computeArtMerit(makeArt(), OLD_WORKS, CURRENT_YEAR)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(1)
  })

  it('maximum possible score (all 10s, old works) is less than or equal to 1', () => {
    const art = makeArt({ significance: 10, influence: 10, replaceability: 1 })
    const score = computeArtMerit(art, [1900], CURRENT_YEAR)
    // baseScore = (10*0.35 + 9*0.35 + 10*0.30) / 10 = (3.5 + 3.15 + 3.0)/10 = 0.965
    // logisticFactor → ~1 for very old works
    expect(score).toBeLessThanOrEqual(1)
    expect(score).toBeGreaterThan(0.9)
  })

  it('works with a single-year array for yearOfMajorWorks', () => {
    const score = computeArtMerit(makeArt(), [1990], CURRENT_YEAR)
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThan(1)
  })

  it('recent works score based on art quality, with modest historical bonus for old works', () => {
    const art = makeArt({ significance: 10, influence: 10, replaceability: 1 })
    const recent = computeArtMerit(art, [2025], CURRENT_YEAR)
    const old = computeArtMerit(art, [1950], CURRENT_YEAR)
    // Recent work should still score high — art quality is chronology-independent
    expect(recent).toBeGreaterThan(0.9)
    // Old work gets a historical embeddedness bonus
    expect(old).toBeGreaterThan(recent)
    // But the bonus is modest (up to 15%)
    expect(old - recent).toBeLessThan(0.16)
  })
})

import { describe, it, expect } from 'vitest'
import { computeTemporalFactor, computeAccountabilityFactor } from '../../src/lib/scoring/temporal'
import type { AccountabilityEvent } from '../../src/lib/scoring/types'

describe('computeTemporalFactor', () => {
  it('returns 1.0 for a very recent act (same year)', () => {
    const factor = computeTemporalFactor(2025, 2025)
    expect(factor).toBe(1.0)
  })

  it('returns 1.0 when currentYear is before yearOfPrimaryAct', () => {
    const factor = computeTemporalFactor(2030, 2025)
    expect(factor).toBe(1.0)
  })

  it('returns a lower value for older acts', () => {
    const recent = computeTemporalFactor(2020, 2026)
    const old = computeTemporalFactor(1970, 2026)
    expect(old).toBeLessThan(recent)
  })

  it('is clamped to [0, 1]', () => {
    // Very ancient act
    const ancient = computeTemporalFactor(1000, 2026)
    expect(ancient).toBeGreaterThanOrEqual(0)
    expect(ancient).toBeLessThanOrEqual(1)
  })

  it('50-year-old act still has factor above 0.5 (logarithmic, not exponential)', () => {
    const factor = computeTemporalFactor(1976, 2026)
    // ALPHA * log(1 + 50/50) = 0.15 * log(2) ≈ 0.104, so factor ≈ 0.896
    expect(factor).toBeGreaterThan(0.5)
  })

  it('100-year-old act has lower factor than 50-year-old act', () => {
    const fifty = computeTemporalFactor(1976, 2026)
    const hundred = computeTemporalFactor(1926, 2026)
    expect(hundred).toBeLessThan(fifty)
  })

  it('decay is logarithmic not exponential: doubling time does not halve factor', () => {
    const factor50 = computeTemporalFactor(1976, 2026)
    const factor100 = computeTemporalFactor(1926, 2026)
    // If exponential, factor100 ≈ factor50^2. Logarithmic means factor100 > factor50^2
    // factor50 ≈ 0.896, factor50^2 ≈ 0.803; factor100 should be > 0.803
    expect(factor100).toBeGreaterThan(factor50 * factor50)
  })
})

describe('computeAccountabilityFactor', () => {
  it('returns 1.0 when harm is 0', () => {
    const factor = computeAccountabilityFactor([], 0, 2000, 2026)
    expect(factor).toBe(1.0)
  })

  it('returns less than 1.0 when there is harm but no accountability events', () => {
    const factor = computeAccountabilityFactor([], 2.0, 2010, 2026)
    expect(factor).toBeLessThan(1.0)
  })

  it('accountability events increase the factor', () => {
    const noEvents = computeAccountabilityFactor([], 2.0, 2010, 2026)
    const withEvents: AccountabilityEvent[] = [
      { year: 2015, type: 'apology', magnitude: 0.5, description: 'Public apology' },
    ]
    const withEventsFactor = computeAccountabilityFactor(withEvents, 2.0, 2010, 2026)
    expect(withEventsFactor).toBeGreaterThan(noEvents)
  })

  it('recent accountability events are more effective than old ones', () => {
    const recentEvent: AccountabilityEvent[] = [
      { year: 2025, type: 'restitution', magnitude: 0.5, description: 'Recent' },
    ]
    const oldEvent: AccountabilityEvent[] = [
      { year: 1990, type: 'restitution', magnitude: 0.5, description: 'Old' },
    ]
    const recentFactor = computeAccountabilityFactor(recentEvent, 2.0, 2000, 2026)
    const oldFactor = computeAccountabilityFactor(oldEvent, 2.0, 2000, 2026)
    expect(recentFactor).toBeGreaterThan(oldFactor)
  })

  it('multiple accountability events produce higher factor than single event', () => {
    const singleEvent: AccountabilityEvent[] = [
      { year: 2015, type: 'apology', magnitude: 0.5, description: 'Apology' },
    ]
    const multipleEvents: AccountabilityEvent[] = [
      { year: 2015, type: 'apology', magnitude: 0.5, description: 'Apology' },
      { year: 2018, type: 'restitution', magnitude: 0.4, description: 'Restitution' },
    ]
    const single = computeAccountabilityFactor(singleEvent, 2.0, 2010, 2026)
    const multiple = computeAccountabilityFactor(multipleEvents, 2.0, 2010, 2026)
    expect(multiple).toBeGreaterThan(single)
  })

  it('factor does not exceed 1.0', () => {
    const massiveEvents: AccountabilityEvent[] = [
      { year: 2025, type: 'full_restitution', magnitude: 10.0, description: 'Massive restitution' },
    ]
    const factor = computeAccountabilityFactor(massiveEvents, 1.0, 2020, 2026)
    expect(factor).toBeLessThanOrEqual(1.0)
  })
})

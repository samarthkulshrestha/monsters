import { describe, it, expect } from 'vitest'
import { computeStain } from '../../src/lib/scoring/stain'
import type { Act } from '../../src/lib/scoring/types'

function makeAct(severity: number): Act {
  return {
    description: 'test act',
    severity,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0.5,
    relationship_proximity: 0.5,
    victim_vulnerability: 0.5,
    categorical_violations: [],
  }
}

describe('computeStain', () => {
  it('returns 0 for empty acts', () => {
    expect(computeStain([])).toBe(0)
  })

  it('returns a value between 0 and 1 for any valid acts', () => {
    const acts = [makeAct(0.5), makeAct(0.8)]
    const stain = computeStain(acts)
    expect(stain).toBeGreaterThan(0)
    expect(stain).toBeLessThan(1)
  })

  it('never reaches exactly 1.0 (exponential saturation)', () => {
    // Even with extreme severity, exp(-K*x) > 0 so stain < 1
    const acts = [makeAct(1.0), makeAct(1.0), makeAct(1.0), makeAct(1.0), makeAct(1.0)]
    expect(computeStain(acts)).toBeLessThan(1.0)
  })

  it('increases as severity increases', () => {
    const low = computeStain([makeAct(0.2)])
    const medium = computeStain([makeAct(0.5)])
    const high = computeStain([makeAct(0.9)])
    expect(medium).toBeGreaterThan(low)
    expect(high).toBeGreaterThan(medium)
  })

  it('saturates — adding more acts has diminishing additional stain', () => {
    const one = computeStain([makeAct(1.0)])
    const two = computeStain([makeAct(1.0), makeAct(1.0)])
    const four = computeStain([makeAct(1.0), makeAct(1.0), makeAct(1.0), makeAct(1.0)])

    const delta1 = two - one
    const delta2 = four - two
    // Diminishing returns: adding more severity increases stain less and less
    expect(delta2).toBeLessThan(delta1)
  })

  it('single act with zero severity returns 0', () => {
    expect(computeStain([makeAct(0)])).toBe(0)
  })

  it('stain depends only on total severity, not victim count or other fields', () => {
    const act1 = makeAct(0.6)
    const act2 = { ...makeAct(0.6), victim_count: 1000, duration: 1.0, reversibility: 1.0 }
    // Both have severity 0.6; stain uses only severity
    expect(computeStain([act1])).toBeCloseTo(computeStain([act2]))
  })
})

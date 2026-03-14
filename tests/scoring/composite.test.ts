import { describe, it, expect } from 'vitest'
import { computeCompositeScore } from '../../src/lib/scoring/composite'
import type { Artist } from '../../src/lib/scoring/types'

const CURRENT_YEAR = 2026

function makeArtist(overrides: Partial<Artist> = {}): Artist {
  return {
    id: 'test-artist',
    name: 'Test Artist',
    domain: 'film',
    sub_domain: 'Director',
    portrait: 'test.jpg',
    acts: [
      {
        description: 'A serious harm',
        severity: 0.8,
        victim_count: 1,
        duration: 0.3,
        reversibility: 0.8,
        power_differential: 0.7,
        relationship_proximity: 0.5,
        victim_vulnerability: 0.6,
        categorical_violations: ['bodily_autonomy'],
      },
    ],
    behavior_summary: 'Test summary',
    sources: [],
    character: {
      virtue_score: 0.4,
      consistency: 0.7,
    },
    art: {
      significance: 8,
      influence: 7,
      replaceability: 3,
      notable_works: ['Film A'],
      summary: 'Notable films.',
      medium_aura: 0.4,
      contamination: 0.5,
      separability: 0.5,
    },
    modifiers: {
      alive_and_profiting: false,
      victims_in_process: false,
    },
    temporal: {
      year_of_primary_act: 1980,
      year_of_major_works: [1970, 1975, 1985],
      accountability_events: [],
    },
    verdict: {
      score: null,
      blurb: 'Test blurb.',
    },
    ...overrides,
  }
}

// Polanski-like artist
const polanskiLike: Artist = {
  id: 'roman-polanski',
  name: 'Roman Polanski',
  domain: 'film',
  sub_domain: 'Director',
  portrait: 'roman-polanski.jpg',
  acts: [
    {
      description: 'Convicted of unlawful sex with a 13-year-old in 1977',
      severity: 0.9,
      victim_count: 1,
      duration: 0.2,
      reversibility: 0.9,
      power_differential: 0.9,
      relationship_proximity: 0.7,
      victim_vulnerability: 1.0,
      categorical_violations: ['bodily_autonomy', 'acts_against_children'],
    },
    {
      description: 'Fled sentencing, avoiding accountability',
      severity: 0.5,
      victim_count: 1,
      duration: 1.0,
      reversibility: 0.7,
      power_differential: 0.6,
      relationship_proximity: 0.2,
      victim_vulnerability: 0.5,
      categorical_violations: [],
    },
    {
      description: 'Multiple additional allegations spanning decades',
      severity: 0.7,
      victim_count: 4,
      duration: 0.8,
      reversibility: 0.8,
      power_differential: 0.8,
      relationship_proximity: 0.5,
      victim_vulnerability: 0.7,
      categorical_violations: ['bodily_autonomy'],
    },
  ],
  behavior_summary: 'Convicted of unlawful sex with a 13-year-old in 1977, fled sentencing, multiple other allegations spanning decades.',
  sources: [],
  character: {
    virtue_score: 0.3,
    consistency: 0.8,
  },
  art: {
    significance: 9,
    influence: 8,
    replaceability: 3,
    notable_works: ['Chinatown', 'The Pianist', "Rosemary's Baby"],
    summary: 'Pioneered psychological horror and neo-noir, multiple Oscar-winning films.',
    medium_aura: 0.5,
    contamination: 0.6,
    separability: 0.4,
  },
  modifiers: {
    alive_and_profiting: true,
    victims_in_process: false,
  },
  temporal: {
    year_of_primary_act: 1977,
    year_of_major_works: [1968, 1974, 2002],
    accountability_events: [],
  },
  verdict: {
    score: null,
    blurb: "The art is undeniably masterful. The man is undeniably a monster. He's still out there, living well. Every stream is a vote. You do the math.",
  },
}

describe('computeCompositeScore', () => {
  it('returns all required breakdown fields', () => {
    const breakdown = computeCompositeScore(makeArtist(), CURRENT_YEAR)
    expect(breakdown).toHaveProperty('consequentialist')
    expect(breakdown).toHaveProperty('deontological')
    expect(breakdown).toHaveProperty('virtue')
    expect(breakdown).toHaveProperty('care')
    expect(breakdown).toHaveProperty('stain')
    expect(breakdown).toHaveProperty('temporal_factor')
    expect(breakdown).toHaveProperty('accountability_factor')
    expect(breakdown).toHaveProperty('art_merit')
    expect(breakdown).toHaveProperty('medium_factor')
    expect(breakdown).toHaveProperty('contamination_factor')
    expect(breakdown).toHaveProperty('moral_modifier')
    expect(breakdown).toHaveProperty('raw_score')
    expect(breakdown).toHaveProperty('final_score')
  })

  it('final_score is always between 0 and 100 inclusive', () => {
    const breakdown = computeCompositeScore(makeArtist(), CURRENT_YEAR)
    expect(breakdown.final_score).toBeGreaterThanOrEqual(0)
    expect(breakdown.final_score).toBeLessThanOrEqual(100)
  })

  it('final_score for Polanski-like artist is low (high monster)', () => {
    const breakdown = computeCompositeScore(polanskiLike, CURRENT_YEAR)
    expect(breakdown.final_score).toBeLessThan(50)
  })

  it('alive_and_profiting reduces score compared to not profiting', () => {
    const withProfit = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: true, victims_in_process: false } }),
      CURRENT_YEAR
    )
    const withoutProfit = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: false, victims_in_process: false } }),
      CURRENT_YEAR
    )
    expect(withProfit.final_score).toBeLessThan(withoutProfit.final_score)
  })

  it('victims_in_process reduces score compared to no ongoing victims', () => {
    const withVictims = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: false, victims_in_process: true } }),
      CURRENT_YEAR
    )
    const withoutVictims = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: false, victims_in_process: false } }),
      CURRENT_YEAR
    )
    expect(withVictims.final_score).toBeLessThan(withoutVictims.final_score)
  })

  it('both modifiers active compound the reduction', () => {
    const both = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: true, victims_in_process: true } }),
      CURRENT_YEAR
    )
    const neither = computeCompositeScore(
      makeArtist({ modifiers: { alive_and_profiting: false, victims_in_process: false } }),
      CURRENT_YEAR
    )
    expect(both.final_score).toBeLessThan(neither.final_score)
  })

  it('artist with no harmful acts scores higher than one with many severe acts', () => {
    const clean = computeCompositeScore(
      makeArtist({ acts: [] }),
      CURRENT_YEAR
    )
    const monster = computeCompositeScore(polanskiLike, CURRENT_YEAR)
    expect(clean.final_score).toBeGreaterThan(monster.final_score)
  })

  it('moral_modifier is between 0 and 1', () => {
    const breakdown = computeCompositeScore(makeArtist(), CURRENT_YEAR)
    expect(breakdown.moral_modifier).toBeGreaterThanOrEqual(0)
    expect(breakdown.moral_modifier).toBeLessThanOrEqual(1)
  })

  it('stain is between 0 and 1', () => {
    const breakdown = computeCompositeScore(makeArtist(), CURRENT_YEAR)
    expect(breakdown.stain).toBeGreaterThanOrEqual(0)
    expect(breakdown.stain).toBeLessThanOrEqual(1)
  })

  it('temporal_factor is between 0 and 1', () => {
    const breakdown = computeCompositeScore(makeArtist(), CURRENT_YEAR)
    expect(breakdown.temporal_factor).toBeGreaterThanOrEqual(0)
    expect(breakdown.temporal_factor).toBeLessThanOrEqual(1)
  })

  it('medium_factor is computed correctly from separability and medium_aura', () => {
    const artist = makeArtist({ art: { ...makeArtist().art, medium_aura: 0.4, separability: 0.5 } })
    const breakdown = computeCompositeScore(artist, CURRENT_YEAR)
    // medium_factor = 1 - 0.4 * (1 - 0.5) = 1 - 0.2 = 0.8
    expect(breakdown.medium_factor).toBeCloseTo(0.8, 5)
  })

  it('contamination_factor is computed correctly from separability and contamination', () => {
    const artist = makeArtist({ art: { ...makeArtist().art, contamination: 0.6, separability: 0.5 } })
    const breakdown = computeCompositeScore(artist, CURRENT_YEAR)
    // contamination_factor = 1 - 0.6 * (1 - 0.5) = 1 - 0.3 = 0.7
    expect(breakdown.contamination_factor).toBeCloseTo(0.7, 5)
  })

  it('full separability (1.0) makes medium/contamination factors equal to 1', () => {
    const artist = makeArtist({
      art: { ...makeArtist().art, medium_aura: 0.9, contamination: 0.9, separability: 1.0 },
    })
    const breakdown = computeCompositeScore(artist, CURRENT_YEAR)
    expect(breakdown.medium_factor).toBeCloseTo(1.0, 5)
    expect(breakdown.contamination_factor).toBeCloseTo(1.0, 5)
  })

  it('zero separability maximises penalty from medium_aura and contamination', () => {
    const artist = makeArtist({
      art: { ...makeArtist().art, medium_aura: 1.0, contamination: 1.0, separability: 0.0 },
    })
    const breakdown = computeCompositeScore(artist, CURRENT_YEAR)
    expect(breakdown.medium_factor).toBeCloseTo(0.0, 5)
    expect(breakdown.contamination_factor).toBeCloseTo(0.0, 5)
  })

  it('final_score is clamped to 0 even when raw maths would go negative', () => {
    // Construct a pathological artist where every factor maximises penalty
    const artist = makeArtist({
      acts: [
        {
          description: 'Extreme harm',
          severity: 1.0,
          victim_count: 100,
          duration: 1.0,
          reversibility: 1.0,
          power_differential: 1.0,
          relationship_proximity: 1.0,
          victim_vulnerability: 1.0,
          categorical_violations: ['acts_against_children', 'violence', 'bodily_autonomy'],
        },
      ],
      art: { ...makeArtist().art, medium_aura: 1.0, contamination: 1.0, separability: 0.0 },
    })
    const breakdown = computeCompositeScore(artist, CURRENT_YEAR)
    expect(breakdown.final_score).toBeGreaterThanOrEqual(0)
    expect(breakdown.final_score).toBeLessThanOrEqual(100)
  })

  it('Polanski-like breakdown has all numeric fields', () => {
    const breakdown = computeCompositeScore(polanskiLike, CURRENT_YEAR)
    for (const [key, val] of Object.entries(breakdown)) {
      expect(typeof val).toBe('number', `field ${key} should be a number`)
      expect(isNaN(val as number)).toBe(false, `field ${key} should not be NaN`)
    }
  })
})

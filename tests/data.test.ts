import { describe, it, expect, beforeAll } from 'vitest'
import path from 'path'
import { loadArtist, loadAllArtists, getArtistBreakdown } from '../src/lib/data'

// Ensure process.cwd() resolves to the project root (vitest runs from the project root)
// The data module uses process.cwd() to locate data/artists/

describe('loadArtist', () => {
  it('returns an artist object with the correct id', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.id).toBe('roman-polanski')
    expect(artist.name).toBe('Roman Polanski')
  })

  it('populates the verdict.score with a computed number', () => {
    const artist = loadArtist('roman-polanski')
    expect(typeof artist.verdict.score).toBe('number')
    expect(artist.verdict.score).not.toBeNull()
  })

  it('computed score is between 0 and 100', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.verdict.score as number).toBeGreaterThanOrEqual(0)
    expect(artist.verdict.score as number).toBeLessThanOrEqual(100)
  })

  it('preserves the original verdict blurb', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.verdict.blurb).toBeTruthy()
    expect(typeof artist.verdict.blurb).toBe('string')
  })

  it('preserves acts array from JSON', () => {
    const artist = loadArtist('roman-polanski')
    expect(Array.isArray(artist.acts)).toBe(true)
    expect(artist.acts.length).toBeGreaterThan(0)
  })

  it('has correct domain and sub_domain', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.domain).toBe('film')
    expect(artist.sub_domain).toBe('Director')
  })

  it('has art data intact', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.art.notable_works).toContain('Chinatown')
    expect(artist.art.significance).toBe(9)
  })

  it('throws an error for a non-existent artist id', () => {
    expect(() => loadArtist('does-not-exist')).toThrow()
  })
})

describe('loadAllArtists', () => {
  it('returns an array', () => {
    const artists = loadAllArtists()
    expect(Array.isArray(artists)).toBe(true)
  })

  it('returns at least one artist', () => {
    const artists = loadAllArtists()
    expect(artists.length).toBeGreaterThanOrEqual(1)
  })

  it('every artist has a computed numeric score', () => {
    const artists = loadAllArtists()
    for (const artist of artists) {
      expect(typeof artist.verdict.score).toBe('number')
      expect(isNaN(artist.verdict.score as number)).toBe(false)
    }
  })

  it('every score is within the 0-100 range', () => {
    const artists = loadAllArtists()
    for (const artist of artists) {
      const score = artist.verdict.score as number
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it('includes roman-polanski in the result', () => {
    const artists = loadAllArtists()
    const ids = artists.map(a => a.id)
    expect(ids).toContain('roman-polanski')
  })
})

describe('getArtistBreakdown', () => {
  it('returns a breakdown object for roman-polanski', () => {
    const breakdown = getArtistBreakdown('roman-polanski')
    expect(breakdown).toHaveProperty('final_score')
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
  })

  it('final_score from breakdown matches the score on the loaded artist', () => {
    const artist = loadArtist('roman-polanski')
    const breakdown = getArtistBreakdown('roman-polanski')
    expect(breakdown.final_score).toBe(artist.verdict.score)
  })

  it('all breakdown fields are finite numbers', () => {
    const breakdown = getArtistBreakdown('roman-polanski')
    for (const [key, val] of Object.entries(breakdown)) {
      expect(typeof val).toBe('number', `field ${key} should be a number`)
      expect(isFinite(val as number)).toBe(true, `field ${key} should be finite`)
    }
  })

  it('throws for unknown artist id', () => {
    expect(() => getArtistBreakdown('unknown-artist')).toThrow()
  })
})

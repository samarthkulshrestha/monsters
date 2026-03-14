import fs from 'fs'
import path from 'path'
import type { Artist } from './scoring/types'
import { computeCompositeScore } from './scoring/composite'

const DATA_DIR = path.join(process.cwd(), 'data', 'artists')
const CURRENT_YEAR = new Date().getFullYear()

export function loadArtist(id: string): Artist {
  const filePath = path.join(DATA_DIR, `${id}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Artist
  const breakdown = computeCompositeScore(raw, CURRENT_YEAR)
  return { ...raw, verdict: { ...raw.verdict, score: breakdown.final_score } }
}

export function loadAllArtists(): Artist[] {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  return files.map(f => loadArtist(f.replace('.json', '')))
}

export function getArtistBreakdown(id: string) {
  const filePath = path.join(DATA_DIR, `${id}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Artist
  return computeCompositeScore(raw, CURRENT_YEAR)
}

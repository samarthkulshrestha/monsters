import type { ArtData } from './types'

export function computeArtMerit(art: ArtData, yearOfMajorWorks: number[], currentYear: number): number {
  // Base score stands on its own — art quality is art quality regardless of when it was made
  const baseScore = (art.significance * 0.35 + (10 - art.replaceability) * 0.35 + art.influence * 0.30) / 10

  // Historical embeddedness bonus: up to 15% boost for work deeply woven into culture
  const avgWorkYear = yearOfMajorWorks.reduce((a, b) => a + b, 0) / yearOfMajorWorks.length
  const culturalAge = currentYear - avgWorkYear
  const historicalBonus = 0.15 * (1 / (1 + Math.exp(-0.08 * (culturalAge - 40))))

  return Math.min(1, baseScore + historicalBonus)
}

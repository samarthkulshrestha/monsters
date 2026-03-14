import type { ArtData } from './types'

export function computeArtMerit(art: ArtData, yearOfMajorWorks: number[], currentYear: number): number {
  const baseScore = (art.significance * 0.35 + (10 - art.replaceability) * 0.35 + art.influence * 0.30) / 10
  const avgWorkYear = yearOfMajorWorks.reduce((a, b) => a + b, 0) / yearOfMajorWorks.length
  const culturalAge = currentYear - avgWorkYear
  const logisticFactor = 1 / (1 + Math.exp(-0.1 * (culturalAge - 20)))
  return baseScore * logisticFactor
}

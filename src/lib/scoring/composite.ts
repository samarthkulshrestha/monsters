import type { Artist, ScoringBreakdown } from './types'
import { computeConsequentialistScore, computeHarm } from './consequentialist'
import { computeDeontologicalScore } from './deontological'
import { computeVirtueScore } from './virtue'
import { computeCareScore } from './care'
import { computeStain } from './stain'
import { computeTemporalFactor, computeAccountabilityFactor } from './temporal'
import { computeArtMerit } from './art-merit'

const FRAMEWORK_WEIGHTS = {
  consequentialist: 0.30,
  deontological: 0.25,
  virtue: 0.20,
  care: 0.25,
}

export function computeCompositeScore(artist: Artist, currentYear: number): ScoringBreakdown {
  const consequentialist = computeConsequentialistScore(artist.acts)
  const deontological = computeDeontologicalScore(artist.acts)
  const virtue = computeVirtueScore(artist.character)
  const care = computeCareScore(artist.acts)

  const moral_modifier =
    FRAMEWORK_WEIGHTS.consequentialist * consequentialist +
    FRAMEWORK_WEIGHTS.deontological * deontological +
    FRAMEWORK_WEIGHTS.virtue * virtue +
    FRAMEWORK_WEIGHTS.care * care

  const S = artist.art.separability
  const medium_factor = 1 - artist.art.medium_aura * (1 - S)
  const contamination_factor = 1 - artist.art.contamination * (1 - S)

  const stain = computeStain(artist.acts)
  const temporal_factor = computeTemporalFactor(artist.temporal.year_of_primary_act, currentYear)
  const harmH = computeHarm(artist.acts)
  const accountability_factor = computeAccountabilityFactor(
    artist.temporal.accountability_events, harmH, artist.temporal.year_of_primary_act, currentYear
  )
  const art_merit = computeArtMerit(artist.art, artist.temporal.year_of_major_works, currentYear)

  let raw_score =
    (1 - stain) * art_merit * (S + (1 - S) * moral_modifier) *
    temporal_factor * accountability_factor * medium_factor * contamination_factor

  if (artist.modifiers.alive_and_profiting) raw_score *= 0.85
  if (artist.modifiers.victims_in_process) raw_score *= 0.80

  const final_score = Math.round(Math.sqrt(raw_score) * 100)

  return {
    consequentialist, deontological, virtue, care, stain,
    temporal_factor, accountability_factor, art_merit,
    medium_factor, contamination_factor, moral_modifier, raw_score,
    final_score: Math.max(0, Math.min(100, final_score)),
  }
}

import type { Character } from './types'

export function computeVirtueScore(character: Character): number {
  const V = (1 - character.virtue_score) * character.consistency
  return 1 - V
}

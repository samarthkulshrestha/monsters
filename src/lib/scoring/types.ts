export interface Act {
  description: string
  severity: number       // 0-1
  victim_count: number
  duration: number       // 0-1
  reversibility: number  // 0-1
  power_differential: number  // 0-1
  relationship_proximity: number // 0-1
  victim_vulnerability: number   // 0-1
  categorical_violations: CategoricalViolation[]
}

export type CategoricalViolation =
  | 'acts_against_children'
  | 'bodily_autonomy'
  | 'sexual_exploitation'
  | 'violence'
  | 'coercion'
  | 'fraud_or_theft'
  | 'hate_speech'
  | 'collaboration_with_oppression'

export interface Character {
  virtue_score: number   // 0-1
  consistency: number    // 0-1
}

export interface ArtData {
  significance: number   // 1-10
  influence: number      // 1-10
  replaceability: number // 1-10 (low = hard to replace)
  notable_works: string[]
  summary: string
  medium_aura: number      // 0-1
  contamination: number    // 0-1
  separability: number     // 0-1
}

export interface Modifiers {
  alive_and_profiting: boolean
  victims_in_process: boolean
}

export interface AccountabilityEvent {
  year: number
  type: string
  magnitude: number      // 0-1
  description: string
}

export interface TemporalData {
  year_of_primary_act: number
  year_of_major_works: number[]
  accountability_events: AccountabilityEvent[]
}

export interface Verdict {
  score: number | null   // computed at build time
  blurb: string
}

export interface Artist {
  id: string
  name: string
  domain: string
  sub_domain: string
  portrait: string
  acts: Act[]
  behavior_summary: string
  sources: string[]
  character: Character
  art: ArtData
  modifiers: Modifiers
  temporal: TemporalData
  verdict: Verdict
}

export interface ScoringBreakdown {
  consequentialist: number
  deontological: number
  virtue: number
  care: number
  stain: number
  temporal_factor: number
  accountability_factor: number
  art_merit: number
  medium_factor: number
  contamination_factor: number
  moral_modifier: number
  raw_score: number
  final_score: number
}

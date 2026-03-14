# Monsters Calculator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js web app that scores whether you should consume art made by morally problematic artists, using a philosophically grounded scoring model.

**Architecture:** Static Next.js site with JSON data files. The scoring engine is a pure TypeScript module that computes scores at build time. Pages are statically generated from the artist JSON files. Client-side JS handles search filtering and browse sorting.

**Tech Stack:** Next.js 15 (App Router, static export), TypeScript, CSS Modules, Space Mono + Space Grotesk fonts, Vitest for testing.

**Spec:** `docs/superpowers/specs/2026-03-14-monsters-calculator-design.md`

---

## File Structure

```
monsters/
├── data/
│   └── artists/
│       ├── roman-polanski.json      # One JSON file per artist
│       ├── woody-allen.json
│       └── ...
├── public/
│   └── portraits/
│       ├── roman-polanski.jpg       # Artist portraits
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout: fonts, nav, footer
│   │   ├── page.tsx                 # Home page: hero + search + featured grid
│   │   ├── page.module.css
│   │   ├── artist/
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Artist detail page (static params)
│   │   │       └── page.module.css
│   │   ├── browse/
│   │   │   ├── page.tsx             # Browse page with filters/sorting
│   │   │   └── page.module.css
│   │   └── about/
│   │       ├── page.tsx             # About / methodology page
│   │       └── page.module.css
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx           # Red banner nav
│   │   │   └── Header.module.css
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.module.css
│   │   ├── Mugshot/
│   │   │   ├── Mugshot.tsx          # Red-tinted portrait with booking frame
│   │   │   └── Mugshot.module.css
│   │   ├── ScoreCard/
│   │   │   ├── ScoreCard.tsx        # Monster/Art score columns
│   │   │   └── ScoreCard.module.css
│   │   ├── VerdictBar/
│   │   │   ├── VerdictBar.tsx       # Full-width red verdict bar
│   │   │   └── VerdictBar.module.css
│   │   ├── FactorBreakdown/
│   │   │   ├── FactorBreakdown.tsx  # Horizontal bar chart factors
│   │   │   └── FactorBreakdown.module.css
│   │   ├── ArtistCard/
│   │   │   ├── ArtistCard.tsx       # Card for browse/search grid
│   │   │   └── ArtistCard.module.css
│   │   └── SearchBar/
│   │       ├── SearchBar.tsx        # Client-side search input
│   │       └── SearchBar.module.css
│   ├── lib/
│   │   ├── scoring/
│   │   │   ├── consequentialist.ts  # H score + sigmoid
│   │   │   ├── deontological.ts     # Violation weights + threshold
│   │   │   ├── virtue.ts            # Character consistency score
│   │   │   ├── care.ts              # Power differential score
│   │   │   ├── stain.ts             # Saturating stain function
│   │   │   ├── temporal.ts          # Moral decay + accountability ODE
│   │   │   ├── art-merit.ts         # Art score + cultural significance
│   │   │   ├── composite.ts         # Final SCORE assembly
│   │   │   └── types.ts             # TypeScript types for Artist data
│   │   └── data.ts                  # Load + parse artist JSON, compute scores
│   └── styles/
│       └── globals.css              # CSS reset, font imports, CSS custom properties
├── tests/
│   ├── scoring/
│   │   ├── consequentialist.test.ts
│   │   ├── deontological.test.ts
│   │   ├── virtue.test.ts
│   │   ├── care.test.ts
│   │   ├── stain.test.ts
│   │   ├── temporal.test.ts
│   │   ├── art-merit.test.ts
│   │   └── composite.test.ts
│   └── data.test.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── vitest.config.ts
```

---

## Chunk 1: Project Setup + Scoring Engine

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `src/styles/globals.css`

- [ ] **Step 1: Initialize Next.js with TypeScript**

```bash
cd /Users/samarthkulshrestha/code/monsters
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*"
```

Accept defaults. This scaffolds the project with App Router.

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 4: Add test script to package.json**

Add to `scripts` section:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Configure static export**

In `next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 6: Set up global styles with fonts and CSS custom properties**

Replace `src/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

:root {
  --color-bg: #ffe0e0;
  --color-red: #cc0000;
  --color-dark: #1a0000;
  --color-secondary: #660000;
  --color-muted: #990000;
  --color-border: #cc0000;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Space Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--color-bg);
  color: var(--color-dark);
  font-family: var(--font-body);
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 7: Verify project builds**

```bash
npm run build
```

Expected: Build succeeds with static export.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript, Vitest, static export"
```

---

### Task 2: Define TypeScript Types

**Files:**
- Create: `src/lib/scoring/types.ts`

- [ ] **Step 1: Write the types file**

```typescript
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

/** Intermediate scoring results for display in the factor breakdown */
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/scoring/types.ts
git commit -m "feat: add TypeScript types for artist data and scoring"
```

---

### Task 3: Consequentialist Scoring Module

**Files:**
- Create: `src/lib/scoring/consequentialist.ts`, `tests/scoring/consequentialist.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/consequentialist.test.ts
import { describe, it, expect } from 'vitest'
import { computeConsequentialistScore } from '@/lib/scoring/consequentialist'
import type { Act } from '@/lib/scoring/types'

describe('computeConsequentialistScore', () => {
  it('returns 1.0 for empty acts array', () => {
    expect(computeConsequentialistScore([])).toBeCloseTo(1.0, 1)
  })

  it('returns low score for severe single act', () => {
    const acts: Act[] = [{
      description: 'test',
      severity: 0.9,
      victim_count: 1,
      duration: 0.5,
      reversibility: 0.9,
      power_differential: 0,
      relationship_proximity: 0,
      victim_vulnerability: 0,
      categorical_violations: [],
    }]
    const score = computeConsequentialistScore(acts)
    expect(score).toBeLessThan(0.5)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('returns lower score for multiple severe acts', () => {
    const singleAct: Act[] = [{
      description: 'test',
      severity: 0.8,
      victim_count: 2,
      duration: 0.6,
      reversibility: 0.7,
      power_differential: 0,
      relationship_proximity: 0,
      victim_vulnerability: 0,
      categorical_violations: [],
    }]
    const multipleActs: Act[] = [singleAct[0], singleAct[0], singleAct[0]]
    expect(computeConsequentialistScore(multipleActs))
      .toBeLessThan(computeConsequentialistScore(singleAct))
  })

  it('uses logarithmic victim scaling', () => {
    const makeAct = (victims: number): Act => ({
      description: 'test',
      severity: 0.5,
      victim_count: victims,
      duration: 0.5,
      reversibility: 0.5,
      power_differential: 0,
      relationship_proximity: 0,
      victim_vulnerability: 0,
      categorical_violations: [],
    })
    const score1 = computeConsequentialistScore([makeAct(1)])
    const score10 = computeConsequentialistScore([makeAct(10)])
    const score100 = computeConsequentialistScore([makeAct(100)])
    // Logarithmic: difference between 1→10 should be larger than 10→100
    expect(score1 - score10).toBeGreaterThan(score10 - score100)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/consequentialist.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/consequentialist.ts
import type { Act } from './types'

function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * (x - midpoint)))
}

export function computeHarm(acts: Act[]): number {
  return acts.reduce((sum, act) => {
    return sum + act.severity
      * Math.log2(act.victim_count + 1)
      * act.duration
      * act.reversibility
  }, 0)
}

export function computeConsequentialistScore(acts: Act[]): number {
  if (acts.length === 0) return 1.0
  const H = computeHarm(acts)
  return 1 - sigmoid(H, 2.0, 1.5)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/consequentialist.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/consequentialist.ts tests/scoring/consequentialist.test.ts
git commit -m "feat: add consequentialist scoring module with sigmoid normalization"
```

---

### Task 4: Deontological Scoring Module

**Files:**
- Create: `src/lib/scoring/deontological.ts`, `tests/scoring/deontological.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/deontological.test.ts
import { describe, it, expect } from 'vitest'
import { computeDeontologicalScore, VIOLATION_WEIGHTS } from '@/lib/scoring/deontological'
import type { Act } from '@/lib/scoring/types'

describe('computeDeontologicalScore', () => {
  const baseAct: Act = {
    description: 'test',
    severity: 0.5,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0.5,
    relationship_proximity: 0.5,
    victim_vulnerability: 0.5,
    categorical_violations: [],
  }

  it('returns 1.0 when no categorical violations', () => {
    expect(computeDeontologicalScore([baseAct])).toBe(1.0)
  })

  it('returns 0.05 for acts_against_children', () => {
    const act = { ...baseAct, categorical_violations: ['acts_against_children' as const] }
    expect(computeDeontologicalScore([act])).toBeCloseTo(0.05)
  })

  it('uses the worst violation across all acts', () => {
    const act1 = { ...baseAct, categorical_violations: ['fraud_or_theft' as const] }
    const act2 = { ...baseAct, categorical_violations: ['bodily_autonomy' as const] }
    // bodily_autonomy (0.90) is worse than fraud_or_theft (0.60)
    expect(computeDeontologicalScore([act1, act2])).toBeCloseTo(1 - 0.90)
  })

  it('returns 1.0 for empty acts', () => {
    expect(computeDeontologicalScore([])).toBe(1.0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/deontological.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/deontological.ts
import type { Act, CategoricalViolation } from './types'

export const VIOLATION_WEIGHTS: Record<CategoricalViolation, number> = {
  acts_against_children: 0.95,
  bodily_autonomy: 0.90,
  sexual_exploitation: 0.90,
  violence: 0.85,
  coercion: 0.80,
  collaboration_with_oppression: 0.75,
  hate_speech: 0.70,
  fraud_or_theft: 0.60,
}

export function computeDeontologicalScore(acts: Act[]): number {
  const allViolations = acts.flatMap(act => act.categorical_violations)
  if (allViolations.length === 0) return 1.0

  const maxWeight = Math.max(
    ...allViolations.map(v => VIOLATION_WEIGHTS[v] ?? 0)
  )
  return 1 - maxWeight
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/deontological.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/deontological.ts tests/scoring/deontological.test.ts
git commit -m "feat: add deontological scoring with categorical violation weights"
```

---

### Task 5: Virtue Ethics Scoring Module

**Files:**
- Create: `src/lib/scoring/virtue.ts`, `tests/scoring/virtue.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/virtue.test.ts
import { describe, it, expect } from 'vitest'
import { computeVirtueScore } from '@/lib/scoring/virtue'
import type { Character } from '@/lib/scoring/types'

describe('computeVirtueScore', () => {
  it('returns high score for virtuous consistent character', () => {
    const character: Character = { virtue_score: 0.9, consistency: 0.8 }
    expect(computeVirtueScore(character)).toBeGreaterThan(0.9)
  })

  it('returns low score for low virtue + high consistency', () => {
    const character: Character = { virtue_score: 0.1, consistency: 0.9 }
    expect(computeVirtueScore(character)).toBeLessThan(0.3)
  })

  it('returns moderate score for low virtue + low consistency', () => {
    const character: Character = { virtue_score: 0.2, consistency: 0.2 }
    const score = computeVirtueScore(character)
    expect(score).toBeGreaterThan(0.8) // low consistency = aberration
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/virtue.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/virtue.ts
import type { Character } from './types'

export function computeVirtueScore(character: Character): number {
  const V = (1 - character.virtue_score) * character.consistency
  return 1 - V
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/virtue.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/virtue.ts tests/scoring/virtue.test.ts
git commit -m "feat: add virtue ethics scoring module"
```

---

### Task 6: Care Ethics Scoring Module

**Files:**
- Create: `src/lib/scoring/care.ts`, `tests/scoring/care.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/care.test.ts
import { describe, it, expect } from 'vitest'
import { computeCareScore } from '@/lib/scoring/care'
import type { Act } from '@/lib/scoring/types'

describe('computeCareScore', () => {
  const baseAct: Act = {
    description: 'test',
    severity: 0.5,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0,
    relationship_proximity: 0,
    victim_vulnerability: 0,
    categorical_violations: [],
  }

  it('returns 1.0 for zero power dynamics', () => {
    expect(computeCareScore([baseAct])).toBeCloseTo(1.0)
  })

  it('returns low score for high power differential + vulnerability', () => {
    const act = {
      ...baseAct,
      power_differential: 0.9,
      relationship_proximity: 0.8,
      victim_vulnerability: 1.0,
    }
    expect(computeCareScore([act])).toBeLessThan(0.5)
  })

  it('averages across multiple acts', () => {
    const lowPower = { ...baseAct, power_differential: 0.2, relationship_proximity: 0.2, victim_vulnerability: 0.2 }
    const highPower = { ...baseAct, power_differential: 0.9, relationship_proximity: 0.9, victim_vulnerability: 0.9 }
    const mixed = computeCareScore([lowPower, highPower])
    expect(mixed).toBeGreaterThan(computeCareScore([highPower]))
    expect(mixed).toBeLessThan(computeCareScore([lowPower]))
  })

  it('returns 1.0 for empty acts', () => {
    expect(computeCareScore([])).toBe(1.0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/care.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/care.ts
import type { Act } from './types'

export function computeCareScore(acts: Act[]): number {
  if (acts.length === 0) return 1.0

  const careScores = acts.map(act =>
    act.power_differential * act.relationship_proximity * act.victim_vulnerability
  )
  const mean = careScores.reduce((sum, c) => sum + c, 0) / careScores.length
  return 1 - mean
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/care.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/care.ts tests/scoring/care.test.ts
git commit -m "feat: add care ethics scoring module"
```

---

### Task 7: Stain Function

**Files:**
- Create: `src/lib/scoring/stain.ts`, `tests/scoring/stain.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/stain.test.ts
import { describe, it, expect } from 'vitest'
import { computeStain } from '@/lib/scoring/stain'
import type { Act } from '@/lib/scoring/types'

describe('computeStain', () => {
  const makeAct = (severity: number): Act => ({
    description: 'test',
    severity,
    victim_count: 1,
    duration: 0.5,
    reversibility: 0.5,
    power_differential: 0,
    relationship_proximity: 0,
    victim_vulnerability: 0,
    categorical_violations: [],
  })

  it('returns 0 for no acts', () => {
    expect(computeStain([])).toBe(0)
  })

  it('returns value between 0 and 1', () => {
    const stain = computeStain([makeAct(0.5)])
    expect(stain).toBeGreaterThan(0)
    expect(stain).toBeLessThan(1)
  })

  it('increases with more severe acts but saturates', () => {
    const stain1 = computeStain([makeAct(0.5)])
    const stain2 = computeStain([makeAct(0.5), makeAct(0.5)])
    const stain3 = computeStain([makeAct(0.5), makeAct(0.5), makeAct(0.5)])
    expect(stain2).toBeGreaterThan(stain1)
    expect(stain3).toBeGreaterThan(stain2)
    // Diminishing returns (saturation)
    expect(stain2 - stain1).toBeGreaterThan(stain3 - stain2)
  })

  it('never reaches 1.0', () => {
    const extreme = Array(20).fill(makeAct(1.0))
    expect(computeStain(extreme)).toBeLessThan(1.0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/stain.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/stain.ts
import type { Act } from './types'

const K = 1.5 // sensitivity constant

export function computeStain(acts: Act[]): number {
  if (acts.length === 0) return 0
  const totalSeverity = acts.reduce((sum, act) => sum + act.severity, 0)
  return 1 - Math.exp(-K * totalSeverity)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/stain.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/stain.ts tests/scoring/stain.test.ts
git commit -m "feat: add stain function with exponential saturation"
```

---

### Task 8: Temporal & Accountability Module

**Files:**
- Create: `src/lib/scoring/temporal.ts`, `tests/scoring/temporal.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/temporal.test.ts
import { describe, it, expect } from 'vitest'
import { computeTemporalFactor, computeAccountabilityFactor } from '@/lib/scoring/temporal'
import type { AccountabilityEvent } from '@/lib/scoring/types'

describe('computeTemporalFactor', () => {
  it('returns ~1.0 for very recent acts', () => {
    const factor = computeTemporalFactor(2025, 2026)
    expect(factor).toBeGreaterThan(0.95)
  })

  it('returns lower value for old acts', () => {
    const recent = computeTemporalFactor(2020, 2026)
    const old = computeTemporalFactor(1950, 2026)
    expect(old).toBeLessThan(recent)
  })

  it('is clamped to [0, 1]', () => {
    const veryOld = computeTemporalFactor(1500, 2026)
    expect(veryOld).toBeGreaterThanOrEqual(0)
    expect(veryOld).toBeLessThanOrEqual(1)
  })

  it('decays logarithmically, not exponentially', () => {
    // Logarithmic decay is slow — even 50 years shouldn't reduce by more than half
    const factor = computeTemporalFactor(1976, 2026)
    expect(factor).toBeGreaterThan(0.5)
  })
})

describe('computeAccountabilityFactor', () => {
  it('returns 1.0 when no accountability events and H is 0', () => {
    expect(computeAccountabilityFactor([], 0, 1977, 2026)).toBeCloseTo(1.0)
  })

  it('returns value > base decay when accountability events exist', () => {
    const events: AccountabilityEvent[] = [
      { year: 2000, type: 'apology', magnitude: 0.3, description: 'test' },
    ]
    const withEvents = computeAccountabilityFactor(events, 2.0, 1977, 2026)
    const withoutEvents = computeAccountabilityFactor([], 2.0, 1977, 2026)
    expect(withEvents).toBeGreaterThan(withoutEvents)
  })

  it('weights recent events more than old ones', () => {
    const oldEvent: AccountabilityEvent[] = [
      { year: 1980, type: 'apology', magnitude: 0.5, description: 'test' },
    ]
    const recentEvent: AccountabilityEvent[] = [
      { year: 2024, type: 'apology', magnitude: 0.5, description: 'test' },
    ]
    expect(computeAccountabilityFactor(recentEvent, 2.0, 1977, 2026))
      .toBeGreaterThan(computeAccountabilityFactor(oldEvent, 2.0, 1977, 2026))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/temporal.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/temporal.ts
import type { AccountabilityEvent } from './types'

const ALPHA = 0.15  // fading rate
const TAU = 50      // time constant (years)
const GAMMA = 0.05  // accountability decay rate

export function computeTemporalFactor(
  yearOfPrimaryAct: number,
  currentYear: number
): number {
  const t = currentYear - yearOfPrimaryAct
  if (t <= 0) return 1.0
  return Math.max(0, Math.min(1, 1 - ALPHA * Math.log(1 + t / TAU)))
}

export function computeAccountabilityFactor(
  events: AccountabilityEvent[],
  harmH: number,
  yearOfPrimaryAct: number,
  currentYear: number
): number {
  if (harmH === 0) return 1.0

  const t = currentYear - yearOfPrimaryAct
  // Natural decay of moral debt
  let remainingDebt = harmH * Math.exp(-GAMMA * t)

  // Restitution events reduce debt (recent events more effective)
  for (const event of events) {
    const eventAge = currentYear - event.year
    remainingDebt -= event.magnitude * Math.exp(-GAMMA * eventAge)
  }

  remainingDebt = Math.max(0, remainingDebt)
  return 1 - remainingDebt / harmH
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/temporal.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/temporal.ts tests/scoring/temporal.test.ts
git commit -m "feat: add temporal decay and accountability ODE scoring"
```

---

### Task 9: Art Merit Module

**Files:**
- Create: `src/lib/scoring/art-merit.ts`, `tests/scoring/art-merit.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/art-merit.test.ts
import { describe, it, expect } from 'vitest'
import { computeArtMerit } from '@/lib/scoring/art-merit'
import type { ArtData } from '@/lib/scoring/types'

describe('computeArtMerit', () => {
  const baseArt: ArtData = {
    significance: 5,
    influence: 5,
    replaceability: 5,
    notable_works: [],
    summary: '',
    medium_aura: 0.5,
    contamination: 0.5,
    separability: 0.5,
  }

  it('returns higher merit for higher significance/influence', () => {
    const high = computeArtMerit({ ...baseArt, significance: 9, influence: 9 }, [2000], 2026)
    const low = computeArtMerit({ ...baseArt, significance: 3, influence: 3 }, [2000], 2026)
    expect(high).toBeGreaterThan(low)
  })

  it('returns higher merit for low replaceability (hard to replace)', () => {
    const irreplaceable = computeArtMerit({ ...baseArt, replaceability: 1 }, [2000], 2026)
    const replaceable = computeArtMerit({ ...baseArt, replaceability: 9 }, [2000], 2026)
    expect(irreplaceable).toBeGreaterThan(replaceable)
  })

  it('scales up with cultural age via logistic growth', () => {
    const recent = computeArtMerit(baseArt, [2024], 2026)
    const established = computeArtMerit(baseArt, [1970], 2026)
    expect(established).toBeGreaterThan(recent)
  })

  it('returns value between 0 and 1', () => {
    const perfect = computeArtMerit(
      { ...baseArt, significance: 10, influence: 10, replaceability: 1 },
      [1900], 2026
    )
    expect(perfect).toBeGreaterThan(0)
    expect(perfect).toBeLessThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/art-merit.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/art-merit.ts
import type { ArtData } from './types'

export function computeArtMerit(
  art: ArtData,
  yearOfMajorWorks: number[],
  currentYear: number
): number {
  // Weighted combination of art scores, normalized to 0-1
  const baseScore = (
    art.significance * 0.35 +
    (10 - art.replaceability) * 0.35 +
    art.influence * 0.30
  ) / 10

  // Logistic growth for cultural significance accumulation
  const avgWorkYear = yearOfMajorWorks.reduce((a, b) => a + b, 0) / yearOfMajorWorks.length
  const culturalAge = currentYear - avgWorkYear
  const logisticFactor = 1 / (1 + Math.exp(-0.1 * (culturalAge - 20)))

  return baseScore * logisticFactor
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/art-merit.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring/art-merit.ts tests/scoring/art-merit.test.ts
git commit -m "feat: add art merit scoring with logistic cultural growth"
```

---

### Task 10: Composite Score Assembly

**Files:**
- Create: `src/lib/scoring/composite.ts`, `tests/scoring/composite.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/scoring/composite.test.ts
import { describe, it, expect } from 'vitest'
import { computeCompositeScore } from '@/lib/scoring/composite'
import type { Artist } from '@/lib/scoring/types'

const polanski: Artist = {
  id: 'roman-polanski',
  name: 'Roman Polanski',
  domain: 'film',
  sub_domain: 'Director',
  portrait: 'polanski.jpg',
  acts: [
    {
      description: 'Convicted of unlawful sex with a 13-year-old',
      severity: 0.9,
      victim_count: 1,
      duration: 0.2,
      reversibility: 0.9,
      power_differential: 0.9,
      relationship_proximity: 0.7,
      victim_vulnerability: 1.0,
      categorical_violations: ['bodily_autonomy', 'acts_against_children'],
    },
  ],
  behavior_summary: 'test',
  sources: [],
  character: { virtue_score: 0.3, consistency: 0.8 },
  art: {
    significance: 9,
    influence: 8,
    replaceability: 3,
    notable_works: ['Chinatown'],
    summary: 'test',
    medium_aura: 0.5,
    contamination: 0.6,
    separability: 0.4,
  },
  modifiers: { alive_and_profiting: true, victims_in_process: false },
  temporal: {
    year_of_primary_act: 1977,
    year_of_major_works: [1968, 1974, 2002],
    accountability_events: [],
  },
  verdict: { score: null, blurb: 'test' },
}

describe('computeCompositeScore', () => {
  it('returns a breakdown with all fields', () => {
    const result = computeCompositeScore(polanski, 2026)
    expect(result).toHaveProperty('consequentialist')
    expect(result).toHaveProperty('deontological')
    expect(result).toHaveProperty('virtue')
    expect(result).toHaveProperty('care')
    expect(result).toHaveProperty('stain')
    expect(result).toHaveProperty('temporal_factor')
    expect(result).toHaveProperty('accountability_factor')
    expect(result).toHaveProperty('art_merit')
    expect(result).toHaveProperty('medium_factor')
    expect(result).toHaveProperty('contamination_factor')
    expect(result).toHaveProperty('moral_modifier')
    expect(result).toHaveProperty('raw_score')
    expect(result).toHaveProperty('final_score')
  })

  it('returns final_score between 0 and 100', () => {
    const result = computeCompositeScore(polanski, 2026)
    expect(result.final_score).toBeGreaterThanOrEqual(0)
    expect(result.final_score).toBeLessThanOrEqual(100)
  })

  it('alive_and_profiting reduces the score', () => {
    const alive = computeCompositeScore(polanski, 2026)
    const dead = computeCompositeScore({
      ...polanski,
      modifiers: { alive_and_profiting: false, victims_in_process: false },
    }, 2026)
    expect(alive.final_score).toBeLessThan(dead.final_score)
  })

  it('returns low score for high-monster, high-art artists', () => {
    const result = computeCompositeScore(polanski, 2026)
    // Polanski should score low — severe monster, even with great art
    expect(result.final_score).toBeLessThan(50)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scoring/composite.test.ts
```

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/scoring/composite.ts
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

export function computeCompositeScore(
  artist: Artist,
  currentYear: number
): ScoringBreakdown {
  // Layer 1: Ethical frameworks
  const consequentialist = computeConsequentialistScore(artist.acts)
  const deontological = computeDeontologicalScore(artist.acts)
  const virtue = computeVirtueScore(artist.character)
  const care = computeCareScore(artist.acts)

  const moral_modifier =
    FRAMEWORK_WEIGHTS.consequentialist * consequentialist +
    FRAMEWORK_WEIGHTS.deontological * deontological +
    FRAMEWORK_WEIGHTS.virtue * virtue +
    FRAMEWORK_WEIGHTS.care * care

  // Layer 2: Art theory
  const S = artist.art.separability
  const medium_factor = 1 - artist.art.medium_aura * (1 - S)
  const contamination_factor = 1 - artist.art.contamination * (1 - S)

  // Layer 3: Calculus-based dynamics
  const stain = computeStain(artist.acts)
  const temporal_factor = computeTemporalFactor(
    artist.temporal.year_of_primary_act,
    currentYear
  )
  const harmH = computeHarm(artist.acts)
  const accountability_factor = computeAccountabilityFactor(
    artist.temporal.accountability_events,
    harmH,
    artist.temporal.year_of_primary_act,
    currentYear
  )
  const art_merit = computeArtMerit(
    artist.art,
    artist.temporal.year_of_major_works,
    currentYear
  )

  // Composite
  let raw_score =
    (1 - stain) *
    art_merit *
    (S + (1 - S) * moral_modifier) *
    temporal_factor *
    accountability_factor *
    medium_factor *
    contamination_factor

  // Contextual modifiers (before power curve)
  if (artist.modifiers.alive_and_profiting) raw_score *= 0.85
  if (artist.modifiers.victims_in_process) raw_score *= 0.80

  // Power curve to spread distribution
  const final_score = Math.round(Math.sqrt(raw_score) * 100)

  return {
    consequentialist,
    deontological,
    virtue,
    care,
    stain,
    temporal_factor,
    accountability_factor,
    art_merit,
    medium_factor,
    contamination_factor,
    moral_modifier,
    raw_score,
    final_score: Math.max(0, Math.min(100, final_score)),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/scoring/composite.test.ts
```

- [ ] **Step 5: Run all scoring tests**

```bash
npx vitest run tests/scoring/
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/scoring/composite.ts tests/scoring/composite.test.ts
git commit -m "feat: add composite scoring engine assembling all ethical frameworks"
```

---

### Task 11: Data Loading Module

**Files:**
- Create: `src/lib/data.ts`, `tests/data.test.ts`, `data/artists/roman-polanski.json`

- [ ] **Step 1: Create the first seed artist JSON**

Create `data/artists/roman-polanski.json`:

```json
{
  "id": "roman-polanski",
  "name": "Roman Polanski",
  "domain": "film",
  "sub_domain": "Director",
  "portrait": "roman-polanski.jpg",
  "acts": [
    {
      "description": "Convicted of unlawful sex with a 13-year-old in 1977",
      "severity": 0.9,
      "victim_count": 1,
      "duration": 0.2,
      "reversibility": 0.9,
      "power_differential": 0.9,
      "relationship_proximity": 0.7,
      "victim_vulnerability": 1.0,
      "categorical_violations": ["bodily_autonomy", "acts_against_children"]
    },
    {
      "description": "Fled sentencing, avoiding accountability",
      "severity": 0.5,
      "victim_count": 1,
      "duration": 1.0,
      "reversibility": 0.7,
      "power_differential": 0.6,
      "relationship_proximity": 0.2,
      "victim_vulnerability": 0.5,
      "categorical_violations": []
    },
    {
      "description": "Multiple additional allegations spanning decades",
      "severity": 0.7,
      "victim_count": 4,
      "duration": 0.8,
      "reversibility": 0.8,
      "power_differential": 0.8,
      "relationship_proximity": 0.5,
      "victim_vulnerability": 0.7,
      "categorical_violations": ["bodily_autonomy"]
    }
  ],
  "behavior_summary": "Convicted of unlawful sex with a 13-year-old in 1977, fled sentencing, multiple other allegations spanning decades.",
  "sources": [],
  "character": {
    "virtue_score": 0.3,
    "consistency": 0.8
  },
  "art": {
    "significance": 9,
    "influence": 8,
    "replaceability": 3,
    "notable_works": ["Chinatown", "The Pianist", "Rosemary's Baby"],
    "summary": "Pioneered psychological horror and neo-noir, multiple Oscar-winning films.",
    "medium_aura": 0.5,
    "contamination": 0.6,
    "separability": 0.4
  },
  "modifiers": {
    "alive_and_profiting": true,
    "victims_in_process": false
  },
  "temporal": {
    "year_of_primary_act": 1977,
    "year_of_major_works": [1968, 1974, 2002],
    "accountability_events": []
  },
  "verdict": {
    "score": null,
    "blurb": "The art is undeniably masterful. The man is undeniably a monster. He's still out there, living well. Every stream is a vote. You do the math."
  }
}
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/data.test.ts
import { describe, it, expect } from 'vitest'
import { loadArtist, loadAllArtists } from '@/lib/data'

describe('loadArtist', () => {
  it('loads and parses a valid artist JSON', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.id).toBe('roman-polanski')
    expect(artist.name).toBe('Roman Polanski')
    expect(artist.acts.length).toBeGreaterThan(0)
  })

  it('computes the verdict score at load time', () => {
    const artist = loadArtist('roman-polanski')
    expect(artist.verdict.score).toBeGreaterThanOrEqual(0)
    expect(artist.verdict.score).toBeLessThanOrEqual(100)
  })
})

describe('loadAllArtists', () => {
  it('returns an array of all artists with computed scores', () => {
    const artists = loadAllArtists()
    expect(artists.length).toBeGreaterThan(0)
    artists.forEach(a => {
      expect(a.verdict.score).not.toBeNull()
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx vitest run tests/data.test.ts
```

- [ ] **Step 4: Write implementation**

```typescript
// src/lib/data.ts
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
  return {
    ...raw,
    verdict: { ...raw.verdict, score: breakdown.final_score },
  }
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
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run tests/data.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/data.ts tests/data.test.ts data/artists/roman-polanski.json
git commit -m "feat: add data loading with build-time score computation"
```

---

## Chunk 2: UI Components + Pages

### Task 12: Root Layout + Header + Footer

**Files:**
- Create: `src/components/Header/Header.tsx`, `src/components/Header/Header.module.css`, `src/components/Footer/Footer.tsx`, `src/components/Footer/Footer.module.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Header component**

```typescript
// src/components/Header/Header.tsx
import Link from 'next/link'
import styles from './Header.module.css'

export function Header() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>MONSTERS</Link>
      <div className={styles.links}>
        <Link href="/browse">Browse</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create Header CSS**

```css
/* src/components/Header/Header.module.css */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 2px solid var(--color-red);
}

.logo {
  background: var(--color-red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  padding: 6px 14px;
  letter-spacing: 2px;
}

.links {
  display: flex;
  gap: 28px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.links a:hover {
  color: var(--color-red);
}
```

- [ ] **Step 3: Create Footer component**

```typescript
// src/components/Footer/Footer.tsx
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>Inspired by Claire Dederer&apos;s &ldquo;Monsters&rdquo;</span>
      <span>&copy; {new Date().getFullYear()}</span>
    </footer>
  )
}
```

```css
/* src/components/Footer/Footer.module.css */
.footer {
  border-top: 2px solid var(--color-red);
  padding: 20px 32px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-muted);
  display: flex;
  justify-content: space-between;
}
```

- [ ] **Step 4: Update root layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Space_Mono, Space_Grotesk } from 'next/font/google'
import { Header } from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'
import '@/styles/globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'The Monsters Calculator',
  description: 'Should you consume the art of terrible people? We did the math.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

Update `src/styles/globals.css` to remove the `@import url(...)` line for Google Fonts (now handled by `next/font`).

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Header/ src/components/Footer/ src/app/layout.tsx
git commit -m "feat: add Header, Footer, and root layout"
```

---

### Task 13: Mugshot Component

**Files:**
- Create: `src/components/Mugshot/Mugshot.tsx`, `src/components/Mugshot/Mugshot.module.css`

- [ ] **Step 1: Create Mugshot component**

```typescript
// src/components/Mugshot/Mugshot.tsx
import Image from 'next/image'
import styles from './Mugshot.module.css'

interface MugshotProps {
  src: string
  alt: string
  number: number
}

export function Mugshot({ src, alt, number }: MugshotProps) {
  return (
    <div className={styles.mugshot}>
      <div className={styles.overlay} />
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.image}
        sizes="280px"
      />
      <div className={styles.markers}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={styles.marker} />
        ))}
      </div>
      <div className={styles.plaque}>
        No. {String(number).padStart(3, '0')}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Mugshot CSS**

```css
/* src/components/Mugshot/Mugshot.module.css */
.mugshot {
  width: 280px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border: 3px solid var(--color-red);
  aspect-ratio: 3 / 4;
}

.image {
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2) brightness(0.9);
  mix-blend-mode: multiply;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(204, 0, 0, 0.35);
  z-index: 1;
  pointer-events: none;
}

.markers {
  position: absolute;
  top: 0;
  right: 8px;
  bottom: 30px;
  width: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
}

.marker {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
}

.plaque {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-red);
  color: #fff;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 6px 12px;
  text-align: center;
  z-index: 2;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Mugshot/
git commit -m "feat: add Mugshot component with red monotone filter"
```

---

### Task 14: ScoreCard, VerdictBar, FactorBreakdown Components

**Files:**
- Create: `src/components/ScoreCard/ScoreCard.tsx`, `src/components/ScoreCard/ScoreCard.module.css`, `src/components/VerdictBar/VerdictBar.tsx`, `src/components/VerdictBar/VerdictBar.module.css`, `src/components/FactorBreakdown/FactorBreakdown.tsx`, `src/components/FactorBreakdown/FactorBreakdown.module.css`

- [ ] **Step 1: Create ScoreCard component**

```typescript
// src/components/ScoreCard/ScoreCard.tsx
import styles from './ScoreCard.module.css'

interface ScoreCardProps {
  monsterScore: number
  monsterDescription: string
  artScore: number
  artDescription: string
}

export function ScoreCard({ monsterScore, monsterDescription, artScore, artDescription }: ScoreCardProps) {
  return (
    <div className={styles.scores}>
      <div className={styles.block}>
        <div className={styles.label}>The Monster</div>
        <div className={`${styles.number} ${styles.monster}`}>{monsterScore.toFixed(1)}</div>
        <div className={styles.desc}>{monsterDescription}</div>
      </div>
      <div className={styles.block}>
        <div className={styles.label}>The Art</div>
        <div className={`${styles.number} ${styles.art}`}>{artScore.toFixed(1)}</div>
        <div className={styles.desc}>{artDescription}</div>
      </div>
    </div>
  )
}
```

```css
/* src/components/ScoreCard/ScoreCard.module.css */
.scores { display: flex; gap: 48px; margin-bottom: 40px; }
.block { flex: 1; }
.label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-muted);
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-red);
}
.number {
  font-family: var(--font-display);
  font-size: 80px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}
.monster { color: var(--color-red); }
.art { color: var(--color-dark); }
.desc {
  font-size: 12px;
  color: var(--color-secondary);
  line-height: 1.5;
}
```

- [ ] **Step 2: Create VerdictBar component**

```typescript
// src/components/VerdictBar/VerdictBar.tsx
import styles from './VerdictBar.module.css'

interface VerdictBarProps {
  score: number
  blurb: string
}

export function VerdictBar({ score, blurb }: VerdictBarProps) {
  return (
    <div className={styles.verdict}>
      <div className={styles.left}>
        <div className={styles.label}>Consumability Index</div>
        <div className={styles.blurb}>{blurb}</div>
      </div>
      <div className={styles.score}>{score}</div>
    </div>
  )
}
```

```css
/* src/components/VerdictBar/VerdictBar.module.css */
.verdict {
  background: var(--color-red);
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left { color: rgba(255, 255, 255, 0.7); }
.label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 4px;
}
.blurb {
  font-family: var(--font-body);
  font-size: 14px;
  color: #fff;
  margin-top: 6px;
  max-width: 500px;
  line-height: 1.5;
}
.score {
  font-family: var(--font-display);
  font-size: 88px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}
```

- [ ] **Step 3: Create FactorBreakdown component**

```typescript
// src/components/FactorBreakdown/FactorBreakdown.tsx
import styles from './FactorBreakdown.module.css'

interface Factor {
  name: string
  value: number  // 0-1 or 0-10
  max: number    // maximum value for the bar
}

interface FactorBreakdownProps {
  factors: Factor[]
}

export function FactorBreakdown({ factors }: FactorBreakdownProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Factor Breakdown</div>
      {factors.map((factor) => (
        <div key={factor.name} className={styles.row}>
          <div className={styles.name}>{factor.name}</div>
          <div className={styles.barBg}>
            <div
              className={styles.bar}
              style={{ width: `${(factor.value / factor.max) * 100}%` }}
            />
          </div>
          <div className={styles.value}>
            {factor.max === 1 ? factor.value.toFixed(2) : factor.value}
          </div>
        </div>
      ))}
    </div>
  )
}
```

```css
/* src/components/FactorBreakdown/FactorBreakdown.module.css */
.container { padding: 40px 0; max-width: 1100px; }
.title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-muted);
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-red);
}
.row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(204, 0, 0, 0.15);
}
.name {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 200px;
  flex-shrink: 0;
}
.barBg {
  flex: 1;
  height: 8px;
  background: rgba(204, 0, 0, 0.1);
  margin: 0 16px;
}
.bar { height: 100%; background: var(--color-red); }
.value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  width: 50px;
  text-align: right;
  color: var(--color-dark);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ScoreCard/ src/components/VerdictBar/ src/components/FactorBreakdown/
git commit -m "feat: add ScoreCard, VerdictBar, and FactorBreakdown components"
```

---

### Task 15: Artist Detail Page

**Files:**
- Create: `src/app/artist/[id]/page.tsx`, `src/app/artist/[id]/page.module.css`

- [ ] **Step 1: Create the artist page**

```typescript
// src/app/artist/[id]/page.tsx
import { loadArtist, loadAllArtists, getArtistBreakdown } from '@/lib/data'
import { Mugshot } from '@/components/Mugshot/Mugshot'
import { ScoreCard } from '@/components/ScoreCard/ScoreCard'
import { VerdictBar } from '@/components/VerdictBar/VerdictBar'
import { FactorBreakdown } from '@/components/FactorBreakdown/FactorBreakdown'
import styles from './page.module.css'

export async function generateStaticParams() {
  const artists = loadAllArtists()
  return artists.map((artist) => ({ id: artist.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params
  const artist = loadArtist(id)
  const breakdown = getArtistBreakdown(id)
  const index = loadAllArtists().findIndex(a => a.id === id) + 1

  const monsterScore = 10 * (1 - breakdown.moral_modifier)
  const artScore = breakdown.art_merit * 10

  const factors = [
    { name: 'Severity', value: artist.acts[0]?.severity ?? 0, max: 1 },
    { name: 'Pattern', value: artist.character.consistency, max: 1 },
    { name: 'Accountability', value: breakdown.accountability_factor, max: 1 },
    { name: 'Significance', value: artist.art.significance, max: 10 },
    { name: 'Influence', value: artist.art.influence, max: 10 },
    { name: 'Replaceability', value: artist.art.replaceability, max: 10 },
  ]

  return (
    <div>
      <div className={styles.sectionLabel}>
        <span>Artist Assessment</span>
        <span>No. {String(index).padStart(3, '0')}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <Mugshot
            src={`/portraits/${artist.portrait}`}
            alt={artist.name}
            number={index}
          />
          <div className={styles.info}>
            <div className={styles.domain}>
              {artist.domain} &middot; {artist.sub_domain}
            </div>
            <h1 className={styles.name}>{artist.name}</h1>
            <div className={styles.works}>
              {artist.art.notable_works.join(' · ')}
            </div>
            <div className={styles.summary}>{artist.behavior_summary}</div>
          </div>
        </div>

        <ScoreCard
          monsterScore={monsterScore}
          monsterDescription={artist.behavior_summary}
          artScore={artScore}
          artDescription={artist.art.summary}
        />

        <VerdictBar
          score={artist.verdict.score!}
          blurb={artist.verdict.blurb}
        />
      </div>

      <div className={styles.factorsWrapper}>
        <FactorBreakdown factors={factors} />

        {artist.sources.length > 0 && (
          <div className={styles.sources}>
            <div className={styles.sourcesTitle}>Sources</div>
            <ul>
              {artist.sources.map((src, i) => (
                <li key={i}>
                  <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create artist page CSS**

```css
/* src/app/artist/[id]/page.module.css */
.sectionLabel {
  padding: 20px 32px;
  border-top: 2px solid var(--color-red);
  border-bottom: 1px solid rgba(204, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-muted);
}

.card { padding: 48px 32px; max-width: 1100px; }

.header {
  display: flex;
  gap: 48px;
  align-items: stretch;
  margin-bottom: 40px;
}

.info { flex: 1; padding-top: 8px; }

.domain {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: var(--color-red);
  margin-bottom: 12px;
}

.name {
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 700;
  line-height: 0.95;
  color: var(--color-dark);
  text-transform: uppercase;
  letter-spacing: -2px;
  margin-bottom: 8px;
}

.works {
  font-size: 14px;
  color: var(--color-secondary);
  font-style: italic;
  margin-bottom: 24px;
}

.summary {
  font-size: 13px;
  color: #440000;
  line-height: 1.7;
  max-width: 520px;
  border-left: 3px solid var(--color-red);
  padding-left: 16px;
}

.factorsWrapper { padding: 0 32px; max-width: 1100px; }

.sources {
  padding: 24px 0;
  border-top: 1px solid rgba(204, 0, 0, 0.15);
}

.sourcesTitle {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-muted);
  margin-bottom: 12px;
}

.sources ul {
  list-style: none;
  padding: 0;
}

.sources li {
  font-size: 12px;
  margin-bottom: 6px;
}

.sources a {
  color: var(--color-red);
  text-decoration: underline;
}
```

- [ ] **Step 3: Add a placeholder portrait**

```bash
mkdir -p public/portraits
convert -size 280x374 xc:'#4a0000' public/portraits/roman-polanski.jpg 2>/dev/null || \
  python3 -c "
from PIL import Image
img = Image.new('RGB', (280, 374), (74, 0, 0))
img.save('public/portraits/roman-polanski.jpg')
" 2>/dev/null || \
  echo "Create a 280x374 solid dark red image manually at public/portraits/roman-polanski.jpg"
```

Real portraits will be sourced during seed dataset creation.

- [ ] **Step 4: Verify build with the artist page**

```bash
npm run build
```

Expected: Build succeeds, static page generated for `/artist/roman-polanski`.

- [ ] **Step 5: Commit**

```bash
git add src/app/artist/ public/portraits/
git commit -m "feat: add artist detail page with full scoring display"
```

---

### Task 16: Home Page

**Files:**
- Create: `src/components/SearchBar/SearchBar.tsx`, `src/components/SearchBar/SearchBar.module.css`, `src/components/ArtistCard/ArtistCard.tsx`, `src/components/ArtistCard/ArtistCard.module.css`
- Modify: `src/app/page.tsx`, create `src/app/page.module.css`

- [ ] **Step 1: Create SearchBar component**

```typescript
// src/components/SearchBar/SearchBar.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './SearchBar.module.css'

interface ArtistStub {
  id: string
  name: string
  domain: string
}

interface SearchBarProps {
  artists: ArtistStub[]
}

export function SearchBar({ artists }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const filtered = query.length >= 2
    ? artists.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search an artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length > 0 && (
        <ul className={styles.results}>
          {filtered.map(a => (
            <li key={a.id}>
              <button
                className={styles.result}
                onClick={() => {
                  router.push(`/artist/${a.id}`)
                  setQuery('')
                }}
              >
                <span className={styles.resultName}>{a.name}</span>
                <span className={styles.resultDomain}>{a.domain}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

```css
/* src/components/SearchBar/SearchBar.module.css */
.container { position: relative; max-width: 600px; margin-bottom: 48px; }
.input {
  width: 100%;
  font-family: var(--font-body);
  font-size: 16px;
  padding: 16px 20px;
  background: rgba(204, 0, 0, 0.05);
  border: 2px solid var(--color-red);
  color: var(--color-dark);
  outline: none;
}
.input::placeholder { color: var(--color-muted); }
.input:focus { background: rgba(204, 0, 0, 0.1); }
.results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  background: #fff;
  border: 2px solid var(--color-red);
  border-top: none;
  z-index: 10;
}
.result {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-dark);
  cursor: pointer;
  text-align: left;
}
.result:hover { background: rgba(204, 0, 0, 0.05); }
.resultDomain {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-muted);
}
```

- [ ] **Step 2: Create ArtistCard component**

```typescript
// src/components/ArtistCard/ArtistCard.tsx
import Link from 'next/link'
import styles from './ArtistCard.module.css'

interface ArtistCardProps {
  id: string
  name: string
  domain: string
  score: number
}

export function ArtistCard({ id, name, domain, score }: ArtistCardProps) {
  return (
    <Link href={`/artist/${id}`} className={styles.card}>
      <div className={styles.domain}>{domain}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.score}>{score}</div>
    </Link>
  )
}
```

```css
/* src/components/ArtistCard/ArtistCard.module.css */
.card {
  display: block;
  padding: 24px;
  border: 2px solid var(--color-red);
  transition: background 0.15s;
}
.card:hover { background: rgba(204, 0, 0, 0.05); }
.domain {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-muted);
  margin-bottom: 8px;
}
.name {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.score {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-red);
}
```

- [ ] **Step 3: Create Home page**

```typescript
// src/app/page.tsx
import { loadAllArtists } from '@/lib/data'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { ArtistCard } from '@/components/ArtistCard/ArtistCard'
import styles from './page.module.css'

export default function HomePage() {
  const artists = loadAllArtists()
  const stubs = artists.map(a => ({ id: a.id, name: a.name, domain: a.domain }))

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        Should you consume the art of{' '}
        <em className={styles.emphasis}>terrible people</em>? We did the math,
        so you don&apos;t have to. (You&apos;re welcome.) (You&apos;re not forgiven.)
      </div>

      <SearchBar artists={stubs} />

      <div className={styles.grid}>
        {artists.map(a => (
          <ArtistCard
            key={a.id}
            id={a.id}
            name={a.name}
            domain={a.domain}
            score={a.verdict.score!}
          />
        ))}
      </div>
    </div>
  )
}
```

```css
/* src/app/page.module.css */
.container { padding: 60px 32px 40px; max-width: 1100px; }
.hero {
  font-family: var(--font-body);
  font-size: 42px;
  line-height: 1.35;
  color: #330000;
  margin-bottom: 48px;
}
.emphasis {
  font-style: normal;
  color: var(--color-red);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SearchBar/ src/components/ArtistCard/ src/app/page.tsx src/app/page.module.css
git commit -m "feat: add home page with search and artist grid"
```

---

### Task 17: Browse Page

**Files:**
- Create: `src/app/browse/page.tsx`, `src/app/browse/BrowseClient.tsx`, `src/app/browse/page.module.css`

- [ ] **Step 1: Create Browse page**

```typescript
// src/app/browse/page.tsx
import { loadAllArtists } from '@/lib/data'
import { BrowseClient } from './BrowseClient'

export default function BrowsePage() {
  const artists = loadAllArtists().map(a => ({
    id: a.id,
    name: a.name,
    domain: a.domain,
    score: a.verdict.score!,
  }))
  const domains = [...new Set(artists.map(a => a.domain))].sort()

  return <BrowseClient artists={artists} domains={domains} />
}
```

- [ ] **Step 2: Create BrowseClient component** (client-side filtering/sorting)

```typescript
// src/app/browse/BrowseClient.tsx
'use client'
import { useState } from 'react'
import { ArtistCard } from '@/components/ArtistCard/ArtistCard'
import styles from './page.module.css'

interface ArtistStub {
  id: string
  name: string
  domain: string
  score: number
}

interface BrowseClientProps {
  artists: ArtistStub[]
  domains: string[]
}

export function BrowseClient({ artists, domains }: BrowseClientProps) {
  const [domain, setDomain] = useState<string>('all')
  const [sort, setSort] = useState<'score' | 'name' | 'monster'>('score')

  let filtered = domain === 'all' ? artists : artists.filter(a => a.domain === domain)

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'score') return a.score - b.score
    if (sort === 'monster') return b.score - a.score
    return a.name.localeCompare(b.name)
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse</h1>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="all">All Domains</option>
          {domains.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value as 'score' | 'name' | 'monster')}
        >
          <option value="score">Least Consumable</option>
          <option value="monster">Most Consumable</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>
      <div className={styles.grid}>
        {filtered.map(a => (
          <ArtistCard key={a.id} id={a.id} name={a.name} domain={a.domain} score={a.score} />
        ))}
      </div>
    </div>
  )
}
```

```css
/* src/app/browse/page.module.css */
.container { padding: 48px 32px; max-width: 1100px; }
.title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}
.select {
  font-family: var(--font-body);
  font-size: 13px;
  padding: 10px 16px;
  background: rgba(204, 0, 0, 0.05);
  border: 2px solid var(--color-red);
  color: var(--color-dark);
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/browse/
git commit -m "feat: add browse page with client-side filtering and sorting"
```

---

### Task 18: About / Methodology Page

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/about/page.module.css`

- [ ] **Step 1: Create About page**

```typescript
// src/app/about/page.tsx
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Methodology</h1>
      <p className={styles.subtitle}>Or: how we reduced the entirety of human ethics to a JavaScript function</p>

      <section className={styles.section}>
        <h2 className={styles.heading}>What Is This?</h2>
        <p>This is The Monsters Calculator — a tool inspired by Claire Dederer&apos;s book <em>Monsters: A Fan&apos;s Dilemma</em>. Dederer wished someone would build a calculator that could weigh the heinousness of an artist&apos;s behavior against the greatness of their art and spit out a verdict. So we did.</p>
        <p>Is this reductive? Absolutely. Is it tongue-in-cheek? Obviously. Does the math actually hold up? Surprisingly, kind of.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>The Four Lenses</h2>
        <p>We score each artist through four ethical frameworks, because one way of judging people has never been enough:</p>
        <ul className={styles.list}>
          <li><strong>Consequentialism</strong> — How much harm was actually done? We sum it up: severity, victim count, duration, permanence. Cold math for cold acts.</li>
          <li><strong>Deontology</strong> — Some things are just wrong, full stop. Kant would not approve of a sliding scale, but we gave him one anyway. Certain violations — acts against children, bodily autonomy — create hard caps that no amount of artistic genius can override.</li>
          <li><strong>Virtue Ethics</strong> — Was this a one-time lapse or a pattern of character? Aristotle cared about who you are, not just what you did.</li>
          <li><strong>Care Ethics</strong> — Power matters. Exploiting someone who depends on you is worse than a conflict between equals.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>The Art Side</h2>
        <p>We also ask: can the art be separated from the artist? Drawing on Roland Barthes (yes, the author is dead) and Berys Gaut (actually, the author&apos;s crimes are in the art), we score how much the artist&apos;s presence contaminates the work.</p>
        <p>A film made by 500 people is more separable than an autobiography. A painting by a fraud is different from a painting by a predator whose predation shows up on canvas.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Time & Accountability</h2>
        <p>Moral weight fades over time — but logarithmically, not exponentially. Old sins leave stains, not bruises. And accountability matters: genuine restitution reduces the score. Old apologies matter less than recent ones.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>The Disclaimer</h2>
        <p>This is not moral advice. This is not a court of law. This is a calculator built by people who read one book and thought, &ldquo;what if we made this worse?&rdquo;</p>
        <p>If you&apos;re looking for absolution, you&apos;ve come to the wrong place. If you&apos;re looking for a number to argue about at dinner parties, welcome home.</p>
      </section>
    </div>
  )
}
```

```css
/* src/app/about/page.module.css */
.container { padding: 48px 32px; max-width: 800px; }
.title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: var(--color-secondary);
  font-style: italic;
  margin-bottom: 48px;
}
.section { margin-bottom: 40px; }
.heading {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-red);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-red);
}
.section p {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 12px;
  color: var(--color-dark);
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 16px;
  padding-left: 16px;
  border-left: 3px solid var(--color-red);
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/about/
git commit -m "feat: add about/methodology page"
```

---

### Task 19: Final Integration & Build Verification

**Files:**
- None new — verification only.

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Static export succeeds for all pages.

- [ ] **Step 3: Test locally**

```bash
npx serve out
```

Open `http://localhost:3000` and verify:
- Home page renders with hero text, search bar, artist grid
- Clicking an artist card navigates to their detail page
- Artist page shows mugshot, scores, verdict bar, factor breakdown
- Browse page filters and sorts work
- About page renders

- [ ] **Step 4: Commit any fixes**

```bash
git status
# Review changes, then add specific files:
git add <changed-files>
git commit -m "fix: integration fixes from manual testing"
```

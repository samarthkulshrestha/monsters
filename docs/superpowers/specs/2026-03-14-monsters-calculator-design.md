# The Monsters Calculator — Design Spec

## Overview

A tongue-in-cheek web app inspired by Claire Dederer's book *Monsters: A Fan's Dilemma*. The app scores whether you should consume art made by morally problematic artists, using a philosophically grounded multi-factor scoring model. The tone is playful and confrontational — self-aware about the absurdity of quantifying ethics, but not letting the user off the hook.

## Core Concept

Users search for or browse artists. Each artist has a curated profile with a "mugshot," scores across multiple ethical and artistic dimensions, and a computed **Consumability Index** (0-100). Each entry includes a hand-edited verdict blurb written in a direct, provocative voice.

## Target Platform

Static web app, deployed to Vercel. No auth, no user accounts, no backend for v1.

## Tech Stack

- **Framework**: Next.js (static export)
- **Data**: JSON files in `/data/artists/`, one per artist, version-controlled
- **Styling**: CSS Modules (custom design, not a component library)
- **Fonts**: Space Mono (monospace body) + Space Grotesk (display/headings) via Google Fonts
- **Images**: Artist portraits stored locally, red monotone applied via CSS (`grayscale(100%) + mix-blend-mode: multiply` over a red overlay)
- **Hosting**: Vercel (free tier)

## Visual Design

### Aesthetic

NaN.xyz-inspired: bold, type-forward, playful but confident. Monochrome red palette on a light cream-red background (`#ffe0e0`). Tabloid sensationalism meets editorial magazine sophistication.

### Key Visual Elements

- **Red banner header** with "MONSTERS" in white Space Grotesk bold
- **All-caps artist names** in oversized Space Grotesk (96px)
- **Mugshot-style portraits** with red monotone filter, bordered like booking photos with height markers and a "No. XXX" plaque
- **Section dividers** with 2px red borders and uppercase labels with wide letter-spacing
- **Red verdict bar** spanning full width with the Consumability Index score
- **Factor breakdown** with horizontal bar charts
- **Monospace body text** (Space Mono) for descriptions and verdicts

### Color Palette

- Background: `#ffe0e0` (light red/cream)
- Primary red: `#cc0000`
- Dark text: `#1a0000`
- Secondary text: `#660000`
- Muted labels: `#990000`
- Verdict bar / header: `#cc0000` background, white text

### Typography

- **Display**: Space Grotesk 700, used for artist names, score numbers
- **Body**: Space Mono 400/700, used for descriptions, verdicts, labels
- **Sizing**: Artist name 96px, score numbers 80px, body 13-14px, labels 10-12px with wide letter-spacing

## Pages

### 1. Home / Search

- Hero text: "Should you consume the art of terrible people? We did the math, so you don't have to. (You're welcome.) (You're not forgiven.)"
- Search bar for artist lookup (client-side: filters a pre-built JSON manifest of all artists by name, loaded at build time)
- Grid of featured/recent artists below

### 2. Artist Page

The core experience. Layout (top to bottom):

1. **Section label**: "Artist Assessment" / "No. XXX"
2. **Artist header**: Mugshot (left) + artist info (right, aligned stretch)
   - Domain tag (e.g., "Film · Director")
   - Artist name (all caps, oversized)
   - Notable works
   - Summary paragraph with red left border
3. **Scores**: Two columns — "The Monster" (red number) and "The Art" (black number), each with terse description
4. **Verdict bar**: Full-width red bar with "Consumability Index" label, verdict blurb, and large score number
5. **Factor breakdown**: Horizontal bar chart for each of the 6 core factors + modifiers
6. **Sources**: List of linked references for the behavioral claims

### 3. Browse

- Filter by domain (film, music, literature, visual art, comedy, etc.) — client-side JS filtering
- Sort by consumability score, monster score, or alphabetically — client-side JS sorting
- Grid/list of artist cards

### 4. About / Methodology

- Simplified prose explanation of the scoring model (not raw formulas — explain the four ethical frameworks, art theory inputs, and time-based dynamics in accessible language)
- Credits to Dederer's book
- Tongue-in-cheek disclaimer: "This is not actual moral advice"

## Data Schema

```jsonc
{
  "id": "roman-polanski",
  "name": "Roman Polanski",
  "domain": "film",
  "sub_domain": "Director",
  "portrait": "polanski.jpg",

  // Monster side — discrete acts, each scored independently
  "acts": [
    {
      "description": "Convicted of unlawful sex with a 13-year-old in 1977",
      "severity": 0.9,            // 0-1 scale
      "victim_count": 1,
      "duration": 0.2,            // 0-1: single incident (0.2) → sustained pattern (1.0)
      "reversibility": 0.9,       // 0-1: how permanent is the damage
      "power_differential": 0.9,  // care ethics: 0-1
      "relationship_proximity": 0.7, // care ethics: stranger (0.2) → dependent (1.0)
      "victim_vulnerability": 1.0,   // care ethics: 0-1
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
  "sources": ["url1", "url2"],

  // Virtue ethics — whole character assessment
  "character": {
    "virtue_score": 0.3,        // 0-1: overall character assessment
    "consistency": 0.8          // 0-1: how consistent is the pattern of vice
  },

  // Art side
  "art": {
    "significance": 9,          // 1-10
    "influence": 8,             // 1-10
    "replaceability": 3,        // 1-10 (low = hard to replace = more artistically valuable)
    "notable_works": ["Chinatown", "The Pianist", "Rosemary's Baby"],
    "summary": "Pioneered psychological horror and neo-noir, multiple Oscar-winning films.",
    // Art theory inputs (0-1 scale)
    "medium_aura": 0.5,         // Benjamin: performance (high) → mass-produced (low)
    "contamination": 0.6,       // Gaut: how much the failing shows up in the art
    "separability": 0.4         // Barthes↔Gaut: how separable is art from artist
  },

  // Contextual modifiers
  "modifiers": {
    "alive_and_profiting": true,
    "victims_in_process": false
  },

  // Temporal data
  "temporal": {
    "year_of_primary_act": 1977,
    "year_of_major_works": [1968, 1974, 2002],
    // Each event: { year, type, description }
    "accountability_events": [
      // e.g. { "year": 2003, "type": "apology", "magnitude": 0.1, "description": "..." }
    ]
  },

  // Computed at build time from the scoring model, blurb is human-edited
  "verdict": {
    "score": null,              // computed at build time, not hand-set
    "blurb": "The art is undeniably masterful. The man is undeniably a monster. He's still out there, living well. Every stream is a vote. You do the math."
  }
}
```

## Scoring Model

### Philosophical Foundations

The model draws from four ethical frameworks, art theory, and calculus-based dynamics.

### Layer 1: Ethical Framework Scores (each 0-1)

All formulas operate over the `acts[]` array from the data schema.

**Consequentialist (Utilitarian)**:
```
H = Σ(act_i.severity × log₂(act_i.victim_count + 1) × act_i.duration × act_i.reversibility)
score_consequentialist = 1 - sigmoid(H, midpoint=2.0, steepness=1.5)
```
Total harm as a utilitarian sum. Logarithmic victim scaling prevents a single mass event from dominating. The sigmoid normalization `σ(x) = 1 / (1 + e^(-steepness × (x - midpoint)))` maps H to [0,1] independently per artist (no cross-artist comparison needed). The midpoint and steepness constants are calibrated against the seed dataset.

**Deontological (Kantian)**:
A threshold function. If any act has `categorical_violations`, the score is hard-capped:
```
D = 1 - max(violation_weight(v) for v in all act_i.categorical_violations)
```
Where `violation_weight` is a fixed mapping:
- `acts_against_children` → 0.95
- `bodily_autonomy` → 0.90
- `sexual_exploitation` → 0.90
- `violence` → 0.85
- `coercion` → 0.80
- `fraud_or_theft` → 0.60
- `hate_speech` → 0.70
- `collaboration_with_oppression` → 0.75

If no categorical violations exist across any act, D = 1.0.
This introduces a discontinuity — philosophically appropriate, since Kant's point is that morality is not a smooth continuum.

**Virtue Ethics (Aristotelian)**:
Evaluates whole character via `character.virtue_score` and `character.consistency`:
```
V = (1 - character.virtue_score) × character.consistency
score_virtue = 1 - V
```
High consistency in vice (high V) = reveals true character = lower score. Low consistency = morally complex person.

**Care Ethics**:
Averaged across all acts:
```
C_i = act_i.power_differential × act_i.relationship_proximity × act_i.victim_vulnerability
score_care = 1 - mean(C_i)
```
Exploitation of power is weighted more heavily than harm between equals.

### Layer 2: Art Theory Modifiers

**Separability Coefficient** (Barthes ↔ Gaut): `S ∈ [0, 1]`
- S = 1: art stands completely alone (Death of the Author)
- S = 0: art is inseparable from artist (Ethicism)

**Contamination** (Gaut):
`art.contamination` is a pre-scored 0-1 value in the schema representing how much the artist's moral failing manifests thematically in their work (e.g., Woody Allen's older-man/younger-woman plots = high contamination; a sculptor who committed tax fraud = low). This value is factored into the composite formula as an additional multiplier: `contamination_factor = 1 - art.contamination × (1 - art.separability)`. Contamination only matters when the art is hard to separate from the artist.

**Medium Aura** (Walter Benjamin):
```
aura ∈ [0, 1]: performance/autobiography (high) → mass-produced (low)
```
Higher aura = harder to separate art from artist.

### Layer 3: Calculus-Based Dynamics

**The Stain** (Dederer):
```
stain = 1 - e^(-k × Σ act_i.severity)   // summed over all acts[]
```
Saturating function. First revelation hits hardest; additional ones compound with diminishing shock. The stain never fully washes out. `k` is a sensitivity constant (default: 1.5).

**Moral Decay Over Time** (logarithmic persistence):
```
t = current_year - temporal.year_of_primary_act
temporal_factor = max(0, 1 - α × ln(1 + t/τ))
```
Old sins fade, but slowly. A stain, not a bruise. τ = 50 (time constant), α = 0.15 (fading rate). Clamped to [0, 1].

**Accountability** (first-order linear ODE):
```
dA/dt = -γA + R(t)

Solution: A(t) = A₀ × e^(-γt) + Σ event_j.magnitude × e^(-γ(t - event_j.year))
```
Moral debt decays naturally but is actively reduced by genuine restitution events (from `temporal.accountability_events[]`). Recent accountability weighs more than old apologies. γ = 0.05. Initial moral debt `A₀` = the consequentialist harm score H (before sigmoid). `accountability_factor = 1 - A(current_year - temporal.year_of_primary_act) / A₀`. All time variables use years-since-primary-act as the unit (i.e., `event_j.year` is converted to `current_year - event_j.year` before use).

**Cultural Significance Accumulation** (logistic growth):
```
t_avg = mean(temporal.year_of_major_works)
cultural_age = current_year - t_avg
art_merit = (art.significance × 0.35 + (10 - art.replaceability) × 0.35 + art.influence × 0.30) / 10
            × K / (1 + e^(-0.1 × (cultural_age - 20)))
```
Art merit combines the three art scores, scaled by a logistic function of how long the work has had to accumulate cultural importance. `K` = 1.0 (carrying capacity).

### Composite Formula

```
SCORE = (1 - stain) × art_merit × (S + (1-S) × moral_modifier)
        × temporal_factor × accountability_factor × medium_factor × contamination_factor
```

Where each term maps to the schema:
- `stain`: computed from `acts[].severity` (see Layer 3)
- `art_merit`: computed from `art.significance`, `art.influence`, `art.replaceability`, and `temporal.year_of_major_works` (see Layer 3)
- `S`: `art.separability` from the schema
- `temporal_factor`: computed from `temporal.year_of_primary_act` (see Layer 3)
- `accountability_factor`: computed from `temporal.accountability_events[]` (see Layer 3)
- `medium_factor`: `1 - art.medium_aura × (1 - art.separability)` — high aura + low separability = harder to consume
- `contamination_factor`: `1 - art.contamination × (1 - art.separability)` (see Layer 2)

**Note on score distribution:** multiplying many [0,1] factors tends to compress scores toward zero. The final raw score is therefore passed through a power curve `SCORE_final = SCORE^0.5 × 100` to spread values across the 0-100 range. The exponent is calibrated against the seed dataset to produce a meaningful distribution.

```
moral_modifier = Σ P(framework_j) × score_j
```
Aggregated across all four ethical frameworks with default weights:
- Consequentialist (`score_consequentialist`): 0.30
- Deontological (`D`): 0.25
- Virtue Ethics (`score_virtue`): 0.20
- Care Ethics (`score_care`): 0.25

Contextual modifiers apply to the raw SCORE **before** the power curve normalization:
- `modifiers.alive_and_profiting`: multiply SCORE by 0.85
- `modifiers.victims_in_process`: multiply SCORE by 0.80

Final output scaled to 0-100 as the **Consumability Index**. The score is **computed at build time** from the formula; the `verdict.blurb` is human-written.

### Future: User-Tunable Weights

In a later version, users can adjust sliders:
- "How Kantian are you feeling today?" (deontological weight)
- "Can you separate art from artist?" (Barthes ↔ Gaut)
- "Are you paying for it?" (financial complicity modifier)

## Seed Dataset

~40-60 artists across all domains (film, music, literature, visual art, comedy, architecture, etc.). Mix of:
- High-profile controversial figures (for range on the monster scale)
- Less controversial figures (for contrast and scale calibration)

Data generated by AI, manually reviewed and edited for tone and accuracy before inclusion.

## Future Enhancements (Out of Scope for v1)

- AI-powered lookup for artists not in the database
- User-tunable ethical framework weights (sliders)
- Shareable results (OG image generation for social)
- Community submissions / PR-based contributions
- Financial complicity calculator (are you buying or borrowing?)

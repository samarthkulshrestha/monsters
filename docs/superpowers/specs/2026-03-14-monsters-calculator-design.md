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
- Search bar for artist lookup
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

### 3. Browse

- Filter by domain (film, music, literature, visual art, comedy, etc.)
- Sort by consumability score, monster score, or alphabetically
- Grid/list of artist cards

### 4. About / Methodology

- Explanation of the scoring model and its philosophical foundations
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

  // Monster side
  "behavior": {
    "severity": 9,
    "pattern": 7,
    "accountability": 2,
    "summary": "Convicted of unlawful sex with a 13-year-old in 1977, fled sentencing, multiple other allegations spanning decades.",
    "sources": ["url1", "url2"],
    // Care ethics inputs
    "power_differential": 0.9,
    "victim_vulnerability": 1.0,
    // Deontological flags
    "categorical_violations": ["bodily_autonomy", "acts_against_children"],
    // Virtue ethics
    "character_consistency": 0.8
  },

  // Art side
  "art": {
    "significance": 9,
    "influence": 8,
    "replaceability": 3,
    "notable_works": ["Chinatown", "The Pianist", "Rosemary's Baby"],
    "summary": "Pioneered psychological horror and neo-noir, multiple Oscar-winning films.",
    // Art theory inputs
    "medium_aura": 0.5,
    "contamination": 0.6,
    "separability": 0.4
  },

  // Contextual modifiers
  "modifiers": {
    "alive_and_profiting": true,
    "behavior_in_art": false,
    "victims_in_process": false
  },

  // Temporal data
  "temporal": {
    "year_of_primary_act": 1977,
    "year_of_major_works": [1968, 1974, 2002],
    "accountability_events": []
  },

  // AI-generated, human-reviewed
  "verdict": {
    "score": 34,
    "blurb": "The art is undeniably masterful. The man is undeniably a monster. He's still out there, living well. Every stream is a vote. You do the math."
  }
}
```

## Scoring Model

### Philosophical Foundations

The model draws from four ethical frameworks, art theory, and calculus-based dynamics.

### Layer 1: Ethical Framework Scores (each 0-1)

**Consequentialist (Utilitarian)**:
```
H = Σ(severity_i × log₂(victims_i + 1) × duration_i × reversibility_i)
```
Total harm as a utilitarian sum. Logarithmic victim scaling prevents a single mass event from dominating.

**Deontological (Kantian)**:
A threshold function. Certain acts (violations of bodily autonomy, acts against children, using persons as means) create a hard cap via:
```
D_soft(act) = 1 - max(violation_strength_j)
```
This introduces a discontinuity — philosophically appropriate, since Kant's point is that morality is not a smooth continuum.

**Virtue Ethics (Aristotelian)**:
Evaluates whole character, not just worst act. Pattern vs. aberration:
```
V = character_assessment × consistency_multiplier
consistency = 1 - variance(moral_acts_over_time)
```
High consistency in vice = reveals true character. High variance = morally complex person.

**Care Ethics**:
```
C = power_differential × relationship_proximity × victim_vulnerability
```
Exploitation of power is weighted more heavily than harm between equals.

### Layer 2: Art Theory Modifiers

**Separability Coefficient** (Barthes ↔ Gaut): `S ∈ [0, 1]`
- S = 1: art stands completely alone (Death of the Author)
- S = 0: art is inseparable from artist (Ethicism)

**Contamination Function** (Gaut):
```
contamination = relevance(artist_failing, artwork_content) × severity(failing)
```
If the artist's moral failing manifests thematically in their work, the art is aesthetically contaminated.

**Medium Aura** (Walter Benjamin):
```
aura ∈ [0, 1]: performance/autobiography (high) → mass-produced (low)
```
Higher aura = harder to separate art from artist.

### Layer 3: Calculus-Based Dynamics

**The Stain** (Dederer):
```
stain(acts) = 1 - e^(-k × Σ severity_i)
```
Saturating function. First revelation hits hardest; additional ones compound with diminishing shock. The stain never fully washes out.

**Moral Decay Over Time** (logarithmic persistence):
```
M(t) = M₀ × (1 - α × ln(1 + t/τ))
```
Old sins fade, but slowly. A stain, not a bruise. τ is a time constant, α controls fading rate.

**Accountability** (first-order linear ODE):
```
dA/dt = -γA + R(t)

Solution: A(t) = A₀ × e^(-γt) + ∫₀ᵗ R(s) × e^(-γ(t-s)) ds
```
Moral debt decays naturally but is actively reduced by genuine restitution. Recent accountability weighs more than old apologies.

**Cultural Significance Accumulation** (logistic growth):
```
S(t) = K / (1 + e^(-r(t - t_half)))
```
Works reach a saturation point of cultural importance.

### Composite Formula

```
SCORE = (1 - stain) × art_merit × (S + (1-S) × moral_modifier)
        × temporal_factor × accountability_factor × medium_factor
```

Where:
```
moral_modifier = Σ P(framework_j) × score_j
```
Aggregated across all four ethical frameworks with default weights:
- Consequentialist: 0.30
- Deontological: 0.25
- Virtue Ethics: 0.20
- Care Ethics: 0.25

Final output scaled to 0-100 as the **Consumability Index**.

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

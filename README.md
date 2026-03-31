# The Monsters Calculator

Should you consume the art of terrible people? We did the math, so you don't have to. (You're welcome.) (You're not forgiven.)

Inspired by Claire Dederer's *Monsters: A Fan's Dilemma*.

## What is this?

A tongue-in-cheek web app that scores whether you should consume art made by morally problematic artists. Each artist is assessed through four ethical frameworks (consequentialism, deontology, virtue ethics, care ethics), art theory (Barthes, Gaut, Benjamin), and calculus-based dynamics (moral decay, accountability ODEs, Dederer's "stain" function) to produce a **Consumability Index** from 0 to 100.

The math is genuinely grounded in philosophy. The tone is not.

## The Scoring Model

The Consumability Index is computed from:

- **Consequentialist harm** — utilitarian sum with logarithmic victim scaling and sigmoid normalization
- **Deontological thresholds** — Kantian categorical imperatives that create hard caps (some things are just wrong)
- **Virtue ethics** — whole-character assessment weighted by behavioral consistency
- **Care ethics** — power differential, relationship proximity, victim vulnerability
- **The Stain** (Dederer) — `1 - e^(-k * severity)`, a saturating function that never fully washes out
- **Temporal decay** — logarithmic, not exponential. Old sins fade, but slowly.
- **Accountability ODE** — moral debt decays naturally but is actively reduced by genuine restitution
- **Art theory modifiers** — separability (Barthes vs Gaut), contamination, medium aura (Benjamin)

See `docs/superpowers/specs/2026-03-14-monsters-calculator-design.md` for the full spec.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development

```bash
npm run dev        # dev server
npm run build      # static export to out/
npm test           # run tests
npm run test:watch # watch mode
```

## Adding an Artist

1. Create a JSON file in `data/artists/` following the schema (see any existing file for reference)
2. Add a portrait to `public/portraits/` matching the artist's `portrait` field
3. Run `npm run build` — the score is computed at build time

## Tech Stack

- **Next.js** (App Router, static export)
- **TypeScript**
- **CSS Modules**
- **Space Mono + Space Grotesk** (Google Fonts)
- **Vitest** for testing

## Disclaimer

This is not moral advice. This is a calculator built by people who read one book and thought, "what if we made this worse?" If you're looking for absolution, you've come to the wrong place. If you're looking for a number to argue about at dinner parties, welcome home.

## Section 1: The Scoring Model

This is the heart of the app. I'm proposing 6 factors, each scored 1-10:

The "Monster" Side (how bad is the person):
1. Severity of behavior — Ranging from "said some ignorant things" (1-2) to "committed serious crimes" (9-10)
2. Pattern vs. incident — One-off vs. sustained, repeated behavior
3. Accountability — Did they face consequences, apologize meaningfully, change? (Inverted: high accountability lowers the monster score)

The "Art" Side (how great is the work):
4. Cultural significance — How important is this work to its medium/genre/culture?
5. Influence & legacy — How many artists/movements did this work inspire?
6. Replaceability — Can you get a similar experience elsewhere, or is this truly singular?

The formula would weight and combine these into a final score — something like a "Consumability Index" from 0-100. Low score = hard to justify consuming. High score = the art outweighs the monster.

There could also be contextual modifiers:
- Is the artist still alive/profiting from sales?
- Is the problematic behavior embedded in the art itself?
- Were the victims part of the art-making process?

## Section 2: Data Schema

```json
{
    "id": "roman-polanski",
    "name": "Roman Polanski",
    "domain": "film",           // film, music, literature, visual-art, comedy, etc.
    "portrait": "polanski.jpg",

    // Monster side
    "behavior": {
        "severity": 9,
        "pattern": 7,
        "accountability": 2,
        "summary": "Convicted of unlawful sex with a 13-year-old in 1977, fled sentencing, multiple other allegations
        spanning decades.",
        "sources": ["url1", "url2"]
    },

    // Art side
    "art": {
        "significance": 9,
        "influence": 8,
        "replaceability": 3,       // 1 = easily replaceable, 10 = utterly singular
        "notable_works": ["Chinatown", "The Pianist", "Rosemary's Baby"],
        "summary": "Pioneered psychological horror and neo-noir, multiple Oscar-winning films."
    },

    // Contextual modifiers
    "modifiers": {
        "alive_and_profiting": true,
        "behavior_in_art": false,
        "victims_in_process": false
    },

    // AI-generated, human-reviewed
    "verdict": {
        "score": 34,               // computed consumability index
        "blurb": "The art is undeniably masterful. The man is undeniably a monster. He's still out there, living well. Every stream is a vote. You do the math."
    }
}
```


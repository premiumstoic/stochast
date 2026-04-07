# User Intent Extract

## Summary
These are the strongest product requirements because they originate from the user's own prompts in the Gemini conversation.

## Core Product Goal
The user wanted to build a website that explains stochastic-process concepts, visualizes how local probability rules create global distributions, and serves as both a learning tool and a foundation for deeper machine-learning intuition.

Source:
- `Q6`

## Mathematical Motivation
The project started from two mathematical goals:
- understanding how fixed probability leads to a Gaussian-style final distribution
- understanding how memory-dependent probability can produce a Uniform distribution
- solving the teacher's question about how to make edge-heavy outcomes with an S-curve relation

Sources:
- `Q3`
- `Q4`

## Product Structure
The user explicitly wanted two experiences:
- an explanatory textbook with small visualizations and interactive blocks
- a big “massive sandbox” page for full experimentation

The textbook should end with a link into the sandbox.

The smaller textbook widgets should be built from parts of the bigger sandbox rather than implemented separately.

Sources:
- `Q14`
- `Q15`

## Implementation Priority
The user explicitly preferred starting with the big sandbox first, then reusing its parts for the explanatory page.

Source:
- `Q15`

## Sandbox Requirements
The user wanted the sandbox to expose:
- total number of agents
- total time / steps
- playback controls
- default rules such as Gaussian, Uniform, and S-curve
- the ability to discover and define many more rules

The user also wanted a system where curated relations can ship as defaults, but users can explore custom rules beyond them.

Source:
- `Q18`

## Technology Direction
The user explicitly planned:
- React
- Vercel deployment

The user was open to guidance on the exact visual engine and state-management approach.

Sources:
- `Q6`
- `Q16`
- `Q20`

## Design Language Intent
The user explicitly pointed toward Monkeytype as the desired interaction and styling reference:
- easy to use
- high focus
- technically inclined
- minimalist and efficient

Sources:
- `Q20`
- `Q22`

## Sharing / Export Intent
The user explicitly wanted the app to:
- show the resulting distribution
- allow saving a PNG containing the distribution and formula
- support shareability as part of the product value

Source:
- `Q23`

## Organizational Intent
The user explicitly wanted the work divided into domains:
- simulation / “bare-metal” technical work
- general website, UI, textbook, and navigation work
- branding, sharing, and export work

The user also wanted context-rich documentation so future AI collaborators would understand the project properly.

Sources:
- `Q24`
- `Q25`
- `Q26`

## Priority Interpretation
If later implementation decisions conflict with Gemini suggestions, the user-originated constraints above should win unless the user later overrides them.

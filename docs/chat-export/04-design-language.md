# Design Language Extract

## Summary
This is the key visual-direction material taken from the Gemini conversation. It combines the user's Monkeytype reference with Gemini's translation of that reference into Stochast-specific UI language.

## User-Supplied Design Reference
The user provided a long reference summary of Monkeytype's design language. The important extracted traits are:
- Minimalist Functionalism
- traditional UI clutter is stripped away
- text becomes the primary interface
- high-focus monospaced typography
- “content-as-UI” philosophy
- keyboard-centric interaction
- real-time metrics and analytics
- a developer-tool feel rather than a standard website feel

Relevant sources:
- `Q20`
- `Q22`

## Gemini's Translation For Stochast
Gemini translated that reference into product language for Stochast as:
- “Brutalist-Chic”
- minimalist
- content-as-UI
- dark-mode native
- high-focus
- data and math as the primary interface

Gemini also explicitly said the product should not feel like a normal website but like a concentrated tool for watching emergent behavior.

Relevant sources:
- `R6`
- `R8`
- `R9`

## Typography Direction
Gemini suggested a monospace-first UI and named examples like:
- JetBrains Mono
- Fira Code

We later adapted that into the more specific `IBM Plex Mono` and `IBM Plex Sans` rules in `/docs/phases`.

Relevant source:
- `R8`

## Interaction Direction
Gemini connected the Monkeytype reference to:
- a command palette
- a command-line-like formula bar
- tight keyboard interaction
- data-dense metrics

Relevant sources:
- `Q22`
- `R6`

## Visual Hierarchy
Gemini's most useful visual-direction idea was that the charts, formula, and metrics should dominate the page, while decorative UI elements should recede.

This directly informed the “formula, charts, and metrics are the interface” rule later locked into the phase docs.

Relevant sources:
- `R6`
- `R8`
- `R9`

## Export Look
Gemini described the export card as:
- dark background
- neon histogram
- raw formula visible
- subtle watermark

Relevant source:
- `R7`

## What Was Useful Versus What Was Dropped
Useful and retained:
- Minimalist Functionalism
- content-as-UI
- dark-mode-first
- keyboard-first interactions
- monospace-heavy interface
- data-rich but visually restrained layout

Not carried forward literally:
- community theme system
- gamified progression systems
- leaderboards
- “Funbox”-style gimmick modes

Those ideas were part of the Monkeytype description, but they are not part of Stochast's current implementation plan.

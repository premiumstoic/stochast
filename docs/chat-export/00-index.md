# Gemini Chat Export: Stochast

## Purpose
This folder contains the Stochast-related information extracted from [Google Gemini.webarchive](/Users/mchalil/Documents/Stochast/Google%20Gemini.webarchive).

It is not a raw transcript dump. It is a curated source package containing:
- user intent and non-negotiable product requirements
- math and distribution explanations that motivated the tool
- Gemini's product, architecture, and design suggestions
- the task-force split and README draft context

## How To Use This Folder
Treat user-originated statements as higher-priority product requirements than Gemini-originated suggestions.

Use this folder for:
- project context recovery
- checking why certain design and architecture decisions were made
- tracing where the phase docs came from
- preserving the original thinking before implementation diverges

Use `/docs/phases` for the actual implementation contract.

## Source Map
- [01-user-intent.md](./01-user-intent.md): extracted goals and constraints from the user's prompts
- [02-math-model.md](./02-math-model.md): the probability and distribution concepts that define the simulation
- [03-product-architecture.md](./03-product-architecture.md): Gemini's product and systems suggestions
- [04-design-language.md](./04-design-language.md): Monkeytype-derived design language and visual-direction notes
- [05-metrics-branding-export.md](./05-metrics-branding-export.md): metrics, export, naming, and growth ideas
- [06-task-force.md](./06-task-force.md): domain split and agent-brief extraction
- [07-readme-source.md](./07-readme-source.md): the README-style project summary generated in the chat

## Relevant Source Turns
The most relevant user prompts were:
- `Q3`: distribution intuition and the Gaussian/Uniform framing
- `Q4`: teacher's S-curve requirement
- `Q6`: React + Vercel website goal
- `Q14` and `Q15`: textbook + sandbox split, sandbox-first implementation
- `Q18`: sandbox controls, presets, and custom rules
- `Q20` and `Q22`: Monkeytype-inspired design language
- `Q23`: exportable PNG and shareability
- `Q24` to `Q26`: team/phase split and README request

The most relevant Gemini responses were:
- `R3`: Gaussian, Uniform, and edge-heavy S-curve explanation
- `R4`: educational flow and high-level app structure
- `R5`: sandbox-first modularization and control surface discussion
- `R6`: Web Worker + canvas + formula bar + Zustand direction
- `R7`: metrics, export card, and “scholar-marketing” concepts
- `R8`: task-force split and agent briefs
- `R9`: README-style project narrative

## Notes
The chat contains a mix of:
- user requirements
- Gemini recommendations
- Gemini rhetoric that is not useful as implementation guidance

This export keeps the useful signal and strips away the filler.

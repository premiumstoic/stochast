# README Source Extract

## Summary
Gemini generated a README-style project explanation late in the conversation. This document extracts the useful project-definition content from that response.

## Gemini's README Framing
Gemini framed Stochast as:
- “A Brutalist-Chic Stochastic Process Simulator & Educational Sandbox”
- a high-performance web application
- a tool for visualizing how local microscopic probability rules shape macroscopic distributions

Relevant source:
- `R9`

## Core Features Mentioned
Gemini's README draft highlighted four feature pillars:
- math engine driven by raw formula input via `math.js`
- high-performance simulation using Web Workers
- Brutalist / Monkeytype-inspired UI
- high-resolution “Trading Card” exports

Relevant source:
- `R9`

## Architecture Mentioned
Gemini's README draft summarized:
- React / Next.js or Vite frontend
- Zustand state management
- Web Workers and typed arrays for simulation
- `math.js` for parsing formulas
- Canvas for drawing paths and histograms

Relevant source:
- `R9`

## How-It-Works Framing
Gemini's README described the core algorithm as:
1. initialize many agents
2. compute `x = (ups + 1) / (T + 2)` at each step
3. evaluate a formula over `x`
4. use the resulting probability to determine the next step
5. send results to the renderer to build the final histogram

Relevant source:
- `R9`

## Value Of This Draft
This README draft is useful because it compresses the project into a concise narrative that can later be turned into the repository's public README.

It is not the final README. It is source material.

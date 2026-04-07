# Product And Architecture Extract

## Summary
This document captures Gemini's product-structure and systems suggestions that are directly relevant to implementation planning.

## Product Framing
Gemini consistently framed Stochast as:
- a high-performance web application
- an educational sandbox for stochastic processes
- a bridge between textbook explanation and open-ended experimentation
- a tool that can also support intuition for machine learning, random walks, and reinforcement learning

Relevant sources:
- `R4`
- `R8`
- `R9`

## Route Structure
Gemini aligned with the user's two-surface model:
- textbook / explanation route
- sandbox / full experimentation route

Gemini also supported building the sandbox first and deriving smaller locked-down visualizations from it later.

Relevant sources:
- `R5`
- `R8`

## Rendering Direction
Gemini warned against rendering thousands of moving elements through standard React DOM nodes and pushed toward:
- HTML5 Canvas first
- PixiJS or similar only as an optional higher-performance alternative

Relevant sources:
- `R4`
- `R5`
- `R6`

## Simulation Location
One of Gemini's strongest architecture claims was that the simulation should not run on a backend:
- sending large coordinate arrays over the network would harm responsiveness
- the simulation should run in-browser
- Web Workers should carry the computation to keep the UI thread responsive

Relevant sources:
- `R6`
- `R8`
- `R9`

## Formula System
Gemini proposed a formula-driven probability engine:
- a command-line-like input where users type raw math
- formulas parsed with `math.js`
- formulas compiled once into fast functions
- curated presets plus editable formulas

Relevant sources:
- `R6`
- `R8`
- `R9`

## State Management
Gemini suggested Zustand as the state-management fit for the project, mainly because:
- high-frequency state should avoid costly React rerenders
- simulation status and playback state can sit outside the normal React render cycle

Relevant sources:
- `R6`
- `R8`
- `R9`

## Reusable Widget Model
Gemini explicitly described a reusable sandbox component with props like:
- `lockedRule`
- `hideControls`

That idea later evolved into the reusable textbook-widget model captured in the phase docs.

Relevant source:
- `R5`

## Output Artifacts
Gemini described the simulation engine as producing:
- trajectories for many agents
- histogram bins
- data suitable for real-time visualization
- metrics-ready final positions

Relevant sources:
- `R8`
- `R9`

## Product Interpretation
The most durable architecture ideas from the Gemini chat are:
- sandbox-first modularity
- client-side simulation
- worker boundary
- canvas rendering
- formula-driven custom rules

These are the ideas that were carried forward into `/docs/phases`.

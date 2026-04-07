# Task-Force And Domain Split Extract

## Summary
The Gemini conversation included a project split into three domains. This became part of the planning logic for phase separation, even though the current work is not being executed by literal separate agents.

## User Intent
The user wanted the work conceptually divided into:
- bare-metal simulation work
- general website, UI, textbook, and navigation work
- branding, export, and sharing work

Relevant sources:
- `Q24`
- `Q25`

## Gemini's Three-Domain Split
Gemini turned that into three roles.

### 1. Simulation Engineer
Gemini assigned this role:
- Web Worker simulation engine
- `math.js` formula parsing and compilation
- typed-array output structures
- fast trajectory and histogram generation

Gemini's proposed first task:
- build a `simulationWorker.js` that accepts configuration and returns path and histogram data

Relevant source:
- `R8`

### 2. UI/UX Architect
Gemini assigned this role:
- React application shell
- state management
- textbook route
- sandbox route
- command-line formula input
- canvas integration

Gemini's proposed first task:
- scaffold the layout, Zustand store, formula input, and placeholder canvas components

Relevant source:
- `R8`

### 3. Growth And Metrics Lead
Gemini assigned this role:
- metric calculations
- export-card generation
- PNG download path

Gemini's proposed first task:
- implement bifurcation and convergence utilities and wire export rendering

Relevant source:
- `R8`

## Why This Still Matters
The exact agent prompts are less important than the domain boundaries they imply:
- simulation core
- application UI
- metrics/export layer

That split was folded into the current phased execution plan under `/docs/phases`.

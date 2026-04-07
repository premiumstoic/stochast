# Phase 00: Overview

## Goal
Establish Stochast as a documentation-led project with one authoritative roadmap, one authoritative design language, and one authoritative execution order before any application code is written.

## Why This Phase Exists
Stochast is intended to be both an educational product and a high-performance simulation tool. Without a stable overview, later phases would drift on product scope, route responsibilities, worker contracts, and design language. This document exists to keep every later phase aligned to one source of truth.

## Scope
This phase defines the product purpose, the route map, the system architecture summary, the implementation order, the shared interface inventory, and the repo-wide definition of done.

The product scope is:
- a high-performance stochastic-process visualizer
- a two-route application with a textbook experience at `/` and a sandbox at `/sandbox`
- a sandbox-first architecture where the simulation engine is reusable inside the textbook as locked widgets
- a documentation-first workflow where every later implementation phase is gated by its corresponding phase document

The route map is:
- `/`: MDX-authored textbook that explains Gaussian, Uniform, and positive-feedback S-curve behavior using constrained embedded widgets
- `/sandbox`: full interactive lab with presets, formula editing, playback, metrics, and PNG export

The system architecture summary is:
- Next.js App Router for page composition and routing
- TypeScript for all application and interface definitions
- Tailwind CSS plus tokenized global CSS for the visual system
- Zustand for simulation-related client state coordination
- Web Workers for simulation execution off the main thread
- Canvas 2D for live path and histogram rendering
- `math.js` for validated formula parsing and compilation
- MDX for textbook content

The implementation dependency graph in prose is:
`design language -> foundation -> simulation engine -> sandbox UI -> textbook -> metrics/export -> hardening`

## Out Of Scope
This phase does not implement any app code, repo bootstrap, CSS, or worker logic. It also does not define persistence, accounts, multiplayer features, or a backend API because those are outside the v1 scope.

## Inputs / Dependencies
This phase depends on the locked project assumptions captured from the Gemini archive and the explicit instruction that documentation is the first implemented deliverable.

The locked assumptions are:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- Canvas 2D
- Web Workers
- `math.js`
- sandbox-first implementation
- MDX textbook route
- Monkeytype-inspired Minimalist Functionalist / Brutalist-Chic design language

## Deliverables
This phase delivers:
- the project roadmap under `/docs/phases`
- the authoritative phase order for implementation
- the shared interface inventory that later phases must honor
- the project status table linking every planned phase document

Project status table:

| Phase | Document | Purpose | Depends On | Status |
| --- | --- | --- | --- | --- |
| 00 | [00-overview.md](./00-overview.md) | Product scope, architecture summary, phase order, shared contracts | None | Synced |
| 01 | [01-design-language.md](./01-design-language.md) | Visual system, typography, themes, interaction grammar, anti-patterns | 00 | Complete |
| 02 | [02-foundation.md](./02-foundation.md) | Repo bootstrap, routes, tokens, shell, state boundaries | 00, 01 | Complete |
| 03 | [03-simulation-engine.md](./03-simulation-engine.md) | Worker model, formulas, presets, result protocol | 02 | Complete |
| 04 | [04-sandbox-ui.md](./04-sandbox-ui.md) | Sandbox layout, controls, canvases, playback, responsive behavior | 01, 02, 03 | Complete |
| 05 | [05-textbook-mdx.md](./05-textbook-mdx.md) | MDX chapters, embedded widgets, narrative flow | 01, 02, 03, 04 | Complete |
| 06 | [06-metrics-export.md](./06-metrics-export.md) | Distribution metrics, scoreboard, export card, PNG pipeline | 01, 03, 04, 05 | Complete |
| 07 | [07-hardening-launch.md](./07-hardening-launch.md) | QA, accessibility, performance, launch readiness | 01, 02, 03, 04, 05, 06 | Complete |

## Design Constraints
The sandbox engine is the reusable product core. The textbook is a constrained presentation layer on top of that core, not a separate implementation path.

Documentation is operational, not decorative. No later phase should contradict these docs without first updating the relevant document.

The design language must survive implementation. Functional correctness alone is not enough to mark a phase complete.

## Technical Decisions Already Locked
The repo-wide definition of done is:
- implementation matches the relevant phase document
- tests exist for each completed phase
- the design language is preserved in the implemented UI
- the matching phase checklist is updated when work lands

The shared interfaces to define before code starts are below. These are behavior-level contracts and may grow only when a later phase document is updated first.

```ts
export interface SimulationConfig {
  presetId: string
  formula: string
  agentCount: number
  steps: number
  histogramBins: number
  frameStride: number
  seed: number
}

export interface SimulationPreset {
  id: string
  label: string
  formula: string
  description: string
  category: 'baseline' | 'feedback' | 'custom'
}

export interface SimulationResult {
  finalPositions: Float32Array
  histogram: Uint32Array
  sampledFrames: Float32Array
  metrics: {
    bifurcationScore: number
    convergenceRate: number
    giniCoefficient: number
  }
  runMeta: {
    runId: string
    presetId: string
    formula: string
    agentCount: number
    steps: number
    frameStride: number
    histogramBins: number
    seed: number
    elapsedMs: number
  }
}

export type WorkerRequest =
  | { type: 'RUN_SIMULATION'; runId: string; config: SimulationConfig }
  | { type: 'CANCEL_SIMULATION'; runId: string }

export type WorkerResponse =
  | { type: 'SIMULATION_PROGRESS'; runId: string; progress: number; completedSteps: number; stage: 'validating' | 'simulating' | 'sampling' }
  | { type: 'SIMULATION_COMPLETE'; runId: string; result: SimulationResult }
  | { type: 'SIMULATION_ERROR'; runId: string; code: string; message: string }
  | { type: 'SIMULATION_CANCELLED'; runId: string }

export interface SimulationWidgetProps {
  mode: 'sandbox' | 'chapter'
  lockedPresetId?: string
  hideControls?: boolean
  fixedAgentCount?: number
  fixedSteps?: number
  showMetrics?: boolean
  showFormulaBar?: boolean
}

export interface ThemeTokens {
  id: 'graphite' | 'terminal-amber' | 'ice'
  background: string
  surface: string
  surfaceMuted: string
  border: string
  textPrimary: string
  textMuted: string
  accentPrimary: string
  accentSecondary: string
  chartGrid: string
  chartTrajectory: string
  chartHistogram: string
  success: string
  warning: string
  error: string
}
```

## Acceptance Criteria
- [ ] `/docs/phases` exists and includes `00-overview.md` through `07-hardening-launch.md`
- [ ] this overview establishes Stochast as a two-route product with the sandbox as the reusable core
- [ ] the implementation order is stated as `design language -> foundation -> simulation engine -> sandbox UI -> textbook -> metrics/export -> hardening`
- [ ] the repo-wide definition of done is explicitly documented
- [ ] the project status table links to every other phase document
- [ ] the shared interface inventory includes `SimulationConfig`, `SimulationPreset`, `SimulationResult`, worker message types, `SimulationWidgetProps`, and `ThemeTokens`

## Test Plan
Review the `/docs/phases` directory to confirm all phase documents exist and follow the same section structure. Open this overview and verify that every planned document is linked in the status table and that the shared interfaces named in the implementation plan are defined here.

## Risks / Open Questions
The main risk is documentation drift once coding starts. The mitigation is simple: if implementation requires changing a locked decision, update the matching phase document first and only then change the code.

There are no blocking open questions for documentation. Remaining unknowns belong to implementation effort, not project definition.

## Status Checklist
- [x] overview document created
- [x] product scope written
- [x] route map written
- [x] system architecture summary written
- [x] implementation dependency order written
- [x] project status table added
- [x] shared interface inventory added
- [x] overview reviewed against implemented code
- [x] overview kept in sync during later phases

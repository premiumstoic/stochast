# Phase 03: Simulation Engine

## Goal
Define the simulation model, formula system, worker protocol, result shapes, validation rules, and performance expectations for the Stochast engine.

## Why This Phase Exists
The simulation engine is the computational core of the product. Every later phase depends on stable behavior here: textbook widgets, sandbox rendering, metrics, and export all consume its outputs. This phase exists to lock the engine contract before UI work couples to unstable assumptions.

## Scope
This phase defines the random-walk model, the formula model, the preset registry, worker request and response messages, typed-array result shapes, validation and cancellation behavior, performance targets, and engine-focused test scenarios.

## Out Of Scope
This phase does not define the full sandbox layout, MDX composition, theme switching UI, or PNG export rendering. It also does not require a server-side simulation service because simulation stays client-side in v1.

## Inputs / Dependencies
This phase depends on [00-overview.md](./00-overview.md) for shared interfaces and [02-foundation.md](./02-foundation.md) for the client-only worker boundary.

## Deliverables
This phase delivers:
- the launch simulation model
- the launch preset registry
- the formula compilation and validation model
- the worker protocol
- the result payload contract
- engine performance targets
- engine-specific acceptance tests

## Design Constraints
The engine must never block the main browser thread. UI smoothness is a product requirement, not an optimization target.

The formula system must feel powerful without becoming arbitrary code execution. User input is mathematical data, not JavaScript.

Result payloads must be efficient enough for Canvas-based rendering and metrics calculation without repeatedly reallocating large structures on the main thread.

## Technical Decisions Already Locked
The launch state variable is:

```ts
x = (ups + 1) / (step + 2)
```

`x` is the current proportion of upward steps for a given agent at a given step.

The launch presets are:

```ts
const launchPresets: SimulationPreset[] = [
  {
    id: 'gaussian',
    label: 'Gaussian',
    formula: '0.5',
    description: 'No-memory baseline with a constant probability of moving up.',
    category: 'baseline',
  },
  {
    id: 'uniform',
    label: 'Uniform',
    formula: 'x',
    description: "Linear memory relation similar to Polya's urn behavior.",
    category: 'feedback',
  },
  {
    id: 'positive-feedback',
    label: 'Positive Feedback',
    formula: '(x^3) / (x^3 + (1-x)^3)',
    description: 'S-curve relation that rewards being ahead and punishes being behind.',
    category: 'feedback',
  },
]
```

The formula model is:
- formulas are user-authored mathematical expressions parsed with `math.js`
- formulas may reference `x`
- formulas may use basic arithmetic and a curated safe subset of `math.js` numeric functions
- formulas compile once per run
- compiled formulas return a scalar probability in `[0, 1]`

The worker request and response contract is:

```ts
export type WorkerRequest =
  | { type: 'RUN_SIMULATION'; runId: string; config: SimulationConfig }
  | { type: 'CANCEL_SIMULATION'; runId: string }

export type WorkerResponse =
  | {
      type: 'SIMULATION_PROGRESS'
      runId: string
      progress: number
      completedSteps: number
      stage: 'validating' | 'simulating' | 'sampling'
    }
  | {
      type: 'SIMULATION_COMPLETE'
      runId: string
      result: SimulationResult
    }
  | {
      type: 'SIMULATION_ERROR'
      runId: string
      code: 'PARSE_ERROR' | 'NON_FINITE_RESULT' | 'OUT_OF_RANGE_PROBABILITY' | 'CANCELLED' | 'UNKNOWN_ERROR'
      message: string
    }
  | {
      type: 'SIMULATION_CANCELLED'
      runId: string
    }
```

The typed-array output shapes are:
- `finalPositions: Float32Array` with length `agentCount`
- `histogram: Uint32Array` with length `histogramBins`
- `sampledFrames: Float32Array` flattened as `frameCount * agentCount`
- metrics-ready run metadata with seed, timing, formula, preset, and sampling info

The required validation behavior is:
- parse failure produces `SIMULATION_ERROR` with code `PARSE_ERROR`
- non-finite formula output produces `SIMULATION_ERROR` with code `NON_FINITE_RESULT`
- probability outside `[0,1]` produces `SIMULATION_ERROR` with code `OUT_OF_RANGE_PROBABILITY`
- cancellation produces `SIMULATION_CANCELLED` for the active `runId`

The UI result artifacts the engine must provide are:
- final positions for metrics and summary rendering
- histogram bins for the distribution plot
- sampled playback frames for path replay
- run metadata required by metrics and export layers

The launch performance targets are:
- support up to 5,000 agents and 1,000 steps in the worker
- keep the main thread responsive during active runs
- report progress during long simulations often enough for visible user feedback
- keep default launch runs feeling near-instant on a recent laptop
- sample playback frames rather than retaining every raw step for every agent

## Acceptance Criteria
- [ ] the launch state variable is documented as `x = (ups + 1) / (step + 2)`
- [ ] the launch presets are documented as Gaussian `0.5`, Uniform `x`, and Positive Feedback `(x^3) / (x^3 + (1-x)^3)`
- [ ] the formula system is documented as `math.js`-based and safe-subset only
- [ ] worker request and response messages are explicitly documented
- [ ] typed-array output shapes are explicitly documented
- [ ] validation behavior covers parse failure, non-finite result, out-of-range probability, and cancellation
- [ ] the result artifacts required by the UI are explicitly documented
- [ ] performance targets are defined

## Test Plan
The engine verification plan should include deterministic tests using fixed seeds, qualitative distribution tests for the three launch presets, formula validation tests for parse and range failures, cancellation tests, and result-shape tests that confirm payload lengths and metadata consistency.

The qualitative expectations are:
- Gaussian stays center-heavy
- Uniform stays flatter across the range than Gaussian
- Positive Feedback pushes mass toward the edges

## Risks / Open Questions
The main risk is overspecifying metrics-related internals before the metrics phase. This document avoids that by only requiring metrics-ready outputs, not final metric implementation details.

Another risk is payload size growth if playback sampling is too dense. The mitigation is to treat `frameStride` as a first-class config value and keep full per-step storage out of the main-thread contract.

## Status Checklist
- [x] simulation model written
- [x] launch presets written
- [x] formula model written
- [x] worker protocol written
- [x] typed-array result shapes written
- [x] validation model written
- [x] performance targets written
- [x] engine test plan written
- [x] worker implementation matches this document
- [x] engine outputs verified against preset expectations

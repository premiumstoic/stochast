# Phase 04: Sandbox UI

## Goal
Define the behavior, layout, and interaction model of the main Stochast sandbox page.

## Why This Phase Exists
The sandbox is the first full product surface and the reusable source for later textbook widgets. This phase exists to keep the main interaction model coherent before component implementation begins.

## Scope
This phase defines the sandbox page layout, formula bar behavior, control strip behavior, canvas composition, playback model, metrics placement, empty and error states, keyboard shortcuts, and responsive rules.

## Out Of Scope
This phase does not define MDX chapter authoring, export rendering internals, or the exact metric formulas. It also does not require advanced theme customization beyond the three shipped themes.

## Inputs / Dependencies
This phase depends on [01-design-language.md](./01-design-language.md) for the visual system, [02-foundation.md](./02-foundation.md) for route and store boundaries, and [03-simulation-engine.md](./03-simulation-engine.md) for the worker contract and result shapes.

## Deliverables
This phase delivers:
- the sandbox route layout
- the formula bar behavior spec
- the control strip behavior spec
- the chart surface composition
- the playback model
- the responsive behavior rules
- the state-driven empty, running, complete, and error states

## Design Constraints
The sandbox must feel like a focused technical tool, not a dashboard with equal-weight cards.

The formula bar is the primary interaction surface. Metrics, controls, and auxiliary information must remain subordinate to the live visualization.

All interactive behaviors must remain operable by keyboard. Dense interface language is allowed, but hidden or ambiguous control behavior is not.

## Technical Decisions Already Locked
The desktop sandbox layout is:
- left column for preset selection, formula editing, and simulation controls
- center column for the main path visualization
- right rail for histogram and metrics

The mobile sandbox layout is:
- formula bar
- main visualization
- histogram
- controls
- metrics

The formula bar behavior is:
- include preset selector plus editable raw formula field
- preserve keyboard priority
- validate inline before run start
- display parse and probability errors directly below the input surface
- allow a preset to populate the editable formula instead of hiding the raw expression

The control behavior is:
- `agentCount`: range `100` to `5000`, default `1000`, step `100`
- `steps`: range `50` to `1000`, default `400`, step `50`
- `frameStride`: range `1` to `20`, default `4`
- playback controls: play, pause, reset, and scrub
- configuration changes that invalidate a finished run should mark the result stale until rerun

The canvas surfaces are:
- a path canvas for trajectory playback and density perception
- a histogram canvas for the final distribution

The playback model is:
- after a completed run, playback reads from sampled frames only
- scrubbing updates the path canvas immediately
- `Space` toggles play and pause when text inputs are not focused
- `R` resets the current run and playback cursor

The required UI states are:
- empty: first-visit guidance with default preset ready to run
- running: progress visible, controls partially locked to prevent invalid state changes
- complete: charts, metrics, and export affordances available
- error: formula or engine errors displayed inline without collapsing the page

The required keyboard shortcuts are:
- `Cmd/Ctrl+K` for the command palette
- `Space` for play and pause
- `R` for reset

The responsive rules are:
- desktop uses persistent columns
- tablet compresses the right rail below the main chart if space is limited
- mobile uses a single column stack
- no horizontal scrolling for essential controls or charts

## Acceptance Criteria
- [ ] the sandbox layout is explicitly documented for desktop and mobile
- [ ] the formula bar behavior includes preset selection, raw formula editing, inline validation, and keyboard priority
- [ ] the control behavior covers agent count, steps, frame sampling, and playback
- [ ] the two canvas surfaces are explicitly documented
- [ ] the playback model is explicitly documented
- [ ] empty, running, complete, and error states are defined
- [ ] keyboard shortcuts are documented
- [ ] responsive rules are documented

## Test Plan
The sandbox verification pass should cover keyboard-first operation, inline formula validation, run lifecycle transitions, playback controls, responsive rearrangement, and the visual balance between controls and charts. The page should remain understandable and operable in empty, running, complete, and error states.

## Risks / Open Questions
The main risk is letting controls sprawl until the page feels like a settings console rather than a focused simulator. The mitigation is to keep the formula bar and charts visually primary and to defer non-essential controls out of the initial surface.

Another risk is mobile density. The mitigation is to keep the stack order fixed and never bury the primary chart or formula surface behind collapsible UI by default.

## Status Checklist
- [x] desktop layout written
- [x] mobile layout written
- [x] formula bar behavior written
- [x] control strip behavior written
- [x] canvas surfaces written
- [x] playback model written
- [x] keyboard shortcuts written
- [x] UI state model written
- [x] responsive rules written
- [x] sandbox implementation matches this document
- [x] sandbox keyboard and responsive behavior validated

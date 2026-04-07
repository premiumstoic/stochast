# Phase 02: Foundation

## Goal
Define the exact bootstrap sequence and architectural boundaries required to start Stochast without rework.

## Why This Phase Exists
Stochast needs a stable foundation before the simulation engine and UI can be built. This phase exists to prevent avoidable churn in routing, font setup, token wiring, state ownership, and worker boundaries.

## Scope
This phase defines the repo bootstrap order, package and tooling choices, app shell structure, route scaffolding, token wiring strategy, state boundaries, worker bootstrapping boundary, code ownership boundaries, and the definition of “foundation ready.”

## Out Of Scope
This phase does not implement the simulation loop, canvas drawing logic, MDX chapter copy, metrics calculations, or export rendering.

## Inputs / Dependencies
This phase depends on [00-overview.md](./00-overview.md) for product scope and [01-design-language.md](./01-design-language.md) for the visual system that the foundation must support.

## Deliverables
This phase delivers:
- a clean Next.js App Router repo bootstrap order
- the base dependency list for the v1 stack
- the route scaffolding plan for `/` and `/sandbox`
- the global font and theme-token setup plan
- the store ownership boundaries
- the client-only worker boundary
- the high-level folder structure

The exact bootstrap order is:
1. initialize a new Next.js application
2. enable TypeScript
3. install Tailwind CSS
4. install `zustand` and `math.js`
5. add font setup for `IBM Plex Mono` and `IBM Plex Sans`
6. create tokenized global CSS driven by CSS variables
7. scaffold routes for `/` and `/sandbox`
8. optionally expose links to `/docs/phases` during development

The preferred package manager is `pnpm`.

## Design Constraints
The foundation must preserve the dark-first, token-driven design system. No base setup should force generic component-library defaults or an incompatible typography stack.

The worker boundary must stay browser-only. The server side of Next.js should never import or instantiate the simulation worker.

The repo structure should be specific enough to guide implementation, but not so rigid that later file names are forced before coding starts.

## Technical Decisions Already Locked
The app shell structure is:
- App Router layout with shared global theme and font setup
- textbook route at `/`
- sandbox route at `/sandbox`
- a client-only simulation boundary beneath route-level page components

The early code ownership boundaries are:
- app shell: routing, layouts, metadata, page composition
- design tokens: CSS variables, font application, theme switching
- shared UI primitives: buttons, fields, panels, palette shell, labels
- simulation integration layer: worker lifecycle, typed-array handoff, canvas coordination

The early folder plan is:
- `/app` for routes and layouts
- `/components` for reusable UI and simulation-facing components
- `/lib` for helpers, registries, and non-React logic
- `/store` for Zustand slices and selectors
- `/workers` for simulation worker code
- `/content/textbook` for MDX chapters
- `/docs/phases` for planning and tracking

The state/store boundaries are:
- configuration state for formula, preset, agents, steps, and theme
- run lifecycle state for idle, validating, simulating, complete, error, or cancelled
- playback state for current frame, play status, and scrub position
- export state for export readiness and export-in-progress status

The worker bootstrapping boundary is:
- instantiate the worker only from a dedicated client-side simulation controller
- treat worker messages as the only bridge between simulation logic and UI logic
- do not let React components reach into worker internals directly

Foundation-ready means:
- the repo boots locally
- routes exist
- fonts and theme tokens are wired
- client-only simulation boundaries are in place
- store and worker integration boundaries are decided

## Acceptance Criteria
- [ ] the bootstrap order is documented exactly
- [ ] Next.js App Router, TypeScript, Tailwind, Zustand, and `math.js` are locked as the initial stack
- [ ] font setup for `IBM Plex Mono` and `IBM Plex Sans` is planned
- [ ] `/` and `/sandbox` are defined as the initial route scaffold
- [ ] code ownership boundaries are explicit
- [ ] the folder plan is documented at a high level
- [ ] the worker bootstrapping boundary is documented as client-only
- [ ] the definition of “foundation ready” is explicit

## Test Plan
When implementation begins, verify the repository starts with the documented dependency stack, route scaffold, font setup, and tokenized global CSS. Confirm that the simulation worker is only created from a client-side boundary and that the store ownership lines remain consistent with this document.

## Risks / Open Questions
The main risk is overbuilding the foundation before the simulation engine exists. The mitigation is to keep the folder plan and boundaries clear while postponing non-essential abstractions until the engine and sandbox UI are real.

There are no open architectural questions blocking repo bootstrap.

## Status Checklist
- [x] bootstrap order written
- [x] dependency stack written
- [x] route scaffold written
- [x] token wiring strategy written
- [x] store boundaries written
- [x] worker boundary written
- [x] high-level folder plan written
- [x] repo bootstrapped according to this document
- [x] foundation validated against actual implementation

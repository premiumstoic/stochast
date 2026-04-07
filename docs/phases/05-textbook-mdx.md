# Phase 05: Textbook MDX

## Goal
Define how the Stochast textbook experience is authored, structured, paced, and connected to the reusable sandbox engine.

## Why This Phase Exists
The textbook is the explanatory layer of the product. It must teach the ideas clearly without forking the implementation away from the sandbox core. This phase exists to make the textbook a constrained presentation system rather than a second app.

## Scope
This phase defines the MDX authoring structure, the chapter progression, the embedded widget API, locked-widget rules, pacing rules, chapter navigation, and the handoff from the textbook into the sandbox.

## Out Of Scope
This phase does not define the low-level worker logic, the full sandbox control surface, or the export card rendering pipeline. It also does not require user-authored textbook content beyond the launch chapter structure.

## Inputs / Dependencies
This phase depends on [01-design-language.md](./01-design-language.md) for the visual system, [02-foundation.md](./02-foundation.md) for route and content boundaries, [03-simulation-engine.md](./03-simulation-engine.md) for reusable simulation outputs, and [04-sandbox-ui.md](./04-sandbox-ui.md) for the shared widget behavior model.

## Deliverables
This phase delivers:
- the textbook content architecture
- the fixed chapter progression
- the reusable widget embedding contract
- the pacing rules that differentiate textbook from sandbox
- the chapter navigation model
- the sandbox handoff model

## Design Constraints
The textbook must preserve the exact same design language as the sandbox, but with calmer pacing, fewer simultaneous controls, and more reading whitespace.

The textbook should never feel like a static documentation site with screenshots. Every embedded widget must be a real instance of the simulation system with locked props.

The narrative must stay progressive. Each chapter introduces one main concept before moving to the next.

## Technical Decisions Already Locked
The MDX authoring structure is:
- use Next.js-compatible MDX for textbook content
- store chapter files under `/content/textbook`
- treat each chapter as a route-aware content document with frontmatter for title, summary, order, and slug

The fixed chapter order is:
1. Gaussian baseline
2. Uniform memory
3. Positive-feedback S-curve
4. open sandbox call to action

The embedded widget API is:

```ts
export interface SimulationWidgetProps {
  mode: 'sandbox' | 'chapter'
  lockedPresetId?: string
  hideControls?: boolean
  fixedAgentCount?: number
  fixedSteps?: number
  showMetrics?: boolean
  showFormulaBar?: boolean
}
```

The locked-widget rules are:
- textbook widgets use `mode: 'chapter'`
- textbook widgets must set `lockedPresetId`
- textbook widgets may hide the formula bar and most controls
- textbook widgets may fix agent count and step count
- textbook widgets may show a limited metric summary when it serves the lesson

The pacing rules are:
- one primary interactive surface per chapter section
- no more than one major idea introduced per section
- explanatory copy appears before and after a widget, not only after it
- the textbook keeps wider whitespace and lower information density than the sandbox

The chapter navigation model is:
- persistent chapter progress indicator on desktop
- compact progress header on mobile
- previous and next navigation at the bottom of each chapter

The sandbox handoff model is:
- the final chapter ends with a strong CTA to `/sandbox`
- when possible, the CTA should preserve the final textbook preset as a sandbox query parameter or initial state seed

## Acceptance Criteria
- [ ] the MDX authoring structure is documented
- [ ] the textbook chapter order is explicitly locked
- [ ] `SimulationWidgetProps` are documented for textbook embedding
- [ ] locked-widget behavior is explicitly documented
- [ ] pacing rules distinguish textbook behavior from sandbox behavior
- [ ] chapter navigation is documented for desktop and mobile
- [ ] the handoff from textbook to sandbox is documented

## Test Plan
The textbook verification pass should confirm that chapters can embed real simulation widgets, that the reading flow stays progressive, that the page never becomes visually denser than the sandbox, and that the transition into `/sandbox` feels like continuation rather than context loss.

## Risks / Open Questions
The main risk is overloading the textbook with too many simultaneous controls or too much math at once. The mitigation is to keep the widget API restrictive in textbook mode and enforce the pacing rules above.

There are no unresolved structural questions for the launch textbook. Additional chapters are intentionally deferred until the core sequence is complete.

## Status Checklist
- [x] MDX content structure written
- [x] chapter order written
- [x] widget API written
- [x] locked-widget rules written
- [x] pacing rules written
- [x] navigation model written
- [x] sandbox handoff written
- [x] textbook implementation matches this document
- [x] textbook pacing validated against real content

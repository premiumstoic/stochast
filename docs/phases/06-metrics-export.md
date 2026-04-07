# Phase 06: Metrics And Export

## Goal
Define the launch distribution metrics, their UI presentation, and the theme-aware PNG export pipeline.

## Why This Phase Exists
Metrics and export are what turn the sandbox from a private tool into a shareable product. This phase exists to ensure that scoring and export visuals are mathematically defensible, visually aligned with the product, and stable enough to build against.

## Scope
This phase defines the launch metrics, their formulas and calculation expectations, the live scoreboard and post-run detail presentation, the export-card layout, the PNG generation flow, theme-aware export requirements, and export QA expectations.

## Out Of Scope
This phase does not define backend persistence, user profiles, or social sharing integrations. It also does not introduce additional launch metrics beyond the three listed below.

## Inputs / Dependencies
This phase depends on [01-design-language.md](./01-design-language.md) for visual language, [03-simulation-engine.md](./03-simulation-engine.md) for result artifacts, [04-sandbox-ui.md](./04-sandbox-ui.md) for sandbox layout, and [05-textbook-mdx.md](./05-textbook-mdx.md) for shared visual consistency.

## Deliverables
This phase delivers:
- metric definitions and launch formulas
- metric display rules
- export-card composition rules
- the PNG rendering strategy
- theme-aware export requirements
- export QA expectations

## Design Constraints
Metrics must remain terse, numeric, and secondary to the charts. They should clarify the result, not overwhelm it.

The export card must look like a native artifact of the app, not a separate branded poster template.

The export pipeline must stay client-side in v1.

## Technical Decisions Already Locked
The launch metrics are:
- bifurcation score
- convergence rate
- gini coefficient

The calculation expectations are:

For bifurcation score:
- normalize final positions to `[-1, 1]`
- define `outerMass` as the fraction of agents with `|z| >= 1/3`
- define `middleMass` as the fraction of agents with `|z| < 1/3`
- compute

```ts
bifurcationScore = clamp(((outerMass - middleMass) + 1 / 3) / (4 / 3), 0, 1) * 100
```

- this calibration is intended to keep center-heavy outcomes near `0`, broadly uniform outcomes near `50`, and highly polarized edge-heavy outcomes near `100`

For convergence rate:
- classify each sampled frame position into `left`, `center`, or `right` using the same `1/3` thresholds
- determine each agent's final class from its final position
- define `lockStep` as the first sampled step after which the agent stays in its final class for the remainder of playback
- compute

```ts
convergenceRate = (1 - median(lockStep / totalSteps)) * 100
```

- high convergence means trajectories settle into their final class early

For gini coefficient:
- compute over histogram bin counts to measure how unevenly agents are distributed across the final-position bins

```ts
giniCoefficient =
  sum_i(sum_j(abs(histogram[i] - histogram[j]))) /
  (2 * histogram.length * sum(histogram))
```

The metrics presentation rules are:
- one terse live scoreboard adjacent to the histogram
- one deeper post-run detail panel for expanded interpretation
- the live scoreboard should show the three metrics as direct numeric outputs without long prose

The export output is:
- portrait `4:5` PNG
- active-theme background
- histogram as the dominant visual element
- raw formula in `IBM Plex Mono`
- metrics strip containing bifurcation score, convergence rate, and gini coefficient
- subtle `stochast.vercel.app` watermark

The export card layout is:
- header with project name, preset name, and timestamp or run label
- central histogram zone
- formula block beneath the chart
- metric strip beneath the formula
- watermark in the footer

The PNG generation flow is:
- render a dedicated export composition surface in the client
- draw the chart and textual metadata directly onto a hidden canvas for predictable fidelity
- encode the hidden canvas as a downloadable PNG
- use DOM-to-image fallbacks only if direct canvas composition cannot satisfy fidelity requirements

The theme-aware export requirements are:
- export must use the same theme tokens as the live app
- export typography must match the app typography
- export chart colors must match the live histogram and text contrast rules

## Acceptance Criteria
- [ ] the three launch metrics are explicitly documented
- [ ] bifurcation score, convergence rate, and gini coefficient calculation expectations are documented
- [ ] the metrics presentation rules distinguish live scoreboard and post-run detail panel
- [ ] the export output is locked as a portrait `4:5` PNG
- [ ] the export card layout is explicitly documented
- [ ] the PNG generation flow is explicitly documented
- [ ] the export is required to be theme-aware and typography-consistent

## Test Plan
The metric verification pass should use synthetic distributions that are clearly center-heavy, uniform-like, and edge-heavy to confirm score directionality. The export verification pass should compare live app colors and typography against exported images under all three themes and confirm the `4:5` output aspect ratio.

## Risks / Open Questions
The main risk is metric controversy if labels feel intuitive but formulas feel opaque. The mitigation is to keep the formulas stable, the UI explanations short, and the metric names consistent with what they actually measure.

Another risk is export drift from the live theme. The mitigation is to drive export styling from the same token system instead of restyling the card separately.

## Status Checklist
- [x] launch metrics written
- [x] calculation expectations written
- [x] metrics presentation rules written
- [x] export output format written
- [x] export-card layout written
- [x] PNG generation flow written
- [x] theme-aware export rules written
- [x] metric implementation matches this document
- [x] exported PNG validated against live theme styling

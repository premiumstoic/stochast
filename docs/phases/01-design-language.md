# Phase 01: Design Language

## Goal
Lock the visual and interaction language of Stochast so implementation does not drift into a generic dashboard or marketing-site aesthetic.

## Why This Phase Exists
Stochast depends on a very specific mood: technical, analytical, calm, and data-first. The product should feel closer to a precision instrument or a developer tool than a polished SaaS landing page. This phase exists to remove visual ambiguity before any UI work begins.

## Scope
This phase defines the product personality, typography, color and token system, theme catalog, layout grammar, chart styling, component behavior, motion rules, keyboard rules, export-card direction, and explicit anti-patterns.

The design language is:
- analytical, calm, technical, and non-salesy in tone
- Monkeytype-inspired in its Minimalist Functionalism
- Brutalist-Chic in restraint, not in ornamental aggression
- dark-mode-first
- content-as-UI, where formulas, charts, and metrics are the product surface

## Out Of Scope
This phase does not implement CSS or components. It does not define a public theme editor, user theme persistence, or decorative brand illustrations.

## Inputs / Dependencies
This phase depends on the product scope in [00-overview.md](./00-overview.md) and the locked assumption that the app should carry a Monkeytype-inspired, high-focus interface language.

## Deliverables
This phase delivers:
- the visual philosophy for all future UI work
- the typography system
- the theme token inventory
- three shipped launch themes
- layout rules for textbook and sandbox
- chart styling rules
- component behavior rules
- motion and keyboard interaction rules
- export-card art direction
- explicit anti-patterns

## Design Constraints
The interface principle is fixed: formulas, charts, and metrics are the interface. Surrounding chrome should frame them, not compete with them.

The visual density should feel intentional. Dense does not mean cluttered. Restraint is mandatory in borders, corners, shadows, and decorative elements.

Every design choice must preserve performance legibility. Anything that makes the charts harder to read or the controls harder to operate under active playback should be rejected.

## Technical Decisions Already Locked
The brand personality is:
- analytical
- calm
- technical
- curious
- scholarly
- non-salesy

The typography system is:
- `IBM Plex Mono` for headings, formulas, metrics, labels, buttons, palette entries, inline numeric values, code, and chart annotations
- `IBM Plex Sans` only for long-form MDX reading text and explanatory paragraphs

The base visual rules are:
- dark-mode-first
- restrained chrome
- chart accents hold the saturation
- minimal borders
- almost no shadows
- corners should be modest and structural, not pill-like
- no floating-card dashboard language

The shipped themes are:

| Theme | Use | Background | Surface | Text | Accent Primary | Accent Secondary |
| --- | --- | --- | --- | --- | --- | --- |
| Graphite | Default app theme | `#111315` | `#171a1d` | `#ece6dc` | `#9fe870` | `#61d0ff` |
| Terminal Amber | Warm alternative | `#14110d` | `#1c1712` | `#f0e2c6` | `#ffb347` | `#ffd166` |
| Ice | Cool analytical alternative | `#0f1418` | `#151d23` | `#e7f1f7` | `#5dd4ff` | `#8ff0c8` |

The canonical token structure is:

```ts
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

The layout grammar is:
- textbook pages use a narrow primary reading column with occasional full-width simulation inserts
- sandbox uses a three-zone desktop layout: controls, main visualization, histogram-plus-metrics rail
- mobile stacks formula bar, main chart, histogram, controls, and metrics in that order
- visual sections should read like panels or instrument zones, not cards in a marketplace grid

The chart styling rules are:
- trajectory lines are thin and low-opacity
- histogram bars are neon-like and the highest-saturation element on screen
- grid lines are subtle, thin, and structurally useful
- axes are minimal and numeric labels are monospace
- charts should have breathing room around them; do not crowd them with decorative wrappers

The component behavior rules are:
- the formula bar is the primary interaction surface on the sandbox page
- the command palette is global and keyboard-first
- metrics are terse and numeric, not verbose explainer cards
- control groups should feel like terminal instrumentation, not glossy control centers

The motion rules are:
- subtle progress updates during simulation
- subtle playback motion during timeline scrubbing or replay
- no decorative page transitions
- no spring-heavy microinteractions
- motion exists to explain system state, never to ornament it

The keyboard rules are:
- `Cmd/Ctrl+K` opens the command palette
- `Space` toggles play and pause when focus is not in a text input
- `R` resets the current run
- the formula bar must be reachable immediately by keyboard

The export-card direction is:
- portrait `4:5` aspect ratio
- dark field matching the active theme
- neon histogram as the visual centerpiece
- raw formula rendered prominently in `IBM Plex Mono`
- metrics strip below the main chart
- subtle `stochast.vercel.app` watermark

The explicit anti-patterns are:
- no bright marketing gradients
- no soft shadow-heavy dashboards
- no rounded-corner card grid as the main visual language
- no generic sans-serif product-site aesthetic
- no chromed control panels that overpower the charts
- no large hero illustrations that compete with the simulation
- no decorative animation that does not communicate state

## Acceptance Criteria
- [ ] the product personality is explicitly defined as analytical, calm, technical, and non-salesy
- [ ] `IBM Plex Mono` and `IBM Plex Sans` usage rules are locked
- [ ] the color system is documented as dark-mode-first with restrained chrome and saturated chart accents
- [ ] `Graphite`, `Terminal Amber`, and `Ice` are defined as launch themes
- [ ] layout rules distinguish textbook and sandbox behavior
- [ ] chart styling rules are concrete enough to guide implementation
- [ ] keyboard shortcuts are defined as `Cmd/Ctrl+K`, `Space`, and `R`
- [ ] export-card direction is specified
- [ ] explicit anti-patterns are documented

## Test Plan
During implementation, compare mockups and built UI against this document rather than against generic design taste. The verification pass for this phase is visual: typography, spacing, theme contrast, control density, chart prominence, and keyboard affordances should all match the rules above.

## Risks / Open Questions
The main risk is slowly sliding into a safe, generic dashboard aesthetic once components start accumulating. The mitigation is to review every new UI piece against the anti-pattern list before merging it.

There are no unresolved design-direction questions in v1. Theme customization beyond the three shipped themes is intentionally deferred.

## Status Checklist
- [x] design personality written
- [x] typography rules written
- [x] launch themes written
- [x] token structure written
- [x] layout grammar written
- [x] chart styling written
- [x] motion and keyboard rules written
- [x] export-card direction written
- [x] anti-patterns written
- [x] design language validated against implemented UI
- [x] design language updated only through explicit doc revision

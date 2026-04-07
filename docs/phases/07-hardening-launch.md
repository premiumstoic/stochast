# Phase 07: Hardening And Launch

## Goal
Define the final verification work required before Stochast can be considered launch-ready.

## Why This Phase Exists
Stochast is performance-sensitive, design-sensitive, and interaction-sensitive. A phase can look complete while still failing on keyboard behavior, responsive layout, or design fidelity. This phase exists to force a final pass across quality, consistency, and readiness.

## Scope
This phase defines accessibility verification, performance verification, responsive QA, browser support targets, analytics and metadata polish, visual consistency checks, and the final launch readiness checklist.

## Out Of Scope
This phase does not add new product features. It only validates and polishes the features defined in earlier phases.

## Inputs / Dependencies
This phase depends on all prior phase documents and their implemented outputs.

## Deliverables
This phase delivers:
- an accessibility verification pass
- a performance verification pass
- a responsive verification pass
- browser support targets
- metadata and analytics polish requirements
- a final launch readiness checklist

## Design Constraints
Hardening must not compromise the design language. Accessibility and performance fixes should reinforce the product, not flatten it into a generic UI.

Launch readiness includes visual consistency. A technically correct but visually drifted result is not complete.

## Technical Decisions Already Locked
The accessibility verification scope includes:
- keyboard operability for the formula bar, command palette, controls, and playback
- visible focus states that fit the design language
- sufficient text and chart contrast in all shipped themes
- meaningful labels for interactive controls

The performance verification scope includes:
- worker-driven simulation does not visibly block the main thread
- playback remains responsive at launch settings
- default runs feel near-instant
- memory use remains acceptable under the documented launch maxima

The responsive QA scope includes:
- textbook readability on mobile
- sandbox stack integrity on mobile
- no essential control hidden behind horizontal scroll
- no chart clipped by layout collapse

The browser support targets are:
- latest Chrome
- latest Firefox
- latest Safari
- latest Edge
- current mobile Safari
- current mobile Chrome

The analytics and metadata polish requirements are:
- final page titles and descriptions
- Open Graph metadata aligned to the product positioning
- export-card and site preview visuals consistent with the design language
- lightweight privacy-respecting site analytics only if they do not alter product scope or design

The final launch rule is:
- do not mark the project complete until the matching phase documents have been reviewed and their status checklists updated

## Acceptance Criteria
- [ ] keyboard QA requirements are documented
- [ ] accessibility verification requirements are documented
- [ ] performance verification requirements are documented
- [ ] responsive QA requirements are documented
- [ ] browser support targets are documented
- [ ] metadata and analytics polish requirements are documented
- [ ] the design-language preservation requirement is explicit
- [ ] the rule to update docs before marking launch complete is explicit

## Test Plan
Run manual keyboard testing across both routes, theme-based contrast checks, responsive inspections across phone and desktop breakpoints, browser smoke tests in the supported matrix, and performance checks at both default and maximum launch settings. Confirm that launch metadata and shared visuals reflect the documented positioning and design language.

## Risks / Open Questions
The main risk is treating hardening as bug cleanup instead of product verification. The mitigation is to use this phase as a formal gate with explicit checks for design fidelity, accessibility, and performance.

There are no open product questions in this phase. Only implementation quality remains to be proven.

## Status Checklist
- [x] accessibility checklist written
- [x] performance checklist written
- [x] responsive QA written
- [x] browser support targets written
- [x] metadata and analytics polish written
- [x] launch readiness rule written
- [x] hardening completed against implemented product
- [x] launch readiness verified

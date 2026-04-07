# Math Model Extract

## Summary
The Gemini conversation built Stochast around three main probability regimes. These are the mathematical ideas that justify the launch presets and the overall educational flow.

## 1. Gaussian / No-Memory Baseline
Gemini described the Gaussian case as a standard coin-flip process:
- `P(up) = 0.5`
- the probability is fixed
- the next step does not care about past outcomes

Claimed outcome:
- the distribution concentrates near the center
- extreme outcomes are rare
- the final shape is bell-curve-like

Relevant source:
- `R3`

## 2. Uniform / Linear Memory
Gemini described the Uniform case using a Polya-style urn intuition:
- the probability of the next “up” equals the current proportion of previous “up” outcomes
- this is a linear relation: `y = x`

Claimed outcome:
- early deviations reinforce themselves just enough to cancel the pull toward the center
- final states become evenly represented across the range
- the final shape is Uniform

Relevant source:
- `R3`

## 3. Positive-Feedback S-Curve / Edge-Heavy Outcome
Gemini tied the teacher's question to an S-curve around the linear line:
- before `0.5`, probability is below the linear relation
- after `0.5`, probability is above the linear relation
- the system punishes being behind and rewards being ahead

Claimed outcome:
- the middle becomes unstable
- trajectories get pulled toward the extremes
- the final shape is bimodal or U-shaped

Relevant sources:
- `Q4`
- `R3`

## Launch Formula Variable
Gemini later framed the core simulation state in terms of a proportion variable `x`:

```ts
x = (ups + 1) / (step + 2)
```

This turns the simulation into a repeated evaluation of a user-provided probability rule over `x`.

Relevant source:
- `R9`

## Launch Preset Formulas
Gemini repeatedly converged on these launch examples:

```ts
Gaussian: 0.5
Uniform: x
Positive feedback: (x^3) / (x^3 + (1-x)^3)
```

Relevant sources:
- `R6`
- `R8`
- `R9`

## Educational Flow Derived From The Math
Gemini's proposed explanation order was:
1. fixed probability / Gaussian
2. memory-dependent linear probability / Uniform
3. S-curve positive feedback / edge-heavy bimodal
4. open exploration in the sandbox

Relevant source:
- `R4`

## Design Implication
The product is not just a generic particle simulator. It is specifically a tool for showing how microscopic step rules produce macroscopic distributions. That sentence appears in multiple Gemini answers and is the conceptual core of the project.

Relevant sources:
- `R3`
- `R8`
- `R9`

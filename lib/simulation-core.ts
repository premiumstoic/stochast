import type { SimulationConfig, SimulationResult, WorkerResponse } from '@/lib/types'
import { compileProbabilityFormula } from '@/lib/formula'

export type SimulationStage = Extract<WorkerResponse, { type: 'SIMULATION_PROGRESS' }>['stage']
export type SimulationErrorCode = Extract<
  Extract<WorkerResponse, { type: 'SIMULATION_ERROR' }>['code'],
  string
>

export class SimulationError extends Error {
  code: SimulationErrorCode

  constructor(code: SimulationErrorCode, message: string) {
    super(message)
    this.name = 'SimulationError'
    this.code = code
  }
}

export function makePrng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function getSampleFrameCount(steps: number, frameStride: number): number {
  if (steps <= 0 || frameStride <= 0) return 0
  return Math.ceil(steps / frameStride)
}

export function shouldCaptureSample(stepNum: number, steps: number, frameStride: number): boolean {
  if (stepNum <= 0 || steps <= 0 || frameStride <= 0) return false
  return stepNum % frameStride === 0 || stepNum === steps
}

export function computeMetrics(
  finalPositions: Float32Array,
  histogram: Uint32Array,
  sampledFrames: Float32Array,
  agentCount: number,
  frameCount: number,
): { bifurcationScore: number; convergenceRate: number; giniCoefficient: number } {
  if (agentCount === 0 || frameCount === 0 || histogram.length === 0) {
    return { bifurcationScore: 0, convergenceRate: 0, giniCoefficient: 0 }
  }

  const threshold = 1 / 3

  let outerCount = 0
  for (let a = 0; a < agentCount; a++) {
    const z = (finalPositions[a] - 0.5) * 2
    if (Math.abs(z) >= threshold) outerCount++
  }
  const outerMass = outerCount / agentCount
  const middleMass = 1 - outerMass
  const bifurcationScore =
    Math.max(0, Math.min(1, ((outerMass - middleMass) + threshold) / (4 / 3))) * 100

  const n = histogram.length
  let total = 0
  for (let i = 0; i < n; i++) total += histogram[i]
  let giniSum = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      giniSum += Math.abs(histogram[i] - histogram[j])
    }
  }
  const giniCoefficient = total > 0 ? giniSum / (2 * n * total) : 0

  const lockRatios: number[] = new Array(agentCount)
  for (let a = 0; a < agentCount; a++) {
    const fp = finalPositions[a]
    const finalClass = fp < threshold ? 0 : fp > 1 - threshold ? 2 : 1

    let lockFrame = 0
    for (let f = frameCount - 2; f >= 0; f--) {
      const pos = sampledFrames[f * agentCount + a]
      const cls = pos < threshold ? 0 : pos > 1 - threshold ? 2 : 1
      if (cls !== finalClass) {
        lockFrame = f + 1
        break
      }
    }
    lockRatios[a] = frameCount > 1 ? lockFrame / (frameCount - 1) : 0
  }
  lockRatios.sort((a, b) => a - b)
  const median = lockRatios[Math.floor(agentCount / 2)] ?? 0
  const convergenceRate = (1 - median) * 100

  return { bifurcationScore, convergenceRate, giniCoefficient }
}

interface SimulateOptions {
  runId?: string
  onProgress?: (progress: number, completedSteps: number, stage: SimulationStage) => void
  shouldCancel?: () => boolean
  yieldControl?: () => Promise<void>
  now?: () => number
}

export async function simulate(
  config: SimulationConfig,
  {
    runId = 'run',
    onProgress,
    shouldCancel,
    yieldControl,
    now = () => performance.now(),
  }: SimulateOptions = {},
): Promise<SimulationResult> {
  const { formula, agentCount, steps, histogramBins, frameStride, seed } = config
  const startMs = now()
  const emitProgress = onProgress ?? (() => {})
  const checkCancelled = shouldCancel ?? (() => false)
  const yieldTurn = yieldControl ?? (() => Promise.resolve())

  const cancelIfNeeded = () => {
    if (checkCancelled()) {
      throw new SimulationError('CANCELLED', 'Simulation cancelled.')
    }
  }

  emitProgress(0, 0, 'validating')

  let fn: { evaluate: (scope: { x: number }) => number }
  try {
    fn = compileProbabilityFormula(formula)
  } catch (error: unknown) {
    if (error instanceof SimulationError) throw error
    const e = error as { code?: SimulationErrorCode; message?: string }
    throw new SimulationError(e.code ?? 'PARSE_ERROR', e.message ?? 'Failed to parse formula.')
  }

  const frameCount = getSampleFrameCount(steps, frameStride)
  const finalPositions = new Float32Array(agentCount)
  const histogram = new Uint32Array(histogramBins)
  const sampledFrames = new Float32Array(frameCount * agentCount)

  const rng = makePrng(seed)
  const scope = { x: 0 }
  const reportEvery = Math.max(1, Math.floor(agentCount / 20))

  for (let a = 0; a < agentCount; a++) {
    cancelIfNeeded()

    let ups = 0
    let sampleIndex = 0

    for (let s = 0; s < steps; s++) {
      scope.x = (ups + 1) / (s + 2)
      const p = fn.evaluate(scope)

      if (!isFinite(p)) {
        throw new SimulationError('NON_FINITE_RESULT', `Non-finite probability at step ${s}.`)
      }
      if (p < 0 || p > 1) {
        throw new SimulationError(
          'OUT_OF_RANGE_PROBABILITY',
          `Probability ${p.toFixed(4)} out of [0, 1] at step ${s}.`,
        )
      }

      if (rng() < p) ups++

      const stepNum = s + 1
      if (shouldCaptureSample(stepNum, steps, frameStride)) {
        sampledFrames[sampleIndex * agentCount + a] = ups / stepNum
        sampleIndex++
      }
    }

    finalPositions[a] = steps > 0 ? ups / steps : 0

    if (a % reportEvery === 0) {
      emitProgress((a / agentCount) * 90, a, 'simulating')
      await yieldTurn()
      cancelIfNeeded()
    }
  }

  emitProgress(92, agentCount, 'sampling')
  for (let a = 0; a < agentCount; a++) {
    const bin = Math.min(Math.floor(finalPositions[a] * histogramBins), histogramBins - 1)
    histogram[bin]++
  }

  const metrics = computeMetrics(finalPositions, histogram, sampledFrames, agentCount, frameCount)

  return {
    finalPositions,
    histogram,
    sampledFrames,
    metrics,
    runMeta: {
      runId,
      presetId: config.presetId,
      formula,
      agentCount,
      steps,
      frameStride,
      histogramBins,
      seed,
      elapsedMs: now() - startMs,
    },
  }
}

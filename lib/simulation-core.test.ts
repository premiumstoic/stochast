import { describe, expect, it } from 'vitest'
import {
  computeMetrics,
  getSampleFrameCount,
  shouldCaptureSample,
  simulate,
  SimulationError,
} from '@/lib/simulation-core'

function makeFrames(agentPositionsByFrame: number[][]): Float32Array {
  const frameCount = agentPositionsByFrame.length
  const agentCount = agentPositionsByFrame[0]?.length ?? 0
  const frames = new Float32Array(frameCount * agentCount)

  for (let f = 0; f < frameCount; f++) {
    for (let a = 0; a < agentCount; a++) {
      frames[f * agentCount + a] = agentPositionsByFrame[f][a]
    }
  }

  return frames
}

function middleMass(positions: Float32Array): number {
  let count = 0
  for (const position of positions) {
    if (position >= 1 / 3 && position <= 2 / 3) count++
  }
  return count / positions.length
}

describe('simulation-core sampling helpers', () => {
  it('includes a terminal sample for step counts that do not align to frameStride', () => {
    expect(getSampleFrameCount(50, 4)).toBe(13)
    expect(shouldCaptureSample(48, 50, 4)).toBe(true)
    expect(shouldCaptureSample(49, 50, 4)).toBe(false)
    expect(shouldCaptureSample(50, 50, 4)).toBe(true)
  })
})

describe('simulation-core metrics', () => {
  it('distinguishes center-heavy and edge-heavy distributions', () => {
    const centerPositions = Float32Array.from([0.5, 0.5, 0.5, 0.5])
    const centerHistogram = Uint32Array.from([0, 4, 0, 0])
    const centerFrames = makeFrames([
      [0.5, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
    ])

    const edgePositions = Float32Array.from([0, 0, 1, 1])
    const edgeHistogram = Uint32Array.from([2, 0, 0, 2])
    const edgeFrames = makeFrames([
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ])

    const centerMetrics = computeMetrics(centerPositions, centerHistogram, centerFrames, 4, 3)
    const edgeMetrics = computeMetrics(edgePositions, edgeHistogram, edgeFrames, 4, 3)

    expect(centerMetrics.bifurcationScore).toBe(0)
    expect(edgeMetrics.bifurcationScore).toBeGreaterThan(centerMetrics.bifurcationScore)
    expect(edgeMetrics.convergenceRate).toBe(100)
  })

  it('penalizes late locking in convergence rate', () => {
    const finalPositions = Float32Array.from([0, 1])
    const histogram = Uint32Array.from([1, 0, 1])
    const frames = makeFrames([
      [0.5, 0.5],
      [0.5, 0.5],
      [0, 1],
    ])

    const metrics = computeMetrics(finalPositions, histogram, frames, 2, 3)
    expect(metrics.convergenceRate).toBe(0)
  })
})

describe('simulation-core simulate', () => {
  it('produces sampled frames that match the configured stride contract', async () => {
    const result = await simulate(
      {
        presetId: 'gaussian',
        formula: '0.5',
        agentCount: 64,
        steps: 50,
        histogramBins: 20,
        frameStride: 4,
        seed: 42,
      },
      { runId: 'gaussian-run', now: () => 100 },
    )

    expect(result.runMeta.runId).toBe('gaussian-run')
    expect(result.sampledFrames.length).toBe(64 * getSampleFrameCount(50, 4))
    expect(result.histogram.length).toBe(20)
  })

  it('matches the expected qualitative preset behavior', async () => {
    const baseConfig = {
      agentCount: 500,
      steps: 250,
      histogramBins: 40,
      frameStride: 5,
      seed: 42,
    }

    const gaussian = await simulate({
      ...baseConfig,
      presetId: 'gaussian',
      formula: '0.5',
    })
    const uniform = await simulate({
      ...baseConfig,
      presetId: 'uniform',
      formula: 'x',
    })
    const positive = await simulate({
      ...baseConfig,
      presetId: 'positive-feedback',
      formula: '(x^3) / (x^3 + (1-x)^3)',
    })

    expect(middleMass(gaussian.finalPositions)).toBeGreaterThan(middleMass(uniform.finalPositions))
    expect(middleMass(uniform.finalPositions)).toBeGreaterThan(middleMass(positive.finalPositions))
    expect(positive.metrics.bifurcationScore).toBeGreaterThan(uniform.metrics.bifurcationScore)
    expect(uniform.metrics.bifurcationScore).toBeGreaterThan(gaussian.metrics.bifurcationScore)
  })

  it('throws parse and range validation errors', async () => {
    await expect(
      simulate({
        presetId: 'custom',
        formula: '(',
        agentCount: 8,
        steps: 10,
        histogramBins: 8,
        frameStride: 2,
        seed: 1,
      }),
    ).rejects.toBeInstanceOf(SimulationError)

    await expect(
      simulate({
        presetId: 'custom',
        formula: '2',
        agentCount: 8,
        steps: 10,
        histogramBins: 8,
        frameStride: 2,
        seed: 1,
      }),
    ).rejects.toMatchObject({ code: 'OUT_OF_RANGE_PROBABILITY' })
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { defaultPreset } from '@/lib/presets'
import type { SimulationResult } from '@/lib/types'
import { useSimulationStore } from '@/store/simulation'

function makeResult(): SimulationResult {
  return {
    finalPositions: Float32Array.from([0.25, 0.5, 0.75]),
    histogram: Uint32Array.from([1, 1, 1]),
    sampledFrames: Float32Array.from([0.25, 0.5, 0.75]),
    metrics: {
      bifurcationScore: 33.3,
      convergenceRate: 66.6,
      giniCoefficient: 0.123,
    },
    runMeta: {
      runId: 'run-1',
      presetId: defaultPreset.id,
      formula: defaultPreset.formula,
      agentCount: 3,
      steps: 4,
      frameStride: 4,
      histogramBins: 3,
      seed: 42,
      elapsedMs: 10,
    },
  }
}

function resetStore() {
  useSimulationStore.setState({
    status: 'idle',
    progress: 0,
    runId: null,
    result: null,
    errorCode: null,
    errorMessage: null,
    presetId: defaultPreset.id,
    formula: defaultPreset.formula,
    agentCount: 1000,
    steps: 400,
    histogramBins: 50,
    frameStride: 4,
    seed: 42,
    themeId: 'graphite',
    isPlaying: false,
    currentFrame: 0,
    totalFrames: 0,
    isExportReady: false,
    isExporting: false,
  })
}

describe('simulation store', () => {
  beforeEach(() => {
    resetStore()
  })

  it('invalidates finished runs when config changes', () => {
    useSimulationStore.setState({
      status: 'complete',
      result: makeResult(),
      runId: 'run-1',
      totalFrames: 12,
      currentFrame: 11,
      isPlaying: true,
      isExportReady: true,
    })

    useSimulationStore.getState().setSteps(600)

    const state = useSimulationStore.getState()
    expect(state.steps).toBe(600)
    expect(state.status).toBe('idle')
    expect(state.result).toBeNull()
    expect(state.totalFrames).toBe(0)
    expect(state.isExportReady).toBe(false)
  })

  it('invalidates finished runs when frame stride changes', () => {
    useSimulationStore.setState({
      status: 'complete',
      result: makeResult(),
      runId: 'run-1',
      totalFrames: 12,
      isExportReady: true,
    })

    useSimulationStore.getState().setFrameStride(6)

    const state = useSimulationStore.getState()
    expect(state.frameStride).toBe(6)
    expect(state.status).toBe('idle')
    expect(state.result).toBeNull()
  })

  it('does not invalidate a finished run when only the theme changes', () => {
    const result = makeResult()
    useSimulationStore.setState({
      status: 'complete',
      result,
      runId: 'run-1',
      isExportReady: true,
    })

    useSimulationStore.getState().setThemeId('ice')

    const state = useSimulationStore.getState()
    expect(state.themeId).toBe('ice')
    expect(state.status).toBe('complete')
    expect(state.result).toBe(result)
    expect(state.isExportReady).toBe(true)
  })
})

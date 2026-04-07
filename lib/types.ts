// ─── Simulation ───────────────────────────────────────────────────────────────

export interface SimulationConfig {
  presetId: string
  formula: string
  agentCount: number
  steps: number
  histogramBins: number
  frameStride: number
  seed: number
}

export interface SimulationPreset {
  id: string
  label: string
  formula: string
  description: string
  category: 'baseline' | 'feedback' | 'custom'
}

export interface SimulationResult {
  finalPositions: Float32Array
  histogram: Uint32Array
  sampledFrames: Float32Array
  metrics: {
    bifurcationScore: number
    convergenceRate: number
    giniCoefficient: number
  }
  runMeta: {
    runId: string
    presetId: string
    formula: string
    agentCount: number
    steps: number
    frameStride: number
    histogramBins: number
    seed: number
    elapsedMs: number
  }
}

// ─── Worker Protocol ─────────────────────────────────────────────────────────

export type WorkerRequest =
  | { type: 'RUN_SIMULATION'; runId: string; config: SimulationConfig }
  | { type: 'CANCEL_SIMULATION'; runId: string }

export type WorkerResponse =
  | {
      type: 'SIMULATION_PROGRESS'
      runId: string
      progress: number
      completedSteps: number
      stage: 'validating' | 'simulating' | 'sampling'
    }
  | {
      type: 'SIMULATION_COMPLETE'
      runId: string
      result: SimulationResult
    }
  | {
      type: 'SIMULATION_ERROR'
      runId: string
      code: 'PARSE_ERROR' | 'NON_FINITE_RESULT' | 'OUT_OF_RANGE_PROBABILITY' | 'CANCELLED' | 'UNKNOWN_ERROR'
      message: string
    }
  | {
      type: 'SIMULATION_CANCELLED'
      runId: string
    }

// ─── UI ───────────────────────────────────────────────────────────────────────

export interface SimulationWidgetProps {
  mode: 'sandbox' | 'chapter'
  lockedPresetId?: string
  hideControls?: boolean
  fixedAgentCount?: number
  fixedSteps?: number
  showMetrics?: boolean
  showFormulaBar?: boolean
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type ThemeId = 'graphite' | 'terminal-amber' | 'ice' | 'vellum' | 'blueprint'

export interface ThemeTokens {
  id: ThemeId
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

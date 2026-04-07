import { create } from 'zustand'
import type { SimulationConfig, SimulationResult, ThemeId } from '@/lib/types'
import { defaultPreset } from '@/lib/presets'

// ─── Run lifecycle ────────────────────────────────────────────────────────────

type RunStatus = 'idle' | 'validating' | 'simulating' | 'complete' | 'error' | 'cancelled'

interface RunState {
  status: RunStatus
  progress: number
  runId: string | null
  result: SimulationResult | null
  errorCode: string | null
  errorMessage: string | null
}

interface RunActions {
  setStatus: (status: RunStatus) => void
  setProgress: (progress: number) => void
  setRunId: (runId: string) => void
  setResult: (result: SimulationResult) => void
  setError: (code: string, message: string) => void
  resetRun: () => void
}

const initialRunState: RunState = {
  status: 'idle',
  progress: 0,
  runId: null,
  result: null,
  errorCode: null,
  errorMessage: null,
}

// ─── Config state ─────────────────────────────────────────────────────────────

interface ConfigState {
  presetId: string
  formula: string
  agentCount: number
  steps: number
  histogramBins: number
  frameStride: number
  seed: number
  themeId: ThemeId
}

interface ConfigActions {
  setFormula: (formula: string) => void
  setPresetId: (presetId: string) => void
  setAgentCount: (agentCount: number) => void
  setSteps: (steps: number) => void
  setFrameStride: (frameStride: number) => void
  setThemeId: (themeId: ThemeId) => void
  getConfig: () => SimulationConfig
}

const initialConfigState: ConfigState = {
  presetId: defaultPreset.id,
  formula: defaultPreset.formula,
  agentCount: 1000,
  steps: 400,
  histogramBins: 50,
  frameStride: 4,
  seed: 42,
  themeId: 'graphite',
}

// ─── Playback state ───────────────────────────────────────────────────────────

interface PlaybackState {
  isPlaying: boolean
  currentFrame: number
  totalFrames: number
}

interface PlaybackActions {
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentFrame: (frame: number) => void
  setTotalFrames: (totalFrames: number) => void
  togglePlay: () => void
  resetPlayback: () => void
}

// ─── Export state ─────────────────────────────────────────────────────────────

interface ExportState {
  isExportReady: boolean
  isExporting: boolean
}

interface ExportActions {
  setExportReady: (ready: boolean) => void
  setExporting: (exporting: boolean) => void
}

// ─── Combined store ───────────────────────────────────────────────────────────

type SimulationStore = RunState &
  RunActions &
  ConfigState &
  ConfigActions &
  PlaybackState &
  PlaybackActions &
  ExportState &
  ExportActions

function invalidateCompletedRun(state: SimulationStore) {
  const shouldInvalidate =
    state.status === 'complete' ||
    state.status === 'error' ||
    state.status === 'cancelled' ||
    state.result !== null

  return shouldInvalidate
    ? {
        ...initialRunState,
        isPlaying: false,
        currentFrame: 0,
        totalFrames: 0,
        isExportReady: false,
        isExporting: false,
      }
    : {}
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Run state
  ...initialRunState,
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setRunId: (runId) => set({ runId }),
  setResult: (result) => set({ result, status: 'complete' }),
  setError: (errorCode, errorMessage) => set({ errorCode, errorMessage, status: 'error' }),
  resetRun: () => set({ ...initialRunState }),

  // Config state
  ...initialConfigState,
  setFormula: (formula) =>
    set((state) => ({
      formula,
      ...invalidateCompletedRun(state),
    })),
  setPresetId: (presetId) =>
    set((state) => ({
      presetId,
      ...invalidateCompletedRun(state),
    })),
  setAgentCount: (agentCount) =>
    set((state) => ({
      agentCount,
      ...invalidateCompletedRun(state),
    })),
  setSteps: (steps) =>
    set((state) => ({
      steps,
      ...invalidateCompletedRun(state),
    })),
  setFrameStride: (frameStride) =>
    set((state) => ({
      frameStride,
      ...invalidateCompletedRun(state),
    })),
  setThemeId: (themeId) => set({ themeId }),
  getConfig: (): SimulationConfig => {
    const s = get()
    return {
      presetId: s.presetId,
      formula: s.formula,
      agentCount: s.agentCount,
      steps: s.steps,
      histogramBins: s.histogramBins,
      frameStride: s.frameStride,
      seed: s.seed,
    }
  },

  // Playback state
  isPlaying: false,
  currentFrame: 0,
  totalFrames: 0,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentFrame: (currentFrame) => set({ currentFrame }),
  setTotalFrames: (totalFrames) => set({ totalFrames }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  resetPlayback: () => set({ isPlaying: false, currentFrame: 0, totalFrames: 0 }),

  // Export state
  isExportReady: false,
  isExporting: false,
  setExportReady: (isExportReady) => set({ isExportReady }),
  setExporting: (isExporting) => set({ isExporting }),
}))

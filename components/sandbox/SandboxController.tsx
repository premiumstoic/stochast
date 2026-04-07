'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useSimulationStore } from '@/store/simulation'
import { validateFormula } from '@/lib/formula'
import { getPresetById } from '@/lib/presets'
import type { ThemeId } from '@/lib/types'
import { getSimulationController } from '@/lib/simulation-controller'
import { FormulaBar } from './FormulaBar'
import { ControlStrip } from './ControlStrip'
import { PlaybackControls } from './PlaybackControls'
import { PathCanvas } from './PathCanvas'
import { HistogramCanvas } from './HistogramCanvas'
import { MetricsRail } from './MetricsRail'
import { ProgressBar } from './ProgressBar'
import { CommandPalette } from './CommandPalette'

interface SandboxControllerProps {
  initialPresetId?: string
  initialThemeId?: ThemeId
}

export function SandboxController({ initialPresetId, initialThemeId }: SandboxControllerProps) {
  const {
    getConfig, setStatus, setProgress, setRunId, setResult,
    setError, resetRun, resetPlayback, setTotalFrames,
    presetId, formula, status, result, themeId, setPresetId, setFormula, setThemeId,
  } = useSimulationStore()

  const controllerRef = useRef(getSimulationController())
  const [paletteOpen, setPaletteOpen] = useState(false)
  const appliedQueryRef = useRef(false)
  const activePreset = getPresetById(presetId)

  useEffect(() => {
    return () => controllerRef.current.destroy()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = themeId
  }, [themeId])

  useEffect(() => {
    if (appliedQueryRef.current) return
    appliedQueryRef.current = true

    if (initialPresetId) {
      const preset = getPresetById(initialPresetId)
      if (preset) {
        setPresetId(preset.id)
        setFormula(preset.formula)
      }
    }

    if (initialThemeId) {
      setThemeId(initialThemeId)
    }
  }, [initialPresetId, initialThemeId, setFormula, setPresetId, setThemeId])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleRun = useCallback(() => {
    const store = useSimulationStore.getState()
    if (store.status === 'simulating' || store.status === 'validating') return

    resetRun()
    resetPlayback()
    setStatus('validating')

    const config = getConfig()
    const { frameStride, steps } = config
    const frameCount = steps > 0 ? Math.ceil(steps / frameStride) : 0
    setTotalFrames(frameCount)

    const runId = controllerRef.current.run(config, {
      onProgress: (progress, completedSteps, stage) => {
        setStatus(stage === 'validating' ? 'validating' : 'simulating')
        setProgress(progress)
      },
      onComplete: (result) => {
        setResult(result)
        const completedFrameCount = result.runMeta.agentCount > 0
          ? result.sampledFrames.length / result.runMeta.agentCount
          : 0
        setTotalFrames(completedFrameCount)
        // Jump to last frame so the full trajectory is visible immediately
        useSimulationStore.getState().setCurrentFrame(Math.max(0, completedFrameCount - 1))
      },
      onError: (code, message) => {
        setError(code, message)
      },
      onCancel: () => {
        setStatus('cancelled')
      },
    })
    setRunId(runId)
  }, [getConfig, resetRun, resetPlayback, setStatus, setProgress, setRunId, setResult, setError, setTotalFrames])

  const handleReset = useCallback(() => {
    controllerRef.current.cancel()
    resetRun()
    resetPlayback()
  }, [resetRun, resetPlayback])

  const isEmpty = (status === 'idle' || status === 'cancelled') && result === null
  const canRun = !(
    status === 'simulating' ||
    status === 'validating' ||
    !validateFormula(formula).ok
  )

  return (
    <div
      className="min-h-screen flex flex-col lg:h-screen lg:overflow-hidden"
      style={{ background: 'var(--color-background)' }}
    >
      <header className="flex items-center justify-between px-4 py-3 border-b border-border md:px-6 flex-shrink-0">
        <span className="text-sm font-mono text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">stochast</Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-text-primary">sandbox</span>
        </span>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="border border-border px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-text-muted transition-colors hover:border-accent-secondary hover:text-accent-secondary"
        >
          Cmd/Ctrl+K
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-auto lg:overflow-hidden">
        <div className="min-h-full grid grid-cols-1 xl:h-full xl:grid-cols-[18rem_minmax(0,1fr)_16rem] xl:grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto]">
          <section
            aria-label="Simulation formula"
            className="order-1 border-b border-border p-4 lg:col-start-1 lg:row-start-1 lg:border-r"
          >
            <FormulaBar onRun={handleRun} />
          </section>

          <main
            id="main-content"
            aria-label="Simulation playback"
            className="order-2 min-h-[20rem] border-b border-border lg:col-start-2 lg:row-span-2 lg:min-h-0 xl:border-b-0"
          >
            <div className="flex h-full min-h-[20rem] flex-col overflow-hidden lg:min-h-0">
              <div className="flex-1 relative min-h-[16rem] lg:min-h-0">
                <PathCanvas />
                {isEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md border border-border bg-background/80 px-4 py-3">
                      <div className="text-sm font-mono text-text-primary">
                        Run the {activePreset?.label ?? 'default'} preset to start.
                      </div>
                      <div
                        className="mt-2 text-sm text-text-muted"
                        style={{ fontFamily: 'var(--font-ibm-plex-sans)' }}
                      >
                        Use the formula bar to edit `p(x)`, switch presets, or open the command palette with `Cmd/Ctrl+K`.
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 border-t border-border px-4 py-3">
                <PlaybackControls onReset={handleReset} />
              </div>
            </div>
          </main>

          <section
            aria-label="Simulation controls"
            className="order-4 border-b border-border p-4 lg:col-start-1 lg:row-start-2 lg:border-r xl:border-b-0"
          >
            <div className="flex flex-col gap-6">
              <ControlStrip />
              <ProgressBar />
            </div>
          </section>

          <aside
            aria-label="Distribution summary"
            className="order-3 lg:col-span-2 lg:row-start-3 xl:order-none xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:flex xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-l xl:border-border"
          >
            <div className="h-56 border-b border-border p-3 sm:h-64 xl:h-56 xl:flex-none">
              <HistogramCanvas />
            </div>
            <div className="border-t border-border p-3 xl:min-h-0 xl:flex-1 xl:overflow-hidden">
              <MetricsRail />
            </div>
          </aside>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        canRun={canRun}
        onClose={() => setPaletteOpen(false)}
        onRun={handleRun}
        onReset={handleReset}
      />
    </div>
  )
}

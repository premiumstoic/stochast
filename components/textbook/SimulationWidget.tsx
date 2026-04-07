'use client'

import { useEffect, useRef, useState } from 'react'
import { SimulationController } from '@/lib/simulation-controller'
import { getPresetById } from '@/lib/presets'
import { drawPaths, drawHistogram } from '@/lib/canvas-draw'
import type { SimulationResult, SimulationConfig, SimulationWidgetProps } from '@/lib/types'

interface Props extends Partial<SimulationWidgetProps> {
  presetId?: string
  agentCount?: number
  steps?: number
  caption?: string
}

type WidgetStatus = 'idle' | 'running' | 'complete' | 'error'

export function SimulationWidget({
  mode = 'chapter',
  lockedPresetId,
  hideControls = true,
  fixedAgentCount,
  fixedSteps,
  showMetrics = false,
  showFormulaBar = false,
  presetId,
  agentCount = 500,
  steps = 200,
  caption,
}: Props) {
  const [status, setStatus] = useState<WidgetStatus>('idle')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)

  const pathRef = useRef<HTMLCanvasElement>(null)
  const histRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<SimulationController | null>(null)
  const resolvedPresetId = lockedPresetId ?? presetId
  const resolvedAgentCount = fixedAgentCount ?? agentCount
  const resolvedSteps = fixedSteps ?? steps

  // Auto-run on mount
  useEffect(() => {
    if (!resolvedPresetId) return
    const preset = getPresetById(resolvedPresetId)
    if (!preset) return

    const ctrl = new SimulationController()
    controllerRef.current = ctrl

    const config: SimulationConfig = {
      presetId: preset.id,
      formula: preset.formula,
      agentCount: resolvedAgentCount,
      steps: resolvedSteps,
      histogramBins: 50,
      frameStride: 4,
      seed: 42,
    }

    setStatus('running')
    ctrl.run(config, {
      onComplete: (res) => {
        const frameCount = res.runMeta.agentCount > 0
          ? res.sampledFrames.length / res.runMeta.agentCount
          : 0
        setResult(res)
        setCurrentFrame(Math.max(0, frameCount - 1))
        setStatus('complete')
      },
      onError: () => setStatus('error'),
    })

    return () => ctrl.destroy()
  }, [resolvedPresetId, resolvedAgentCount, resolvedSteps])

  // Draw paths
  useEffect(() => {
    const canvas = pathRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      if (status === 'idle' || !result) {
        const W = canvas!.offsetWidth
        const H = canvas!.offsetHeight
        if (W && H) {
          if (canvas!.width !== W) canvas!.width = W
          if (canvas!.height !== H) canvas!.height = H
          ctx!.clearRect(0, 0, W, H)
        }
        return
      }
      drawPaths(ctx!, canvas!, result, currentFrame)
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [result, currentFrame, status])

  // Draw histogram
  useEffect(() => {
    const canvas = histRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      if (status !== 'complete' || !result) {
        const W = canvas!.offsetWidth
        const H = canvas!.offsetHeight
        if (W && H) {
          if (canvas!.width !== W) canvas!.width = W
          if (canvas!.height !== H) canvas!.height = H
          ctx!.clearRect(0, 0, W, H)
        }
        return
      }
      drawHistogram(ctx!, canvas!, result)
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [result, status])

  const preset = resolvedPresetId ? getPresetById(resolvedPresetId) : null
  const showLockedMetadata = mode === 'chapter' && !hideControls

  return (
    <figure className="my-8 border border-border" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          {preset?.label ?? resolvedPresetId}
        </span>
        <span className="text-xs font-mono text-text-muted">
          {status === 'running' ? 'running…' : status === 'complete' ? `${resolvedAgentCount.toLocaleString()} agents` : ''}
        </span>
      </div>

      {showFormulaBar && preset && (
        <div className="border-b border-border px-3 py-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Formula</div>
          <div className="mt-1 text-sm font-mono text-accent-primary">{preset.formula}</div>
        </div>
      )}

      {showLockedMetadata && (
        <div className="border-b border-border px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-text-muted">
          locked preset · {resolvedSteps} steps
        </div>
      )}

      <div className="flex" style={{ height: '220px' }}>
        <div className="flex-1 relative">
          <canvas
            ref={pathRef}
            className="w-full h-full"
            style={{ background: 'var(--color-surface)' }}
            role="img"
            aria-label="Chapter simulation trajectories."
          />
          {status === 'running' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-text-muted">running…</span>
            </div>
          )}
        </div>

        <div className="w-24 flex-shrink-0 border-l border-border">
          <canvas
            ref={histRef}
            className="w-full h-full"
            style={{ background: 'var(--color-surface)' }}
            role="img"
            aria-label="Chapter simulation histogram."
          />
        </div>
      </div>

      {showMetrics && status === 'complete' && result && (
        <div className="grid grid-cols-3 border-t border-border">
          <div className="border-r border-border px-3 py-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Bifurcation</div>
            <div className="mt-1 text-sm font-mono text-accent-primary">
              {result.metrics.bifurcationScore.toFixed(1)}
            </div>
          </div>
          <div className="border-r border-border px-3 py-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Convergence</div>
            <div className="mt-1 text-sm font-mono text-accent-primary">
              {result.metrics.convergenceRate.toFixed(1)}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">Gini</div>
            <div className="mt-1 text-sm font-mono text-accent-primary">
              {result.metrics.giniCoefficient.toFixed(3)}
            </div>
          </div>
        </div>
      )}

      {caption && (
        <figcaption className="px-3 py-2 border-t border-border text-xs font-mono text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

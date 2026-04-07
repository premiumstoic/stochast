'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation'

const TRAJECTORY_ALPHA = 0.12
const TRAJECTORY_WIDTH = 0.8

export function PathCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { result, currentFrame, status } = useSimulationStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      if (!W || !H) return

      if (canvas!.width !== W) canvas!.width = W
      if (canvas!.height !== H) canvas!.height = H

      ctx!.clearRect(0, 0, W, H)
      if (status === 'idle' || !result) return

      const { sampledFrames, runMeta } = result
      const { agentCount, frameStride } = runMeta
      const frameCount = agentCount > 0 ? sampledFrames.length / agentCount : 0
      const visibleFrames = Math.min(currentFrame + 1, frameCount)
      if (visibleFrames === 0 || frameCount <= 1) return

      const trajectoryColor =
        getComputedStyle(canvas!).getPropertyValue('--color-chart-trajectory').trim() ||
        `rgba(97,208,255,${TRAJECTORY_ALPHA})`

      ctx!.strokeStyle = trajectoryColor
      ctx!.lineWidth = TRAJECTORY_WIDTH

      for (let a = 0; a < agentCount; a++) {
        ctx!.beginPath()
        for (let f = 0; f < visibleFrames; f++) {
          const pos = sampledFrames[f * agentCount + a]
          const x = (f / (frameCount - 1)) * W
          const y = (1 - pos) * H
          if (f === 0) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        }
        ctx!.stroke()
      }
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [result, currentFrame, status])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'var(--color-surface)' }}
      role="img"
      aria-label="Trajectory playback showing how agent paths evolve over time."
    />
  )
}

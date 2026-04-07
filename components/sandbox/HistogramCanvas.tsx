'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation'

const BAR_GAP = 1

export function HistogramCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { result, status } = useSimulationStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      if (!W || !H) return

      // Only reassign if dimensions actually changed — setting canvas.width always clears it
      if (canvas!.width !== W) canvas!.width = W
      if (canvas!.height !== H) canvas!.height = H

      ctx!.clearRect(0, 0, W, H)
      if (status === 'idle' || !result) return

      const { histogram } = result
      const bins = histogram.length
      let maxCount = 0
      for (let i = 0; i < bins; i++) if (histogram[i] > maxCount) maxCount = histogram[i]
      if (maxCount === 0) return

      const histColor =
        getComputedStyle(canvas!).getPropertyValue('--color-chart-histogram').trim() || '#9fe870'
      const barW = W / bins

      ctx!.fillStyle = histColor
      for (let i = 0; i < bins; i++) {
        const barH = (histogram[i] / maxCount) * H
        ctx!.fillRect(i * barW + BAR_GAP / 2, H - barH, barW - BAR_GAP, barH)
      }
    }

    draw()

    const ro = new ResizeObserver(draw)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [result, status])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'var(--color-surface)' }}
      role="img"
      aria-label="Histogram of final agent positions for the current simulation."
    />
  )
}

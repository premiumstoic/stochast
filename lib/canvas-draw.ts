import type { SimulationResult } from './types'

const TRAJECTORY_ALPHA = 0.12
const TRAJECTORY_WIDTH = 0.8
const BAR_GAP = 1

export function drawPaths(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  result: SimulationResult,
  currentFrame: number,
): void {
  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  if (!W || !H) return

  if (canvas.width !== W) canvas.width = W
  if (canvas.height !== H) canvas.height = H

  ctx.clearRect(0, 0, W, H)

  const { sampledFrames, runMeta } = result
  const { agentCount, frameStride } = runMeta
  const frameCount = agentCount > 0 ? sampledFrames.length / agentCount : 0
  const visibleFrames = Math.min(currentFrame + 1, frameCount)
  if (visibleFrames === 0 || frameCount <= 1) return

  const trajectoryColor =
    getComputedStyle(canvas).getPropertyValue('--color-chart-trajectory').trim() ||
    `rgba(97,208,255,${TRAJECTORY_ALPHA})`

  ctx.strokeStyle = trajectoryColor
  ctx.lineWidth = TRAJECTORY_WIDTH

  for (let a = 0; a < agentCount; a++) {
    ctx.beginPath()
    for (let f = 0; f < visibleFrames; f++) {
      const pos = sampledFrames[f * agentCount + a]
      const x = (f / (frameCount - 1)) * W
      const y = (1 - pos) * H
      if (f === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

export function drawHistogram(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  result: SimulationResult,
): void {
  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  if (!W || !H) return

  if (canvas.width !== W) canvas.width = W
  if (canvas.height !== H) canvas.height = H

  ctx.clearRect(0, 0, W, H)

  const { histogram } = result
  const bins = histogram.length
  let maxCount = 0
  for (let i = 0; i < bins; i++) if (histogram[i] > maxCount) maxCount = histogram[i]
  if (maxCount === 0) return

  const histColor =
    getComputedStyle(canvas).getPropertyValue('--color-chart-histogram').trim() || '#9fe870'
  const barW = W / bins

  ctx.fillStyle = histColor
  for (let i = 0; i < bins; i++) {
    const barH = (histogram[i] / maxCount) * H
    ctx.fillRect(i * barW + BAR_GAP / 2, H - barH, barW - BAR_GAP, barH)
  }
}

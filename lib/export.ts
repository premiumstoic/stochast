'use client'

import type { SimulationResult, SimulationConfig } from './types'
import { getPresetById } from './presets'

// Card dimensions: portrait 4:5
const W = 800
const H = 1000
const PAD = 48

// Read a CSS variable from the document root
function token(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  )
}

function tokens() {
  return {
    background: token('--color-background', '#111315'),
    surface: token('--color-surface', '#171a1d'),
    surfaceMuted: token('--color-surface-muted', '#1e2226'),
    border: token('--color-border', '#2a2f35'),
    textPrimary: token('--color-text-primary', '#ece6dc'),
    textMuted: token('--color-text-muted', '#6b7280'),
    accentPrimary: token('--color-accent-primary', '#9fe870'),
    accentSecondary: token('--color-accent-secondary', '#61d0ff'),
    chartGrid: token('--color-chart-grid', 'rgba(255,255,255,0.06)'),
    histogram: token('--color-chart-histogram', '#9fe870'),
  }
}

function drawHistogramOnCanvas(
  ctx: CanvasRenderingContext2D,
  histogram: Uint32Array,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  const bins = histogram.length
  let max = 0
  for (let i = 0; i < bins; i++) if (histogram[i] > max) max = histogram[i]
  if (max === 0) return

  const barW = w / bins
  ctx.fillStyle = color
  for (let i = 0; i < bins; i++) {
    const barH = (histogram[i] / max) * h
    ctx.fillRect(x + i * barW + 0.5, y + h - barH, barW - 1, barH)
  }
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate
      continue
    }

    if (current) lines.push(current)
    if (ctx.measureText(word).width <= maxWidth) {
      current = word
      continue
    }

    let chunk = ''
    for (const char of word) {
      const chunkCandidate = chunk + char
      if (ctx.measureText(chunkCandidate).width <= maxWidth) {
        chunk = chunkCandidate
      } else {
        lines.push(chunk)
        chunk = char
      }
    }
    current = chunk
  }

  if (current) lines.push(current)

  lines.forEach((lineText, index) => {
    ctx.fillText(lineText, x, y + index * lineHeight)
  })

  return lines.length
}

export async function exportToPng(
  result: SimulationResult,
  config: SimulationConfig,
): Promise<void> {
  const t = tokens()
  const preset = getPresetById(result.runMeta.presetId)
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = t.background
  ctx.fillRect(0, 0, W, H)

  // ── Header ──────────────────────────────────────────────────────────────────
  const headerY = PAD

  ctx.font = `500 13px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textMuted
  ctx.fillText('stochast', PAD, headerY)

  ctx.font = `500 13px 'IBM Plex Mono', monospace`
  ctx.textAlign = 'right'
  ctx.fillStyle = t.textPrimary
  ctx.fillText(preset?.label ?? result.runMeta.presetId, W - PAD, headerY)
  ctx.textAlign = 'left'

  // Timestamp / run meta
  const metaY = headerY + 22
  ctx.font = `400 11px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textMuted
  const ts = new Date().toISOString().replace('T', '  ').slice(0, 19)
  ctx.fillText(
    `${result.runMeta.agentCount.toLocaleString()} agents · ${result.runMeta.steps} steps · ${ts}`,
    PAD,
    metaY,
  )

  // Separator
  const sep1Y = metaY + 18
  line(ctx, PAD, sep1Y, W - PAD, sep1Y, t.border)

  // ── Histogram (dominant element) ────────────────────────────────────────────
  const histX = PAD
  const histY = sep1Y + 20
  const histW = W - PAD * 2
  const histH = 520

  // Histogram background
  ctx.fillStyle = t.surface
  ctx.fillRect(histX, histY, histW, histH)

  // Subtle horizontal grid
  ctx.strokeStyle = t.chartGrid
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const gy = histY + (histH / 5) * i
    ctx.beginPath()
    ctx.moveTo(histX, gy)
    ctx.lineTo(histX + histW, gy)
    ctx.stroke()
  }

  // Draw histogram bars
  drawHistogramOnCanvas(ctx, result.histogram, histX, histY, histW, histH, t.histogram)

  // Histogram border
  ctx.strokeStyle = t.border
  ctx.lineWidth = 1
  ctx.strokeRect(histX, histY, histW, histH)

  const sep2Y = histY + histH + 20
  line(ctx, PAD, sep2Y, W - PAD, sep2Y, t.border)

  // ── Formula ─────────────────────────────────────────────────────────────────
  const formulaY = sep2Y + 36
  ctx.font = `400 13px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textMuted
  ctx.fillText('p(x) =', PAD, formulaY)

  ctx.font = `500 16px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.accentPrimary
  const formulaLines = drawWrappedText(
    ctx,
    config.formula,
    PAD + 70,
    formulaY,
    W - PAD * 2 - 70,
    22,
  )

  // ── Metrics strip ────────────────────────────────────────────────────────────
  const sep3Y = formulaY + Math.max(24, formulaLines * 22)
  line(ctx, PAD, sep3Y, W - PAD, sep3Y, t.border)

  const metricsY = sep3Y + 20
  const colW = (W - PAD * 2) / 3
  const { metrics } = result
  const metricItems = [
    { label: 'BIFURCATION', value: metrics.bifurcationScore.toFixed(1) },
    { label: 'CONVERGENCE', value: metrics.convergenceRate.toFixed(1) },
    { label: 'GINI', value: metrics.giniCoefficient.toFixed(3) },
  ]

  for (let i = 0; i < metricItems.length; i++) {
    const mx = PAD + i * colW
    ctx.font = `400 10px 'IBM Plex Mono', monospace`
    ctx.fillStyle = t.textMuted
    ctx.fillText(metricItems[i].label, mx, metricsY)

    ctx.font = `500 24px 'IBM Plex Mono', monospace`
    ctx.fillStyle = i === 1 ? t.accentSecondary : t.accentPrimary
    ctx.fillText(metricItems[i].value, mx, metricsY + 30)
  }

  // Run detail footer block
  const footerPanelY = metricsY + 56
  ctx.fillStyle = t.surfaceMuted
  ctx.fillRect(PAD, footerPanelY, W - PAD * 2, 58)
  ctx.strokeStyle = t.border
  ctx.strokeRect(PAD, footerPanelY, W - PAD * 2, 58)

  ctx.font = `400 11px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textMuted
  ctx.fillText('run detail', PAD + 16, footerPanelY + 20)

  ctx.font = `500 13px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textPrimary
  ctx.fillText(
    `${result.runMeta.agentCount.toLocaleString()} agents · ${result.runMeta.steps} steps · ${result.runMeta.elapsedMs.toFixed(0)}ms`,
    PAD + 16,
    footerPanelY + 40,
  )

  // ── Watermark ────────────────────────────────────────────────────────────────
  ctx.font = `400 11px 'IBM Plex Mono', monospace`
  ctx.fillStyle = t.textMuted
  ctx.textAlign = 'center'
  ctx.fillText('stochast.vercel.app', W / 2, H - 28)
  ctx.textAlign = 'left'

  // ── Download ─────────────────────────────────────────────────────────────────
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('toBlob failed')); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stochast-${config.presetId}-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}

'use client'

import { useSimulationStore } from '@/store/simulation'
import { ExportButton } from './ExportButton'
import { getPresetById } from '@/lib/presets'

function Metric({
  label,
  value,
  digits = 1,
}: {
  label: string
  value: number | null
  digits?: number
}) {
  return (
    <div className="flex flex-col gap-1 border border-border p-3">
      <span className="text-xs text-text-muted font-mono uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-mono text-accent-primary tabular-nums">
        {value !== null ? value.toFixed(digits) : '—'}
      </span>
    </div>
  )
}

function interpretBifurcation(score: number) {
  if (score < 20) return 'center-heavy'
  if (score < 60) return 'mixed'
  return 'edge-heavy'
}

function interpretConvergence(score: number) {
  if (score < 35) return 'late lock'
  if (score < 70) return 'moderate lock'
  return 'early lock'
}

function interpretGini(score: number) {
  if (score < 0.2) return 'even spread'
  if (score < 0.45) return 'moderate skew'
  return 'strong skew'
}

function DetailRow({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-t border-border first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
          {label}
        </div>
        <div className="mt-1 text-xs font-sans text-text-muted" style={{ fontFamily: 'var(--font-ibm-plex-sans)' }}>
          {note}
        </div>
      </div>
      <div className="shrink-0 text-sm font-mono text-text-primary tabular-nums">
        {value}
      </div>
    </div>
  )
}

export function MetricsRail() {
  const { result, status } = useSimulationStore()
  const m = status === 'complete' && result ? result.metrics : null
  const preset = result ? getPresetById(result.runMeta.presetId) : null

  return (
    <div className="flex flex-col gap-2">
      <Metric label="Bifurcation" value={m?.bifurcationScore ?? null} />
      <Metric label="Convergence" value={m?.convergenceRate ?? null} />
      <Metric label="Gini" value={m ? m.giniCoefficient : null} digits={3} />

      {status === 'complete' && result && (
        <div className="border border-border bg-surface p-3 mt-1">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                Run Detail
              </div>
              <div className="mt-1 text-sm font-mono text-text-primary">
                {preset?.label ?? result.runMeta.presetId}
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-text-muted tabular-nums">
              {result.runMeta.agentCount.toLocaleString()} agents
              <br />
              {result.runMeta.steps} steps
            </div>
          </div>

          <div className="mt-3 border border-border bg-background px-3 py-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Formula
            </div>
            <div className="mt-1 break-all text-sm font-mono text-accent-primary">
              {result.runMeta.formula}
            </div>
          </div>

          <div className="mt-3">
            <DetailRow
              label="Bifurcation"
              value={`${result.metrics.bifurcationScore.toFixed(1)}%`}
              note={`Final distribution reads as ${interpretBifurcation(result.metrics.bifurcationScore)}.`}
            />
            <DetailRow
              label="Convergence"
              value={`${result.metrics.convergenceRate.toFixed(1)}%`}
              note={`Trajectories reached their final class with ${interpretConvergence(result.metrics.convergenceRate)}.`}
            />
            <DetailRow
              label="Gini"
              value={result.metrics.giniCoefficient.toFixed(3)}
              note={`Bin occupancy shows ${interpretGini(result.metrics.giniCoefficient)} across the final histogram.`}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-border text-[11px] font-mono text-text-muted tabular-nums">
            {result.runMeta.elapsedMs.toFixed(0)}ms worker time · {result.runMeta.histogramBins} bins · frame stride {result.runMeta.frameStride}
          </div>
        </div>
      )}

      <ExportButton />
    </div>
  )
}

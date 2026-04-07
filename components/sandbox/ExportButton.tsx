'use client'

import { useState } from 'react'
import { useSimulationStore } from '@/store/simulation'
import { exportToPng } from '@/lib/export'

export function ExportButton() {
  const { status, result } = useSimulationStore()
  const [exporting, setExporting] = useState(false)

  const isReady = status === 'complete' && result !== null

  async function handleExport() {
    if (!result || exporting) return
    setExporting(true)
    try {
      await exportToPng(result, {
        presetId: result.runMeta.presetId,
        formula: result.runMeta.formula,
        agentCount: result.runMeta.agentCount,
        steps: result.runMeta.steps,
        histogramBins: result.runMeta.histogramBins,
        frameStride: result.runMeta.frameStride,
        seed: result.runMeta.seed,
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={!isReady || exporting}
      className={[
        'w-full py-2 text-xs font-mono border transition-colors mt-2',
        isReady && !exporting
          ? 'border-border text-text-muted hover:border-accent-secondary hover:text-accent-secondary'
          : 'border-border text-text-muted opacity-30 cursor-not-allowed',
      ].join(' ')}
    >
      {exporting ? 'exporting…' : 'export png'}
    </button>
  )
}

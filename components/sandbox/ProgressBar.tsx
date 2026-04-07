'use client'

import { useSimulationStore } from '@/store/simulation'

export function ProgressBar() {
  const { status, progress, errorMessage } = useSimulationStore()

  if (status === 'idle' || status === 'complete') return null

  if (status === 'error') {
    return (
      <div className="text-xs font-mono text-error border border-error px-3 py-2" role="alert">
        {errorMessage ?? 'An error occurred.'}
      </div>
    )
  }

  if (status === 'cancelled') {
    return (
      <div className="text-xs font-mono text-text-muted border border-border px-3 py-2" role="status">
        Run cancelled.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1" role="status" aria-live="polite">
      <div
        className="h-px bg-surface-muted w-full overflow-hidden"
        role="progressbar"
        aria-label="Simulation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full bg-accent-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-mono text-text-muted">{Math.round(progress)}%</span>
    </div>
  )
}

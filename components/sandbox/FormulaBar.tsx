'use client'

import { useSimulationStore } from '@/store/simulation'
import { validateFormula } from '@/lib/formula'
import { launchPresets } from '@/lib/presets'

export function FormulaBar({ onRun }: { onRun: () => void }) {
  const { formula, presetId, status, errorCode, errorMessage, setFormula, setPresetId } = useSimulationStore()
  const isRunning = status === 'simulating' || status === 'validating'
  const validation = validateFormula(formula)
  const inlineError = !validation.ok
    ? validation.message
    : status === 'error' &&
        (errorCode === 'PARSE_ERROR' ||
          errorCode === 'NON_FINITE_RESULT' ||
          errorCode === 'OUT_OF_RANGE_PROBABILITY')
      ? errorMessage
      : null

  function handlePresetChange(id: string) {
    const preset = launchPresets.find((p) => p.id === id)
    if (preset) {
      setPresetId(preset.id)
      setFormula(preset.formula)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Preset selector */}
      <div className="flex gap-1">
        {launchPresets.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePresetChange(p.id)}
            disabled={isRunning}
            className={[
              'px-3 py-1 text-xs font-mono border transition-colors',
              isRunning
                ? 'border-border text-text-muted opacity-40 cursor-not-allowed bg-surface'
                : presetId === p.id
                ? 'border-accent-primary text-accent-primary bg-surface'
                : 'border-border text-text-muted hover:text-text-primary hover:border-text-muted bg-surface',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Formula input */}
      <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2 focus-within:border-accent-primary transition-colors">
        <span className="text-text-muted text-xs font-mono select-none shrink-0">p(x) =</span>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !isRunning && validation.ok) onRun() }}
          disabled={isRunning}
          spellCheck={false}
          className="flex-1 bg-transparent text-text-primary text-sm font-mono outline-none placeholder:text-text-muted min-w-0"
          placeholder="0.5"
          aria-label="Formula"
        />
      </div>

      {inlineError && (
        <div className="border border-error px-3 py-2 text-xs font-mono text-error">
          {inlineError}
        </div>
      )}

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isRunning || !validation.ok}
        className={[
          'w-full py-2 text-sm font-mono border transition-colors',
          isRunning || !validation.ok
            ? 'border-border text-text-muted cursor-not-allowed'
            : 'border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-background',
        ].join(' ')}
      >
        {isRunning ? 'running…' : 'run'}
      </button>
    </div>
  )
}

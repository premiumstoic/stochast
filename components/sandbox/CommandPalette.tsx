'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { launchPresets } from '@/lib/presets'
import { themeOptions } from '@/lib/themes'
import { useSimulationStore } from '@/store/simulation'

interface CommandPaletteProps {
  open: boolean
  canRun: boolean
  onClose: () => void
  onRun: () => void
  onReset: () => void
}

export function CommandPalette({ open, canRun, onClose, onRun, onReset }: CommandPaletteProps) {
  const { presetId, themeId, setPresetId, setFormula, setThemeId } = useSimulationStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(timer)
  }, [open])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredPresets = useMemo(() => {
    if (!normalizedQuery) return launchPresets
    return launchPresets.filter((preset) =>
      `${preset.label} ${preset.formula} ${preset.description}`.toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery])

  const filteredThemes = useMemo(() => {
    if (!normalizedQuery) return themeOptions
    return themeOptions.filter((theme) => theme.label.toLowerCase().includes(normalizedQuery))
  }, [normalizedQuery])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-12"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onClose()
            }}
            className="w-full bg-transparent text-sm font-mono text-text-primary outline-none placeholder:text-text-muted"
            placeholder="Search actions, presets, or themes"
            aria-label="Command palette"
          />
        </div>

        <div className="grid gap-6 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="flex flex-col gap-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Actions
            </div>
            <button
              type="button"
              disabled={!canRun}
              onClick={() => {
                onRun()
                onClose()
              }}
              className={[
                'flex items-center justify-between border px-3 py-2 text-left text-sm font-mono transition-colors',
                canRun
                  ? 'border-border text-text-primary hover:border-accent-primary hover:text-accent-primary'
                  : 'border-border text-text-muted opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              <span>Run simulation</span>
              <span className="text-xs text-text-muted">Enter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onReset()
                onClose()
              }}
              className="flex items-center justify-between border border-border px-3 py-2 text-left text-sm font-mono text-text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
            >
              <span>Reset run</span>
              <span className="text-xs text-text-muted">R</span>
            </button>
          </section>

          <section className="flex flex-col gap-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Themes
            </div>
            {filteredThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setThemeId(theme.id)
                  onClose()
                }}
                className={[
                  'flex items-center justify-between border px-3 py-2 text-left text-sm font-mono transition-colors',
                  themeId === theme.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-border text-text-primary hover:border-accent-primary hover:text-accent-primary',
                ].join(' ')}
              >
                <span>{theme.label}</span>
                <span className="text-[10px] uppercase tracking-widest text-text-muted">
                  {theme.appearance}
                </span>
              </button>
            ))}
          </section>

          <section className="flex flex-col gap-2 md:col-span-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Presets
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setPresetId(preset.id)
                    setFormula(preset.formula)
                    onClose()
                  }}
                  className={[
                    'border px-3 py-3 text-left transition-colors',
                    presetId === preset.id
                      ? 'border-accent-primary text-accent-primary'
                      : 'border-border text-text-primary hover:border-accent-primary hover:text-accent-primary',
                  ].join(' ')}
                >
                  <div className="text-sm font-mono">{preset.label}</div>
                  <div className="mt-1 text-xs font-mono text-text-muted">{preset.formula}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

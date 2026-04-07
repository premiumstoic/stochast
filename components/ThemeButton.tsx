'use client'

import { themeOptions } from '@/lib/themes'
import { useSimulationStore } from '@/store/simulation'

export function ThemeButton() {
  const themeId = useSimulationStore((s) => s.themeId)
  const setThemeId = useSimulationStore((s) => s.setThemeId)

  function cycleTheme() {
    const idx = themeOptions.findIndex((t) => t.id === themeId)
    const next = themeOptions[(idx + 1) % themeOptions.length]
    setThemeId(next.id)
  }

  const current = themeOptions.find((t) => t.id === themeId)

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={current?.label}
      aria-label={`Theme: ${current?.label}. Click to cycle.`}
      className="border border-border p-1.5 text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary"
    >
      {/* Half-filled circle: right half solid, left half outline */}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 1 A5 5 0 0 1 6 11 Z" fill="currentColor" />
      </svg>
    </button>
  )
}

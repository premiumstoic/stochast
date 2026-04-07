'use client'

import { useEffect } from 'react'
import { themeOptions, defaultThemeId } from '@/lib/themes'
import { useSimulationStore } from '@/store/simulation'

export function ThemeProvider() {
  const themeId = useSimulationStore((s) => s.themeId)
  const setThemeId = useSimulationStore((s) => s.setThemeId)

  // Sync theme to DOM on any store change
  useEffect(() => {
    document.documentElement.dataset.theme = themeId
  }, [themeId])

  // On mount: if no query param has already overridden the theme, pick a
  // random theme that matches the device's color-scheme preference
  useEffect(() => {
    if (useSimulationStore.getState().themeId !== defaultThemeId) return
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const appearance = prefersDark ? 'dark' : 'light'
    const matching = themeOptions.filter((t) => t.appearance === appearance)
    const pick = matching[Math.floor(Math.random() * matching.length)]
    setThemeId(pick.id)
    document.documentElement.dataset.theme = pick.id
  }, [setThemeId])

  return null
}

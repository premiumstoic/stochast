import type { ThemeId } from './types'

export interface ThemeOption {
  id: ThemeId
  label: string
  appearance: 'dark' | 'light'
}

export const defaultThemeId: ThemeId = 'graphite'

export const themeOptions: ThemeOption[] = [
  { id: 'graphite', label: 'Graphite', appearance: 'dark' },
  { id: 'terminal-amber', label: 'Terminal Amber', appearance: 'dark' },
  { id: 'ice', label: 'Ice', appearance: 'dark' },
  { id: 'vellum', label: 'Vellum', appearance: 'light' },
  { id: 'blueprint', label: 'Blueprint', appearance: 'light' },
]

const themeIdSet = new Set<ThemeId>(themeOptions.map((theme) => theme.id))

export function isThemeId(value: string | undefined | null): value is ThemeId {
  return value != null && themeIdSet.has(value as ThemeId)
}

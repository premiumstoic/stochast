import { describe, expect, it } from 'vitest'
import { defaultThemeId, isThemeId, themeOptions } from '@/lib/themes'

describe('theme registry', () => {
  it('publishes both dark and light curated themes', () => {
    expect(themeOptions.map((theme) => theme.id)).toEqual([
      'graphite',
      'terminal-amber',
      'ice',
      'vellum',
      'blueprint',
    ])

    expect(themeOptions.filter((theme) => theme.appearance === 'light').map((theme) => theme.id)).toEqual([
      'vellum',
      'blueprint',
    ])
  })

  it('validates theme ids from query params and UI state', () => {
    expect(defaultThemeId).toBe('graphite')
    expect(isThemeId('graphite')).toBe(true)
    expect(isThemeId('vellum')).toBe(true)
    expect(isThemeId('blueprint')).toBe(true)
    expect(isThemeId('sunrise')).toBe(false)
    expect(isThemeId(undefined)).toBe(false)
  })
})

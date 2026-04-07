import type { Metadata } from 'next'
import { SandboxController } from '@/components/sandbox/SandboxController'
import type { ThemeId } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Sandbox',
  description: 'Experiment with stochastic rules, compare distributions, and export results from the Stochast sandbox.',
  openGraph: {
    title: 'Sandbox | Stochast',
    description: 'Experiment with stochastic rules, compare distributions, and export results from the Stochast sandbox.',
    url: 'https://stochast.vercel.app/sandbox',
  },
}

interface SandboxPageProps {
  searchParams?: Promise<{
    preset?: string
    theme?: string
  }>
}

export default async function SandboxPage({ searchParams }: SandboxPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const initialPresetId = resolvedSearchParams?.preset
  const theme = resolvedSearchParams?.theme
  const initialThemeId: ThemeId | undefined =
    theme === 'graphite' || theme === 'terminal-amber' || theme === 'ice'
      ? theme
      : undefined

  return <SandboxController initialPresetId={initialPresetId} initialThemeId={initialThemeId} />
}

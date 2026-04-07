import type { SimulationPreset } from '@/lib/types'

export const launchPresets: SimulationPreset[] = [
  {
    id: 'gaussian',
    label: 'Gaussian',
    formula: '0.5',
    description: 'No-memory baseline with a constant probability of moving up.',
    category: 'baseline',
  },
  {
    id: 'uniform',
    label: 'Uniform',
    formula: 'x',
    description: "Linear memory relation similar to Polya's urn behavior.",
    category: 'feedback',
  },
  {
    id: 'positive-feedback',
    label: 'Positive Feedback',
    formula: '(x^3) / (x^3 + (1-x)^3)',
    description: 'S-curve relation that rewards being ahead and punishes being behind.',
    category: 'feedback',
  },
]

export const defaultPreset = launchPresets[0]

export function getPresetById(id: string): SimulationPreset | undefined {
  return launchPresets.find((p) => p.id === id)
}

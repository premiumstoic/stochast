'use client'

import { useSimulationStore } from '@/store/simulation'

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-text-muted">{label}</span>
        <span className="text-text-primary tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full accent-accent-primary disabled:opacity-40"
        aria-label={label}
      />
    </div>
  )
}

export function ControlStrip() {
  const { agentCount, steps, frameStride, status, setAgentCount, setSteps, setFrameStride } = useSimulationStore()
  const isRunning = status === 'simulating' || status === 'validating'

  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="agents"
        value={agentCount}
        min={100}
        max={5000}
        step={100}
        onChange={setAgentCount}
        disabled={isRunning}
      />
      <Slider
        label="steps"
        value={steps}
        min={50}
        max={1000}
        step={50}
        onChange={setSteps}
        disabled={isRunning}
      />
      <Slider
        label="frame stride"
        value={frameStride}
        min={1}
        max={20}
        step={1}
        onChange={setFrameStride}
        disabled={isRunning}
      />
    </div>
  )
}

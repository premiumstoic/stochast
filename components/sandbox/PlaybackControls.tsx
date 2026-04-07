'use client'

import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulation'

export function PlaybackControls({ onReset }: { onReset: () => void }) {
  const {
    status, isPlaying, currentFrame, totalFrames,
    togglePlay, setCurrentFrame, resetPlayback,
  } = useSimulationStore()

  const rafRef = useRef<number | null>(null)

  // Keyboard shortcuts: Space = play/pause, R = reset
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); onReset() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, onReset])

  // Advance frame on play
  useEffect(() => {
    if (!isPlaying || status !== 'complete') return

    function tick() {
      const store = useSimulationStore.getState()
      const next = store.currentFrame + 1
      if (next >= store.totalFrames) {
        store.setIsPlaying(false)
        return
      }
      store.setCurrentFrame(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPlaying, status, totalFrames, setCurrentFrame])

  const isComplete = status === 'complete'

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        disabled={!isComplete}
        className="w-8 h-8 flex items-center justify-center border border-border text-text-primary hover:border-accent-primary hover:text-accent-primary disabled:opacity-30 transition-colors font-mono text-xs"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <button
        onClick={() => { resetPlayback(); onReset() }}
        className="w-8 h-8 flex items-center justify-center border border-border text-text-muted hover:border-text-muted hover:text-text-primary transition-colors font-mono text-xs"
        aria-label="Reset"
      >
        ↺
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalFrames - 1)}
        value={currentFrame}
        onChange={(e) => setCurrentFrame(Number(e.target.value))}
        disabled={!isComplete}
        className="flex-1 accent-accent-primary disabled:opacity-30"
        aria-label="Scrub timeline"
      />

      <span className="text-xs font-mono text-text-muted tabular-nums w-16 text-right">
        {isComplete ? `${currentFrame + 1} / ${totalFrames}` : '—'}
      </span>
    </div>
  )
}

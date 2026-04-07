import type { WorkerRequest, WorkerResponse, SimulationConfig } from '@/lib/types'
import { simulate, SimulationError } from '@/lib/simulation-core'

// ─── Simulation loop ─────────────────────────────────────────────────────────

const cancelledRunIds = new Set<string>()

async function runSimulation(runId: string, config: SimulationConfig) {
  const post = (msg: WorkerResponse) => self.postMessage(msg)
  const isCancelled = () => cancelledRunIds.has(runId)
  try {
    const result = await simulate(config, {
      runId,
      onProgress: (progress, completedSteps, stage) => {
        post({ type: 'SIMULATION_PROGRESS', runId, progress, completedSteps, stage })
      },
      shouldCancel: isCancelled,
      yieldControl: () => new Promise<void>((resolve) => setTimeout(resolve, 0)),
    })

    cancelledRunIds.delete(runId)

    self.postMessage(
      { type: 'SIMULATION_COMPLETE', runId, result } satisfies WorkerResponse,
      { transfer: [result.finalPositions.buffer, result.histogram.buffer, result.sampledFrames.buffer] },
    )
  } catch (error: unknown) {
    cancelledRunIds.delete(runId)

    if (error instanceof SimulationError && error.code === 'CANCELLED') {
      post({ type: 'SIMULATION_CANCELLED', runId })
      return
    }

    const code = error instanceof SimulationError ? error.code : 'UNKNOWN_ERROR'
    const message = error instanceof Error ? error.message : 'Simulation failed.'
    post({ type: 'SIMULATION_ERROR', runId, code, message })
  }
}

// ─── Message handler ──────────────────────────────────────────────────────────

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data
  if (msg.type === 'CANCEL_SIMULATION') {
    cancelledRunIds.add(msg.runId)
    return
  }
  if (msg.type === 'RUN_SIMULATION') {
    cancelledRunIds.delete(msg.runId)
    runSimulation(msg.runId, msg.config)
  }
}

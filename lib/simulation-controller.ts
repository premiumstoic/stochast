'use client'

import type { SimulationConfig, WorkerRequest, WorkerResponse } from '@/lib/types'

type ProgressHandler = (progress: number, completedSteps: number, stage: WorkerResponse & { type: 'SIMULATION_PROGRESS' } extends { stage: infer S } ? S : never) => void
type CompleteHandler = (result: Extract<WorkerResponse, { type: 'SIMULATION_COMPLETE' }>['result']) => void
type ErrorHandler = (code: string, message: string) => void
type CancelHandler = () => void

export class SimulationController {
  private worker: Worker | null = null
  private activeRunId: string | null = null

  private onProgress: ProgressHandler | null = null
  private onComplete: CompleteHandler | null = null
  private onError: ErrorHandler | null = null
  private onCancel: CancelHandler | null = null

  init() {
    if (this.worker) return
    // Worker is instantiated lazily — only when the first run is requested.
    // The worker module path is resolved at build time via the Webpack/Next.js
    // worker bundling pipeline.
  }

  run(config: SimulationConfig, handlers: {
    onProgress?: ProgressHandler
    onComplete?: CompleteHandler
    onError?: ErrorHandler
    onCancel?: CancelHandler
  }) {
    this.onProgress = handlers.onProgress ?? null
    this.onComplete = handlers.onComplete ?? null
    this.onError = handlers.onError ?? null
    this.onCancel = handlers.onCancel ?? null

    const runId = crypto.randomUUID()
    this.activeRunId = runId

    if (!this.worker) {
      this.worker = new Worker(new URL('../workers/simulation.worker.ts', import.meta.url))
      this.worker.onmessage = this.handleMessage.bind(this)
    }

    const request: WorkerRequest = { type: 'RUN_SIMULATION', runId, config }
    this.worker.postMessage(request)

    return runId
  }

  cancel() {
    if (!this.worker || !this.activeRunId) return
    const request: WorkerRequest = { type: 'CANCEL_SIMULATION', runId: this.activeRunId }
    this.worker.postMessage(request)
  }

  destroy() {
    this.worker?.terminate()
    this.worker = null
    this.activeRunId = null
  }

  private handleMessage(event: MessageEvent<WorkerResponse>) {
    const msg = event.data
    if (msg.runId !== this.activeRunId) return

    switch (msg.type) {
      case 'SIMULATION_PROGRESS':
        this.onProgress?.(msg.progress, msg.completedSteps, msg.stage)
        break
      case 'SIMULATION_COMPLETE':
        this.activeRunId = null
        this.onComplete?.(msg.result)
        break
      case 'SIMULATION_ERROR':
        this.activeRunId = null
        this.onError?.(msg.code, msg.message)
        break
      case 'SIMULATION_CANCELLED':
        this.activeRunId = null
        this.onCancel?.()
        break
    }
  }
}

// Singleton for use in React components — instantiated only on the client.
let controller: SimulationController | null = null

export function getSimulationController(): SimulationController {
  if (!controller) {
    controller = new SimulationController()
  }
  return controller
}

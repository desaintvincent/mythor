import { Ecs, Manager, System } from '@mythor/core'

export interface SceneOptions {
  managers?: Manager[]
  systems?: System[]
  onInit?: (ecs: Ecs) => Promise<void>
  onLoaded?: (ecs: Ecs) => Promise<void>
}

class Scene {
  public readonly name: string
  private _ready = false
  private _running = false
  public readonly ecs: Ecs

  public constructor(name: string, options?: SceneOptions) {
    this.name = name
    this.ecs = new Ecs({ queueEntities: false })
    this.ecs.registerManagers(...(options?.managers ?? []))
    this.ecs.registerSystems(...(options?.systems ?? []))

    this.init(options)
  }

  public isReady(): boolean {
    return this._ready
  }

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    if (!this._ready || !this._running) {
      return
    }

    this.ecs.update(elapsedTimeInSeconds, totalTimeInSeconds)
  }

  private init(options?: SceneOptions): Scene {
    void this.ecs
      .init()
      .then(async () => {
        await options?.onInit?.(this.ecs)
      })
      .then(() => {
        this._ready = true
      })
      .then(async () => {
        await options?.onLoaded?.(this.ecs)
      })

    return this
  }

  public start(): void {
    this._running = true
  }

  public stop(): void {
    this._running = false
  }
}

export default Scene

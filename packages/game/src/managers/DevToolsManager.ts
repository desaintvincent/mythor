import { Ecs, Manager } from '@mythor/core'
import PhysicDebugManager from './PhysicDebugManager'
import RendererDebugManager from './RendererDebugManager'
import SelectDebugManager, {
  SelectDebugManagerParams,
} from './SelectDebugManager'
import StatisticsManager, {
  StatisticsManagerOptions,
} from './StatisticsManager'

export type DevToolsManagerOptions = {
  addStatisticsManager?: boolean
  addPhysicDebugManager?: boolean
  addSelectDebugManager?: boolean
  addRendererDebugManager?: boolean
  params?: {
    statisticsManager?: StatisticsManagerOptions
    selectDebugManager?: SelectDebugManagerParams
  }
}

export default class DevToolsManager extends Manager {
  private readonly managers: Manager[]

  public constructor(options?: DevToolsManagerOptions) {
    super('DevToolsManager')

    this.managers = [
      ...(options?.addStatisticsManager ?? true
        ? [new StatisticsManager(options?.params?.statisticsManager)]
        : []),
      ...(options?.addPhysicDebugManager ?? true
        ? [new PhysicDebugManager()]
        : []),
      ...(options?.addSelectDebugManager ?? true
        ? [new SelectDebugManager(options?.params?.selectDebugManager)]
        : []),
      ...(options?.addRendererDebugManager ?? true
        ? [new RendererDebugManager()]
        : []),
    ]
  }

  public async init(ecs: Ecs): Promise<void> {
    await super.init(ecs)
    for (const manager of this.managers) {
      await manager.init(ecs)
    }
  }

  public update(
    ecs: Ecs,
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this.managers.forEach((manager) => {
      manager.update(ecs, elapsedTimeInSeconds, totalTimeInSeconds)
    })
  }

  public postUpdate(ecs: Ecs): void {
    this.managers.forEach((manager) => {
      manager.postUpdate(ecs)
    })
  }

  public clear(): void {
    this.managers.forEach((manager) => {
      manager.clear()
    })
  }
}

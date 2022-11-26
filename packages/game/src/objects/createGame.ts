import Scene, { SceneOptions } from './Scene'
import { LoadingStateManager, Manager } from '@mythor/core'
import Game from './Game'
import { EventsManager, EventManagerOptions } from '@mythor/events'
import CameraMovementManager from '../managers/CameraMovementManager'
import StatisticsManager, {
  StatisticsManagerOptions,
} from '../managers/StatisticsManager'
import PhysicDebugManager from '../managers/PhysicDebugManager'
import SelectDebugManager, {
  SelectDebugManagerParams,
} from '../managers/SelectDebugManager'
import RendererDebugManager from '../managers/RendererDebugManager'
import createLoadingScene from '../util/createLoadingScene'
import { Camera } from '@mythor/renderer'

interface GameMakerOptions extends SceneOptions {
  addLoadingStateManager?: boolean
  addEventsManager?: boolean
  addCameraMovementManager?: boolean
  addStatisticsManager?: boolean
  addPhysicDebugManager?: boolean
  addSelectDebugManager?: boolean
  addRendererDebugManager?: boolean
  params?: {
    eventsManager?: EventManagerOptions
    statisticsManager?: StatisticsManagerOptions
    selectDebugManager?: SelectDebugManagerParams
  }
  camera?: Camera
}

interface ConditionalAdd<T> {
  condition: (options: GameMakerOptions) => boolean
  getItem: (options: GameMakerOptions) => T
}

const defaultManagers: Array<ConditionalAdd<Manager>> = [
  {
    condition: (options) => options?.addLoadingStateManager ?? true,
    getItem: () => new LoadingStateManager(),
  },
  {
    condition: (options) => options?.addEventsManager ?? true,
    getItem: (options) => new EventsManager(options?.params?.eventsManager),
  },
  {
    condition: (options) => options?.addCameraMovementManager ?? true,
    getItem: () => new CameraMovementManager(),
  },
  {
    condition: (options) => options?.addStatisticsManager ?? true,
    getItem: (options) =>
      new StatisticsManager(options?.params?.statisticsManager),
  },
  {
    condition: (options) => options?.addPhysicDebugManager ?? true,
    getItem: () => new PhysicDebugManager(),
  },
  {
    condition: (options) => options?.addSelectDebugManager ?? true,
    getItem: (options) =>
      new SelectDebugManager(options?.params?.selectDebugManager),
  },
  {
    condition: (options) => options?.addRendererDebugManager ?? true,
    getItem: () => new RendererDebugManager(),
  },
]

function getManagers(options: GameMakerOptions): Manager[] {
  const managers = options.managers ?? []

  defaultManagers.forEach(({ condition, getItem }) => {
    if (condition(options)) {
      managers.push(getItem(options))
    }
  })

  return managers
}

function createGame(options: GameMakerOptions): Game {
  return new Game()
    .addScene(createLoadingScene(options?.camera))
    .addScene(
      new Scene('Mainscene', {
        ...options,
        managers: getManagers(options),
        onLoaded: async (ecs) => {
          options?.onLoaded?.(ecs)
          if (ecs.managers.has(LoadingStateManager)) {
            ecs.managers.delete(LoadingStateManager)
          }
        },
      })
    )
    .start()
}

export default createGame

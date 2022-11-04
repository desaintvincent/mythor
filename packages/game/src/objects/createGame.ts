import Scene, { SceneOptions } from './Scene'
import { LoadingStateManager, Manager } from '@mythor/core'
import Game from './Game'
import { EventsManager } from '@mythor/events'
import CameraMovementManager from '../managers/CameraMovementManager'
import StatisticsManager from '../managers/StatisticsManager'
import PhysicDebugManager from '../managers/PhysicDebugManager'
import SelectDebugManager from '../managers/SelectDebugManager'
import RendererDebugManager from '../managers/RendererDebugManager'

interface GameMakerOptions extends SceneOptions {
  addLoadingStateManager?: boolean
  addEventsManager?: boolean
  addCameraMovementManager?: boolean
  addStatisticsManager?: boolean
  addPhysicDebugManager?: boolean
  addSelectDebugManager?: boolean
  addRendererDebugManager?: boolean
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
    getItem: () => new EventsManager(),
  },
  {
    condition: (options) => options?.addCameraMovementManager ?? true,
    getItem: () => new CameraMovementManager(),
  },
  {
    condition: (options) => options?.addStatisticsManager ?? true,
    getItem: () => new StatisticsManager(),
  },
  {
    condition: (options) => options?.addPhysicDebugManager ?? true,
    getItem: () => new PhysicDebugManager(),
  },
  {
    condition: (options) => options?.addSelectDebugManager ?? true,
    getItem: () => new SelectDebugManager(),
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
  return (
    new Game()
      // .addScene(createLoadingScene())
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
  )
}

export default createGame

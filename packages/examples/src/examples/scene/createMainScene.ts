import createSecondScene from './createSecondScene'
import SceneManager from '@mythor/game/lib/managers/SceneManager'
import now from '@mythor/core/lib/util/now'
import {
  Entity,
  LoadingStateManager,
  Manager,
  System,
  Transform,
} from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { Scene } from '@mythor/game'
import { Renderable, Renderer, Sprite, TextureManager } from '@mythor/renderer'
import cat from '../../assets/cat'
import { Vec2 } from '@mythor/math'

class Click extends Manager {
  public constructor() {
    super('Test')
  }

  public update(): void {
    if (!this.ecs.managers.has(EventsManager)) {
      return
    }

    const events = this.ecs.manager(EventsManager)

    if (events.mousePressed(MouseButton.Right)) {
      SceneManager.getInstance().pushOne(createSecondScene()).swap()
    }
  }
}

class Rotate extends System {
  public constructor() {
    super('Rotate', [Transform])
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const transform = entity.get(Transform)
    transform.rotation += elapsedTimeInSeconds
  }
}

class FakeLoadingManager extends Manager {
  private readonly timeToWait: number = 1
  public constructor() {
    super('FakeLoadingManager')
  }

  public async init(): Promise<void> {
    const startedTime = now()
    const state = this.ecs.manager(LoadingStateManager).createState({
      detail: 'fakeLoadingManager',
      name: 'FakeLoadingManager',
      total: this.timeToWait,
    })

    await new Promise<void>((resolve) => {
      const timerId = setInterval(() => {
        const time = (now() - startedTime) * 0.001
        state.current = Math.min(time, this.timeToWait)
        state.detail = `FakeLoadingManager ${(
          (100 * state.current) /
          state.total
        ).toFixed(0)}%`

        if (time >= this.timeToWait) {
          clearInterval(timerId)
          resolve()
        }
      }, 0)
    })
  }
}

function createMainScene(): Scene {
  return new Scene('Mainscene', {
    managers: [
      new EventsManager(),
      new Click(),
      new LoadingStateManager(),
      new FakeLoadingManager(),
      new TextureManager([['f', cat]]),
    ],
    onInit: async (ecs) => {
      ecs.create().add(
        new Renderable(),
        new Sprite(ecs.manager(TextureManager).get('f')),
        new Transform({
          position: new Vec2(300, 0),
        })
      )
    },
    systems: [new Rotate(), new Renderer()],
  })
}
export default createMainScene

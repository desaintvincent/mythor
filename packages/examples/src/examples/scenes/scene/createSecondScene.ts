import { Manager, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import SceneManager from '@mythor/game/lib/managers/SceneManager'
import { Scene } from '@mythor/game'
import { Renderable, Renderer, RenderedText } from '@mythor/renderer'

class Click extends Manager {
  public constructor() {
    super('Click')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)

    if (events.mousePressed(MouseButton.Right)) {
      SceneManager.getInstance().next()
    }
  }
}

function createSecondScene(): Scene {
  return new Scene('SecondScene', {
    managers: [new EventsManager(), new Click()],
    onInit: async (ecs) => {
      ecs.create().add(
        new Renderable(),
        new RenderedText('Second Scene', {
          color: [0, 1, 0, 1],
        }),
        new Transform()
      )
    },
    systems: [new Renderer()],
  })
}

export default createSecondScene

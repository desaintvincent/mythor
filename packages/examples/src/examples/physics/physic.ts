import { Manager, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import {
  colorGreen,
  colorRed,
  FillRect,
  Renderable,
  Renderer,
} from '@mythor/renderer'
import { Physic, PhysicSystem, PhysicType } from '@mythor/physic2d'
import { Vec2 } from '@mythor/math'
import { createGame } from '@mythor/game'
import showDescription from '../../util/showDescription'

showDescription('2D physics simulation using planck-js.', [
  'Left click: spawn a falling box',
])

const groundSize = new Vec2(600, 40)
const groundPosition = new Vec2(0, 150)
const boxSize = new Vec2(40, 40)

function createBox(position: Vec2): [Transform, FillRect, Renderable, Physic] {
  return [
    new Transform({ position, size: boxSize }),
    new FillRect({ color: colorRed }),
    new Renderable(),
    new Physic({ type: PhysicType.DYNAMIC, restitution: 0.3 }),
  ]
}

class SpawnBox extends Manager {
  public constructor() {
    super('SpawnBox')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)
    if (!events.mousePressed(MouseButton.Left)) {
      return
    }

    this.ecs.create().add(...createBox(events.mousePosition()))
  }
}

createGame({
  managers: [new SpawnBox()],
  onInit: async (ecs) => {
    ecs
      .create()
      .add(
        new Transform({ position: groundPosition, size: groundSize }),
        new FillRect({ color: colorGreen }),
        new Renderable(),
        new Physic({ type: PhysicType.STATIC })
      )

    // spawn a stack of falling boxes so the scene is alive as soon as it loads
    for (let i = 0; i < 5; i += 1) {
      ecs
        .create()
        .add(
          ...createBox(
            new Vec2(
              groundPosition.x - 100 + i * 40,
              groundPosition.y - groundSize.y / 2 - 150 - i * 50
            )
          )
        )
    }
  },
  systems: [new PhysicSystem(), new Renderer()],
})

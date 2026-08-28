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

// Port of the planck.js "Boxes" testbed example
// (https://piqnt.com/planck.js/Boxes): a 5x5 grid of boxes falls onto a
// static bar. Note: unlike the original example, we don't call
// body.setMassData({ mass: 1, center: Vec2(), I: 1 }) on the boxes. Planck
// already computes a physically correct mass and rotational inertia from
// each box's own geometry and density (see Physic's `density` option), so
// forcing an arbitrary inertia unrelated to box size is what causes
// unstable stacks (jitter, sliding, interpenetration).
showDescription('Port of the planck.js "Boxes" testbed example.', [
  'Left click: spawn a falling box',
])

const barSize = new Vec2(600, 20)
const barPosition = new Vec2(0, 200)
const boxSize = new Vec2(60, 60)
const gridSize = 5

function createBox(position: Vec2): [Transform, FillRect, Renderable, Physic] {
  return [
    new Transform({ position, size: boxSize }),
    new FillRect({ color: colorRed }),
    new Renderable(),
    new Physic({ type: PhysicType.DYNAMIC }),
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
        new Transform({ position: barPosition, size: barSize }),
        new FillRect({ color: colorGreen }),
        new Renderable(),
        new Physic({ type: PhysicType.STATIC })
      )

    const gridTop = barPosition.y - barSize.y / 2 - boxSize.y * gridSize - 100
    const gridLeft = -((gridSize - 1) * boxSize.x) / 2

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        ecs
          .create()
          .add(
            ...createBox(
              new Vec2(gridLeft + col * boxSize.x, gridTop + row * boxSize.y)
            )
          )
      }
    }
  },
  systems: [new PhysicSystem(), new Renderer()],
})

import { Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import {
  colorGreen,
  colorRed,
  FillRect,
  Renderable,
  Renderer,
} from '@mythor/renderer'
import {
  ColliderCallback,
  Physic,
  PhysicSystem,
  PhysicType,
} from '@mythor/physic2d'
import { createGame } from '@mythor/game'
import showDescription from '../../util/showDescription'

showDescription('A box turns green on the first physics contact.', [])

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  onInit: async (ecs) => {
    ecs.create().add(
      new Transform({
        position: Vec2.create(0, 150),
        size: Vec2.create(600, 40),
      }),
      new FillRect({ color: colorGreen }),
      new Renderable(),
      new Physic({ type: PhysicType.STATIC })
    )

    ecs.create().add(
      new Transform({
        position: Vec2.create(0, 0),
        size: Vec2.create(40, 40),
      }),
      new FillRect({ color: colorRed }),
      new Renderable(),
      new Physic({ type: PhysicType.DYNAMIC, restitution: 0.3 }),
      new ColliderCallback({
        callback: (entity) => {
          entity.get(FillRect).color = colorGreen
        },
      })
    )
  },
  systems: [new PhysicSystem(), new Renderer()],
})

import {
  Camera,
  FillRect,
  Renderable,
  Renderer,
  TextureManager,
} from '@mythor/renderer'
import { createGame } from '@mythor/game'
import { generateEntitiesFromTiled } from '@mythor/tiled'
import training from '../maps/training.json'
import castle from '../assets/sheet.png'
import { Physic, PhysicSystem, PhysicType } from '@mythor/physic2d'
import { Vec2 } from '@mythor/math'
import PlatformerControllerSystem from './system/PlatformerControllerSystem'
import PlatformerMovements from './components/PlatformerMovements'
import PlatformerMovementsSystem from './system/PlatformerMovementsSystem'
import EventControls from './components/EventControls'
import { Transform } from '@mythor/core'
import MovementStats from './components/MovementStats'

const camera = new Camera(Vec2.create(1920, 1080))

createGame({
  camera,
  managers: [new TextureManager([['castle', castle]])],
  onInit: async (ecs) => {
    await generateEntitiesFromTiled(ecs, training)

    const player = ecs.create().add(
      new Renderable(),
      new FillRect(),
      new Transform({
        position: new Vec2(500, 400),
        size: new Vec2(45, 70),
      }),
      new Physic({
        friction: 0,
        bullet: true,
      }),
      new PlatformerMovements(),
      new EventControls(),
      new MovementStats()
    )

    ecs
      .system(Renderer)
      .getCamera()
      .setTargetFunction((target) => new Vec2(target.x, target.y))
      .targetEntity(player)
  },
  systems: [
    new PlatformerControllerSystem(),
    new PlatformerMovementsSystem(),
    new PhysicSystem(),
    new Renderer({ camera }),
  ],
})

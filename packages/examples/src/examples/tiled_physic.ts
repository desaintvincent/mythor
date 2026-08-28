import { Manager, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { createGame } from '@mythor/game'
import { generateEntitiesFromTiled } from '@mythor/tiled'
import {
  FillRect,
  Renderable,
  Renderer,
  TextureManager,
} from '@mythor/renderer'
import { Physic, PhysicSystem, PhysicType } from '@mythor/physic2d'
import { Vec2 } from '@mythor/math'
import training from '../maps/training.json'
import castle from '../assets/sheet.png'
import showDescription from '../util/showDescription'

showDescription('A Tiled map with a falling box spawned by left click.', [
  'Left click: spawn a box',
])

const boxSize = new Vec2(40, 40)

function createBox(position: Vec2): [Transform, FillRect, Renderable, Physic] {
  return [
    new Transform({ position, size: boxSize }),
    new FillRect({ color: [1, 0, 0, 1] }),
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
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new TextureManager([['castle', castle]]), new SpawnBox()],
  onInit: async (ecs) => {
    await generateEntitiesFromTiled(ecs, training)
  },
  systems: [new PhysicSystem(), new Renderer()],
})

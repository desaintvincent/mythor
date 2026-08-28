import { Transform } from '@mythor/core'
import { createGame } from '@mythor/game'
import PhysicDebugManager from '@mythor/game/lib/managers/PhysicDebugManager'
import RendererDebugManager from '@mythor/game/lib/managers/RendererDebugManager'
import SelectDebugManager from '@mythor/game/lib/managers/SelectDebugManager'
import StatisticsManager from '@mythor/game/lib/managers/StatisticsManager'
import { Vec2 } from '@mythor/math'
import { FillRect, Renderable, Renderer, colorGreen } from '@mythor/renderer'
import { Physic, PhysicSystem, PhysicType } from '@mythor/physic2d'
import showDescription from '../util/showDescription'

showDescription('Debug overlays for physics, renderer, selection, and stats.', [
  'F3: stats',
  'F4: physics debug',
  'F5: renderer debug',
  'F6: selection debug',
  'Left click: select',
  'Right click: clear selection',
])

const info = document.createElement('p')
info.innerText = 'Use F3, F4, F5, and F6 to toggle debug overlays.'
document.getElementById('canvas')?.before(info)

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [
    new PhysicDebugManager(),
    new RendererDebugManager(),
    new SelectDebugManager(),
    new StatisticsManager(),
  ],
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

    for (let i = 0; i < 3; i += 1) {
      ecs.create().add(
        new Transform({
          position: Vec2.create(-40 + i * 45, -50 - i * 45),
          size: Vec2.create(40, 40),
        }),
        new FillRect({ color: [1, 0, 0, 1] }),
        new Renderable(),
        new Physic({ type: PhysicType.DYNAMIC, restitution: 0.2 })
      )
    }
  },
  systems: [new PhysicSystem(), new Renderer()],
})

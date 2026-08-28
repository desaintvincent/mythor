import { Transform } from '@mythor/core'
import { Renderable, Renderer, RenderedText } from '@mythor/renderer'
import { createGame } from '@mythor/game'
import showDescription from '../../util/showDescription'

showDescription('Text rendering with the default generated font.', [])

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  onInit: async (ecs) => {
    ecs.create().add(
      new Renderable(),
      new RenderedText('Hello Mythor', {
        color: [1, 1, 1, 1],
      }),
      new Transform()
    )
  },
  systems: [new Renderer()],
})

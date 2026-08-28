import { Renderer, TextureManager } from '@mythor/renderer'
import { createGame } from '@mythor/game'
import { generateEntitiesFromTiled } from '@mythor/tiled'
import training from '../../maps/training.json'
import castle from '../../assets/sheet.png'
import { PhysicSystem } from '@mythor/physic2d'
import showDescription from '../../util/showDescription'

showDescription(
  'A map loaded from Tiled, with physics colliders generated from its tiles.',
  []
)

createGame({
  managers: [new TextureManager([['castle', castle]])],
  onInit: async (ecs) => {
    await generateEntitiesFromTiled(ecs, training)
  },
  systems: [new PhysicSystem(), new Renderer()],
})

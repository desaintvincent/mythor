import { Renderer, TextureManager } from '@mythor/renderer'
import { createGame } from '@mythor/game'
import { generateEntitiesFromTiled } from '@mythor/tiled'
import training from '../maps/training.json'
import castel from '../assets/sheet.png'
import { PhysicSystem } from '@mythor/physic2d'

createGame({
  managers: [new TextureManager([['castel', castel]])],
  onInit: async (ecs) => {
    await generateEntitiesFromTiled(ecs, training, {
      aggreateColliders: false,
    })
  },
  systems: [new PhysicSystem(), new Renderer()],
})

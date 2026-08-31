import { Transform3D } from '@mythor/core'
import { Vec3 } from '@mythor/math'
import {
  Camera3D,
  Renderable3D,
  Renderer3D,
  RotatingSystem,
} from '@mythor/renderer3d'
import { Game, Scene } from '@mythor/game'
import showDescription from '../../util/showDescription'

showDescription('A rotating 3D triangle rendered with depth testing.', [])

const camera = new Camera3D({ position: new Vec3(0, 0, 3) })
const renderer = new Renderer3D({ camera })
const rotating = new RotatingSystem()

const scene = new Scene('render3d-basic', {
  systems: [renderer, rotating],
  onLoaded: async (ecs) => {
    ecs
      .create()
      .add(new Transform3D(), new Renderable3D({ color: [0.2, 0.7, 1] }))
  },
})

new Game(scene).start()

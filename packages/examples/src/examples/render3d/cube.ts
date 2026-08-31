import { Entity, System, Transform3D } from '@mythor/core'
import { Quaternion, Vec3 } from '@mythor/math'
import {
  Camera3D,
  CameraMovementManager3D,
  createCube,
  Renderable3D,
  Renderer3D,
} from '@mythor/renderer3d'
import { EventsManager } from '@mythor/events'
import { Game, Scene } from '@mythor/game'
import showDescription from '../../util/showDescription'
import StatisticsManager from '@mythor/game/lib/managers/StatisticsManager'

// A tiny example-only system spinning the entity. Rotation over time is not
// the renderer's responsibility, so it does not belong in @mythor/renderer3d
// (that will be a future @mythor/physic3d concern).
class RotatingSystem extends System {
  public constructor() {
    super('RotatingSystem', [Transform3D])
  }

  protected onEntityUpdate(
    entity: Entity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    entity.get(Transform3D).rotation = Quaternion.fromEuler(
      totalTimeInSeconds * 0.6,
      totalTimeInSeconds,
      0
    )
  }
}

showDescription(
  'A 3D cube with a distinct color per face, so edges are easy to see.',
  [
    'W/A/S/D: move the camera',
    'Q/E: move the camera down/up',
    'Right click + drag: look around',
  ]
)

// prettier-ignore
const faceColors: [number, number, number][] = [
  [0.9, 0.2, 0.2], // front
  [0.7, 0.1, 0.1], // back
  [0.2, 0.7, 0.2], // left
  [0.1, 0.5, 0.1], // right
  [0.2, 0.4, 0.9], // top
  [0.1, 0.3, 0.7], // bottom
]
const cube = createCube(faceColors)

const camera = new Camera3D({ position: new Vec3(0, 0, 3) })
const renderer = new Renderer3D({ camera })

const scene = new Scene('render3d-cube', {
  managers: [
    new EventsManager(),
    new CameraMovementManager3D(),
    new StatisticsManager(),
  ],
  systems: [renderer, new RotatingSystem()],
  onLoaded: async (ecs) => {
    ecs
      .create()
      .add(
        new Transform3D(),
        new Renderable3D({ vertices: cube.vertices, colors: cube.colors })
      )
  },
})

new Game(scene).start()

import { Entity, System, Transform3D } from '@mythor/core'
import { Quaternion, Vec3 } from '@mythor/math'
import {
  Camera3D,
  CameraMovementManager3D,
  Renderable3D,
  Renderer3D,
} from '@mythor/renderer3d'
import { EventsManager } from '@mythor/events'
import { Game, Scene } from '@mythor/game'
import showDescription from '../../util/showDescription'

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

showDescription('A 3D cube rendered with depth testing.', [
  'W/A/S/D: move the camera',
  'Q/E: move the camera down/up',
  'Right click + drag: look around',
])

// prettier-ignore
const cubeVertices = new Float32Array([
  // front
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  // back
  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
  // left
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  // right
  0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
  0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
  // top
  -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  // bottom
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
])

const camera = new Camera3D({ position: new Vec3(0, 0, 3) })
const renderer = new Renderer3D({ camera })

const scene = new Scene('render3d-cube', {
  managers: [new EventsManager(), new CameraMovementManager3D()],
  systems: [renderer, new RotatingSystem()],
  onLoaded: async (ecs) => {
    ecs
      .create()
      .add(
        new Transform3D(),
        new Renderable3D({ vertices: cubeVertices, color: [1, 0.5, 0.2] })
      )
  },
})

new Game(scene).start()

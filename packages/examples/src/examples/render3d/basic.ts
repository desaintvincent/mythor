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
      0,
      totalTimeInSeconds,
      0
    )
  }
}

showDescription('A rotating 3D triangle rendered with depth testing.', [
  'W/A/S/D: move the camera',
  'Q/E: move the camera down/up',
  'Right click + drag: look around',
])

const camera = new Camera3D({ position: new Vec3(0, 0, 3) })
const renderer = new Renderer3D({ camera })

// Classic WebGL demo: one distinct color per corner, interpolated by the GPU.
// prettier-ignore
const rainbowTriangleColors = new Float32Array([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
])

const scene = new Scene('render3d-basic', {
  managers: [new EventsManager(), new CameraMovementManager3D()],
  systems: [renderer, new RotatingSystem()],
  onLoaded: async (ecs) => {
    ecs
      .create()
      .add(
        new Transform3D(),
        new Renderable3D({ colors: rainbowTriangleColors })
      )
  },
})

new Game(scene).start()

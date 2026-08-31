import { Manager } from '@mythor/core'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import { Vec3 } from '@mythor/math'
import Renderer3D from '../systems/Renderer3D'

const moveSpeed = 3
const lookSensitivity = 0.005
const maxPitch = (Math.PI / 2) * 0.99

export default class CameraMovementManager3D extends Manager {
  private yaw = -Math.PI / 2
  private pitch = 0

  public constructor() {
    super('CameraMovementManager3D')
  }

  public update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ecs: unknown,
    elapsedTimeInSeconds: number
  ): void {
    if (
      !this.ecs.managers.has(EventsManager) ||
      !this.ecs.systems.has(Renderer3D)
    ) {
      return
    }

    const events = this.ecs.manager(EventsManager)
    const camera = this.ecs.system(Renderer3D).camera

    if (events.isDragging(MouseButton.Right)) {
      const delta = events.dragDelta()

      this.yaw += delta.x * lookSensitivity
      this.pitch = Math.max(
        -maxPitch,
        Math.min(maxPitch, this.pitch - delta.y * lookSensitivity)
      )
    }

    const forward = new Vec3(
      Math.cos(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.sin(this.yaw) * Math.cos(this.pitch)
    ).normalize()
    const right = forward.cross(camera.up).normalize()

    let movement = Vec3.zero()

    if (events.keyIsDown(Key.w)) {
      movement = movement.add(forward.times(moveSpeed * elapsedTimeInSeconds))
    }
    if (events.keyIsDown(Key.s)) {
      movement = movement.sub(forward.times(moveSpeed * elapsedTimeInSeconds))
    }
    if (events.keyIsDown(Key.d)) {
      movement = movement.add(right.times(moveSpeed * elapsedTimeInSeconds))
    }
    if (events.keyIsDown(Key.a)) {
      movement = movement.sub(right.times(moveSpeed * elapsedTimeInSeconds))
    }
    if (events.keyIsDown(Key.e)) {
      movement = movement.add(camera.up.times(moveSpeed * elapsedTimeInSeconds))
    }
    if (events.keyIsDown(Key.q)) {
      movement = movement.sub(camera.up.times(moveSpeed * elapsedTimeInSeconds))
    }

    camera.position = camera.position.add(movement)
    camera.target = camera.position.add(forward)
  }
}

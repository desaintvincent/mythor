import { Entity, System, Transform3D } from '@mythor/core'
import { Quaternion } from '@mythor/math'

export default class RotatingSystem extends System {
  public constructor() {
    super('RotatingSystem', [Transform3D])
  }

  protected onEntityUpdate(
    entity: Entity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const transform = entity.get(Transform3D)

    transform.rotation = Quaternion.fromEuler(0, totalTimeInSeconds, 0)
  }
}

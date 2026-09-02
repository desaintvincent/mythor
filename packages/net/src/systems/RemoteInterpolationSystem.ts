import { Entity, System, Transform } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import NetworkManager from '../managers/NetworkManager'
import RemoteNetworked from '../components/RemoteNetworked'

/**
 * For entities controlled elsewhere (`RemoteNetworked`): blends
 * `Transform` between the last two received snapshots using a fixed
 * render delay, no prediction/extrapolation. If no newer snapshot has
 * arrived, holds the last known value (accepted graceful degradation).
 */
class RemoteInterpolationSystem extends System {
  private networkManager!: NetworkManager

  public constructor() {
    super('RemoteInterpolationSystem', [RemoteNetworked, Transform])
  }

  protected async onSystemInit(ecs: IEcs): Promise<void> {
    this.networkManager = ecs.manager(NetworkManager)
    this.networkManager.onSnapshot((message) => {
      message.entities.forEach((snapshotEntity) => {
        if (snapshotEntity.ackSeq !== undefined) {
          return
        }

        const entity = ecs.entity(snapshotEntity.id)

        if (!entity || !entity.has(RemoteNetworked)) {
          return
        }

        entity.get(RemoteNetworked).pushSample({
          t: Date.now() / 1000,
          position: new Vec2(
            snapshotEntity.transform.position[0],
            snapshotEntity.transform.position[1]
          ),
          rotation: snapshotEntity.transform.rotation,
        })
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEntityUpdate(entity: Entity): void {
    const remote = entity.get(RemoteNetworked)

    if (remote.sampleCount < 2) {
      return
    }

    const from = remote.sampleAt(0)
    const to = remote.sampleAt(1)

    if (!from || !to) {
      return
    }

    const transform = entity.get(Transform)
    const renderTime = Date.now() / 1000 - remote.interpolationDelay
    const span = to.t - from.t
    const alpha = span > 0 ? clamp((renderTime - from.t) / span, 0, 1) : 1

    transform.position.vSet(
      from.position.add(to.position.sub(from.position).times(alpha))
    )
    transform.rotation = from.rotation + (to.rotation - from.rotation) * alpha
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export default RemoteInterpolationSystem

import { Entity, System, getConstructor } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import NetworkManager from '../managers/NetworkManager'
import RemoteNetworked from '../components/RemoteNetworked'
import { isNetworkInterpolatable, isNetworkSync } from '../sync/NetworkSync'

/**
 * For entities controlled elsewhere (`RemoteNetworked`): for each
 * attached component implementing `NetworkSync`, blends between the last
 * two received samples if it also implements `NetworkInterpolatable`
 * (e.g. `Transform`), or snaps to the latest sample otherwise (no lerp
 * assumption forced on arbitrary data). Uses a fixed render delay, no
 * prediction/extrapolation. If no newer snapshot has arrived, holds the
 * last known value (accepted graceful degradation).
 */
class RemoteInterpolationSystem extends System {
  private networkManager!: NetworkManager

  public constructor() {
    super('RemoteInterpolationSystem', [RemoteNetworked])
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

        const remote = entity.get(RemoteNetworked)

        entity.components.forEach((component) => {
          if (!isNetworkSync(component)) {
            return
          }

          const data = snapshotEntity.components[component.constructor.name]

          if (data === undefined) {
            return
          }

          remote.pushSample(getConstructor(component), {
            t: Date.now() / 1000,
            data,
          })
        })
      })
    })
  }

  protected onEntityUpdate(entity: Entity): void {
    const remote = entity.get(RemoteNetworked)
    const renderTime = Date.now() / 1000 - remote.interpolationDelay

    entity.components.forEach((component) => {
      if (!isNetworkSync(component)) {
        return
      }

      const constructor = getConstructor(component)

      if (remote.sampleCount(constructor) < 2) {
        return
      }

      const from = remote.sampleAt(constructor, 0)
      const to = remote.sampleAt(constructor, 1)

      if (!from || !to) {
        return
      }

      if (!isNetworkInterpolatable(component)) {
        component.deserialize(to.data)

        return
      }

      const span = to.t - from.t
      const alpha = span > 0 ? clamp((renderTime - from.t) / span, 0, 1) : 1

      component.deserialize(component.interpolate(from.data, to.data, alpha))
    })
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export default RemoteInterpolationSystem

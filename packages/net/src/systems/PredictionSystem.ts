import { Entity, System } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import NetworkManager from '../managers/NetworkManager'
import OwnedNetworked from '../components/OwnedNetworked'
import { isNetworkSync } from '../sync/NetworkSync'

/**
 * For entities this client controls (`OwnedNetworked`): predicts input
 * locally every frame, and reconciles against the server's authoritative
 * state whenever a snapshot acknowledges a processed input sequence, by
 * restoring every networked component from the authoritative payload and
 * replaying every input the server hasn't acknowledged yet (always
 * trust-and-replay, no misprediction-diff bookkeeping). Generic over any
 * component implementing `NetworkSync` — never touches a hardcoded type.
 */
class PredictionSystem extends System {
  private networkManager!: NetworkManager

  public constructor() {
    super('PredictionSystem', [OwnedNetworked], {
      managers: [NetworkManager],
    })
  }

  protected async onSystemInit(ecs: IEcs): Promise<void> {
    this.networkManager = ecs.manager(NetworkManager)
    this.networkManager.onSnapshot((message) => {
      message.entities.forEach((snapshotEntity) => {
        if (snapshotEntity.ackSeq === undefined) {
          return
        }

        const entity = ecs.entity(snapshotEntity.id)

        if (!entity || !entity.has(OwnedNetworked)) {
          return
        }

        this.reconcile(entity, snapshotEntity.ackSeq, snapshotEntity.components)
      })
    })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const owned = entity.get(OwnedNetworked)
    const input = owned.getInput()
    const seq = owned.nextSeq()

    owned.applyInput(entity, input, elapsedTimeInSeconds)
    owned.pushPending(seq, input, elapsedTimeInSeconds)
    this.networkManager.sendInput(entity._id, seq, input)
  }

  private reconcile(
    entity: Entity,
    ackSeq: number,
    components: Record<string, unknown>
  ): void {
    const owned = entity.get(OwnedNetworked)

    owned.discardAcked(ackSeq)

    entity.components.forEach((component) => {
      if (!isNetworkSync(component)) {
        return
      }

      const data = components[component.constructor.name]

      if (data === undefined) {
        return
      }

      component.deserialize(data)
    })

    owned.pendingInputs.forEach(({ input, dt }) => {
      owned.applyInput(entity, input, dt)
    })
  }
}

export default PredictionSystem

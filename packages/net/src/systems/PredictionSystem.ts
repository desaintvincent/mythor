import { Entity, System, Transform } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import NetworkManager from '../managers/NetworkManager'
import OwnedNetworked from '../components/OwnedNetworked'

/**
 * For entities this client controls (`OwnedNetworked`): predicts input
 * locally every frame, and reconciles against the server's authoritative
 * state whenever a snapshot acknowledges a processed input sequence, by
 * snapping to the authoritative state and replaying every input the
 * server hasn't acknowledged yet (always trust-and-replay, no
 * misprediction-diff bookkeeping).
 */
class PredictionSystem extends System {
  private networkManager!: NetworkManager

  public constructor() {
    super('PredictionSystem', [OwnedNetworked, Transform], {
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

        if (!entity || !entity.has(OwnedNetworked) || !entity.has(Transform)) {
          return
        }

        this.reconcile(
          entity,
          snapshotEntity.ackSeq,
          snapshotEntity.transform.position,
          snapshotEntity.transform.rotation
        )
      })
    })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const owned = entity.get(OwnedNetworked)
    const transform = entity.get(Transform)
    const input = owned.getInput()
    const seq = owned.nextSeq()

    owned.applyInput(transform, input, elapsedTimeInSeconds)
    owned.pushPending(seq, input, elapsedTimeInSeconds)
    this.networkManager.sendInput(entity._id, seq, input)
  }

  // Note: mutates `transform.position` in place via `vSet`, which only
  // reaches the real underlying position when the entity has no parent
  // `Transform` (otherwise `Transform.position` returns a computed copy).
  // Networked entities are expected to be top-level for this reason.
  private reconcile(
    entity: Entity,
    ackSeq: number,
    position: [number, number],
    rotation: number
  ): void {
    const owned = entity.get(OwnedNetworked)
    const transform = entity.get(Transform)

    owned.discardAcked(ackSeq)
    transform.position.vSet(new Vec2(position[0], position[1]))
    transform.rotation = rotation

    owned.pendingInputs.forEach(({ input, dt }) => {
      owned.applyInput(transform, input, dt)
    })
  }
}

export default PredictionSystem

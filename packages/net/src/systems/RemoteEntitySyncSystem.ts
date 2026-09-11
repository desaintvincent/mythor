import { Component, Entity, System } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import NetworkManager from '../managers/NetworkManager'
import Networked from '../components/Networked'
import RemoteNetworked, {
  RemoteNetworkedOptions,
} from '../components/RemoteNetworked'

/**
 * Auto spawn/despawn of remote entities: for every entity id seen in a
 * snapshot without an `ackSeq` (i.e. not this client's own entity) that
 * doesn't exist locally yet, creates it with a `Networked` +
 * `RemoteNetworked` marker plus a fresh instance of every registered
 * component present in the payload (via `NetworkManager.registerComponent`
 * factories). Destroys any previously-spawned remote entity no longer
 * present in the latest snapshot. This is the "no per-game diffing code
 * needed" guarantee: a game only registers its components, it never has
 * to hand-write spawn/despawn logic itself.
 */
class RemoteEntitySyncSystem extends System {
  private networkManager!: NetworkManager
  private readonly remoteEntityIds = new Set<string>()

  public constructor(private readonly options?: RemoteNetworkedOptions) {
    super('RemoteEntitySyncSystem', [Networked], {
      managers: [NetworkManager],
    })
  }

  protected async onSystemInit(ecs: IEcs): Promise<void> {
    this.networkManager = ecs.manager(NetworkManager)
    this.networkManager.onSnapshot((message) => {
      const seenThisFrame = new Set<string>()

      message.entities.forEach((snapshotEntity) => {
        if (snapshotEntity.ackSeq !== undefined) {
          return
        }

        seenThisFrame.add(snapshotEntity.id)

        if (this.remoteEntityIds.has(snapshotEntity.id)) {
          return
        }

        this.remoteEntityIds.add(snapshotEntity.id)
        this.spawn(ecs, snapshotEntity.id, snapshotEntity.components)
      })

      this.remoteEntityIds.forEach((id) => {
        if (seenThisFrame.has(id)) {
          return
        }

        this.remoteEntityIds.delete(id)
        ecs.entity(id)?.destroy()
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEntityUpdate(entity: Entity): void {
    // No per-frame behaviour: spawn/despawn happens on snapshot receipt.
  }

  private spawn(
    ecs: IEcs,
    id: string,
    components: Record<string, unknown>
  ): void {
    const entity = ecs.create(id)
    const instances = Object.keys(components)
      .map((name) => this.networkManager.createRegisteredComponent(name))
      .filter((component): component is Component => component !== undefined)

    // A single `add()` call so every system watching this entity only
    // sees one entity-creation event, with every component already
    // present (`EntityCollection.addEntity` has no dedup guard: calling
    // `add()` more than once would fire `onEntityCreation` again for any
    // system whose filter already matched after the first call).
    entity.add(new Networked(), new RemoteNetworked(this.options), ...instances)
  }
}

export default RemoteEntitySyncSystem

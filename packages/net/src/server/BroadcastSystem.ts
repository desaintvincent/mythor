import { System, getConstructor } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import ServerNetworkManager from './ServerNetworkManager'
import Networked from '../components/Networked'
import { isNetworkSync } from '../sync/NetworkSync'
import { SnapshotEntity } from '../messages'

interface EntitySnapshotData {
  id: string
  components: Record<string, unknown>
  ownerConnectionId?: string
}

/**
 * Generic replication: for every entity marked `Networked`, serializes
 * every attached component implementing `NetworkSync` and sends a
 * per-recipient snapshot to every connected client — only the owning
 * connection's own entity carries `ackSeq` (via
 * `ServerNetworkManager.lastProcessedSeqFor`), so it reconciles locally
 * while everyone else sees it as a remote/interpolated entity. Never
 * hardcodes a component type: a game registers no components on the
 * server, it only needs its own components to implement `NetworkSync`.
 */
class BroadcastSystem extends System {
  private serverNetworkManager!: ServerNetworkManager

  public constructor() {
    super('BroadcastSystem', [Networked], {
      managers: [ServerNetworkManager],
    })
  }

  protected async onSystemInit(ecs: IEcs): Promise<void> {
    this.serverNetworkManager = ecs.manager(ServerNetworkManager)
  }

  public update(): void {
    const entitiesData: EntitySnapshotData[] = []

    this.entities.forEach((entity) => {
      const components: Record<string, unknown> = {}

      entity.components.forEach((component) => {
        if (!isNetworkSync(component)) {
          return
        }

        components[getConstructor(component).name] = component.serialize()
      })

      if (Object.keys(components).length === 0) {
        return
      }

      entitiesData.push({
        id: entity._id,
        components,
        ownerConnectionId: entity.get(Networked).ownerConnectionId,
      })
    })

    this.serverNetworkManager.connections.forEach((connection) => {
      const entities: SnapshotEntity[] = entitiesData.map((data) => ({
        id: data.id,
        components: data.components,
        ackSeq:
          data.ownerConnectionId === connection.id
            ? this.serverNetworkManager.lastProcessedSeqFor(data.id)
            : undefined,
      }))

      this.serverNetworkManager.sendSnapshot(connection.id, {
        v: 1,
        type: 'snapshot',
        entities,
      })
    })
  }
}

export default BroadcastSystem

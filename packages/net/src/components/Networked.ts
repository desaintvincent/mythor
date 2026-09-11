import { Component } from '@mythor/core'

interface NetworkedOptions {
  /**
   * Server-side only: the id of the connection that owns this entity
   * (e.g. a player's avatar). Used by `BroadcastSystem` to decide which
   * recipient gets `ackSeq` set for this entity. Undefined for entities
   * with no single owner (NPCs, server-simulated objects).
   */
  ownerConnectionId?: string
}

/**
 * Marks an entity as replicated. On the client this is added by
 * `RemoteEntitySyncSystem` for auto-spawned remote entities (or by game
 * code for locally-owned entities, alongside `OwnedNetworked`). On the
 * server, game code adds it to any entity that should be broadcast by
 * `BroadcastSystem`.
 */
class Networked extends Component {
  public ownerConnectionId?: string

  public constructor(options?: NetworkedOptions) {
    super()
    this.ownerConnectionId = options?.ownerConnectionId
  }
}

export default Networked
export type { NetworkedOptions }

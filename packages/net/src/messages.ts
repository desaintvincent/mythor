/**
 * Wire message envelopes exchanged between `NetworkManager` and a server
 * process (dedicated or player-hosted, both are plain Node processes
 * running `@mythor/core` headless — this package ships no server code,
 * only the shared contract and the client-side plumbing around it).
 */

export interface SnapshotEntity {
  id: string
  /**
   * Serialized payload of every networked component attached to this
   * entity, keyed by component constructor name (same convention as
   * `@mythor/persistence`'s `SaveManager.registerComponent`).
   */
  components: Record<string, unknown>
  /**
   * Present only for entities owned by the client receiving this
   * snapshot: the highest input `seq` the server had processed for this
   * entity at the time the snapshot was produced, used for prediction
   * reconciliation. Absent for remote entities.
   */
  ackSeq?: number
}

export interface SnapshotMessage {
  v: 1
  type: 'snapshot'
  entities: SnapshotEntity[]
}

export interface InputMessage {
  v: 1
  type: 'input'
  entityId: string
  seq: number
  input: unknown
}

export interface AppMessage {
  v: 1
  type: 'message'
  payload: unknown
}

export type NetMessage = SnapshotMessage | InputMessage | AppMessage

export function isNetMessage(value: unknown): value is NetMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Partial<NetMessage>).v === 1 &&
    typeof (value as Partial<NetMessage>).type === 'string'
  )
}

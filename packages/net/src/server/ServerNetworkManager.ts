import { Manager } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import ServerTransport, { ServerSocket } from './ServerTransport'
import WsServerTransport from './WsServerTransport'
import {
  AppMessage,
  NetMessage,
  SnapshotMessage,
  isNetMessage,
} from '../messages'

export interface Connection {
  readonly id: string
}

interface ServerNetworkManagerOptions {
  port: number
  transport?: ServerTransport
}

type Unsubscribe = () => void

interface InboxEntry {
  connectionId: string
  raw: string
}

interface OutboxEntry {
  /** Undefined means broadcast to every open connection. */
  connectionId?: string
  message: NetMessage
}

/**
 * Server-side counterpart of `NetworkManager`: accepts WebSocket
 * connections (dedicated infra or a player-hosted "listen server", same
 * code either way), receives `InputMessage`s (tracking `lastProcessedSeq`
 * per entity for reconciliation acks), and exposes `broadcast`/`sendTo`
 * for generic non-entity events (e.g. "play a sound"). Entity
 * replication itself is `BroadcastSystem`'s job, built on top of this.
 * Like the client, inbound/outbound messages are only parsed/flushed
 * inside `update()`, never mid-frame from an async socket event.
 */
class ServerNetworkManager extends Manager {
  private readonly options: ServerNetworkManagerOptions
  private readonly transport: ServerTransport
  private nextConnectionId = 0
  private readonly sockets = new Map<string, ServerSocket>()
  private readonly inbox: InboxEntry[] = []
  private readonly outbox: OutboxEntry[] = []
  private readonly lastProcessedSeq = new Map<string, number>()
  private readonly connectHandlers = new Set<(connection: Connection) => void>()
  private readonly disconnectHandlers = new Set<
    (connection: Connection) => void
  >()
  private readonly inputHandlers = new Set<
    (
      connection: Connection,
      entityId: string,
      seq: number,
      input: unknown
    ) => void
  >()
  private readonly messageHandlers = new Set<
    (connection: Connection, payload: unknown) => void
  >()

  public constructor(options: ServerNetworkManagerOptions) {
    super('ServerNetworkManager')
    this.options = options
    this.transport = options.transport ?? new WsServerTransport()
  }

  public listen(): void {
    this.transport.listen(this.options.port, (socket) =>
      this.handleConnection(socket)
    )
  }

  public close(): void {
    this.sockets.forEach((socket) => socket.close())
    this.sockets.clear()
    this.transport.close()
  }

  public get connections(): Connection[] {
    return Array.from(this.sockets.keys()).map((id) => ({ id }))
  }

  /** Highest input `seq` processed so far for a given entity, or -1. */
  public lastProcessedSeqFor(entityId: string): number {
    return this.lastProcessedSeq.get(entityId) ?? -1
  }

  public broadcast(payload: unknown): void {
    this.outbox.push({ message: { v: 1, type: 'message', payload } })
  }

  public sendTo(connectionId: string, payload: unknown): void {
    const message: AppMessage = { v: 1, type: 'message', payload }
    this.outbox.push({ connectionId, message })
  }

  public sendSnapshot(connectionId: string, message: SnapshotMessage): void {
    this.outbox.push({ connectionId, message })
  }

  public onConnect(handler: (connection: Connection) => void): Unsubscribe {
    this.connectHandlers.add(handler)

    return () => this.connectHandlers.delete(handler)
  }

  public onDisconnect(handler: (connection: Connection) => void): Unsubscribe {
    this.disconnectHandlers.add(handler)

    return () => this.disconnectHandlers.delete(handler)
  }

  public onInput(
    handler: (
      connection: Connection,
      entityId: string,
      seq: number,
      input: unknown
    ) => void
  ): Unsubscribe {
    this.inputHandlers.add(handler)

    return () => this.inputHandlers.delete(handler)
  }

  public onMessage(
    handler: (connection: Connection, payload: unknown) => void
  ): Unsubscribe {
    this.messageHandlers.add(handler)

    return () => this.messageHandlers.delete(handler)
  }

  public update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ecs: IEcs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalTimeInSeconds: number
  ): void {
    this.flushInbox()
    this.flushOutbox()
  }

  public clear(): void {
    this.inbox.length = 0
    this.outbox.length = 0
  }

  private handleConnection(socket: ServerSocket): void {
    const id = `connection-${this.nextConnectionId}`
    this.nextConnectionId += 1
    this.sockets.set(id, socket)

    const connection: Connection = { id }

    this.connectHandlers.forEach((handler) => handler(connection))

    socket.onMessage((raw) => {
      this.inbox.push({ connectionId: id, raw })
    })

    socket.onClose(() => {
      this.sockets.delete(id)
      this.disconnectHandlers.forEach((handler) => handler(connection))
    })
  }

  private flushInbox(): void {
    while (this.inbox.length > 0) {
      const entry = this.inbox.shift()

      if (!entry) {
        continue
      }

      this.dispatch(entry.connectionId, this.parse(entry.raw))
    }
  }

  private parse(raw: string): NetMessage | undefined {
    let parsed: unknown

    try {
      parsed = JSON.parse(raw)
    } catch {
      return undefined
    }

    return isNetMessage(parsed) ? parsed : undefined
  }

  private dispatch(
    connectionId: string,
    message: NetMessage | undefined
  ): void {
    if (!message) {
      return
    }

    const connection: Connection = { id: connectionId }

    if (message.type === 'input') {
      this.lastProcessedSeq.set(message.entityId, message.seq)
      this.inputHandlers.forEach((handler) =>
        handler(connection, message.entityId, message.seq, message.input)
      )

      return
    }

    if (message.type === 'message') {
      this.messageHandlers.forEach((handler) =>
        handler(connection, message.payload)
      )
    }
  }

  private flushOutbox(): void {
    while (this.outbox.length > 0) {
      const entry = this.outbox.shift()

      if (!entry) {
        continue
      }

      const raw = JSON.stringify(entry.message)

      if (entry.connectionId === undefined) {
        this.sockets.forEach((socket) => socket.send(raw))

        continue
      }

      this.sockets.get(entry.connectionId)?.send(raw)
    }
  }
}

export default ServerNetworkManager
export type { ServerNetworkManagerOptions }

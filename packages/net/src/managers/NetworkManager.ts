import { Component, Constructor, Manager } from '@mythor/core'
import type { IEcs } from '@mythor/core'
import Transport from '../transport/Transport'
import WebSocketTransport from '../transport/WebSocketTransport'
import {
  AppMessage,
  InputMessage,
  NetMessage,
  SnapshotMessage,
  isNetMessage,
} from '../messages'

export type ConnectionState = 'idle' | 'connecting' | 'open' | 'closed'

interface NetworkManagerOptions {
  transport?: Transport
}

type Unsubscribe = () => void

/**
 * Owns the `Transport` to a server process (dedicated infra or a
 * player-hosted "listen server" — both are the same code path from this
 * package's point of view). Buffers inbound messages on the raw transport
 * callback and only parses/dispatches them inside `update()`, so ECS state
 * is never mutated mid-frame by an async socket event.
 */
class NetworkManager extends Manager {
  private readonly transport: Transport
  private _state: ConnectionState = 'idle'
  private readonly inbox: string[] = []
  private readonly outbox: NetMessage[] = []
  private readonly messageHandlers = new Set<(payload: unknown) => void>()
  private readonly snapshotHandlers = new Set<
    (message: SnapshotMessage) => void
  >()
  private readonly stateChangeHandlers = new Set<
    (state: ConnectionState) => void
  >()
  private readonly componentFactories = new Map<string, () => Component>()

  public constructor(options?: NetworkManagerOptions) {
    super('NetworkManager')
    this.transport = options?.transport ?? new WebSocketTransport()
  }

  /**
   * Registers a component type so newly-seen remote entities can be
   * spawned with a fresh instance of it (mirrors
   * `@mythor/persistence`'s `SaveManager.registerComponent`). Keyed by
   * `constructor.name`, matching the wire format's component keys.
   */
  public registerComponent<C extends Component>(
    constructor: Constructor<C>,
    factory: () => C
  ): void {
    this.componentFactories.set(constructor.name, factory)
  }

  public createRegisteredComponent(name: string): Component | undefined {
    return this.componentFactories.get(name)?.()
  }

  public get state(): ConnectionState {
    return this._state
  }

  public connect(url: string): void {
    this.setState('connecting')
    this.transport.onOpen(() => this.setState('open'))
    this.transport.onClose(() => this.setState('closed'))
    this.transport.onError(() => this.setState('closed'))
    this.transport.onMessage((data) => this.inbox.push(data))
    this.transport.connect(url)
  }

  public disconnect(): void {
    this.transport.close()
    this.setState('closed')
  }

  public send(payload: unknown): void {
    const message: AppMessage = { v: 1, type: 'message', payload }
    this.outbox.push(message)
  }

  public sendInput(entityId: string, seq: number, input: unknown): void {
    const message: InputMessage = { v: 1, type: 'input', entityId, seq, input }
    this.outbox.push(message)
  }

  public onMessage(handler: (payload: unknown) => void): Unsubscribe {
    this.messageHandlers.add(handler)

    return () => this.messageHandlers.delete(handler)
  }

  public onSnapshot(handler: (message: SnapshotMessage) => void): Unsubscribe {
    this.snapshotHandlers.add(handler)

    return () => this.snapshotHandlers.delete(handler)
  }

  public onStateChange(handler: (state: ConnectionState) => void): Unsubscribe {
    this.stateChangeHandlers.add(handler)

    return () => this.stateChangeHandlers.delete(handler)
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

  private setState(state: ConnectionState): void {
    this._state = state
    this.stateChangeHandlers.forEach((handler) => handler(state))
  }

  private flushInbox(): void {
    while (this.inbox.length > 0) {
      const raw = this.inbox.shift()

      if (raw === undefined) {
        continue
      }

      this.dispatch(this.parse(raw))
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

  private dispatch(message: NetMessage | undefined): void {
    if (!message) {
      return
    }

    if (message.type === 'snapshot') {
      this.snapshotHandlers.forEach((handler) => handler(message))

      return
    }

    if (message.type === 'message') {
      this.messageHandlers.forEach((handler) => handler(message.payload))
    }
  }

  private flushOutbox(): void {
    while (this.outbox.length > 0) {
      const message = this.outbox.shift()

      if (message === undefined) {
        continue
      }

      this.transport.send(JSON.stringify(message))
    }
  }
}

export default NetworkManager
export type { NetworkManagerOptions }

import ServerTransport, {
  ServerSocket,
} from '../../../src/server/ServerTransport'

/**
 * In-memory `ServerSocket`: no real network I/O. `sent` records every
 * payload the code under test has sent to this connection; `emit()`
 * simulates an inbound message; `disconnect()` simulates the peer
 * closing the connection.
 */
class FakeServerSocket implements ServerSocket {
  public sent: string[] = []
  private messageHandler: ((data: string) => void) | undefined
  private closeHandler: (() => void) | undefined

  public send(data: string): void {
    this.sent.push(data)
  }

  public close(): void {
    this.closeHandler?.()
  }

  public onMessage(callback: (data: string) => void): void {
    this.messageHandler = callback
  }

  public onClose(callback: () => void): void {
    this.closeHandler = callback
  }

  public emit(data: string): void {
    this.messageHandler?.(data)
  }

  public disconnect(): void {
    this.closeHandler?.()
  }
}

/**
 * In-memory `ServerTransport`: `connect()` lets a test simulate a new
 * peer connecting, wiring it through the same `onConnection` callback a
 * real `WsServerTransport` would use.
 */
class FakeServerTransport implements ServerTransport {
  private onConnectionCallback: ((socket: ServerSocket) => void) | undefined

  public listen(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    port: number,
    onConnection: (socket: ServerSocket) => void
  ): void {
    this.onConnectionCallback = onConnection
  }

  public close(): void {
    // no-op
  }

  public connect(): FakeServerSocket {
    const socket = new FakeServerSocket()
    this.onConnectionCallback?.(socket)

    return socket
  }
}

export default FakeServerTransport

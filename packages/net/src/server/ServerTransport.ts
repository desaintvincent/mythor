/**
 * Pluggable server transport abstraction used by `ServerNetworkManager`,
 * mirroring the client's `Transport` interface. Ships with
 * `WsServerTransport` as the default implementation, but any object
 * implementing this interface can be used instead (e.g. a fake
 * in-memory transport in tests).
 */
export interface ServerSocket {
  send(data: string): void
  close(): void
  onMessage(callback: (data: string) => void): void
  onClose(callback: () => void): void
}

export default interface ServerTransport {
  listen(port: number, onConnection: (socket: ServerSocket) => void): void
  close(): void
}

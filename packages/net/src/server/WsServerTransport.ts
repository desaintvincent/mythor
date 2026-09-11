import { WebSocket, WebSocketServer } from 'ws'
import ServerTransport, { ServerSocket } from './ServerTransport'

function toServerSocket(socket: WebSocket): ServerSocket {
  return {
    send: (data) => socket.send(data),
    close: () => socket.close(),
    onMessage: (callback) => {
      socket.on('message', (raw) => callback(raw.toString()))
    },
    onClose: (callback) => {
      socket.on('close', callback)
    },
  }
}

class WsServerTransport implements ServerTransport {
  private server?: WebSocketServer

  public listen(
    port: number,
    onConnection: (socket: ServerSocket) => void
  ): void {
    this.server = new WebSocketServer({ port })
    this.server.on('connection', (socket) =>
      onConnection(toServerSocket(socket))
    )
  }

  public close(): void {
    this.server?.close()
  }
}

export default WsServerTransport

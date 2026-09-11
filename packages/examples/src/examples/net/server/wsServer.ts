import { WebSocketServer, WebSocket } from 'ws'
import { isNetMessage, NetMessage } from '@mythor/net'

/**
 * Minimal local WebSocket server helper shared by the `@mythor/net`
 * examples. These example servers are NOT part of `@mythor/net` — the
 * package ships client-side code only, this is userland game-server code
 * the reader is expected to write themselves.
 */

interface Connection {
  socket: WebSocket
  send: (message: NetMessage) => void
}

interface WsServerOptions {
  port: number
  onConnection: (connection: Connection) => void
  onMessage: (connection: Connection, message: NetMessage) => void
  onClose: (connection: Connection) => void
}

export function startWsServer(options: WsServerOptions): WebSocketServer {
  const server = new WebSocketServer({ port: options.port })

  server.on('connection', (socket) => {
    const connection: Connection = {
      socket,
      send: (message) => socket.send(JSON.stringify(message)),
    }

    options.onConnection(connection)

    socket.on('message', (raw) => {
      let parsed: unknown

      try {
        parsed = JSON.parse(raw.toString())
      } catch {
        return
      }

      if (isNetMessage(parsed)) {
        options.onMessage(connection, parsed)
      }
    })

    socket.on('close', () => options.onClose(connection))
  })

  // eslint-disable-next-line no-console
  console.log(`Listening on ws://localhost:${options.port}`)

  return server
}

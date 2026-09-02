import { startWsServer } from './wsServer'

/**
 * Server for the "connection" example. It only accepts WebSocket
 * connections — it does not track any game state. Its only purpose is to
 * demonstrate `NetworkManager`'s connection lifecycle (idle -> connecting
 * -> open -> closed).
 *
 * Run with: yarn workspace @mythor/examples run server:net-connection
 */
startWsServer({
  port: 8081,
  onConnection: () => {
    // Nothing to do: the client only observes the connection state.
  },
  onMessage: () => {
    // No messages are expected from this example's client.
  },
  onClose: () => {
    // Nothing to clean up.
  },
})

import { Connection, startWsServer } from './wsServer'

/**
 * Server for the "prediction" example: a single owned entity per
 * connection, moved with `dx`/`dy` input.
 *
 * `applyMoveInput` below is deliberately duplicated from the client example
 * (`2--prediction.ts`). This is not an oversight: `@mythor/net`'s
 * client-side prediction replays inputs locally using the client's own
 * `applyInput` function, so the server MUST run the exact same
 * deterministic movement rule, or the client's prediction will constantly
 * be corrected by the server (visible as jitter/rubber-banding). In a real
 * project this function should live in a single shared module imported by
 * both the client and the server.
 *
 * Run with: yarn workspace @mythor/examples run server:net-prediction
 */

const SPEED = 200 // pixels per second
const TICK_RATE_HZ = 20

interface MoveInput {
  dx: number
  dy: number
}

interface PlayerState {
  entityId?: string
  x: number
  y: number
  lastProcessedSeq: number
}

function applyMoveInput(state: PlayerState, input: MoveInput, dt: number) {
  state.x += input.dx * SPEED * dt
  state.y += input.dy * SPEED * dt
}

const players = new Map<Connection, PlayerState>()

startWsServer({
  port: 8082,
  onConnection: (connection) => {
    players.set(connection, { x: 0, y: 0, lastProcessedSeq: -1 })
  },
  onMessage: (connection, message) => {
    if (message.type !== 'input') {
      return
    }

    const state = players.get(connection)

    if (!state) {
      return
    }

    state.entityId = message.entityId
    applyMoveInput(state, message.input as MoveInput, 1 / TICK_RATE_HZ)
    state.lastProcessedSeq = message.seq
  },
  onClose: (connection) => {
    players.delete(connection)
  },
})

setInterval(() => {
  players.forEach((state, connection) => {
    if (!state.entityId) {
      return
    }

    connection.send({
      v: 1,
      type: 'snapshot',
      entities: [
        {
          id: state.entityId,
          transform: { position: [state.x, state.y], rotation: 0 },
          ackSeq: state.lastProcessedSeq,
        },
      ],
    })
  })
}, 1000 / TICK_RATE_HZ)

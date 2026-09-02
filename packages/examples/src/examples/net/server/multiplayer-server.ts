import { SnapshotEntity } from '@mythor/net'
import { Connection, startWsServer } from './wsServer'

/**
 * Server for the combined "multiplayer" example: every connection controls
 * its own entity (same movement rule as the "prediction" example) and sees
 * every other connection's entity as a remote, interpolated entity.
 *
 * `applyMoveInput` is duplicated from the client example (`4--multiplayer.ts`)
 * for the same reason as in `prediction-server.ts`: it must run identically
 * on both sides for prediction/reconciliation to work without jitter.
 *
 * Unlike the other example servers, this one builds a different snapshot
 * payload per recipient: `ackSeq` is only set on the entity that belongs to
 * the connection receiving the message, so every other client treats it as
 * a remote entity (see `SnapshotEntity`'s `ackSeq` doc in `@mythor/net`).
 *
 * Run with: yarn workspace @mythor/examples run server:net-multiplayer
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
  port: 8084,
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
  Array.from(players.keys()).forEach((recipient) => {
    const entities: SnapshotEntity[] = []

    players.forEach((state, connection) => {
      if (!state.entityId) {
        return
      }

      entities.push({
        id: state.entityId,
        transform: { position: [state.x, state.y], rotation: 0 },
        ackSeq: connection === recipient ? state.lastProcessedSeq : undefined,
      })
    })

    recipient.send({ v: 1, type: 'snapshot', entities })
  })
}, 1000 / TICK_RATE_HZ)

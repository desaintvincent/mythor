# @mythor/net

> @mythor/net is part of the <a href="https://github.com/desaintvincent/mythor">Mythor</a> project


<p>
@mythor/net exports minimal client-side multiplayer networking primitives:
a WebSocket-backed NetworkManager, client-side prediction/reconciliation for
entities the client owns, and snapshot interpolation for remote entities.
</p>
<p align="center">
    <a href="">
      <img alt="MIT Licensed" src="https://img.shields.io/npm/l/@mythor/net.svg?style=flat" />
    </a>
    <a href="https://www.npmjs.com/package/@mythor/net">
      <img alt="NPM Status" src="https://img.shields.io/npm/v/@mythor/net.svg?style=flat" />
    </a>
</p>
<hr />

## Scope

`@mythor/net` assumes a **server-authoritative** topology: some Node process
(a dedicated server, or a player's own Node/Electron process acting as a
listen-server — the code is identical either way) runs `@mythor/core`
headless and owns the authoritative simulation.

**This package ships client-side code only.** It does **not** include:

- any server / `ws`-relay implementation,
- any anti-cheat or input-validation logic,
- peer-to-peer/WebRTC support (the `Transport` interface is transport-agnostic,
  so a future `WebRTCTransport` could be added later without touching
  `NetworkManager`, `PredictionSystem`, or `RemoteInterpolationSystem`).

Implementing the server side is the game's responsibility. At minimum, the
server must:

- receive `InputMessage`s and run the exact same `applyInput` function
  authoritatively (deterministic, same code as the client),
- track the last processed input sequence per connection/entity,
- periodically broadcast `SnapshotMessage`s, setting `ackSeq` only on the
  entities owned by the message's recipient (omitted for every other
  entity in that snapshot).

## Usage

### Connecting

```ts
import { NetworkManager } from '@mythor/net'
import { Ecs } from '@mythor/core'

const ecs = new Ecs()
const networkManager = new NetworkManager()
ecs.registerManagers(networkManager)
await ecs.init()

networkManager.connect('wss://example.com/game')
```

### Entities you own (prediction + reconciliation)

```ts
import { OwnedNetworked, PredictionSystem } from '@mythor/net'
import { Transform } from '@mythor/core'

interface MoveInput {
  dx: number
}

function applyInput(transform: Transform, input: MoveInput, dt: number): void {
  transform.position.vSet(
    transform.position.add(new Vec2(input.dx * dt, 0))
  )
}

const player = ecs.create()
player.add(new Transform())
player.add(
  new OwnedNetworked<MoveInput>({
    getInput: () => currentInput,
    applyInput,
  })
)

ecs.registerSystems(new PredictionSystem())
```

`applyInput` **must be deterministic** (pure function of `transform`, `input`
and `dt`): it is replayed against unacknowledged inputs whenever the server
sends a corrected snapshot.

### Entities you don't own (snapshot interpolation)

```ts
import { RemoteNetworked, RemoteInterpolationSystem } from '@mythor/net'

const remotePlayer = ecs.create(remoteId)
remotePlayer.add(new Transform())
remotePlayer.add(new RemoteNetworked({ interpolationDelay: 0.1 }))

ecs.registerSystems(new RemoteInterpolationSystem())
```

Remote entities are smoothed by buffering the last two received snapshots
and interpolating between them with a fixed render-lag (`interpolationDelay`).
If no newer snapshot arrives, the entity holds its last known position —
there is no extrapolation.

### Custom transport (testing)

`NetworkManager` accepts any `Transport` implementation, which makes it easy
to unit test networked systems in Node with a fake transport instead of a
real WebSocket:

```ts
const networkManager = new NetworkManager({ transport: myFakeTransport })
```

## A few links to help you get started
- [Examples](https://desaintvincent.github.io/mythor/) — see the `net`
  category (`packages/examples/src/examples/net/`) for a runnable example of
  each feature: connection lifecycle, prediction/reconciliation, snapshot
  interpolation, and a combined multiplayer demo. Each example needs its own
  local server running to work — see the `server:net-*` scripts in
  `packages/examples/package.json` (e.g.
  `yarn workspace @mythor/examples run server:net-prediction`, after
  `yarn build`).
<br />

## License

<a href="http://opensource.org/licenses/MIT">MIT</a> © <a href="http://github.com/desaintvincent">desaintvincent</a>

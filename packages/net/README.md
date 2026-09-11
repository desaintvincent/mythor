# @mythor/net

> @mythor/net is part of the <a href="https://github.com/desaintvincent/mythor">Mythor</a> project


<p>
@mythor/net turns any @mythor/core Ecs into a networked game: broadcast
(server), prediction/reconciliation (owned entities), snapshot interpolation
(remote entities), auto spawn/despawn of remote entities, and a generic
event channel — all generic over whatever components your own game defines.
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

The package ships both halves:

- `@mythor/net` (default entry): client-side — `NetworkManager`,
  `OwnedNetworked`/`PredictionSystem`, `RemoteNetworked`/
  `RemoteInterpolationSystem`/`RemoteEntitySyncSystem`.
- `@mythor/net/server`: server-side (Node-only, depends on `ws`) —
  `ServerNetworkManager`, `BroadcastSystem`, `Networked`.

**What it does *not* ship**: any anti-cheat/input-validation logic, or
peer-to-peer/WebRTC support (the `Transport`/`ServerTransport` interfaces are
transport-agnostic, so a future `WebRTCTransport` could be added later
without touching any of the systems above). A game is still responsible for
its own authoritative movement/gameplay rules — `@mythor/net` only handles
delivery, bookkeeping and replication around them.

## The core idea: components opt in, the lib never hardcodes a type

Any component can become network-syncable by implementing a small
structural interface — no change to `@mythor/net` needed for a new
component type:

```ts
interface NetworkSync<T = unknown> {
  serialize(): T
  deserialize(data: T): void
}

interface NetworkInterpolatable<T = unknown> extends NetworkSync<T> {
  interpolate(from: T, to: T, alpha: number): T
}
```

`@mythor/core`'s `Transform` already implements both, so it works out of the
box. Components that only implement `NetworkSync` (no `interpolate`) are
snapped to the latest received value on remote entities instead of blended
— no lerp assumption is ever forced onto arbitrary data (e.g. a `Health`
component).

## Usage

### Connecting (client)

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

function applyInput(entity: Entity, input: MoveInput, dt: number): void {
  const transform = entity.get(Transform)
  transform.position.vSet(transform.position.add(new Vec2(input.dx * dt, 0)))
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

`applyInput` **must be deterministic** (pure function of `entity`, `input`
and `dt`): it is replayed against unacknowledged inputs whenever the server
sends a corrected snapshot, and the exact same function must run
authoritatively on the server.

### Entities you don't own (auto spawn/despawn + interpolation)

```ts
import {
  RemoteEntitySyncSystem,
  RemoteInterpolationSystem,
  NetworkManager,
} from '@mythor/net'
import { Transform } from '@mythor/core'

const networkManager = ecs.manager(NetworkManager)
networkManager.registerComponent(Transform, () => new Transform())

ecs.registerSystems(new RemoteEntitySyncSystem(), new RemoteInterpolationSystem())
```

Remote entities never need to be created by your game code:
`RemoteEntitySyncSystem` spawns one automatically (with a fresh instance of
every registered component present in the snapshot) the first time it
appears in a snapshot, and destroys it once it's no longer present.
`RemoteInterpolationSystem` then blends (or snaps) each of its networked
components frame after frame, buffering the last two received snapshots and
rendering with a fixed render-lag (`RemoteNetworked`'s `interpolationDelay`).
If no newer snapshot arrives, the entity holds its last known value — there
is no extrapolation.

### Broadcasting entities (server)

```ts
import { ServerNetworkManager, BroadcastSystem, Networked } from '@mythor/net/server'
import { Ecs, Transform } from '@mythor/core'

const ecs = new Ecs()
const networkManager = new ServerNetworkManager({ port: 8080 })
ecs.registerManagers(networkManager)
ecs.registerSystems(new BroadcastSystem())
await ecs.init()
networkManager.listen()

const player = ecs.create(entityId)
player.add(new Transform(), new Networked({ ownerConnectionId: connection.id }))

setInterval(() => ecs.update(1 / 20, 0), 1000 / 20)
```

`BroadcastSystem` scans every `Networked` entity's own components for
whichever ones implement `NetworkSync`, serializes them, and sends a
per-recipient snapshot to every connection — only the entity's own
`ownerConnectionId` gets `ackSeq` set, so it reconciles locally on the owning
client while every other client treats it as remote/interpolated. Your game
never builds a snapshot payload by hand.

### Non-entity events (e.g. "play a sound")

Both `NetworkManager` (client) and `ServerNetworkManager` (server) expose a
generic, untyped message channel, independent of entity replication:

```ts
// server
serverNetworkManager.broadcast({ sound: 'explosion' })
serverNetworkManager.sendTo(connectionId, { sound: 'ping' })

// client
networkManager.onMessage((payload) => {
  if (payload.sound) playSound(payload.sound)
})
```

### Custom transport (testing)

Both `NetworkManager` and `ServerNetworkManager` accept a pluggable
transport, which makes it easy to unit test networked systems in Node
without a real socket:

```ts
const networkManager = new NetworkManager({ transport: myFakeTransport })
const serverNetworkManager = new ServerNetworkManager({ port: 8080, transport: myFakeServerTransport })
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

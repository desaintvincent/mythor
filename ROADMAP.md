# Roadmap

This document tracks features that have been discussed but are **not yet started**.
It exists to capture intent and rough design direction before implementation begins —
nothing here is final, and no code has been written for these items.

## `@mythor/audio`

**Goal:** Web Audio API wrapper, following the same shape as `@mythor/events`.

- **Dependencies:** `@mythor/core`, `@mythor/math` (same dependency level as `events`,
  so it can build in parallel with it — see the package dependency order in `AGENTS.md`).
- **Proposed API:**
  - `AudioManager` (a `Manager` subclass, singleton like `EventsManager`):
    `load(key, url)`, `play(key, options)`, `stop(key)`, master volume and
    per-channel volume controls.
  - `Sound` / `AudioSource` component: attaches playback to an entity, with an
    optional positional/spatial mode driven by the entity's `Transform` (panning
    based on distance/position relative to the active camera or listener).
- **Testing approach:** mock `AudioContext` (jsdom does not implement Web Audio),
  unit-test `AudioManager`/`AudioSource` logic in a `node` test environment the
  same way `PhysicSystem` is tested — no real audio playback in CI.
- **Sequencing:** `@mythor/ui` (button hover/click) already exists; wire
  `Button.onClick`/`onHoverChange` callbacks in `@mythor/ui` to
  `AudioManager.play(...)` once this package lands, instead of adding a
  hard dependency from `@mythor/ui` to `@mythor/audio`.

## `@mythor/fsm`

**Goal:** generic, ECS-independent finite state machine primitive, usable both
for entity-level behavior (character controller state: idle/walk/jump/attack)
and simple AI (patrol/chase/attack/flee) — factoring out logic that would
otherwise be duplicated as ad-hoc `if`/`switch` chains in every consuming
project's custom `System`s.

- **Dependencies:** none — a leaf package like `@mythor/math`, since a state
  machine has no inherent need for `Entity`/`Component`/`Ecs`. Consumers wire
  it into a `Component` or `System` themselves (see example below), the same
  way `@mythor/math`'s `Vec2`/`Rect` are consumed without `@mythor/fsm` needing
  to know about the ECS.
- **Proposed API:**
  - `StateMachine<TState extends string, TContext>`: constructed with a state
    table (`{ [state]: { transitions: { [event]: TState }, onEnter?, onExit? } }`),
    an initial state, and a context object passed to `onEnter`/`onExit` hooks.
  - `fire(event)`: transitions if the current state declares that event,
    no-ops (returns `false`) otherwise — invalid transitions are silently
    rejected rather than throwing, so consumers can fire events speculatively
    (e.g. "jump" pressed while already jumping) without guarding every call.
  - `onEnter`/`onExit` hooks centralize side effects (play animation, toggle
    hitbox) instead of scattering them across a `System`'s `update()`.
- **Not covered / explicitly out of scope:** scene-level state (menu/playing/
  paused) — already handled by `@mythor/game`'s `Scene`/`SceneManager`, which
  operates one level above (switching entire `Ecs` instances, not per-entity
  behavior). `@mythor/fsm` targets per-entity state only.
- **Testing approach:** pure unit tests (no ECS, no DOM) — transition tables,
  hook invocation order, rejection of invalid transitions.

## `@mythor/net`

**Goal:** basic multiplayer networking primitives (state sync over WebSocket),
kept intentionally minimal — not a full authoritative server framework.

- **Dependencies:** `@mythor/core`, `@mythor/math`.
- **Proposed API:**
  - `NetworkManager` (a `Manager` subclass): connect/disconnect, message
    send/broadcast, connection state.
  - `Networked` component: marks an entity/component set for replication;
    simple dirty-checking + serialization reusing the same opt-in strategy as
    `@mythor/persistence` where possible (shared serialization primitives are
    worth extracting if both packages land).
  - Sync model: start with a simple snapshot/interpolation approach for
    positions, not full authoritative simulation — keep scope small.
- **Open question:** client-server vs. peer-to-peer as the default topology;
  this needs a decision before implementation, since it changes the shape of
  `NetworkManager`.
- **Sequencing:** should land after `@mythor/persistence` if serialization
  primitives are shared between the two.
- **Testing approach:** unit-test message encode/decode and reconciliation
  logic in `node` env with a fake/mock socket transport — no real network
  round-trips in CI.

## `@mythor/assets`

**Goal:** unified asset loading/preloading, replacing the current situation
where each package (renderer's `TextureManager`, `tiled`) loads its own assets
independently with no shared progress reporting or caching.

- **Dependencies:** `@mythor/core` only (renderer/tiled would depend on it,
  not the other way around, to avoid inverting the existing dependency order
  documented in `AGENTS.md`).
- **Proposed API:**
  - `AssetManager`: `load(manifest)`, `get(key)`, `onProgress(callback)`,
    per-type loaders (`image`, `json`, `audio` — pluggable so `@mythor/audio`
    and `@mythor/tiled` can register their own loader instead of duplicating
    fetch/cache logic).
  - Manifest-driven preloading for a loading-screen flow (`game` package
    already has a loading scene concept — this should plug into it rather than
    replace it).
- **Sequencing:** ideally before/alongside `@mythor/audio`, since audio assets
  benefit from the same preload/cache pipeline as textures.
- **Testing approach:** unit-test manifest parsing, cache hits/misses, and
  progress reporting in `node` env with mocked `fetch`/loaders.

## Tooling / build improvements

**Goal:** address structural build/tooling gaps identified during codebase review,
independent of any new package feature.

- **Dual ESM+CJS build** (or pure ESM with an `exports` map) for each published
  package. Currently every package builds to commonjs only (`module: "commonjs"`
  in the root `tsconfig.json`), which prevents tree-shaking for consumers using
  modern bundlers — meaningful for a game framework where bundle size matters.
- **Bump TypeScript** from 4.8 to a current 5.x release across the workspace.
  Gains: better inference, `satisfies`, faster compilation. Needs a check that
  `ts-jest`, `typedoc`, and each package's `tsconfig.json` (`strict: true`)
  still behave the same after the bump.
- **Harmonize root vs. package `tsconfig.json`.** The root config has
  `noImplicitAny` defaulting to false (not set to `strict`), while every package
  overrides with its own `strict: true`. Either promote `strict: true` to the
  root and let packages inherit it, or document why the duplication exists.

## Notes

- `@mythor/audio` should follow the dependency ordering already documented in
  `AGENTS.md` (`math → core → renderer/physic2d → events/tiled → game`),
  inserting `audio` alongside `events`/`tiled`.
- `@mythor/audio` doesn't exist yet; this file is the only artifact produced
  for that work so far — no scaffolding, no stub package.
- `@mythor/ui` has been implemented (see `packages/ui`); its section was
  removed from this document accordingly.

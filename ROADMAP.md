# Roadmap

This document tracks features that have been discussed but are **not yet started**.
It exists to capture intent and rough design direction before implementation begins —
nothing here is final, and no code has been written for these items.

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

## Codebase health / technical debt

### Injectable logging

**Goal:** make `log()` replaceable through framework options so consumers can
route output to their own logger or silence it entirely.
**Current state:** `packages/core/src/util/log.ts` is a hardcoded
`console.log` wrapper. It is imported directly from core, renderer, and tiled
code paths, which makes the debug channel central but inflexible.
**Proposed approach:** add a logger hook to the relevant top-level options
(`EcsOptions`, `GameMakerOptions`, or the shared bootstrap path), defaulting to
the current helper.
**Open question:** should the injection surface be per-package or shared
through a small common logging interface?
**Sequencing:** do this before deeper ECS and renderer refactors so the new
seams can reuse the same logger path.
**Testing approach:** unit-test the default `%c` formatting and a custom logger
adapter that records expected calls.

### Renderer decomposition

**Goal:** split `Renderer` into smaller pieces with clearer responsibilities.
**Current state:** `packages/renderer/src/systems/Renderer.ts` is 513 lines and
still owns WebGL init, shader registry, QuadTree/culling, camera management,
imperative draw helpers, particles, and text rendering.
**Proposed approach:** extract a `ShaderRegistry`, a `DrawAPI` facade, and a
`RendererCore` for WebGL setup + render loop while keeping the public API
stable.
**Open question:** which layer should own camera state and the draw helpers
after the split: the facade or the core?
**Sequencing:** after logging injection, so the extracted pieces can share the
same tracing/debug hooks.
**Testing approach:** add headless renderer integration tests around the public
drawing API once the split creates test seams.

### `Agregate` rename

**Goal:** rename `Agregate` to `Aggregate`.
**Current state:** `packages/tiled/src/Agregate.ts` still uses the misspelled
file and class name, while the exported collider type is already correctly
spelled as `AggregateCollider`.
**Proposed approach:** rename file, class, imports, and exports together; keep a
compatibility path only if a transition release is needed.
**Open question:** ship a temporary alias or make this a clean semver-major
break.
**Sequencing:** after the `Agregate.ts` split, so the rename lands once
responsibilities are separated.
**Testing approach:** update Tiled integration tests and import sites to cover
the new name.

### Private field naming

**Goal:** remove the `_prefix` convention for private fields.
**Current state:** core still uses fields like `_systems`, `_managers`, and
`_entityCollections` in `Ecs.ts`.
**Proposed approach:** switch to plain `private` names or `#private` fields
where runtime privacy is useful.
**Open question:** cosmetic cleanup only, or a full migration to `#private`
syntax.
**Sequencing:** low priority; do this only when touching the affected classes
for another reason.
**Testing approach:** rely on typecheck and existing unit coverage.

### `Agregate.ts` responsibility split

**Goal:** separate parsing, polygon decomposition, and loading-state management
in the Tiled collider generator.
**Current state:** `Agregate.ts` mixes `PolyBool` / `poly-decomp` geometry work
with Tiled parsing and duplicated loading-state logic (`LoadState`, `onLoad`
callback, constructor bookkeeping). Core already has a dedicated
`LoadingStateManager`, so the file reimplements state handling that exists
elsewhere.
**Proposed approach:** extract a loading-state helper and the decomposition
pipeline into separate modules, then wire `Agregate` / `Aggregate` as a thin
orchestrator. Reuse `packages/core/src/managers/LoadingStateManager.ts` instead
of duplicating state tracking.
**Open question:** should the decomposition code live beside Tiled or in a
shared geometry helper package.
**Sequencing:** combine with the rename, since both changes touch the same file
and imports.
**Testing approach:** cover the loading callbacks and collider output
separately, with fixtures for polygon-heavy maps.

### ECS testability

**Goal:** make `Entity`, `System`, and `Manager` unit-testable without spinning
up a full `Ecs`.
**Current state:** the `IEcs` extraction removed the biggest cycle, but these
types still have the remaining direct coupling that makes isolated tests
awkward. `ANALYSIS.md` step 3 was left open.
**Proposed approach:** introduce the smallest possible seams for the remaining
`Ecs` interactions, then add focused unit tests for lifecycle behavior and
`init` / `clear` flows.
**Open question:** how much dependency injection is acceptable before the ECS
API starts to feel heavier than the current direct wiring.
**Sequencing:** after the renderer and Tiled cleanup work, because this is
mostly test and maintenance work rather than feature work.
**Testing approach:** add isolated unit tests for `Entity`, `System`, and
`Manager`, plus one integration test for the full ECS lifecycle.

## Notes

- `@mythor/ui` has been implemented (see `packages/ui`); its section was
  removed from this document accordingly.
- `@mythor/assets` has been implemented (see `packages/assets`); its section
  was removed from this document accordingly.
- `@mythor/audio` has been implemented (see `packages/audio`); its section
  was removed from this document accordingly.
- `@mythor/fsm` has been implemented (see `packages/fsm`); its section was
  removed from this document accordingly.

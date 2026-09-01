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

## Notes

- `@mythor/ui` has been implemented (see `packages/ui`); its section was
  removed from this document accordingly.
- `@mythor/assets` has been implemented (see `packages/assets`); its section
  was removed from this document accordingly.
- `@mythor/audio` has been implemented (see `packages/audio`); its section
  was removed from this document accordingly.
- `@mythor/fsm` has been implemented (see `packages/fsm`); its section was
  removed from this document accordingly.
- **Dual ESM+CJS build** (or pure ESM with an `exports` map) for each published
  package has been implemented. Packages now build CommonJS to `lib/` and ESM
  to `lib/esm/`, with bundler-friendly `module` metadata preserved for tree-
  shaking while keeping existing deep-import paths working.
- Injectable logging has been implemented (`EcsOptions.logger`, plus optional
  `logger` params on `TiledMapParser` and `loadTexture`); its section was
  removed from this document accordingly.
- Renderer decomposition has been implemented via `RendererCore`,
  `ShaderRegistry`, and `DrawAPI`; its section was removed from this document
  accordingly.
- The `Agregate` → `Aggregate` rename and its responsibility split
  (`packages/tiled/src/polygonDecomposition.ts` extracted from the class) have
  been done; the section was removed from this document accordingly.
- **TypeScript was bumped** from 4.8.4 to 5.0.4 (`ts-jest`, `typedoc`, and
  builds verified). `strict: true` was promoted to the root `tsconfig.json`
  and removed from every package override, harmonizing root vs. package
  config; their section was removed from this document accordingly. Note:
  going past TS 5.0.x currently breaks the doc toolchain (`typedoc`/
  `typedoc-plugin-markdown` compatibility gaps — TS 5.7+ also needs WebGL
  typed-array type fixes in `@mythor/renderer`), so a further TS bump is left
  as a distinct follow-up if needed.
- ECS testability has been implemented: `System` and `Manager` now depend on
  the `IEcs` interface instead of the concrete `Ecs` class (mirroring
  `Entity`'s existing pattern), removing the last runtime coupling described
  in `docs/ecs-architectural-cycles.md`. Isolated unit tests using a minimal
  mock `IEcs` were added for `System` and `Manager` in
  `packages/core/__tests__/`, alongside the existing full-`Ecs` lifecycle
  tests; its section was removed from this document accordingly.

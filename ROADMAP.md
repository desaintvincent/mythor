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

## Codebase health / technical debt

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
- Injectable logging has been implemented (`EcsOptions.logger`, plus optional
  `logger` params on `TiledMapParser` and `loadTexture`); its section was
  removed from this document accordingly.
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

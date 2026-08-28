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
- **Sequencing:** build before `@mythor/ui`, since UI interactions (button
  hover/click) will likely want to trigger sounds.

## `@mythor/ui`

**Goal:** Minimal UI primitives layered on top of the renderer and input packages.

- **Dependencies:** `@mythor/core`, `@mythor/renderer`, `@mythor/events`, `@mythor/math`.
- **Proposed primitives:**
  - `Panel` — a container component for grouping/positioning children.
  - `Label` — wraps the renderer's `Text` object.
  - `Button` — combines a `Renderable` with hit-testing against
    `EventsManager.mousePosition()` / `mousePressed()`.
- **Open question:** layout model — flex-like layout vs. simple anchor-based
  positioning. This needs a decision before implementation starts, since it
  affects the shape of every primitive above.
- **Testing approach:** unit-test hit-testing and interaction state logic in a
  `node` environment (no DOM/WebGL needed for that layer); leave actual visual
  rendering verification to the `examples` package.

## Notes

- Both packages should follow the dependency ordering already documented in
  `AGENTS.md` (`math → core → renderer/physic2d → events/tiled → game`), inserting
  `audio` alongside `events`/`tiled` and `ui` after `renderer`+`events`.
- Neither package exists yet; this file is the only artifact produced for this
  work — no scaffolding, no stub packages.

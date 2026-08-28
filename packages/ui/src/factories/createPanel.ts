import { Component, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import { Color, colorWhite, FillRect, Renderable } from '@mythor/renderer'

export interface PanelOptions {
  position?: Vec2
  size?: Vec2
  rotation?: number
  color?: Color
  layer?: number
  /**
   * Whether this panel is fixed to the screen, independent of the world
   * camera's pan/zoom/rotation (see `Renderable.screenSpace`). Defaults to
   * `true`, since UI is expected to stay put on screen. Set to `false` for
   * world-space UI (e.g. a nameplate anchored to a moving entity).
   */
  screenSpace?: boolean
  /** Corner radius in pixels, forwarded to the background `FillRect`. */
  radius?: number
}

/**
 * Container/background primitive. A `Panel` is plain composition of existing
 * renderer primitives (`Transform` + `Renderable` + `FillRect`) — grouping
 * and relative positioning of children is already provided for free by
 * `Entity.addChild()` + `Transform`'s parent-relative `position`/`rotation`,
 * so no dedicated layout engine or component is needed here.
 */
function createPanel(options?: PanelOptions): Component[] {
  return [
    new Transform({
      position: options?.position,
      rotation: options?.rotation,
      size: options?.size,
    }),
    new Renderable({
      layer: options?.layer,
      screenSpace: options?.screenSpace ?? true,
    }),
    new FillRect({
      color: options?.color ?? colorWhite,
      radius: options?.radius,
      size: options?.size,
    }),
  ]
}

export default createPanel

import { Component, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import { Color, Renderable, RenderedText } from '@mythor/renderer'
import { getCenteredLabelOffset } from '../util/measureDefaultFontTextWidth'

export interface LabelOptions {
  position?: Vec2
  rotation?: number
  color?: Color
  layer?: number
  /** See `PanelOptions.screenSpace`. Defaults to `true`. */
  screenSpace?: boolean
  /** Center the text horizontally and vertically on `position`. Defaults to `true`. */
  center?: boolean
}

/**
 * Text primitive for UI entities. Thin naming wrapper around the existing
 * `RenderedText` component (already "wraps the renderer's Text object") —
 * no new rendering logic, purely composition for naming parity with
 * `Panel`/`Button`.
 */
function createLabel(str: string, options?: LabelOptions): Component[] {
  const centered = options?.center ?? true
  const offset = centered ? getCenteredLabelOffset(str) : Vec2.zero()

  return [
    new Transform({
      position: options?.position,
      rotation: options?.rotation,
    }),
    new Renderable({
      layer: options?.layer,
      screenSpace: options?.screenSpace ?? true,
    }),
    new RenderedText(str, { color: options?.color, offset }),
  ]
}

export default createLabel

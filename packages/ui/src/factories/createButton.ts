import { Component, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import {
  Color,
  colorWhite,
  FillRect,
  Renderable,
  RenderedText,
} from '@mythor/renderer'
import Button, { ButtonOptions } from '../components/Button'
import { getCenteredLabelOffset } from '../util/measureDefaultFontTextWidth'

export interface CreateButtonOptions extends ButtonOptions {
  position?: Vec2
  size?: Vec2
  color?: Color
  label?: string
  labelColor?: Color
  layer?: number
  /** Corner radius in pixels, forwarded to the background `FillRect`. */
  radius?: number
  /** See `PanelOptions.screenSpace`. Defaults to `true`. */
  screenSpace?: boolean
}

/**
 * Clickable UI entity: background rect (`FillRect`) + interactive state
 * (`Button`, driven by `ButtonSystem`) + an optional text label
 * (`RenderedText`, centered on the button). `Transform.size` is also the
 * hit-test bounds used by `ButtonSystem`.
 */
function createButton(options?: CreateButtonOptions): Component[] {
  const components: Component[] = [
    new Transform({ position: options?.position, size: options?.size }),
    new Renderable({
      layer: options?.layer,
      screenSpace: options?.screenSpace ?? true,
    }),
    new FillRect({
      color: options?.color ?? colorWhite,
      radius: options?.radius,
      size: options?.size,
    }),
    new Button({
      disabled: options?.disabled,
      onClick: options?.onClick,
      onHoverChange: options?.onHoverChange,
    }),
  ]

  if (options?.label !== undefined) {
    components.push(
      new RenderedText(options.label, {
        color: options.labelColor,
        offset: getCenteredLabelOffset(options.label),
      })
    )
  }

  return components
}

export default createButton

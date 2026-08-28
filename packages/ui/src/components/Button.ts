import { Component } from '@mythor/core'

export interface ButtonOptions {
  disabled?: boolean
  onClick?: () => void
  onHoverChange?: (hovered: boolean) => void
}

/**
 * Interactive state for a clickable UI entity. Combined with a `Transform`
 * (for hit-testing bounds) and driven every frame by `ButtonSystem`, which is
 * the only place allowed to mutate `hovered`/`pressed`/`clicked`.
 */
class Button extends Component {
  public hovered = false
  public pressed = false
  public clicked = false
  public disabled: boolean
  public onClick?: () => void
  public onHoverChange?: (hovered: boolean) => void

  public constructor(options?: ButtonOptions) {
    super()
    this.disabled = options?.disabled ?? false
    this.onClick = options?.onClick
    this.onHoverChange = options?.onHoverChange
  }
}

export default Button

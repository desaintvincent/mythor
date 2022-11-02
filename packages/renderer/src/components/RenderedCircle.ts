import { Vec2 } from '@mythor/math'
import Color, { colorWhite } from '../color/Color'
import { Component } from '@mythor/core'

interface RenderedCircleOptions {
  offset?: Vec2
  color?: Color
  fill?: boolean
  diagonal?: boolean
  radius?: number
  width?: number
}

class RenderedCircle extends Component {
  public offset: Vec2
  public radius?: number
  public color: Color
  public fill: boolean
  public diagonal: boolean
  public width: number

  public constructor(options?: RenderedCircleOptions) {
    super()
    this.offset = options?.offset ?? Vec2.zero()
    this.color = options?.color ?? colorWhite
    this.fill = options?.fill ?? false
    this.diagonal = options?.diagonal ?? false
    this.radius = options?.radius
    this.width = options?.width ?? 1
  }
}

export default RenderedCircle

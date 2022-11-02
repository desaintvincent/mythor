import { Vec2 } from '@mythor/math'
import Color, { colorWhite } from '../color/Color'
import { Component } from '@mythor/core'

interface RenderedRectOptions {
  offset?: Vec2
  color?: Color
  size?: Vec2
}

class FillRect extends Component {
  public offset: Vec2
  public size?: Vec2
  public color: Color

  public constructor(options?: RenderedRectOptions) {
    super()
    this.offset = options?.offset ?? Vec2.zero()
    this.color = options?.color ?? colorWhite
    this.size = options?.size
  }
}

export default FillRect

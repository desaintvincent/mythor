import { Vec2 } from '@mythor/math'
import Color from '../color/Color'
import Font from '../toRename/Font'
import { Component } from '@mythor/core'

interface RenderTextOptions {
  offset?: Vec2
  color?: Color
  font?: Font
}

export default class RenderedText extends Component {
  public offset: Vec2
  public color: Color
  public font?: Font

  public constructor(public str: string, options?: RenderTextOptions) {
    super()
    this.offset = options?.offset ?? Vec2.zero()
    this.color = options?.color ?? [0, 0, 1, 1]
    this.font = options?.font
  }
}

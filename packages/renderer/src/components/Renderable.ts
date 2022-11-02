import { Component, Constructor } from '@mythor/core'
import QuadTree from '../quadTree/QuadTree'

interface RenderableParameters {
  visible?: boolean
  static?: boolean
  layer?: number
}

class Renderable extends Component {
  public readonly visible: boolean = true
  public readonly static: boolean = false
  public readonly layer: number = 0
  public readonly shapes: Array<Constructor<Component>> = []
  public quadTree: null | QuadTree = null

  public constructor(params?: RenderableParameters) {
    super()

    this.visible = params?.visible ?? true
    this.static = params?.static ?? false
    this.layer = params?.layer ?? 0

    if (this.layer < 0 || this.layer > 256) {
      throw new Error('Sprite layer must be between 0 and 256')
    }
  }
}

export default Renderable

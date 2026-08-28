import { Component, Constructor } from '@mythor/core'
import QuadTree from '../quadTree/QuadTree'

interface RenderableParameters {
  visible?: boolean
  static?: boolean
  layer?: number
  screenSpace?: boolean
}

class Renderable extends Component {
  public readonly visible: boolean = true
  public readonly static: boolean = false
  public readonly layer: number = 0
  public readonly shapes: Array<Constructor<Component>> = []
  public quadTree: null | QuadTree = null
  /**
   * When true, this entity is rendered with the renderer's fixed GUI camera
   * instead of the world camera: its `Transform.position` is expressed in
   * screen pixels and stays fixed on screen regardless of camera pan/zoom/
   * rotation. It is also excluded from world-space frustum culling. Intended
   * for HUD/UI entities (see `@mythor/ui`).
   */
  public readonly screenSpace: boolean = false

  public constructor(params?: RenderableParameters) {
    super()

    this.visible = params?.visible ?? true
    this.static = params?.static ?? false
    this.layer = params?.layer ?? 0
    this.screenSpace = params?.screenSpace ?? false

    if (this.layer < 0 || this.layer > 256) {
      throw new Error('Sprite layer must be between 0 and 256')
    }
  }
}

export default Renderable

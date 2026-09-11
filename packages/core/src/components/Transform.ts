import Component from '../ecs/Component'
import { Vec2 } from '@mythor/math'

interface TransformOptions {
  rotation?: number
  position?: Vec2
  size?: Vec2
}

class Transform extends Component {
  private _rotation: number
  private readonly _position: Vec2
  private readonly _size: Vec2

  public constructor({
    rotation = 0,
    position = Vec2.zero(),
    size = new Vec2(100, 100),
  }: TransformOptions = {}) {
    super()
    this._rotation = rotation
    this._position = position
    this._size = size
  }

  public get size(): Vec2 {
    return this._size
  }

  public get position(): Vec2 {
    if (!this._entity?.parent) {
      return this._position
    }

    if (!this._entity.parent.has(Transform)) {
      return this._position
    }

    const parentTransform = this._entity.parent.get(Transform)

    return parentTransform.position.add(
      this._position.rotate(parentTransform.rotation)
    )
  }

  public get rotation(): number {
    if (!this._entity?.parent) {
      return this._rotation
    }

    if (!this._entity.parent.has(Transform)) {
      return this._rotation
    }

    return this._entity.parent.get(Transform).rotation + this._rotation
  }

  public set rotation(value) {
    this._rotation = value
  }

  /**
   * Structural network/persistence sync support: satisfies
   * `@mythor/net`'s `NetworkInterpolatable` (and `@mythor/persistence`'s
   * `Serializable`) interfaces without importing them, so `Transform`
   * keeps working as a synced type with no cross-package dependency.
   */
  public serialize(): TransformData {
    return {
      position: [this._position.x, this._position.y],
      rotation: this._rotation,
    }
  }

  public deserialize(data: TransformData): void {
    this._position.vSet(new Vec2(data.position[0], data.position[1]))
    this._rotation = data.rotation
  }

  public interpolate(
    from: TransformData,
    to: TransformData,
    alpha: number
  ): TransformData {
    return {
      position: [
        from.position[0] + (to.position[0] - from.position[0]) * alpha,
        from.position[1] + (to.position[1] - from.position[1]) * alpha,
      ],
      rotation: from.rotation + (to.rotation - from.rotation) * alpha,
    }
  }
}

interface TransformData {
  position: [number, number]
  rotation: number
}

export default Transform

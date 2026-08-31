import { Vec3, Quaternion } from '@mythor/math'
import Component from '../ecs/Component'

interface Transform3DOptions {
  position?: Vec3
  rotation?: Quaternion
  scale?: Vec3
}

class Transform3D extends Component {
  private readonly _position: Vec3
  private _rotation: Quaternion
  private readonly _scale: Vec3

  public constructor({
    position = Vec3.zero(),
    rotation = Quaternion.identity(),
    scale = Vec3.one(),
  }: Transform3DOptions = {}) {
    super()
    this._position = position
    this._rotation = rotation
    this._scale = scale
  }

  public get position(): Vec3 {
    return this._position
  }

  public get rotation(): Quaternion {
    return this._rotation
  }

  public set rotation(value: Quaternion) {
    this._rotation = value
  }

  public get scale(): Vec3 {
    return this._scale
  }
}

export default Transform3D

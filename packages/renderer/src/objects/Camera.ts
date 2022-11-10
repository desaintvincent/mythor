import { Vec2 } from '@mythor/math'
import { Entity, Transform } from '@mythor/core'

const depth = 1e5

type TargetFunction = (
  target: Vec2,
  to: Vec2,
  elapsedTimeInSeconds: number,
  camera: Camera
) => Vec2

export type Projection = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]

export default class Camera {
  private readonly at: Vec2 = Vec2.zero()
  private to: Vec2 = Vec2.zero() // 0 -> 1
  private _target: Vec2 = Vec2.zero()
  private readonly angle: number = 0
  private _scale = 1
  private readonly size: Vec2
  private _dirty = true
  private _projection?: Projection
  private _targetEntity?: Entity
  private targetFunction?: TargetFunction

  public constructor(size?: Vec2) {
    this.size = size ?? new Vec2(1024, 512)
  }

  public update(elapsedTimeInSeconds: number): void {
    if (this._targetEntity?.has(Transform)) {
      this.target(this._targetEntity.get(Transform).position)
    }
    if (this.targetFunction) {
      this.to = this.targetFunction(
        this._target,
        this.to,
        elapsedTimeInSeconds,
        this
      )
    }
  }

  public getSize(): Vec2 {
    return this.size
  }

  public getPosition(): Vec2 {
    return this.to
  }

  public setTargetFunction(fn: TargetFunction): Camera {
    this.targetFunction = fn

    return this
  }

  public targetEntity(entity?: Entity): Camera {
    this._targetEntity = entity

    return this
  }

  public getTargetEntity(): Entity | undefined {
    return this._targetEntity
  }

  public move(offset: Vec2, relatifToZoom = false): void {
    this.to.x += offset.x / (relatifToZoom ? this._scale : 1)
    this.to.y += offset.y / (relatifToZoom ? this._scale : 1)
    this._target = this.to
    this._dirty = true
  }

  public lookat(position: Vec2): void {
    this.to = position
    this._target = position
    this._dirty = true
  }

  public target(position: Vec2): void {
    this._target = position
  }

  public zoom(value: number): void {
    this.scale += value
  }

  public get scale(): number {
    return this._scale
  }

  public set scale(value: number) {
    this._scale = Math.min(Math.max(0.1, value), 10)
    this._dirty = true
  }

  public screenToWorld(screenPosition: Vec2): Vec2 {
    const rotated = Vec2.rotate(
      Vec2.divide(
        Vec2.sub(screenPosition, Vec2.times(this.size, 0.5)),
        this._scale
      ),
      this.angle
    )

    return Vec2.add(rotated, this.to)
  }

  public worldToScreen(worldPosition: Vec2): Vec2 {
    const translated = Vec2.sub(worldPosition, this.to)
    const rotated = Vec2.rotate(translated, -this.angle)

    return Vec2.add(
      Vec2.times(rotated, this._scale),
      Vec2.times(this.size, 0.5)
    )
  }

  public get projection(): Projection {
    if (!this._dirty && this._projection) {
      return this._projection
    }

    const x = this.at.x - this.size.x * 0.5 + this.to.x
    const y = this.at.y - this.size.y * 0.5 + this.to.y

    const c = Math.cos(this.angle)
    const s = Math.sin(this.angle)

    const w = 2 / this.size.x
    const h = -2 / this.size.y

    /*

        |   1 |    0| 0| 0|
        |   0 |    1| 0| 0|
        |   0 |    0| 1| 0|
        | at.x| at.y| 0| 1|

        x

        |  c| s| 0| 0|
        | -s| c| 0| 0|
        |  0| 0| 1| 0|
        |  0| 0| 0| 1|

        x

        |     1|     0| 0| 0|
        |     0|     1| 0| 0|
        |     0|     0| 1| 0|
        | -at.x| -at.y| 0| 1|

        x

        |     2/this.size.x|           0|        0| 0|
        |           0|   -2/this.size.y|        0| 0|
        |           0|           0| -1/depth| 0|
        | -2x/this.size.x-1| 2y/this.size.y+1|        0| 1|

        */

    const calculatedProjection = [
      c * w,
      s * h,
      0,
      0,
      -s * w,
      c * h,
      0,
      0,
      0,
      0,
      -1 / depth,
      0,

      (this.at.x * (1 - c) + this.at.y * s) * w - (2 * x) / this.size.x - 1,
      (this.at.y * (1 - c) - this.at.x * s) * h + (2 * y) / this.size.y + 1,
      0,
      1 / this.scale,
    ] as Projection

    this._projection = calculatedProjection

    return calculatedProjection
  }
}

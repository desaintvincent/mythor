import { Vec2 } from '@mythor/math'
import Texture from '../toRename/Texture'
import { Component } from '@mythor/core'

interface SpriteOptions {
  anchor?: Vec2
  origin?: Vec2
  parallax?: Vec2
  offset?: Vec2
  size?: Vec2
  scale?: Vec2
  tint?: number
  alpha?: number
}

export default class Sprite extends Component {
  public readonly texture: Texture
  public visible: boolean
  public anchor: Vec2
  public tint: number
  public alpha: number
  public origin: Vec2
  public parallax: Vec2
  public offset: Vec2
  public size: Vec2
  public scale: Vec2

  public constructor(texture: Texture, options?: SpriteOptions) {
    super()
    this.texture = texture
    this.visible = true
    this.anchor = options?.anchor ?? new Vec2(0.5, 0.5)
    this.tint = options?.tint ?? 0xffffff
    this.alpha = options?.alpha ?? 1
    this.origin = options?.origin ?? new Vec2(0, 0)
    this.parallax = options?.parallax ?? new Vec2(1, 1)
    this.offset = options?.offset ?? new Vec2(0, 0)
    this.size = options?.size ?? new Vec2(1, 1)
    this.scale = options?.scale ?? new Vec2(1, 1)
  }
}

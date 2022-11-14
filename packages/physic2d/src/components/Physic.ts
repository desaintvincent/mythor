import { Vec2 } from '@mythor/math'
import { Body } from 'planck-js'
import { Component } from '@mythor/core'

export enum PhysicType {
  STATIC = 'static',
  KINEMATIC = 'kinematic',
  DYNAMIC = 'dynamic',
}

export interface PhysicParams {
  type?: PhysicType
  fixedRotation?: boolean
  interactWithWorld?: boolean
  mass?: number
  polygons?: Array<Array<{ x: number; y: number }>>
  size?: Vec2
  offset?: Vec2
  friction?: number
  restitution?: number
  density?: number
  linearDamping?: number
  bullet?: boolean
  initialLinearVelocity?: Vec2
  gravityScale?: number
  ellipses?: number[]
}

export default class Physic extends Component {
  public body: Body
  public readonly fixedRotation: boolean
  public readonly mass: number
  public readonly polygons: Array<Array<{ x: number; y: number }>>
  public readonly ellipses: number[]
  public readonly size?: Vec2
  public readonly offset: Vec2
  public readonly friction: number
  public readonly restitution: number
  public readonly density: number
  public readonly linearDamping: number
  public readonly bullet: boolean
  public readonly initialLinearVelocity: Vec2
  public readonly gravityScale: number
  public readonly interactWithWorld: boolean
  public readonly type: PhysicType

  public constructor(options?: PhysicParams) {
    super()
    this.type = options?.type ?? PhysicType.STATIC
    this.mass = options?.mass ?? 1
    this.fixedRotation = options?.fixedRotation ?? false
    this.polygons = options?.polygons ?? []
    this.size = options?.size ?? undefined
    this.offset = options?.offset ?? Vec2.zero()
    this.friction = options?.friction ?? 0.2
    this.restitution = options?.restitution ?? 0
    this.density = options?.density ?? 0
    this.linearDamping = options?.linearDamping ?? 0
    this.bullet = options?.bullet ?? false
    this.interactWithWorld = options?.interactWithWorld ?? true
    this.initialLinearVelocity = options?.initialLinearVelocity ?? Vec2.zero()
    this.gravityScale = options?.gravityScale ?? 1
    this.ellipses = options?.ellipses ?? []
  }
}

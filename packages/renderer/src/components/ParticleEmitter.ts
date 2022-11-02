import { Vec2 } from '@mythor/math'
import { Component, Entity } from '@mythor/core'
import Texture from '../toRename/Texture'
import Color, { colorWhite } from '../color/Color'

export interface BufferContent {
  buffer1: WebGLBuffer
  buffer2: WebGLBuffer
}

type Minmax<T> =
  | T
  | {
      min: T
      max: T
    }

type StartEnd<T> = {
  start: T
  end: T
}

type TOrStartEnd<T> = T | StartEnd<T>

type TimingValues = [number, number, number, number]
export enum TimingFunction {
  LINEAR,
  EASE,
  EASE_IN,
  EASE_IN_OUT,
  EASE_OUT,
  SMOOTH_IN,
  SMOOTH_OUT,
  SMOOTH_IN_OUT,
}

const timingFunctionMapping: Record<TimingFunction, TimingValues> = {
  [TimingFunction.LINEAR]: [0, 0, 1, 1],
  [TimingFunction.EASE]: [0.25, 0.1, 0.25, 1.0],
  [TimingFunction.EASE_IN]: [0.42, 0.0, 1.0, 1.0],
  [TimingFunction.EASE_IN_OUT]: [0.42, 0.0, 0.58, 1.0],
  [TimingFunction.EASE_OUT]: [0.0, 0.0, 0.58, 1.0],
  [TimingFunction.SMOOTH_IN]: [0.2, 1, 0, 1],
  [TimingFunction.SMOOTH_OUT]: [1, 0, 0.8, 0],
  [TimingFunction.SMOOTH_IN_OUT]: [0.2, 1, 0.8, 0],
}

type Timing = TimingValues | TimingFunction

const getTimingValues = (timing?: Timing): TimingValues => {
  if (!timing) {
    return timingFunctionMapping[TimingFunction.LINEAR]
  }

  if (Array.isArray(timing)) {
    return timing
  }

  return timingFunctionMapping[timing]
}

interface ParticleEmitterParameters {
  respawn?: boolean
  frequency?: number
  lifeTime?: Minmax<number>
  theta?: Minmax<number>
  speed?: Minmax<number>
  rotation?: Minmax<number>
  torque?: Minmax<number>
  size?: Minmax<Vec2> & {
    timing?: Timing
  }
  textureOrigin?: Vec2 | (() => Vec2)
  textureSize?: Vec2 | (() => Vec2)
  offset?: Vec2
  deleteOnEndOfLife?: boolean
  onEndOfLife?: (entity: Entity) => void
  gravity?: Vec2
  texture?: Texture
  color?: TOrStartEnd<Color> & {
    timing?: Timing
  }
}

function minMaxVec2(
  value: Minmax<number> | undefined,
  defaultValue: Vec2
): Vec2 {
  if (value === undefined) {
    return defaultValue
  }

  if (typeof value === 'number') {
    return Vec2.create(value, value)
  }

  if (value.min > value.max) {
    throw new Error(
      `Min cannot be greater than Max. min: ${value.min}, max: ${value.max}`
    )
  }

  return Vec2.create(value.min, value.max)
}

function minMaxSize(
  value: Minmax<Vec2> | undefined,
  defaultValue: Vec2
): {
  min: Vec2
  max: Vec2
} {
  if (!value) {
    return { max: defaultValue, min: defaultValue }
  }

  if (value instanceof Vec2) {
    return { max: value, min: value }
  }

  return value
}

function generateOriginFunction(
  origin: undefined | Vec2 | (() => Vec2),
  defaultValue: Vec2
): () => Vec2 {
  if (!origin) {
    return () => defaultValue
  }

  return typeof origin === 'function' ? origin : () => origin
}

class ParticleEmitter extends Component {
  public textureOriginBuffer: WebGLBuffer
  public textureSizeBuffer: WebGLBuffer
  public buffers: Map<string, BufferContent>

  public readonly maxParticleNumber
  public particleNumber = 0
  public readonly minMaxLifeTime: Vec2
  public readonly minMaxTheta: Vec2
  public readonly minMaxSpeed: Vec2
  public readonly minMaxRotation: Vec2
  public readonly minMaxTorque: Vec2
  public readonly offset: Vec2
  public readonly frequency: number
  public readonly startColor: Color
  public readonly endColor: Color
  public readonly gravity: Vec2
  public texture?: Texture
  public textureOriginFunction: () => Vec2
  public textureSizeFunction: () => Vec2
  public readonly minMaxSize: [number, number, number, number]
  public readonly respawn: boolean
  public age = 0
  public deleteOnEndOfLife: boolean
  public onEndOfLife?: (entity: Entity) => void
  public colorTimingBezier: TimingValues
  public sizeTimingBezier: TimingValues

  public constructor(
    maxParticleNumber: number,
    params?: ParticleEmitterParameters
  ) {
    super()
    this.buffers = new Map<string, BufferContent>()
    this.textureOriginFunction = generateOriginFunction(
      params?.textureOrigin,
      Vec2.zero()
    )
    this.textureSizeFunction = generateOriginFunction(
      params?.textureSize,
      Vec2.create(1, 1)
    )
    this.maxParticleNumber = maxParticleNumber
    this.minMaxLifeTime = minMaxVec2(params?.lifeTime, Vec2.create(1, 1))
    this.minMaxTheta = minMaxVec2(params?.theta, Vec2.create(-Math.PI, Math.PI))
    this.minMaxSpeed = minMaxVec2(params?.speed, Vec2.create(100, 100))
    this.minMaxRotation = minMaxVec2(params?.rotation, Vec2.create(0, 0))
    this.minMaxTorque = minMaxVec2(params?.torque, Vec2.create(0, 0))
    this.frequency = params?.frequency ?? 1
    this.offset = params?.offset ?? Vec2.zero()
    this.gravity = params?.gravity ?? Vec2.zero()
    const minMaxSized = minMaxSize(params?.size, Vec2.create(10, 10))
    this.minMaxSize = [
      minMaxSized.min.x,
      minMaxSized.min.y,
      minMaxSized.max.x,
      minMaxSized.max.y,
    ]
    this.startColor =
      (params?.color as StartEnd<Color>)?.start ??
      (params?.color as Color) ??
      colorWhite
    this.endColor =
      (params?.color as StartEnd<Color>)?.end ??
      (params?.color as Color) ??
      colorWhite
    this.texture = params?.texture
    this.respawn = params?.respawn ?? false
    this.deleteOnEndOfLife = params?.deleteOnEndOfLife ?? false
    this.onEndOfLife = params?.onEndOfLife
    this.colorTimingBezier = getTimingValues(params?.color?.timing)
    this.sizeTimingBezier = getTimingValues(params?.size?.timing)
  }
}

export default ParticleEmitter

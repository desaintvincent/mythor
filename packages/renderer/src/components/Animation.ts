import { Component } from '@mythor/core'

interface AnimationDefinition {
  fallBack?: number | string
  start: number
  end: number
  loop: boolean
  speed: number
}

interface AddParams {
  loop?: boolean
  speed?: number
  fallBack?: number | string
}

export default class Animation<
  AnimationId extends string | number = string | number
> extends Component {
  public currentFrame = 0
  public time = 0
  public currentAnimation: AnimationId
  public previousAnimation: AnimationId
  public animations: Map<AnimationId, AnimationDefinition>
  public animationSpeed: number
  public finished: boolean

  public constructor(animationSpeedInSeconds = 0) {
    super()
    this.currentFrame = 0
    this.time = 0
    this.currentAnimation = null
    this.previousAnimation = null
    this.animations = new Map<AnimationId, AnimationDefinition>()
    this.animationSpeed = animationSpeedInSeconds
    this.finished = true
  }

  public running(name: AnimationId): boolean {
    return this.currentAnimation === name
  }

  public add(
    name: AnimationId,
    start: number,
    end: number,
    params?: AddParams
  ): Animation {
    this.animations.set(name, {
      end,
      loop: params?.loop ?? true,
      speed: params?.speed ?? 0,
      start,
      fallBack: params?.fallBack ?? null,
    })
    if (!this.currentAnimation) {
      this.run(name)
    }

    return this
  }

  public run(name: AnimationId, reset = false): Animation {
    if (!(reset || this.currentAnimation !== name)) {
      return this
    }

    if (!this.animations.has(name)) {
      return this
    }

    this.time = 0
    this.finished = false
    if (this.currentAnimation !== name) {
      this.previousAnimation = this.currentAnimation
    }
    this.currentAnimation = name
    this.currentFrame = this.animations.get(name)?.start

    return this
  }
}

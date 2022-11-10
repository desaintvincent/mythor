import { Component } from '@mythor/core'

interface AnimationDefinition {
  start: number
  end: number
  loop: boolean
  speed: number
}

type AnimationId = string

interface AddParams {
  loop?: boolean
  speed?: number
}

export default class Animation extends Component {
  public currentFrame = 0
  public time = 0
  public currentAnimation: AnimationId
  public previousAnimation: AnimationId
  public animations: Record<AnimationId, AnimationDefinition>
  public animationSpeed: number
  public finished: boolean

  public constructor(animationSpeedInSeconds = 0) {
    super()
    this.currentFrame = 0
    this.time = 0
    this.currentAnimation = ''
    this.previousAnimation = ''
    this.animations = {}
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
    this.animations[name] = {
      end,
      loop: params?.loop ?? true,
      speed: params?.speed ?? 0,
      start,
    }
    if (!this.currentAnimation) {
      this.run(name)
    }

    return this
  }

  public run(name: AnimationId, reset = false): Animation {
    if (reset || this.currentAnimation !== name) {
      this.time = 0
      this.finished = false
      if (this.currentAnimation !== name) {
        this.previousAnimation = this.currentAnimation
      }
      this.currentAnimation = name
      this.currentFrame = this.animations[name].start
    }

    return this
  }
}

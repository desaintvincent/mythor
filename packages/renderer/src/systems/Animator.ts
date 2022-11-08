import { Entity, System } from '@mythor/core'
import Sprite from '../components/Sprite'
import Animation from '../components/Animation'

export default class Animator extends System {
  public constructor() {
    super('Animator', [Animation, Sprite])
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const animation = entity.get(Animation)
    if (!animation.animations[animation.currentAnimation]) {
      return
    }
    const sprite = entity.get(Sprite)
    animation.time += elapsedTimeInSeconds
    const { speed } = animation.animations[animation.currentAnimation]
    if (animation.time >= (speed || animation.animationSpeed)) {
      animation.time = 0
      animation.currentFrame++

      const { start, end, loop } =
        animation.animations[animation.currentAnimation]

      if (animation.currentFrame > end) {
        if (loop) {
          animation.currentFrame = start
        } else {
          animation.finished = true
          animation.currentFrame--
        }
      }
    }

    sprite.origin.x = (animation.currentFrame * sprite.size.x) % 1
    sprite.origin.y =
      Math.floor(animation.currentFrame * sprite.size.x) * sprite.size.y
  }
}

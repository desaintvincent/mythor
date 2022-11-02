import { lerp, Vec2 } from '@mythor/math'
import Camera from './toRename/Camera'

const lerpCamera =
  (lerpAmout = 0.05) =>
  (
    target: Vec2,
    currentPosition: Vec2,
    elapsedTimeInSeconds: number,
    camera: Camera
  ) => {
    currentPosition.x = lerp(
      currentPosition.x,
      target.x,
      lerpAmout * camera.scale
    )
    currentPosition.y = lerp(
      currentPosition.y,
      target.y,
      lerpAmout * camera.scale
    )

    return currentPosition
  }

export default lerpCamera

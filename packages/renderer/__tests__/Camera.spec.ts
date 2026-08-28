import Camera from '../src/objects/Camera'
import { Vec2 } from '@mythor/math'

describe('Camera', () => {
  it('converts between world and screen using position and scale', () => {
    const camera = new Camera(new Vec2(200, 100))
    camera.lookat(new Vec2(10, 20))
    camera.scale = 2

    expect(camera.worldToScreen(new Vec2(10, 20))).toEqual(new Vec2(100, 50))
    expect(camera.screenToWorld(new Vec2(100, 50))).toEqual(new Vec2(10, 20))
  })

  it('clamps scale within bounds', () => {
    const camera = new Camera()
    camera.scale = 0.01
    expect(camera.scale).toBe(0.1)

    camera.scale = 20
    expect(camera.scale).toBe(10)
  })

  it('updates target from a target function', () => {
    const camera = new Camera()
    camera.setTargetFunction((target, to) => to.add(target))
    camera.target(new Vec2(2, 3))
    camera.update(1)

    expect(camera.getPosition()).toEqual(new Vec2(2, 3))
  })
})

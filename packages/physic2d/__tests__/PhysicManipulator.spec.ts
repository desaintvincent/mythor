import { Vec2 } from '@mythor/math'
import PhysicManipulator from '../src/utils/PhysicManipulator'

describe('PhysicManipulator', () => {
  it('sets and reads linear velocity through the physic body', () => {
    const body = createBodyStub()

    PhysicManipulator.setVelocity({ body } as never, new Vec2(3, 4))
    expect(body.setLinearVelocity).toHaveBeenCalledWith({ x: 3, y: 4 })

    body.getLinearVelocity.mockReturnValueOnce({ x: 6, y: 7 })
    expect(PhysicManipulator.getVelocity({ body } as never)).toEqual(
      new Vec2(6, 7)
    )
  })

  it('adds velocity by mutating the current vector', () => {
    const velocity = { x: 1, y: 2 }
    const body = createBodyStub(velocity)

    PhysicManipulator.addVelocity({ body } as never, new Vec2(8, 9))

    expect(body.setLinearVelocity).toHaveBeenCalledWith(velocity)
    expect(velocity).toEqual({ x: 8, y: 9 })
  })

  it('applies force and impulse at the world center', () => {
    const point = { x: 11, y: 12 }
    const body = createBodyStub(undefined, point)

    PhysicManipulator.applyForce({ body } as never, new Vec2(1, 2))
    PhysicManipulator.applyImpulse({ body } as never, new Vec2(3, 4))

    expect(body.applyForce).toHaveBeenCalledWith({ x: 1, y: 2 }, point)
    expect(body.applyLinearImpulse).toHaveBeenCalledWith({ x: 3, y: 4 }, point)
  })
})

function createBodyStub(
  velocity = { x: 0, y: 0 },
  worldCenter = { x: 0, y: 0 }
) {
  return {
    applyForce: jest.fn(),
    applyLinearImpulse: jest.fn(),
    getLinearVelocity: jest.fn(() => velocity),
    getWorldCenter: jest.fn(() => worldCenter),
    setLinearVelocity: jest.fn(),
  }
}

import { Vec2 } from '@mythor/math'
import Physic from '../components/Physic'
import toPlank from './toPlank'

class PhysicManipulator {
  public static setVelocity({ body }: Physic, velocity: Vec2): void {
    body.setLinearVelocity(toPlank(velocity.x, velocity.y))
  }

  public static getVelocity({ body }: Physic): Vec2 {
    const v = body.getLinearVelocity()

    return Vec2.create(v.x, v.y)
  }

  public static addVelocity({ body }: Physic, velocityToAdd: Vec2): void {
    const v = body.getLinearVelocity()
    v.x = velocityToAdd.x
    v.y = velocityToAdd.y

    body.setLinearVelocity(v)
  }

  // public static applyForce({ body }: Physic, force: Vec2): {}
}

export default PhysicManipulator

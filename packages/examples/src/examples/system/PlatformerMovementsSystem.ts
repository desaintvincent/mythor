import { System } from '@mythor/core'
import PlatformerMovements from '../components/PlatformerMovements'
import Movement from '../components/Movement'
import {
  Physic,
  PhysicManipulator,
  PhysicSystem,
  PhysicType,
} from '@mythor/physic2d'
import { Vec2 } from '@mythor/math'
import MovementStats from '../components/MovementStats'

/* @todo
- [ ] stats
- [ ] start move with acceleration
- [ ] stop move with deceleration
- [ ] jump
- [ ] can jump
- [ ] jump queue
- [ ] coyote

 */

class PlatformerMovementsSystem extends System {
  public constructor() {
    super(
      'PlatformerMovementsSystem',
      [PlatformerMovements, MovementStats, Physic],
      { systems: [PhysicSystem] }
    )
  }

  public onEntityCreation(entity): void {
    const physic = entity.get(Physic)
    const { body } = physic
    physic.type = PhysicType.DYNAMIC
    body.setType(PhysicType.DYNAMIC)

    physic.gravityScale = 0
    body.setGravityScale(0)

    body.setAwake(true)
    body.setSleepingAllowed(false)

    physic.fixedRotation = true
    body.setFixedRotation(true)

    // @todo set friction to 0??
  }

  public onEntityUpdate(entity, elapsedTimeInSeconds): void {
    const movements = entity.get(PlatformerMovements)
    const stats = entity.get(MovementStats)
    const physic = entity.get(Physic)

    PhysicManipulator.applyForce(physic, Vec2.create(0, 981))

    if (movements.movements[Movement.LEFT]) {
      PhysicManipulator.applyForce(physic, Vec2.create(-stats.move, 0))
    }
    if (movements.movements[Movement.RIGHT]) {
      PhysicManipulator.applyForce(physic, Vec2.create(stats.move, 0))
    }

    if (
      !movements.movements[Movement.LEFT] &&
      !movements.movements[Movement.RIGHT]
    ) {
      const velocity = PhysicManipulator.getVelocity(physic)
      PhysicManipulator.setVelocity(physic, Vec2.create(0, velocity.y))
    }
    if (movements.movements[Movement.JUMP] && this.canJump()) {
      PhysicManipulator.applyForce(physic, Vec2.create(0, -stats.jump))
    }
  }

  private canJump(): boolean {
    return true
  }
}

export default PlatformerMovementsSystem

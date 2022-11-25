import { Entity, System } from '@mythor/core'
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
import PlatformerSensors from '../components/PlatformerSensors'

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
  private readonly wallDetection: number = 0.9
  private readonly groundDetection: number = 0

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
  }

  public sensors(entity: Entity): void {
    const body = entity.get(Physic).body
    const sensor = entity.get(PlatformerSensors)

    if (!body) {
      return
    }

    sensor.onGround = false
    sensor.onTop = false
    sensor.onLeft = false
    sensor.onRight = false

    const contactList = body.getContactList()
    if (!contactList) {
      return
    }

    for (let edge: any | undefined = contactList; edge; edge = edge.next) {
      const contact = edge.contact
      const worldManifold = contact.getWorldManifold(null)
      if (!worldManifold) {
        continue
      }
      const bodyA = contact.getFixtureA().getBody()
      const bodyB = contact.getFixtureB().getBody()
      const normal = worldManifold.normal

      // if (bodyA === body) {
      //   sensor.onGround = normal.y > this.groundDetection
      //   sensor.onTop = normal.y < -this.groundDetection
      //   sensor.onLeft = normal.x < -this.wallDetection
      //   sensor.onRight = normal.x > this.wallDetection
      // }
      //
      // if (bodyB === body) {
      //   sensor.onGround = normal.y < -this.groundDetection
      //   sensor.onTop = normal.y > this.groundDetection
      //   sensor.onLeft = normal.x > this.wallDetection
      //   sensor.onRight = normal.x < -this.wallDetection
      // }

      if (bodyA === body) {
        sensor.onGround = sensor.onGround || normal.y > this.groundDetection
        sensor.onTop = sensor.onTop || normal.y < -this.groundDetection
        sensor.onLeft = sensor.onLeft || normal.x < -this.wallDetection
        sensor.onRight = sensor.onRight || normal.x > this.wallDetection
      }

      if (bodyB === body) {
        sensor.onGround = sensor.onGround || normal.y < -this.groundDetection
        sensor.onTop = sensor.onTop || normal.y > this.groundDetection
        sensor.onLeft = sensor.onLeft || normal.x > this.wallDetection
        sensor.onRight = sensor.onRight || normal.x < -this.wallDetection
      }
    }

    if (!sensor.onGround) {
      console.log('====> platformerState', sensor)
    }
  }

  public onEntityUpdate(entity): void {
    this.sensors(entity)
    this.movement(entity)
  }

  private movement(entity: Entity): void {
    const movements = entity.get(PlatformerMovements)
    const stats = entity.get(MovementStats)
    const physic = entity.get(Physic)

    const velocity = PhysicManipulator.getVelocity(physic)
    PhysicManipulator.applyForce(physic, Vec2.create(0, stats.gravity))

    if (movements.movements[Movement.LEFT]) {
      velocity.x = -stats.move
    } else if (movements.movements[Movement.RIGHT]) {
      velocity.x = stats.move
    }

    if (
      !movements.movements[Movement.LEFT] &&
      !movements.movements[Movement.RIGHT]
    ) {
      velocity.x = 0
    }
    if (movements.movements[Movement.JUMP] && this.canJump()) {
      PhysicManipulator.applyForce(physic, Vec2.create(0, -stats.jump))
    }

    PhysicManipulator.setVelocity(physic, velocity)
  }

  private canJump(): boolean {
    return true
  }
}

export default PlatformerMovementsSystem

import { System, Transform } from '@mythor/core'
import PlatformerMovements from '../components/PlatformerMovements'
import Movement from '../components/Movement'
import { Physic, PhysicManipulator, PhysicSystem } from '@mythor/physic2d'
import { Vec2 } from '@mythor/math'
import physicManipulator from '@mythor/physic2d/lib/utils/PhysicManipulator'

class PlatformerMovementsSystem extends System {
  public constructor() {
    super(
      'PlatformerMovementsSystem',
      [PlatformerMovements, Transform, Physic],
      { systems: [PhysicSystem] }
    )
  }

  public onEntityUpdate(entity, elapsedTimeInSeconds): void {
    const movments = entity.get(PlatformerMovements)
    const transform = entity.get(Transform)
    const physic = entity.get(Physic)

    const velocity = PhysicManipulator.getVelocity(physic)
    velocity.y += 100

    if (movments.movements[Movement.LEFT]) {
      console.log('====> left')
      velocity.x -= 100
    }
    if (movments.movements[Movement.RIGHT]) {
      console.log('====> right')
      velocity.x += 100
      // PhysicManipulator.addVelocity(physic, Vec2.create(1000, 0))
    }

    if (
      !movments.movements[Movement.LEFT] &&
      !movments.movements[Movement.RIGHT]
    ) {
      // velocity.x = 0
    }
    if (movments.movements[Movement.JUMP]) {
      velocity.y -= 100
      // console.log('====> jump')
      // console.log(
      //   '====> physic.body.getTransform()',
      //   physic.body.getTransform()
      // )

      console.log(
        '====> PhysicManipulator.getVelocity(physic)'
        // PhysicManipulator.getVelocity(physic)
      )

      // PhysicManipulator.addVelocity(physic, Vec2.create(0, -1000))
    }

    const gravity = 100
    const body = physic.body

    physicManipulator.setVelocity(physic, velocity)
    // body.setLinearVelocity(toPlank(0, 500))
    // PhysicManipulator.addVelocity(physic, Vec2.create(0, 500))
    // console.log('====> entity._id', entity._id)
    // transform.position.y += elapsedTimeInSeconds * gravity

    //
    //
    // console.log('====> position.y', position.y)
  }
}

export default PlatformerMovementsSystem

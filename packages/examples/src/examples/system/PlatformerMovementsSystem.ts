import { System, Transform } from '@mythor/core'
import PlatformerMovements from '../components/PlatformerMovements'
import Movement from '../components/Movement'
import { Physic, toPlank } from '@mythor/physic2d'

class PlatformerMovementsSystem extends System {
  public constructor() {
    super('PlatformerMovementsSystem', [PlatformerMovements, Transform, Physic])
  }

  public onEntityUpdate(entity, elapsedTimeInSeconds): void {
    const movments = entity.get(PlatformerMovements)
    const transform = entity.get(Transform)
    const physic = entity.get(Physic)

    if (movments.movements[Movement.LEFT]) {
      console.log('====> left')
    }
    if (movments.movements[Movement.RIGHT]) {
      console.log('====> right')
    }
    if (movments.movements[Movement.JUMP]) {
      console.log('====> jump')
      console.log(
        '====> physic.body.getTransform()',
        physic.body.getTransform()
      )
    }

    const gravity = 100
    const body = physic.body
    // body.setLinearVelocity({ x: 0, y: 500 })
    // console.log('====> entity._id', entity._id)
    transform.position.y += elapsedTimeInSeconds * gravity

    //
    //
    // console.log('====> position.y', position.y)
  }
}

export default PlatformerMovementsSystem

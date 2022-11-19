import { Entity, System } from '@mythor/core'
import EventControls from '../components/EventControls'
import PlatformerMovements from '../components/PlatformerMovements'
import { EventsManager } from '@mythor/events'
import Movement from '../components/Movement'

class PlatformerControllerSystem extends System {
  public constructor() {
    super('PlatformerControllerSystem', [EventControls, PlatformerMovements], {
      managers: [EventsManager],
    })
  }

  protected onEntityUpdate(entity: Entity) {
    const events = this.ecs.manager(EventsManager)
    const { keys } = entity.get(EventControls)
    const { movements } = entity.get(PlatformerMovements)

    movements[Movement.LEFT] = events.keyIsDown(keys[Movement.LEFT])
    movements[Movement.RIGHT] = events.keyIsDown(keys[Movement.RIGHT])
    movements[Movement.JUMP] = events.keyPressed(keys[Movement.JUMP])
  }
}

export default PlatformerControllerSystem

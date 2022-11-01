import Component from '../ecs/Component'
import Entity from '../ecs/Entity'

export default class Owner implements Component {
  public _entity: Entity
  public readonly id: string

  public constructor(entity: Entity) {
    this.id = entity._id
  }

  public is(entity: Entity): boolean {
    return this.id === entity._id
  }
}

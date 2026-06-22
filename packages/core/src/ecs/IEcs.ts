import type Entity from './Entity'

export interface IEcs {
  addEntityToCollections(entity: Entity): void
  destroyEntity(entity: Entity): void
}

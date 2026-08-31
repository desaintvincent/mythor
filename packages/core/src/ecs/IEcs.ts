import type Entity from './Entity'
import type System from './System'
import type Manager from './Manager'
import type EntityCollection from '../collections/EntityCollection'
import type IList from '../lists/IList'
import type { ArrayListOptions } from '../lists/List'
import type { Constructor } from '../collections/Signable'

export interface IEcs {
  readonly entities: Map<string, Entity>
  getEntityNumber(): number
  readonly systems: { has(constructor: Constructor<System | Manager>): boolean }
  readonly managers: {
    has(constructor: Constructor<System | Manager>): boolean
  }
  readonly entityCollections: EntityCollection
  readonly duration: number
  init(): Promise<void>
  stop(): void
  update(elapsedTimeInSeconds: number, totalTimeInSeconds: number): void
  registerSystems(...systemInstances: System[]): void
  registerManagers(...managerInstances: Manager[]): void
  system<C extends System>(constructor: Constructor<C>): C
  manager<C extends Manager>(constructor: Constructor<C>): C
  entity(entityId: string): Entity | undefined
  create(id?: string): Entity
  createList(
    options: ArrayListOptions<Entity>,
    listConstructor?: Constructor<IList<Entity>>
  ): IList<Entity>
  addEntityToCollections(entity: Entity): void
  destroyEntity(entity: Entity): void
  flush(reset?: boolean): void
}

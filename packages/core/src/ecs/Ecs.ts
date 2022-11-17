import Entity from './Entity'
import EntityCollection from '../collections/EntityCollection'
import System from './System'
import {
  Constructor,
  getConstructor,
  isRegistered,
} from '../collections/Signable'
import Manager from './Manager'
import now from '../util/now'
import { ArrayListOptions } from '../lists/List'
import IList from '../lists/IList'
import SignableMap from '../collections/SignableMap'

export interface EcsOptions {
  queueEntities?: boolean
}

export default class Ecs {
  private readonly _systems: SignableMap<System>
  private readonly _managers: SignableMap<Manager>
  private readonly _entityCollections: EntityCollection
  private readonly _entities: Map<string, Entity>

  private _queueEntities: boolean
  private readonly _entitiesToCreate: Entity[] = []
  private readonly _entitiesToDestroy: Entity[] = []

  private _duration: number

  public constructor(options?: EcsOptions) {
    this._queueEntities = options?.queueEntities ?? false
    this._entities = new Map()
    this._duration = 0

    this._systems = new SignableMap<System>('system', 'lightblue')
    this._managers = new SignableMap<Manager>('manager', 'red')
    this._entityCollections = new EntityCollection()

    this._entityCollections.onNewList = (list) => {
      this._entities.forEach((entity) =>
        this._entityCollections.addEntityToCollection(entity, list)
      )
    }
  }

  public get entities(): Map<string, Entity> {
    return this._entities
  }

  public getEntityNumber(): number {
    return this._entities.size
  }

  public get systems(): SignableMap<System> {
    return this._systems
  }

  public get managers(): SignableMap<Manager> {
    return this._managers
  }

  public get entityCollections(): EntityCollection {
    return this._entityCollections
  }

  public get duration(): number {
    return this._duration
  }

  public async init(): Promise<void> {
    await this.systems.forEachAsync(async (system) => {
      await system.init(this)
    })

    await this.managers.forEachAsync(
      async (manager) => await manager.init(this)
    )
  }

  public stop(): void {
    this._systems.clear()
    this._managers.clear()
    this._entities.clear()
    this._entitiesToDestroy.length = 0
    this._entitiesToCreate.length = 0
    this._duration = 0
    // todo clear entityCollections
  }

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const beginTotal = now()
    this.managers.forEach((manager) => {
      manager.update(this, elapsedTimeInSeconds, totalTimeInSeconds)
    })
    this.systems.forEach((system) => {
      const begin = now()
      if (!system.disabled()) {
        system.update(elapsedTimeInSeconds, totalTimeInSeconds)
        system.setDuration(now() - begin)
      } else {
        system.setDuration(0)
      }
    })

    this.managers.forEach((manager) => {
      manager.postUpdate(this)
    })
    this._duration = now() - beginTotal
    this.destroyEntities()
  }

  private destroyEntities(): void {
    while (this._entitiesToDestroy.length > 0) {
      const entityToDestroy = this._entitiesToDestroy.shift()
      if (!entityToDestroy) {
        return
      }
      this.__destroyEntity(entityToDestroy)
    }
  }

  public registerSystems(...systemInstances: System[]): void {
    systemInstances.forEach((systemInstance) => {
      const constructor = getConstructor(systemInstance)

      if (!isRegistered(constructor) || !this.systems.has(constructor)) {
        this.systems.set(systemInstance)
      }
    })
  }

  public registerManagers(...managerInstances: Manager[]): void {
    managerInstances.forEach((managerInstance) => {
      const constructor = getConstructor(managerInstance)

      if (!this.managers.has(constructor)) {
        this.managers.set(managerInstance)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        managerInstance.ecs = this
      }
    })
  }

  public system<C extends System>(constructor: Constructor<C>): C {
    return this._systems.get(constructor)
  }

  public manager<C extends Manager>(constructor: Constructor<C>): C {
    return this.managers.get(constructor)
  }

  public entity(entityId: string): Entity | undefined {
    return this._entities.get(entityId)
  }

  public create(id = undefined): Entity {
    const entity = new Entity(id)
    entity.setEcs(this)
    if (this._queueEntities) {
      this._entitiesToCreate.push(entity)
    } else {
      this._entities.set(entity._id, entity)
    }

    return entity
  }

  public createList(
    options: ArrayListOptions<Entity>,
    listConstructor?: Constructor<IList<Entity>>
  ): IList<Entity> {
    return this._entityCollections.createList(options, listConstructor)
  }

  public addEntityToCollections(entity: Entity): void {
    if (this._queueEntities) {
      return
    }
    this._entityCollections.addEntity(entity)
  }

  public destroyEntity(entity: Entity): void {
    this._entitiesToDestroy.push(entity)
  }

  public flush(reset = false): void {
    while (this._entitiesToCreate.length > 0) {
      const entity = this._entitiesToCreate.shift()
      if (entity == null) {
        return
      }
      this._entityCollections.addEntity(entity)
      this._entities.set(entity._id, entity)
    }
    if (reset) {
      this._queueEntities = false
    }
  }

  private __destroyEntity(entity: Entity): void {
    this._entityCollections.removeEntity(entity)
    this._entities.delete(entity._id)
  }
}

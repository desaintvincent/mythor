import MapList from '../lists/MapList'
import Component from '../ecs/Component'
import {
  Constructor,
  getConstructor,
  getSignature,
  isRegistered,
} from './Signable'
import Entity from '../ecs/Entity'
import ComponentRegistry from '../registries/ComponentRegistry'
import { ArrayListOptions } from '../lists/List'
import IList from '../lists/IList'
import log from '../util/log'

class EntityCollection {
  private _collectionLists: Record<string, IList<Entity>> = {}
  public onNewList: (l: IList<Entity>) => void = () => {
    // do nothing
  }

  public readonly componentRegistry: ComponentRegistry

  public constructor() {
    this.componentRegistry = new ComponentRegistry()
  }

  public get lists(): Record<string, IList<Entity>> {
    return this._collectionLists
  }

  public select(...constructors: Array<Constructor<Component>>): IList<Entity> {
    const signature = this.buildListSignature(...constructors)

    if (!(signature in this._collectionLists)) {
      this.createListFromSignature(signature, { constructors })
      log(
        `Registering %clist%c "${constructors
          .map((constructor) => constructor.name)
          .join()}" as ${signature}`,
        'yellow'
      )
    }

    return this._collectionLists[signature]
  }

  public createList(
    options: ArrayListOptions<Entity>,
    listConstructor?: Constructor<IList<Entity>>
  ): IList<Entity> {
    const { constructors } = options
    const signature = this.buildListSignature(...constructors)
    log(
      `Registering %clist%c "${constructors
        .map((constructor) => constructor.name)
        .join()}" as ${signature}`,
      'yellow'
    )

    return this.createListFromSignature(signature, options, listConstructor)
  }

  private getConstructorSignature(constructor: Constructor<Component>): number {
    if (!isRegistered(constructor)) {
      this.componentRegistry.registerConstructor(constructor)
    }

    return getSignature(constructor)
  }

  private createListFromSignature(
    signature: number,
    options: ArrayListOptions<Entity>,
    listConstructor?: Constructor<IList<Entity>>
  ): IList<Entity> {
    const newList = new (listConstructor ?? MapList)<Entity>(signature, options)

    this._collectionLists[signature] = newList

    this.onNewList(newList)

    return newList
  }

  private buildListSignature(
    ...constructors: Array<Constructor<Component>>
  ): number {
    return constructors.reduce(
      (accumulator, currentValue) =>
        accumulator | this.getConstructorSignature(currentValue),
      0
    )
  }

  private getEntitySignature(entity: Entity): number {
    return this.buildListSignature(...entity.components.map(getConstructor))
  }

  public addEntity(entity: Entity): void {
    const entitySignature = this.getEntitySignature(entity)

    for (const signature in this._collectionLists) {
      const collection = this._collectionLists[signature]
      if ((collection.signature & entitySignature) === collection.signature) {
        collection.add(entity)
      }
    }
  }

  public addEntityToCollection(
    entity: Entity,
    collection: IList<Entity>
  ): void {
    const entitySignature = this.getEntitySignature(entity)

    if ((collection.signature & entitySignature) === collection.signature) {
      collection.add(entity)
    }
  }

  public removeEntity(entity: Entity): void {
    const entitySignature = this.getEntitySignature(entity)

    for (const signature in this._collectionLists) {
      const collection = this._collectionLists[signature]
      if ((collection.signature & entitySignature) === collection.signature) {
        collection.remove(entity)
      }
    }
  }
}

export default EntityCollection

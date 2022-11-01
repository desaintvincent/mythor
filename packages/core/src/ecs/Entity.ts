import Component from './Component'
import {
  Constructor,
  getConstructor,
  getSignature,
  isRegistered,
} from '../collections/Signable'
import Ecs from './Ecs'
import ComponentRegistry from '../registries/ComponentRegistry'
import uuidv4 from '../util/uuidv4'

export default class Entity {
  public readonly _id: string
  private readonly _children: Entity[] = []
  private _ecs?: Ecs
  private readonly _tags: string[] = []
  private readonly _components: Map<number, Component>
  private _parent?: Entity

  public constructor(id?: string) {
    this._id = id ?? uuidv4()
    this._components = new Map<number, Component>()
  }

  public get parent(): Entity | undefined {
    return this._parent
  }

  public get components(): Component[] {
    return Array.from(this._components.values())
  }

  public setEcs(ecs: Ecs): void {
    this._ecs = ecs
  }

  public addChild(otherEntity: Entity): Entity {
    otherEntity._parent = this
    this._children.push(otherEntity)

    return this
  }

  public addComponent<T extends Component>(componentInstance: T): Entity {
    const constructor = getConstructor(componentInstance)

    if (!isRegistered(constructor)) {
      const cr = new ComponentRegistry()
      cr.registerConstructor(constructor)
    }
    this._components.set(getSignature(constructor), componentInstance)

    return this
  }

  public add(...components: Component[]): Entity {
    components.forEach((component) => {
      component._entity = this
      this.addComponent(component)
    })

    this._ecs?.addEntityToCollections(this)

    return this
  }

  public get<C extends Component>(constructor: Constructor<C>): C {
    return this._components.get(getSignature(constructor)) as C
  }

  // @todo set an arg in get?
  public getRecursive<T extends Component>(
    constructor: Constructor<T>
  ): T | undefined {
    if (this.has(constructor)) {
      return this.get<T>(constructor)
    }

    if (this.parent != null) {
      return this.parent.getRecursive<T>(constructor)
    }

    return undefined
  }

  public forEachChild(cb: (e: Entity) => void, recursive = false): void {
    this._children.forEach((entity) => {
      if (recursive) {
        entity.forEachChild(cb, recursive)
      }
      cb(entity)
    })
  }

  public has(componentConstructor: Constructor<Component>): boolean {
    if (componentConstructor.signature === undefined) {
      return false
    }

    return this._components.has(getSignature(componentConstructor))
  }

  public tag(tagName: string): Entity {
    this._tags.push(tagName)

    return this
  }

  public hasTag(tagName: string): boolean {
    return this._tags.includes(tagName)
  }

  public remove(componentConstructor: Constructor<Component>): Entity {
    if (componentConstructor.signature === undefined) {
      throw new Error('Cannot remove an unsigned Component')
    }
    if (this.has(componentConstructor)) {
      this._components.delete(componentConstructor.signature)
    }

    return this
  }

  public destroy(cascade = true): void {
    if (cascade) {
      this._children.forEach((child) => child.destroy(true))
    }
    this._ecs?.destroyEntity(this)
  }
}

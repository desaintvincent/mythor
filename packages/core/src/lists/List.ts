import { Constructor } from '../collections/Signable'
import Component from '../ecs/Component'

export interface ArrayListOptions<T> {
  constructors: Array<Constructor<Component>>
  onCreate?: (item: T) => void
  onDelete?: (item: T) => void
  shouldBeAdded?: (item: T) => boolean
}

class List<T extends { _id: string }> {
  public readonly _signature: number
  private readonly _contructors: Array<Constructor<Component>> = []

  private readonly onCreate?: (item: T) => void
  private readonly onDelete?: (item: T) => void
  private readonly shouldBeAdded: (item: T) => boolean

  public constructor(signature: number, options: ArrayListOptions<T>) {
    this._signature = signature
    this._contructors = options.constructors
    this.shouldBeAdded = options.shouldBeAdded ?? (() => true)
    this.onCreate = options.onCreate
    this.onDelete = options.onDelete
  }

  public get constructors(): Array<Constructor<Component>> {
    return this._contructors
  }

  public get signature(): number {
    return this._signature
  }

  public add(data: T): void {
    if (!this.shouldBeAdded(data)) {
      return
    }
    this.__add(data)
    this.onCreate?.(data)
  }

  public remove(data: T): void {
    this.onDelete?.(data)
    this.__remove(data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected __add(data: T): void {
    throw new Error('should be implemented')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected __remove(data: T): void {
    throw new Error('should be implemented')
  }
}

export default List

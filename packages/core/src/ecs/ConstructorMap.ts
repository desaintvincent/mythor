import { Constructor, getConstructor } from '../collections/Signable'

class ConstructorMap<T> {
  private readonly _map: Map<Constructor<T>, T>
  public constructor() {
    this._map = new Map<Constructor<T>, T>()
  }

  public clear(): void {
    this._map.clear()
  }

  public delete(key: Constructor<T>): boolean {
    return this._map.delete(key)
  }

  public map<U>(callbackfn: (value: T, index: number) => U): U[] {
    return Array.from(this._map).map(([, value], index) =>
      callbackfn(value, index)
    )
  }

  public forEach(
    callbackfn: (
      value: T,
      key: Constructor<T>,
      map: Map<Constructor<T>, T>
    ) => void
  ): void {
    this._map.forEach(callbackfn)
  }

  public async forEachAsync(
    callbackfn: (
      value: T,
      key: Constructor<T>,
      map: Map<Constructor<T>, T>
    ) => Promise<void>
  ): Promise<void> {
    await Promise.all(
      Array.from(this._map).map(
        async ([key, item]) => await callbackfn(item, key, this._map)
      )
    )
  }

  public get<U extends T>(constructor: Constructor<U>): U {
    return this._map.get(constructor) as U
  }

  public has(key: Constructor<T>): boolean {
    return this._map.has(key)
  }

  public set(value: T): this {
    this._map.set(getConstructor(value), value)

    return this
  }

  public get size(): number {
    return this._map.size
  }
}

export default ConstructorMap

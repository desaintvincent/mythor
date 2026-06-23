import Signable, {
  Constructor,
  getConstructor,
  getSignature,
  isRegistered,
} from './Signable'
import ConstructorRegistry from '../registries/ConstructorRegistry'
import { Logger } from '../util/log'

class SignableMap<T extends Signable> {
  private readonly _map: Map<number, T>
  private readonly registry: ConstructorRegistry<Signable>
  private static constructorRegistries: Map<
    string,
    ConstructorRegistry<Signable>
  > = new Map<string, ConstructorRegistry<Signable>>()
  private name: string
  public constructor(name: string, color: string, logger?: Logger) {
    this.name = name
    this._map = new Map<number, T>()
    let registry = SignableMap.constructorRegistries.get(name)
    if (!registry) {
      registry = new ConstructorRegistry<Signable>(name, color, logger)
      SignableMap.constructorRegistries.set(name, registry)
    }
    this.registry = registry
  }

  public clear(): void {
    this._map.clear()
  }

  public delete(key: Constructor<T>): boolean {
    return this._map.delete(getSignature(key))
  }

  public map<U>(callbackfn: (value: T, index: number) => U): U[] {
    return Array.from(this._map).map(([, value], index) =>
      callbackfn(value, index)
    )
  }

  public forEach(
    callbackfn: (value: T, key: number, map: Map<number, T>) => void
  ): void {
    this._map.forEach(callbackfn)
  }

  public async forEachAsync(
    callbackfn: (value: T, key: number, map: Map<number, T>) => Promise<void>
  ): Promise<void> {
    await Promise.all(
      Array.from(this._map).map(
        async ([key, item]) => await callbackfn(item, key, this._map)
      )
    )
  }

  public get<U extends T>(constructor: Constructor<U>): U {
    return this._map.get(getSignature(constructor)) as U
  }

  public has(key: Constructor<T>): boolean {
    if (!isRegistered(key)) {
      return false
    }

    return this._map.has(getSignature(key))
  }

  public set(value: T): this {
    const constructor = getConstructor(value)
    const signature = isRegistered(constructor)
      ? getSignature(constructor)
      : this.registry.registerConstructor(constructor)
    this._map.set(signature, value)

    return this
  }

  public get size(): number {
    return this._map.size
  }
}

export default SignableMap

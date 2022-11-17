import Signable, {
  Constructor,
  getSignature,
  isRegistered,
} from '../collections/Signable'
import log from '../util/log'

class ConstructorRegistry<T extends Signable> {
  private bits = 0
  private readonly name: string
  private readonly color: string
  public readonly constructors: Array<Constructor<T>> = []

  public constructor(name: string, color: string) {
    this.name = name
    this.color = color
  }

  public registerConstructor(constructor: Constructor<T>): number {
    if (isRegistered(constructor)) {
      return getSignature(constructor)
    }

    const newBit = 1 << this.bits
    this.bits++
    constructor.signature = newBit

    log(
      `Registering %c${this.name}%c "${constructor.name}" as ${newBit}`,
      this.color
    )

    this.constructors.push(constructor)

    return newBit
  }
}

export default ConstructorRegistry

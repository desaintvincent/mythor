import { Constructor } from '../collections/Signable'
import Component from '../ecs/Component'

interface IList<T> {
  readonly signature: number
  readonly constructors: Array<Constructor<Component>>
  readonly add: (data: T) => void
  readonly remove: (data: T) => void
  readonly clear: () => void
  readonly forEach: (callback: (e: T) => void) => void
  readonly length: number
}

export default IList

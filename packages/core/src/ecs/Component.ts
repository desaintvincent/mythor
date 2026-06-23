import type Entity from './Entity'
import Signable from '../collections/Signable'

abstract class Component extends Signable {
  // @todo set protected?
  public _entity: Entity | undefined
}

export default Component

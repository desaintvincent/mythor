import Signable from '../collections/Signable'
import { Logger } from '../util/log'
import ConstructorRegistry from './ConstructorRegistry'

class ComponentRegistry extends ConstructorRegistry<Signable> {
  private static instance?: ComponentRegistry

  public constructor(name = 'component', logger?: Logger) {
    const color = 'SeaGreen'
    super(name, color, logger)
    if (ComponentRegistry.instance) {
      return ComponentRegistry.instance
    }
    ComponentRegistry.instance = this
    this.logger('Creating %cComponentRegistry%c', color)
  }
}

export default ComponentRegistry

import Component from '../ecs/Component'
import log from '../util/log'
import ConstructorRegistry from './ConstructorRegistry'

class ComponentRegistry extends ConstructorRegistry<Component> {
  private static instance?: ComponentRegistry

  public constructor(name = 'component') {
    const color = 'SeaGreen'
    super(name, color)
    if (ComponentRegistry.instance) {
      return ComponentRegistry.instance
    }
    ComponentRegistry.instance = this
    log('Creating %cComponentRegistry%c', color)
  }
}

export default ComponentRegistry

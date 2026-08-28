import Ecs from '../src/ecs/Ecs'
import Component from '../src/ecs/Component'
import System from '../src/ecs/System'
import Manager from '../src/ecs/Manager'
import Entity from '../src/ecs/Entity'

class EcsTestComp extends Component {}

class SimpleSystem extends System {
  public updateCount = 0
  public constructor() {
    super('SimpleSystem', [EcsTestComp])
  }
  protected onEntityUpdate(): void {
    this.updateCount++
  }
}

class SimpleManager extends Manager {
  public initCalled = false
  public updateCount = 0
  public postUpdateCount = 0
  public constructor() {
    super('SimpleManager')
  }
  public async init(): Promise<void> {
    this.initCalled = true
  }
  public update(): void {
    this.updateCount++
  }
  public postUpdate(): void {
    this.postUpdateCount++
  }
}

describe('Ecs', () => {
  describe('create', () => {
    it('stores entity immediately', () => {
      const ecs = new Ecs()
      const entity = ecs.create()
      expect(ecs.entities.has(entity._id)).toBe(true)
    })

    it('creates entity with custom id', () => {
      const ecs = new Ecs()
      const entity = ecs.create('custom-id')
      expect(entity._id).toBe('custom-id')
      expect(ecs.entity('custom-id')).toBe(entity)
    })

    it('getEntityNumber counts stored entities', () => {
      const ecs = new Ecs()
      expect(ecs.getEntityNumber()).toBe(0)
      ecs.create()
      ecs.create()
      expect(ecs.getEntityNumber()).toBe(2)
    })

    it('entity(id) returns undefined for unknown id', () => {
      const ecs = new Ecs()
      expect(ecs.entity('no-such-id')).toBeUndefined()
    })
  })

  describe('queueEntities mode', () => {
    it('entity not in map until flush', () => {
      const ecs = new Ecs({ queueEntities: true })
      const entity = ecs.create()
      expect(ecs.entities.has(entity._id)).toBe(false)
      ecs.flush()
      expect(ecs.entities.has(entity._id)).toBe(true)
    })

    it('flush(reset=true) disables queueing for subsequent creates', () => {
      const ecs = new Ecs({ queueEntities: true })
      ecs.flush(true)
      const entity = ecs.create()
      expect(ecs.entities.has(entity._id)).toBe(true)
    })

    it('flush processes all queued entities', () => {
      const ecs = new Ecs({ queueEntities: true })
      ecs.create()
      ecs.create()
      ecs.create()
      expect(ecs.getEntityNumber()).toBe(0)
      ecs.flush()
      expect(ecs.getEntityNumber()).toBe(3)
    })
  })

  describe('destroyEntity', () => {
    it('entity queued for destruction, removed after update', () => {
      const ecs = new Ecs()
      const entity = ecs.create()
      expect(ecs.entities.has(entity._id)).toBe(true)
      entity.destroy()
      // still present before update flushes the destroy queue
      expect(ecs.entities.has(entity._id)).toBe(true)
      ecs.update(0, 0)
      expect(ecs.entities.has(entity._id)).toBe(false)
    })

    it('stop clears all entities', () => {
      const ecs = new Ecs()
      ecs.create()
      ecs.create()
      ecs.stop()
      expect(ecs.getEntityNumber()).toBe(0)
    })

    it('stop calls clear() on registered systems and managers', async () => {
      const ecs = new Ecs()
      const system = new SimpleSystem()
      const manager = new SimpleManager()
      const systemClearSpy = jest.spyOn(system, 'clear')
      const managerClearSpy = jest.spyOn(manager, 'clear')
      ecs.registerSystems(system)
      ecs.registerManagers(manager)
      await ecs.init()
      ecs.stop()
      expect(systemClearSpy).toHaveBeenCalledTimes(1)
      expect(managerClearSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('systems', () => {
    it('registerSystems → accessible via system()', async () => {
      const ecs = new Ecs()
      const system = new SimpleSystem()
      ecs.registerSystems(system)
      await ecs.init()
      expect(ecs.system(SimpleSystem)).toBe(system)
    })

    it('duplicate registration does not duplicate system', async () => {
      const ecs = new Ecs()
      const system = new SimpleSystem()
      ecs.registerSystems(system, system)
      await ecs.init()
      expect(ecs.system(SimpleSystem)).toBe(system)
    })

    it('update calls onEntityUpdate for matching entities', async () => {
      const ecs = new Ecs()
      const system = new SimpleSystem()
      ecs.registerSystems(system)
      await ecs.init()
      const e = ecs.create()
      e.add(new EcsTestComp())
      ecs.update(1, 1)
      expect(system.updateCount).toBe(1)
    })

    it('disabled system skipped during update', async () => {
      const ecs = new Ecs()
      const system = new SimpleSystem()
      ecs.registerSystems(system)
      await ecs.init()
      const e = ecs.create()
      e.add(new EcsTestComp())
      system.disabled(true)
      ecs.update(1, 1)
      expect(system.updateCount).toBe(0)
    })
  })

  describe('managers', () => {
    it('registerManagers → accessible via manager()', () => {
      const ecs = new Ecs()
      const manager = new SimpleManager()
      ecs.registerManagers(manager)
      expect(ecs.manager(SimpleManager)).toBe(manager)
    })

    it('init calls manager.init', async () => {
      const ecs = new Ecs()
      const manager = new SimpleManager()
      ecs.registerManagers(manager)
      await ecs.init()
      expect(manager.initCalled).toBe(true)
    })

    it('update calls manager.update', () => {
      const ecs = new Ecs()
      const manager = new SimpleManager()
      ecs.registerManagers(manager)
      ecs.update(1, 1)
      expect(manager.updateCount).toBe(1)
    })

    it('update calls manager.postUpdate', () => {
      const ecs = new Ecs()
      const manager = new SimpleManager()
      ecs.registerManagers(manager)
      ecs.update(0, 0)
      expect(manager.postUpdateCount).toBe(1)
    })
  })
})

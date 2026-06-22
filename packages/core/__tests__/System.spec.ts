import Ecs from '../src/ecs/Ecs'
import Component from '../src/ecs/Component'
import System from '../src/ecs/System'
import Entity from '../src/ecs/Entity'

// Define at module scope — stable signatures within this test file
class SysComp extends Component {}
class SysComp2 extends Component {}

class TrackingSystem extends System {
  public created: Entity[] = []
  public destroyed: Entity[] = []
  public updated: Entity[] = []

  public constructor() {
    super('TrackingSystem', [SysComp])
  }

  protected onEntityUpdate(entity: Entity): void {
    this.updated.push(entity)
  }

  protected onEntityCreation(entity: Entity): void {
    this.created.push(entity)
  }

  protected onEntityDestruction(entity: Entity): void {
    this.destroyed.push(entity)
  }
}

class MultiCompSystem extends System {
  public constructor() {
    super('MultiCompSystem', [SysComp, SysComp2])
  }
}

class NoCompSystem extends System {
  public constructor() {
    super('NoCompSystem', [])
  }
}

class FilterSystem extends System {
  public constructor() {
    super('FilterSystem', [SysComp])
  }

  protected shouldBeAdded(entity: Entity): boolean {
    return entity.hasTag('active')
  }
}

describe('System', () => {
  describe('init', () => {
    it('throws when 0 components', async () => {
      const ecs = new Ecs()
      const system = new NoCompSystem()
      ecs.registerSystems(system)
      await expect(ecs.init()).rejects.toThrow()
    })

    it('initializes correctly with components', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await expect(ecs.init()).resolves.toBeUndefined()
    })

    it('onSystemInit hook called during init', async () => {
      class InitHookSystem extends System {
        public hookCalled = false
        public constructor() {
          super('InitHookSystem', [SysComp])
        }
        protected async onSystemInit(): Promise<void> {
          this.hookCalled = true
        }
      }
      const ecs = new Ecs()
      const system = new InitHookSystem()
      ecs.registerSystems(system)
      await ecs.init()
      expect(system.hookCalled).toBe(true)
    })
  })

  describe('entity tracking', () => {
    it('picks up entity with matching component', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e = ecs.create()
      e.add(new SysComp())

      expect(system.getEntities().length).toBe(1)
    })

    it('ignores entity without matching component', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e = ecs.create()
      e.add(new SysComp2())

      expect(system.getEntities().length).toBe(0)
    })

    it('requires ALL components for multi-component system', async () => {
      const ecs = new Ecs()
      const system = new MultiCompSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e1 = ecs.create()
      e1.add(new SysComp())

      const e2 = ecs.create()
      e2.add(new SysComp2())

      const e3 = ecs.create()
      e3.add(new SysComp(), new SysComp2())

      expect(system.getEntities().length).toBe(1)
    })

    it('onEntityCreation called when entity added', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e = ecs.create()
      e.add(new SysComp())

      expect(system.created).toContain(e)
    })

    it('onEntityDestruction called when entity destroyed', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e = ecs.create()
      e.add(new SysComp())
      e.destroy()
      ecs.update(0, 0)

      expect(system.destroyed).toContain(e)
    })
  })

  describe('update', () => {
    it('onEntityUpdate called for each matching entity', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e1 = ecs.create()
      const e2 = ecs.create()
      e1.add(new SysComp())
      e2.add(new SysComp())

      system.updated = []
      ecs.update(1, 1)

      expect(system.updated).toContain(e1)
      expect(system.updated).toContain(e2)
      expect(system.updated).toHaveLength(2)
    })

    it('disabled system skips update', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const e = ecs.create()
      e.add(new SysComp())

      system.disabled(true)
      system.updated = []
      ecs.update(1, 1)

      expect(system.updated).toHaveLength(0)
    })

    it('disabled(true/false) toggles', async () => {
      const ecs = new Ecs()
      const system = new TrackingSystem()
      ecs.registerSystems(system)
      await ecs.init()

      expect(system.disabled()).toBe(false)
      system.disabled(true)
      expect(system.disabled()).toBe(true)
      system.disabled(false)
      expect(system.disabled()).toBe(false)
    })
  })

  describe('shouldBeAdded filter', () => {
    it('respects shouldBeAdded hook', async () => {
      const ecs = new Ecs()
      const system = new FilterSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const tagged = ecs.create()
      tagged.tag('active')
      tagged.add(new SysComp())

      const untagged = ecs.create()
      untagged.add(new SysComp())

      expect(system.getEntities().length).toBe(1)
    })
  })

  describe('dependencies', () => {
    it('throws when required system dependency missing', async () => {
      class DepSystem extends System {
        public constructor() {
          super('DepSystem', [SysComp], { systems: [TrackingSystem] })
        }
      }
      const ecs = new Ecs()
      ecs.registerSystems(new DepSystem())
      await expect(ecs.init()).rejects.toThrow(/missing system dependencies/)
    })

    it('succeeds when required system dependency present', async () => {
      class DepSystem extends System {
        public constructor() {
          super('DepSystem', [SysComp2], { systems: [TrackingSystem] })
        }
      }
      const ecs = new Ecs()
      ecs.registerSystems(new TrackingSystem(), new DepSystem())
      await expect(ecs.init()).resolves.toBeUndefined()
    })
  })
})

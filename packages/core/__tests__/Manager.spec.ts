import Ecs from '../src/ecs/Ecs'
import Manager from '../src/ecs/Manager'

class TrackingManager extends Manager {
  public initCalled = false
  public updateArgs: Array<[number, number]> = []
  public postUpdateCount = 0
  public clearCount = 0

  public constructor() {
    super('TrackingManager')
  }

  public async init(): Promise<void> {
    this.initCalled = true
  }

  public update(_ecs: Ecs, elapsed: number, total: number): void {
    this.updateArgs.push([elapsed, total])
  }

  public postUpdate(): void {
    this.postUpdateCount++
  }

  public clear(): void {
    this.clearCount++
  }
}

class AnotherManager extends Manager {
  public constructor() {
    super('AnotherManager')
  }
}

describe('Manager', () => {
  describe('registration and access', () => {
    it('accessible via manager() after registerManagers', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      expect(ecs.manager(TrackingManager)).toBe(mgr)
    })

    it('multiple managers coexist', () => {
      const ecs = new Ecs()
      const mgr1 = new TrackingManager()
      const mgr2 = new AnotherManager()
      ecs.registerManagers(mgr1, mgr2)
      expect(ecs.manager(TrackingManager)).toBe(mgr1)
      expect(ecs.manager(AnotherManager)).toBe(mgr2)
    })
  })

  describe('lifecycle hooks', () => {
    it('init called during ecs.init()', async () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      await ecs.init()
      expect(mgr.initCalled).toBe(true)
    })

    it('init not called before ecs.init()', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      expect(mgr.initCalled).toBe(false)
    })

    it('update called with elapsed and total time', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      ecs.update(0.016, 1.5)
      expect(mgr.updateArgs).toHaveLength(1)
      expect(mgr.updateArgs[0]).toEqual([0.016, 1.5])
    })

    it('update called on every ecs.update()', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      ecs.update(1, 1)
      ecs.update(1, 2)
      ecs.update(1, 3)
      expect(mgr.updateArgs).toHaveLength(3)
    })

    it('postUpdate called after update each tick', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      ecs.update(0, 0)
      ecs.update(0, 0)
      expect(mgr.postUpdateCount).toBe(2)
    })

    it('ecs.stop() clears all entities and unregisters managers', () => {
      const ecs = new Ecs()
      const mgr = new TrackingManager()
      ecs.registerManagers(mgr)
      ecs.create()
      ecs.stop()
      // stop() clears internal SignableMap — managers no longer accessible
      expect(ecs.getEntityNumber()).toBe(0)
      expect(ecs.managers.has(TrackingManager)).toBe(false)
    })
  })

  describe('name', () => {
    it('returns name passed to constructor', () => {
      const mgr = new TrackingManager()
      expect(mgr.name).toBe('TrackingManager')
    })
  })

  describe('base Manager no-ops', () => {
    it('base init resolves without throwing', async () => {
      const ecs = new Ecs()
      const mgr = new AnotherManager()
      ecs.registerManagers(mgr)
      await expect(ecs.init()).resolves.toBeUndefined()
    })

    it('base update/postUpdate/clear do not throw', () => {
      const ecs = new Ecs()
      const mgr = new AnotherManager()
      ecs.registerManagers(mgr)
      expect(() => ecs.update(0, 0)).not.toThrow()
      expect(() => ecs.stop()).not.toThrow()
    })
  })
})

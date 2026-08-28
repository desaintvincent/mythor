import { Ecs, Manager } from '@mythor/core'
import DevToolsManager from '../src/managers/DevToolsManager'

describe('DevToolsManager', () => {
  const originalDocument = global.document

  beforeEach(() => {
    global.document = {
      body: {
        appendChild: jest.fn(),
      },
      getElementById: jest.fn(() => null),
    } as unknown as Document
  })

  afterEach(() => {
    global.document = originalDocument
  })

  it('creates the enabled debug managers', async () => {
    const manager = new DevToolsManager({
      addStatisticsManager: false,
      addPhysicDebugManager: true,
      addSelectDebugManager: true,
      addRendererDebugManager: true,
    })
    const ecs = new Ecs()

    await manager.init(ecs)

    expect(getSubManagers(manager)).toHaveLength(3)
  })

  it('forwards update/postUpdate/clear to every sub-manager', async () => {
    const manager = new DevToolsManager({
      addStatisticsManager: false,
      addPhysicDebugManager: true,
      addSelectDebugManager: true,
      addRendererDebugManager: true,
    })
    const ecs = new Ecs()

    await manager.init(ecs)

    getSubManagers(manager).forEach((subManager) => {
      jest.spyOn(subManager, 'update')
      jest.spyOn(subManager, 'postUpdate')
      jest.spyOn(subManager, 'clear')
    })

    manager.update(ecs, 1, 2)
    manager.postUpdate(ecs)
    manager.clear()

    getSubManagers(manager).forEach((subManager) => {
      expect(subManager.update).toHaveBeenCalledWith(ecs, 1, 2)
      expect(subManager.postUpdate).toHaveBeenCalledWith(ecs)
      expect(subManager.clear).toHaveBeenCalled()
    })
  })
})

function getSubManagers(
  manager: DevToolsManager
): Array<Pick<Manager, 'update' | 'postUpdate' | 'clear'>> {
  return (manager as unknown as { managers: Manager[] }).managers
}

import { Ecs, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import AudioSystem from '../src/systems/AudioSystem'
import AudioSource from '../src/components/AudioSource'
import AudioListener from '../src/components/AudioListener'
import AudioManager from '../src/managers/AudioManager'

class FakeAudioParam {
  public value = 1
}

class FakeGainNode {
  public gain = new FakeAudioParam()
  public connect = jest.fn()
}

class FakeStereoPannerNode {
  public pan = new FakeAudioParam()
  public connect = jest.fn()
}

class FakeAudioBufferSourceNode {
  public buffer: unknown
  public loop = false
  public onended: (() => void) | null = null
  public connect = jest.fn()
  public start = jest.fn()
  public stop = jest.fn(() => {
    this.onended?.()
  })
}

class FakeAudioContext {
  public destination = {}
  public createGain = jest.fn(() => new FakeGainNode())
  public createStereoPanner = jest.fn(() => new FakeStereoPannerNode())
  public createBufferSource = jest.fn(() => new FakeAudioBufferSourceNode())
  public decodeAudioData = jest.fn(async () => ({}))
}

describe('AudioSystem', () => {
  const audioManager = new AudioManager({
    context: new FakeAudioContext() as unknown as AudioContext,
  })

  const createEcs = async (): Promise<Ecs> => {
    const ecs = new Ecs()
    ecs.registerManagers(audioManager)
    ecs.registerSystems(new AudioSystem())
    await ecs.init()
    // Pre-populate a decoded buffer directly (bypassing AssetManager, which
    // isn't relevant to AudioSystem's behavior).
    ;(audioManager as unknown as { buffers: Map<string, unknown> }).buffers.set(
      'sound',
      {}
    )

    return ecs
  }

  it('plays a source once when autoplay is set', async () => {
    const ecs = await createEcs()
    const entity = ecs.create()
    entity.add(
      new Transform(),
      new AudioSource({ key: 'sound', autoplay: true })
    )

    ecs.update(0, 0)

    const source = entity.get(AudioSource)
    expect(source.isPlaying()).toBe(true)

    const handleAfterFirstUpdate = source.handle
    ecs.update(0, 0)

    expect(source.handle).toBe(handleAfterFirstUpdate)
  })

  it('plays a source on request via play()', async () => {
    const ecs = await createEcs()
    const entity = ecs.create()
    entity.add(new Transform(), new AudioSource({ key: 'sound' }))
    const source = entity.get(AudioSource)

    ecs.update(0, 0)
    expect(source.isPlaying()).toBe(false)

    source.play()
    ecs.update(0, 0)

    expect(source.isPlaying()).toBe(true)
  })

  it('stops a source on request via stop()', async () => {
    const ecs = await createEcs()
    const entity = ecs.create()
    entity.add(
      new Transform(),
      new AudioSource({ key: 'sound', autoplay: true })
    )

    ecs.update(0, 0)
    const source = entity.get(AudioSource)
    expect(source.isPlaying()).toBe(true)

    source.stop()
    ecs.update(0, 0)

    expect(source.isPlaying()).toBe(false)
  })

  it('falls back to world origin as listener position when no AudioListener exists', async () => {
    const ecs = await createEcs()
    const entity = ecs.create()
    entity.add(
      new Transform({ position: Vec2.create(100, 0) }),
      new AudioSource({ key: 'sound', autoplay: true, spatial: true })
    )

    const updateSpatialSpy = jest.spyOn(audioManager, 'updateSpatial')

    ecs.update(0, 0)
    ecs.update(0, 0)

    expect(updateSpatialSpy).toHaveBeenCalledWith(
      expect.any(Number),
      100,
      expect.any(Number),
      expect.anything()
    )

    updateSpatialSpy.mockRestore()
  })

  it('computes distance/pan relative to the active AudioListener entity', async () => {
    const ecs = await createEcs()

    const listenerEntity = ecs.create()
    listenerEntity.add(
      new Transform({ position: Vec2.create(50, 0) }),
      new AudioListener()
    )

    const sourceEntity = ecs.create()
    sourceEntity.add(
      new Transform({ position: Vec2.create(100, 0) }),
      new AudioSource({ key: 'sound', autoplay: true, spatial: true })
    )

    const updateSpatialSpy = jest.spyOn(audioManager, 'updateSpatial')

    ecs.update(0, 0)
    ecs.update(0, 0)

    expect(updateSpatialSpy).toHaveBeenCalledWith(
      expect.any(Number),
      50,
      expect.any(Number),
      expect.anything()
    )

    updateSpatialSpy.mockRestore()
  })

  it('does not push spatial updates for non-spatial sources', async () => {
    const ecs = await createEcs()
    const entity = ecs.create()
    entity.add(
      new Transform(),
      new AudioSource({ key: 'sound', autoplay: true, spatial: false })
    )

    const updateSpatialSpy = jest.spyOn(audioManager, 'updateSpatial')

    ecs.update(0, 0)
    ecs.update(0, 0)

    expect(updateSpatialSpy).not.toHaveBeenCalled()

    updateSpatialSpy.mockRestore()
  })
})

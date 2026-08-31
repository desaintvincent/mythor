import { AssetManager } from '@mythor/assets'
import { Ecs } from '@mythor/core'
import AudioManager from '../src/managers/AudioManager'
import { AudioChannels } from '../src/definitions/AudioChannel'

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
  public suspend = jest.fn(async () => undefined)
  public resume = jest.fn(async () => undefined)
  public createGain = jest.fn(() => new FakeGainNode())
  public createStereoPanner = jest.fn(() => new FakeStereoPannerNode())
  public createBufferSource = jest.fn(() => new FakeAudioBufferSourceNode())
  public decodeAudioData = jest.fn(async (data: ArrayBuffer) => ({
    duration: data.byteLength,
  }))
}

// `AudioManager` is a singleton (mirrors `EventsManager`): a single instance
// is shared by every test in this file, exactly like `EventsManager.spec.ts`.
describe('AudioManager', () => {
  const context = new FakeAudioContext()
  const audioManager = new AudioManager({
    context: context as unknown as AudioContext,
  })
  const assetManager = new AssetManager()
  const ecs = new Ecs()

  beforeAll(async () => {
    assetManager.registerLoader('mock', async (src: string) =>
      src === 'missing.wav' ? undefined : new ArrayBuffer(4)
    )
    ecs.registerManagers(assetManager, audioManager)
    await ecs.init()
    await assetManager.load([{ key: 'sound', src: 'sound.wav', type: 'mock' }])
  })

  describe('decode', () => {
    it('decodes an asset once and caches it', async () => {
      expect(audioManager.isDecoded('sound')).toBe(false)

      await audioManager.decode('sound')
      await audioManager.decode('sound')

      expect(audioManager.isDecoded('sound')).toBe(true)
      expect(context.decodeAudioData).toHaveBeenCalledTimes(1)
    })

    it('throws when decoding a key with no matching registered asset', async () => {
      await expect(audioManager.decode('unregistered-key')).rejects.toThrow()
    })
  })

  describe('play', () => {
    it('throws when playing a key that has not been decoded', () => {
      expect(() => audioManager.play('unregistered-key')).toThrow()
    })

    it('plays, tracks and stops a non-spatial instance', () => {
      const handle = audioManager.play('sound', { channel: AudioChannels.Sfx })

      expect(audioManager.isPlaying(handle)).toBe(true)

      audioManager.stop(handle)

      expect(audioManager.isPlaying(handle)).toBe(false)
    })

    it('only creates a StereoPannerNode for spatial instances', () => {
      context.createStereoPanner.mockClear()

      audioManager.play('sound')
      expect(context.createStereoPanner).not.toHaveBeenCalled()

      audioManager.play('sound', { spatial: true })
      expect(context.createStereoPanner).toHaveBeenCalledTimes(1)
    })

    it('stopAll only stops instances on the given channel', () => {
      const musicHandle = audioManager.play('sound', {
        channel: AudioChannels.Music,
      })
      const sfxHandle = audioManager.play('sound', {
        channel: AudioChannels.Sfx,
      })

      audioManager.stopAll(AudioChannels.Music)

      expect(audioManager.isPlaying(musicHandle)).toBe(false)
      expect(audioManager.isPlaying(sfxHandle)).toBe(true)

      audioManager.stopAll()
    })
  })

  describe('volume', () => {
    it('propagates master and per-channel volume to the underlying gain nodes', () => {
      audioManager.setMasterVolume(0.5)
      expect(audioManager.getMasterVolume()).toBe(0.5)

      audioManager.setChannelVolume(AudioChannels.Music, 0.2)
      expect(audioManager.getChannelVolume(AudioChannels.Music)).toBe(0.2)

      audioManager.mute(AudioChannels.Music)
      expect(audioManager.getChannelVolume(AudioChannels.Music)).toBe(0)

      audioManager.unmute(AudioChannels.Music, 0.8)
      expect(audioManager.getChannelVolume(AudioChannels.Music)).toBe(0.8)

      audioManager.mute()
      expect(audioManager.getMasterVolume()).toBe(0)

      audioManager.unmute()
    })
  })

  describe('updateSpatial', () => {
    it('adjusts gain and pan for a spatial instance and is a no-op for an unknown handle', () => {
      const spatialHandle = audioManager.play('sound', { spatial: true })

      expect(() =>
        audioManager.updateSpatial(spatialHandle, 500, 2)
      ).not.toThrow()

      expect(() => audioManager.updateSpatial(999999, 10, 0)).not.toThrow()
    })

    it('is a no-op for a non-spatial instance', () => {
      const nonSpatialHandle = audioManager.play('sound')

      expect(() =>
        audioManager.updateSpatial(nonSpatialHandle, 10, 0.5)
      ).not.toThrow()
    })
  })

  describe('dependency on AssetManager', () => {
    it('throws a descriptive error when AssetManager is not registered on the ecs', async () => {
      const standaloneEcs = new Ecs()
      const standaloneAudioManager = new AudioManager({
        context: new FakeAudioContext() as unknown as AudioContext,
      })
      standaloneEcs.registerManagers(standaloneAudioManager)
      await standaloneEcs.init()

      await expect(
        standaloneAudioManager.decode('never-decoded')
      ).rejects.toThrow('AssetManager')
    })
  })

  describe('singleton behavior', () => {
    it('a second construction returns the first instance and ignores new options', () => {
      const second = new AudioManager({
        context: new FakeAudioContext() as unknown as AudioContext,
      })

      expect(second).toBe(audioManager)
    })
  })
})

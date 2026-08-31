import { AssetManager } from '@mythor/assets'
import { Manager } from '@mythor/core'
import { AudioChannels, AudioChannel } from '../definitions/AudioChannel'
import {
  AudioInstanceHandle,
  PlayOptions,
  SpatialFalloffOptions,
} from '../types'

export interface AudioManagerOptions {
  context?: AudioContext
  masterVolume?: number
}

interface AudioInstance {
  source: AudioBufferSourceNode
  instanceGain: GainNode
  panner?: StereoPannerNode
  channel: AudioChannel
  baseVolume: number
  spatial: boolean
  playing: boolean
}

const computeSpatialGain = (
  distance: number,
  falloff: SpatialFalloffOptions
): number => {
  const refDistance = falloff.refDistance ?? 1
  const maxDistance = falloff.maxDistance ?? 1000
  const rolloffFactor = falloff.rolloffFactor ?? 1
  const distanceModel = falloff.distanceModel ?? 'inverse'

  // Beyond maxDistance the source is treated as fully silent: unlike the
  // native Web Audio distance models (which only asymptotically approach 0),
  // this gives a predictable, audible cutoff for games.
  if (distance >= maxDistance) {
    return 0
  }

  const clampedDistance = Math.min(Math.max(distance, refDistance), maxDistance)

  switch (distanceModel) {
    case 'linear':
      return (
        1 -
        (rolloffFactor * (clampedDistance - refDistance)) /
          (maxDistance - refDistance || 1)
      )
    case 'exponential':
      return Math.pow(clampedDistance / refDistance, -rolloffFactor)
    case 'inverse':
    default:
      return (
        refDistance /
        (refDistance + rolloffFactor * (clampedDistance - refDistance))
      )
  }
}

/**
 * Web Audio API wrapper. Mirrors `@mythor/events`'s `EventsManager` shape:
 * a singleton `Manager` that owns all browser API state, exposed to systems
 * and game code through simple, ECS-agnostic methods.
 *
 * Builds a fixed audio graph:
 * `source -> instanceGain -> [panner ->] channelGain -> masterGain -> destination`
 *
 * Raw audio data is loaded through `@mythor/assets`'s `AssetManager` (as an
 * `ArrayBuffer`, using the `'audio'` loader) and decoded/cached here.
 */
class AudioManager extends Manager {
  private static instance?: AudioManager
  private readonly context!: AudioContext
  private readonly masterGain!: GainNode
  private readonly channelGains!: Map<AudioChannel, GainNode>
  private readonly buffers!: Map<string, AudioBuffer>
  private readonly instances!: Map<AudioInstanceHandle, AudioInstance>
  private nextHandle = 1

  public constructor(options?: AudioManagerOptions) {
    super('AudioManager')
    if (AudioManager.instance) {
      return AudioManager.instance
    }
    AudioManager.instance = this

    this.context = options?.context ?? new AudioContext()
    this.channelGains = new Map()
    this.buffers = new Map()
    this.instances = new Map()

    this.masterGain = this.context.createGain()
    this.masterGain.gain.value = options?.masterVolume ?? 1
    this.masterGain.connect(this.context.destination)
  }

  private getChannelGain(channel: AudioChannel): GainNode {
    let gain = this.channelGains.get(channel)
    if (!gain) {
      gain = this.context.createGain()
      gain.connect(this.masterGain)
      this.channelGains.set(channel, gain)
    }

    return gain
  }

  private getAssetManager(): AssetManager {
    if (!this.ecs.managers.has(AssetManager)) {
      throw new Error(
        'AudioManager requires an AssetManager to be registered on the ecs'
      )
    }

    return this.ecs.manager(AssetManager)
  }

  public async decode(key: string): Promise<void> {
    if (this.buffers.has(key)) {
      return
    }

    const arrayBuffer = this.getAssetManager().get<ArrayBuffer>(key)
    if (!arrayBuffer) {
      throw new Error(`AudioManager: no asset found for key "${key}"`)
    }

    const buffer = await this.context.decodeAudioData(arrayBuffer.slice(0))
    this.buffers.set(key, buffer)
  }

  public isDecoded(key: string): boolean {
    return this.buffers.has(key)
  }

  public play(key: string, options?: PlayOptions): AudioInstanceHandle {
    const buffer = this.buffers.get(key)
    if (!buffer) {
      throw new Error(
        `AudioManager: "${key}" has not been decoded yet. Call decode() first.`
      )
    }

    const channel = options?.channel ?? AudioChannels.Sfx
    const spatial = options?.spatial ?? false
    const baseVolume = options?.volume ?? 1

    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.loop = options?.loop ?? false

    const instanceGain = this.context.createGain()
    instanceGain.gain.value = baseVolume

    let panner: StereoPannerNode | undefined
    let outputNode: AudioNode = instanceGain

    if (spatial) {
      panner = this.context.createStereoPanner()
      instanceGain.connect(panner)
      outputNode = panner
    }

    source.connect(instanceGain)
    outputNode.connect(this.getChannelGain(channel))

    const handle = this.nextHandle++
    const instance: AudioInstance = {
      source,
      instanceGain,
      panner,
      channel,
      baseVolume,
      spatial,
      playing: true,
    }
    this.instances.set(handle, instance)

    source.onended = () => {
      instance.playing = false
      this.instances.delete(handle)
    }

    source.start()

    return handle
  }

  public stop(handle: AudioInstanceHandle): void {
    const instance = this.instances.get(handle)
    if (!instance) {
      return
    }
    instance.source.stop()
  }

  public pause(handle: AudioInstanceHandle): void {
    void this.context.suspend()
    const instance = this.instances.get(handle)
    if (instance) {
      instance.playing = false
    }
  }

  public resume(handle: AudioInstanceHandle): void {
    void this.context.resume()
    const instance = this.instances.get(handle)
    if (instance) {
      instance.playing = true
    }
  }

  public isPlaying(handle: AudioInstanceHandle): boolean {
    return this.instances.get(handle)?.playing ?? false
  }

  public stopAll(channel?: AudioChannel): void {
    this.instances.forEach((instance, handle) => {
      if (!channel || instance.channel === channel) {
        this.stop(handle)
      }
    })
  }

  public setMasterVolume(value: number): void {
    this.masterGain.gain.value = value
  }

  public getMasterVolume(): number {
    return this.masterGain.gain.value
  }

  public setChannelVolume(channel: AudioChannel, value: number): void {
    this.getChannelGain(channel).gain.value = value
  }

  public getChannelVolume(channel: AudioChannel): number {
    return this.getChannelGain(channel).gain.value
  }

  public mute(channel?: AudioChannel): void {
    if (channel) {
      this.setChannelVolume(channel, 0)
    } else {
      this.setMasterVolume(0)
    }
  }

  public unmute(channel?: AudioChannel, value = 1): void {
    if (channel) {
      this.setChannelVolume(channel, value)
    } else {
      this.setMasterVolume(value)
    }
  }

  /**
   * Recomputes gain (from distance falloff) and pan (from angle) of a
   * spatial instance. Called every frame by `AudioSystem` for entities
   * carrying a spatial `AudioSource`.
   */
  public updateSpatial(
    handle: AudioInstanceHandle,
    distance: number,
    pan: number,
    falloff: SpatialFalloffOptions = {}
  ): void {
    const instance = this.instances.get(handle)
    if (!instance || !instance.panner) {
      return
    }

    const gain = computeSpatialGain(distance, falloff)
    instance.instanceGain.gain.value = instance.baseVolume * gain
    instance.panner.pan.value = Math.min(Math.max(pan, -1), 1)
  }

  public clear(): void {
    this.stopAll()
  }
}

export default AudioManager

import { Component } from '@mythor/core'
import { AudioChannels, AudioChannel } from '../definitions/AudioChannel'
import { AudioInstanceHandle, DistanceModel } from '../types'

export interface AudioSourceOptions {
  key: string
  channel?: AudioChannel
  volume?: number
  loop?: boolean
  autoplay?: boolean
  spatial?: boolean
  refDistance?: number
  maxDistance?: number
  rolloffFactor?: number
  distanceModel?: DistanceModel
}

/**
 * Declarative sound emitter. Data-only: playback is entirely driven by
 * `AudioSystem`, which is the sole place allowed to read `_pendingPlay`/
 * `_pendingStop`/`handle` (same ownership rule as `@mythor/ui`'s `Button`,
 * whose derived state is only mutated by `ButtonSystem`).
 *
 * Call `play()`/`stop()` to request playback; the actual `AudioManager`
 * call happens on the next `AudioSystem` update.
 */
class AudioSource extends Component {
  public key: string
  public channel: AudioChannel
  public volume: number
  public loop: boolean
  public autoplay: boolean
  public spatial: boolean
  public refDistance: number
  public maxDistance: number
  public rolloffFactor: number
  public distanceModel: DistanceModel

  /** @internal owned by `AudioSystem` */
  public handle?: AudioInstanceHandle
  /** @internal owned by `AudioSystem` */
  public autoplayed = false
  /** @internal owned by `AudioSystem` */
  public pendingPlay = false
  /** @internal owned by `AudioSystem` */
  public pendingStop = false

  public constructor(options: AudioSourceOptions) {
    super()
    this.key = options.key
    this.channel = options.channel ?? AudioChannels.Sfx
    this.volume = options.volume ?? 1
    this.loop = options.loop ?? false
    this.autoplay = options.autoplay ?? false
    this.spatial = options.spatial ?? false
    this.refDistance = options.refDistance ?? 1
    this.maxDistance = options.maxDistance ?? 1000
    this.rolloffFactor = options.rolloffFactor ?? 1
    this.distanceModel = options.distanceModel ?? 'inverse'
  }

  public play(): void {
    this.pendingPlay = true
  }

  public stop(): void {
    this.pendingStop = true
  }

  public isPlaying(): boolean {
    return this.handle !== undefined
  }
}

export default AudioSource

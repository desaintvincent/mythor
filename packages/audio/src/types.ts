import type { AudioChannel } from './definitions/AudioChannel'

/**
 * Opaque handle returned by `AudioManager.play()`, used to `stop`/`pause`/
 * `resume` a specific playing instance and, for spatial instances, to push
 * updated pan/gain values from `AudioSystem`.
 */
export type AudioInstanceHandle = number

export type DistanceModel = 'linear' | 'inverse' | 'exponential'

export interface SpatialFalloffOptions {
  /** Distance under which volume is at its maximum. Defaults to `1`. */
  refDistance?: number
  /** Distance beyond which volume reaches `0`. Defaults to `1000`. */
  maxDistance?: number
  /** Defaults to `1`. Only used by the `linear` and `exponential` models. */
  rolloffFactor?: number
  /** Defaults to `'inverse'`. */
  distanceModel?: DistanceModel
}

export interface PlayOptions {
  channel?: AudioChannel
  /** `0`..`1`, multiplied with the channel and master volume. Defaults to `1`. */
  volume?: number
  loop?: boolean
  /**
   * When `true`, the instance is routed through a `StereoPannerNode` and its
   * gain/pan are expected to be driven every frame via
   * `AudioManager.updateSpatial()` (done automatically by `AudioSystem` for
   * entities carrying an `AudioSource`). Defaults to `false`.
   */
  spatial?: boolean
}

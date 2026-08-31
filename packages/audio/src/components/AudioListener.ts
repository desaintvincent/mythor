import { Component } from '@mythor/core'

export interface AudioListenerOptions {
  enabled?: boolean
}

/**
 * Marker component for the entity acting as the 2D spatial audio listener.
 * Must be combined with a `Transform`. `AudioSystem` uses the first entity
 * carrying both `Transform` and an enabled `AudioListener` as the reference
 * point for spatial `AudioSource`s; falls back to world origin `(0, 0)` if
 * none is found.
 */
class AudioListener extends Component {
  public enabled: boolean

  public constructor(options?: AudioListenerOptions) {
    super()
    this.enabled = options?.enabled ?? true
  }
}

export default AudioListener

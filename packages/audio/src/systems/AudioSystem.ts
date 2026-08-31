import { Entity, System, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import AudioListener from '../components/AudioListener'
import AudioSource from '../components/AudioSource'
import AudioManager from '../managers/AudioManager'

const origin = Vec2.create(0, 0)

/**
 * Drives every `AudioSource` found on `[Transform, AudioSource]` entities:
 * triggers autoplay/`play()`/`stop()` requests, and for spatial sources
 * recomputes distance/pan against the active `AudioListener` (or world
 * origin if none exists) and pushes it to `AudioManager.updateSpatial()`.
 */
class AudioSystem extends System {
  public constructor() {
    super('AudioSystem', [Transform, AudioSource], {
      managers: [AudioManager],
    })
  }

  private findListenerPosition(): Vec2 {
    for (const entity of this.ecs.entities.values()) {
      if (!entity.has(Transform) || !entity.has(AudioListener)) {
        continue
      }
      const listener = entity.get(AudioListener)
      if (listener.enabled) {
        return entity.get(Transform).position
      }
    }

    return origin
  }

  protected onEntityUpdate(entity: Entity): void {
    const source = entity.get(AudioSource)
    const transform = entity.get(Transform)
    const audioManager = this.ecs.manager(AudioManager)

    if (source.pendingStop) {
      if (source.handle !== undefined) {
        audioManager.stop(source.handle)
      }
      source.handle = undefined
      source.pendingStop = false
    }

    if (!source.autoplayed && source.autoplay) {
      source.autoplayed = true
      source.pendingPlay = true
    }

    if (source.pendingPlay) {
      source.pendingPlay = false
      source.handle = audioManager.play(source.key, {
        channel: source.channel,
        volume: source.volume,
        loop: source.loop,
        spatial: source.spatial,
      })
    }

    if (source.handle !== undefined && !audioManager.isPlaying(source.handle)) {
      source.handle = undefined
    }

    if (source.spatial && source.handle !== undefined) {
      const listenerPosition = this.findListenerPosition()
      const delta = transform.position.sub(listenerPosition)
      const distance = Math.sqrt(
        transform.position.distanceSquared(listenerPosition)
      )
      // Stereo pan: sound coming from the listener's left should be
      // emphasized on the left channel, and vice versa. `delta` points
      // from the listener to the source, so a source to the listener's
      // left has a negative x, but the StereoPannerNode's pan convention
      // used here is inverted relative to that axis, hence the minus
      // sign below. `panRange` keeps the far side always audible instead
      // of hard panning to a single ear, and its magnitude grows with
      // distance (a source right next to the listener is heard evenly
      // on both ears, a distant one is heard more clearly on one side).
      const panRange = 0.85
      const proximity =
        distance === 0 ? 0 : Math.min(1, distance / source.maxDistance)
      const pan =
        distance === 0
          ? 0
          : Math.max(
              -panRange,
              Math.min(panRange, (-delta.x / distance) * panRange * proximity)
            )

      audioManager.updateSpatial(source.handle, distance, pan, {
        refDistance: source.refDistance,
        maxDistance: source.maxDistance,
        rolloffFactor: source.rolloffFactor,
        distanceModel: source.distanceModel,
      })
    }
  }
}

export default AudioSystem

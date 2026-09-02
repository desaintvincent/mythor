import { Component } from '@mythor/core'
import { Vec2 } from '@mythor/math'

interface SnapshotSample {
  /** Local receipt time, in seconds. */
  t: number
  position: Vec2
  rotation: number
}

interface RemoteNetworkedOptions {
  /**
   * How far behind real time (in seconds) this entity is rendered, so an
   * already-received newer snapshot is usually available to interpolate
   * towards. Defaults to 100ms.
   */
  interpolationDelay?: number
}

/**
 * Marks an entity controlled elsewhere (another client's avatar, or an
 * NPC simulated by the server): `RemoteInterpolationSystem` blends
 * `Transform` between the last two received snapshots, with no
 * prediction/extrapolation. If no newer snapshot arrives in time, the
 * entity holds its last known position (accepted graceful degradation).
 */
class RemoteNetworked extends Component {
  public readonly interpolationDelay: number
  private readonly samples: SnapshotSample[] = []

  public constructor(options?: RemoteNetworkedOptions) {
    super()
    this.interpolationDelay = options?.interpolationDelay ?? 0.1
  }

  public pushSample(sample: SnapshotSample): void {
    this.samples.push(sample)

    if (this.samples.length > 2) {
      this.samples.shift()
    }
  }

  public get sampleCount(): number {
    return this.samples.length
  }

  public sampleAt(index: number): SnapshotSample | undefined {
    return this.samples[index]
  }
}

export default RemoteNetworked
export type { RemoteNetworkedOptions, SnapshotSample }

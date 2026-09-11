import { Component, Constructor } from '@mythor/core'
import { NetworkSync } from '../sync/NetworkSync'

interface SnapshotSample<T = unknown> {
  /** Local receipt time, in seconds. */
  t: number
  data: T
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
 * NPC simulated by the server). For each networked component attached to
 * this entity, `RemoteInterpolationSystem` either blends between the
 * last two received samples (if the component implements
 * `NetworkInterpolatable`) or snaps to the latest one (plain
 * `NetworkSync`). If no newer snapshot arrives in time, holds the last
 * known value (accepted graceful degradation, no extrapolation).
 */
class RemoteNetworked extends Component {
  public readonly interpolationDelay: number
  private readonly samples = new Map<
    Constructor<NetworkSync>,
    SnapshotSample[]
  >()

  public constructor(options?: RemoteNetworkedOptions) {
    super()
    this.interpolationDelay = options?.interpolationDelay ?? 0.1
  }

  public pushSample(
    constructor: Constructor<NetworkSync>,
    sample: SnapshotSample
  ): void {
    const buffer = this.samples.get(constructor) ?? []
    buffer.push(sample)

    if (buffer.length > 2) {
      buffer.shift()
    }

    this.samples.set(constructor, buffer)
  }

  public sampleCount(constructor: Constructor<NetworkSync>): number {
    return this.samples.get(constructor)?.length ?? 0
  }

  public sampleAt(
    constructor: Constructor<NetworkSync>,
    index: number
  ): SnapshotSample | undefined {
    return this.samples.get(constructor)?.[index]
  }
}

export default RemoteNetworked
export type { RemoteNetworkedOptions, SnapshotSample }

import { Component } from '@mythor/core'
import { NetworkSync } from '../../src/sync/NetworkSync'

interface FlagData {
  active: boolean
}

/**
 * Minimal dummy component implementing only `NetworkSync` (no
 * `interpolate`), used to prove `RemoteInterpolationSystem` snaps to the
 * latest value for components that don't support blending, instead of
 * forcing a lerp assumption onto arbitrary data.
 */
class Flag extends Component implements NetworkSync<FlagData> {
  public active = false

  public serialize(): FlagData {
    return { active: this.active }
  }

  public deserialize(data: FlagData): void {
    this.active = data.active
  }
}

export default Flag

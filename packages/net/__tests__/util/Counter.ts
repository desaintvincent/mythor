import { Component } from '@mythor/core'
import { NetworkInterpolatable } from '../../src/sync/NetworkSync'

export interface CounterData {
  value: number
}

/**
 * Minimal dummy `NetworkSync`/`NetworkInterpolatable` component used only
 * in tests, to prove `@mythor/net`'s systems are fully generic and never
 * assume `Transform`.
 */
class Counter extends Component implements NetworkInterpolatable<CounterData> {
  public value = 0

  public serialize(): CounterData {
    return { value: this.value }
  }

  public deserialize(data: CounterData): void {
    this.value = data.value
  }

  public interpolate(
    from: CounterData,
    to: CounterData,
    alpha: number
  ): CounterData {
    return { value: from.value + (to.value - from.value) * alpha }
  }
}

export default Counter

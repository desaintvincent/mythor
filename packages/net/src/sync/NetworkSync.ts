/**
 * Structural interface a game's own `Component` subclass implements to
 * become network-syncable, without `@mythor/net` needing to know the
 * component's type. Mirrors `@mythor/core`'s `Serializable`/`isSerializable`
 * duck-typing style.
 */
export interface NetworkSync<T = unknown> {
  serialize(): T
  deserialize(data: T): void
}

/**
 * A `NetworkSync` component that also supports time-based blending
 * between two received snapshots (e.g. `Transform`). Components that
 * only implement `NetworkSync` are snapped to the latest received value
 * instead (no lerp assumption forced on arbitrary data).
 */
export interface NetworkInterpolatable<T = unknown> extends NetworkSync<T> {
  interpolate(from: T, to: T, alpha: number): T
}

export function isNetworkSync(value: unknown): value is NetworkSync {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<NetworkSync>).serialize === 'function' &&
    typeof (value as Partial<NetworkSync>).deserialize === 'function'
  )
}

export function isNetworkInterpolatable(
  value: unknown
): value is NetworkInterpolatable {
  return (
    isNetworkSync(value) &&
    typeof (value as Partial<NetworkInterpolatable>).interpolate === 'function'
  )
}

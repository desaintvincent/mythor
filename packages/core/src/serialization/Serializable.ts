/**
 * Marker interface components opt into to be included when a manager (e.g.
 * `SaveManager` in `@mythor/persistence`, or replication in `@mythor/net`)
 * needs to read an entity's state. Components that do not implement this
 * interface are silently skipped (e.g. transient/derived state such as GPU
 * handles).
 */
export default interface Serializable<T = unknown> {
  serialize(): T
}

export function isSerializable(value: unknown): value is Serializable<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<Serializable>).serialize === 'function'
  )
}

/**
 * Pluggable storage abstraction used by `SaveManager`. Methods may be sync
 * or async so both `localStorage`-like and `IndexedDB`-like backends can
 * implement this interface.
 */
export default interface StorageBackend {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
  keys(): string[] | Promise<string[]>
}

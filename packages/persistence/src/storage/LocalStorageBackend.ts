import StorageBackend from './StorageBackend'

/**
 * Default `StorageBackend`, backed by `window.localStorage`. Keys are
 * prefixed to avoid clashing with other data consumers may store there.
 */
class LocalStorageBackend implements StorageBackend {
  private readonly prefix: string

  public constructor(prefix = 'mythor:save:') {
    this.prefix = prefix
  }

  private key(slot: string): string {
    return `${this.prefix}${slot}`
  }

  public getItem(key: string): string | null {
    return window.localStorage.getItem(this.key(key))
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(this.key(key), value)
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(this.key(key))
  }

  public keys(): string[] {
    const slots: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key?.startsWith(this.prefix)) {
        slots.push(key.slice(this.prefix.length))
      }
    }

    return slots
  }
}

export default LocalStorageBackend

import Transport from './Transport'

/**
 * Default `Transport`, backed by the global `WebSocket`. The constructor
 * does not touch any global; `WebSocket` is only referenced inside
 * `connect()`, so importing this module is safe in non-browser
 * environments (e.g. running tests in `node`) as long as `connect()`
 * itself isn't called there.
 *
 * Callbacks can be registered before `connect()` is called (this is how
 * `NetworkManager` uses it, to avoid missing an early synchronous open
 * event); they are stored and wired onto the socket once it exists.
 */
class WebSocketTransport implements Transport {
  private socket: WebSocket | undefined
  private openCallback: (() => void) | undefined
  private messageCallback: ((data: string) => void) | undefined
  private closeCallback: (() => void) | undefined
  private errorCallback: ((error: unknown) => void) | undefined

  public connect(url: string): void {
    this.socket = new WebSocket(url)
    this.socket.onopen = () => this.openCallback?.()
    this.socket.onmessage = (event: MessageEvent<string>) => {
      this.messageCallback?.(event.data)
    }
    this.socket.onclose = () => this.closeCallback?.()
    this.socket.onerror = (error) => this.errorCallback?.(error)
  }

  public send(data: string): void {
    this.socket?.send(data)
  }

  public close(): void {
    this.socket?.close()
  }

  public onOpen(callback: () => void): void {
    this.openCallback = callback
  }

  public onMessage(callback: (data: string) => void): void {
    this.messageCallback = callback
  }

  public onClose(callback: () => void): void {
    this.closeCallback = callback
  }

  public onError(callback: (error: unknown) => void): void {
    this.errorCallback = callback
  }
}

export default WebSocketTransport

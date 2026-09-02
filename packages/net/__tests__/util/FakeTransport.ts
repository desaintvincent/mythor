import Transport from '../../src/transport/Transport'

/**
 * In-memory `Transport` for tests: no real socket. `connect()` just marks
 * itself ready; `emit()` lets a test simulate an inbound message; `sent`
 * records everything the code under test has sent, for assertions.
 */
class FakeTransport implements Transport {
  public sent: string[] = []
  private openHandler: (() => void) | undefined
  private messageHandler: ((data: string) => void) | undefined
  private closeHandler: (() => void) | undefined
  private errorHandler: ((error: unknown) => void) | undefined

  public connect(): void {
    this.openHandler?.()
  }

  public send(data: string): void {
    this.sent.push(data)
  }

  public close(): void {
    this.closeHandler?.()
  }

  public onOpen(callback: () => void): void {
    this.openHandler = callback
  }

  public onMessage(callback: (data: string) => void): void {
    this.messageHandler = callback
  }

  public onClose(callback: () => void): void {
    this.closeHandler = callback
  }

  public onError(callback: (error: unknown) => void): void {
    this.errorHandler = callback
  }

  public emit(data: string): void {
    this.messageHandler?.(data)
  }

  public emitError(error: unknown): void {
    this.errorHandler?.(error)
  }
}

export default FakeTransport

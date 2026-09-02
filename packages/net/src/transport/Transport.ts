/**
 * Pluggable transport abstraction used by `NetworkManager`. Ships with
 * `WebSocketTransport` as the default implementation, but any object
 * implementing this interface can be used instead (e.g. a fake transport
 * in tests, or a future WebRTC data-channel transport).
 *
 * Messages are opaque strings (JSON-encoded envelopes, see `messages.ts`);
 * this interface only deals with connection lifecycle and raw transport.
 */
export default interface Transport {
  connect(url: string): void
  send(data: string): void
  close(): void
  onOpen(callback: () => void): void
  onMessage(callback: (data: string) => void): void
  onClose(callback: () => void): void
  onError(callback: (error: unknown) => void): void
}

import { Component, Transform } from '@mythor/core'

interface PendingInput<TInput> {
  seq: number
  input: TInput
  dt: number
}

interface OwnedNetworkedOptions<TInput> {
  /** Reads the current local input for this entity (game-supplied). */
  getInput: () => TInput
  /**
   * Applies an input to `Transform` for `dt` seconds. Must be a pure
   * function of (transform, input, dt) — it is called once per frame to
   * predict locally, and replayed on top of the authoritative state every
   * time the server acknowledges an input, so non-determinism here will
   * produce visibly wrong corrections. The exact same function must be
   * used authoritatively on the server process.
   */
  applyInput: (transform: Transform, input: TInput, dt: number) => void
}

/**
 * Marks an entity this client controls: input is predicted locally by
 * `PredictionSystem` and reconciled against the server's authoritative
 * state whenever a snapshot acknowledges a processed input sequence.
 */
class OwnedNetworked<TInput = unknown> extends Component {
  public readonly getInput: () => TInput
  public readonly applyInput: (
    transform: Transform,
    input: TInput,
    dt: number
  ) => void
  private seq = 0
  private readonly pending: PendingInput<TInput>[] = []

  public constructor(options: OwnedNetworkedOptions<TInput>) {
    super()
    this.getInput = options.getInput
    this.applyInput = options.applyInput
  }

  public nextSeq(): number {
    const seq = this.seq
    this.seq += 1

    return seq
  }

  public pushPending(seq: number, input: TInput, dt: number): void {
    this.pending.push({ seq, input, dt })
  }

  public get pendingInputs(): readonly PendingInput<TInput>[] {
    return this.pending
  }

  /** Discards buffered inputs the server has already processed. */
  public discardAcked(ackSeq: number): void {
    while (this.pending.length > 0 && this.pending[0].seq <= ackSeq) {
      this.pending.shift()
    }
  }
}

export default OwnedNetworked
export type { OwnedNetworkedOptions }

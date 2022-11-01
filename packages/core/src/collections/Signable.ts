abstract class Signable {
  public static signature?: number
}

export type Constructor<T> = (new (...args: unknown[]) => T) & {
  signature?: number
}

export function getConstructor<T = Signable>(instance: T): Constructor<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return instance.constructor
}

export function getSignature<T = Signable>(
  constructor: Constructor<T>
): number {
  if (constructor.signature === undefined) {
    throw new Error('Cannot get signature of an unsigned Signable')
  }

  return constructor.signature
}

export function isRegistered(constructor: Constructor<Signable>): boolean {
  return constructor.signature !== undefined
}

export default Signable

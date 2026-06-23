import Signable, {
  getConstructor,
  getSignature,
  isRegistered,
} from '../src/collections/Signable'

// Two classes registered via ComponentRegistry by importing them into ECS tests would bleed state.
// Here we test the raw Signable helpers directly — inject signatures manually.

class Alpha extends Signable {}
class Beta extends Signable {}
class Unsigned extends Signable {}

// Manually stamp signatures so these stay isolated from ComponentRegistry
;(Alpha as unknown as { signature: number }).signature = 1
;(Beta as unknown as { signature: number }).signature = 2
// Unsigned has no signature

describe('Signable helpers', () => {
  describe('isRegistered', () => {
    it('returns true when signature is set', () => {
      expect(isRegistered(Alpha)).toBe(true)
      expect(isRegistered(Beta)).toBe(true)
    })

    it('returns false when signature is undefined', () => {
      expect(isRegistered(Unsigned)).toBe(false)
    })
  })

  describe('getSignature', () => {
    it('returns the numeric signature', () => {
      expect(getSignature(Alpha)).toBe(1)
      expect(getSignature(Beta)).toBe(2)
    })

    it('throws for unregistered constructor', () => {
      expect(() => getSignature(Unsigned)).toThrow()
    })
  })

  describe('getConstructor', () => {
    it('returns the class constructor from an instance', () => {
      const a = new Alpha()
      expect(getConstructor(a)).toBe(Alpha)
    })

    it('works for subclasses', () => {
      const b = new Beta()
      expect(getConstructor(b)).toBe(Beta)
    })
  })
})

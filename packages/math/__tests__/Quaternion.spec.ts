import Quaternion from '../src/Quaternion'
import Vec3 from '../src/Vec3'

describe('Quaternion', () => {
  describe('identity', () => {
    it('is (0,0,0,1)', () => {
      const q = Quaternion.identity()
      expect(q.x).toBe(0)
      expect(q.y).toBe(0)
      expect(q.z).toBe(0)
      expect(q.w).toBe(1)
    })

    it('toMat4() is identity matrix', () => {
      expect(Quaternion.identity().toMat4()).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ])
    })
  })

  describe('fromAxisAngle', () => {
    it('90deg around Z rotates X axis to Y axis', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 0, 1), Math.PI / 2)
      const m = q.toMat4()
      // rotate vector (1,0,0) by matrix m
      const x = m[0] * 1 + m[4] * 0 + m[8] * 0
      const y = m[1] * 1 + m[5] * 0 + m[9] * 0

      expect(x).toBeCloseTo(0)
      expect(y).toBeCloseTo(1)
    })
  })

  describe('multiply', () => {
    it('identity * identity = identity', () => {
      const q = Quaternion.identity().multiply(Quaternion.identity())
      expect(q.x).toBeCloseTo(0)
      expect(q.y).toBeCloseTo(0)
      expect(q.z).toBeCloseTo(0)
      expect(q.w).toBeCloseTo(1)
    })
  })

  describe('length / normalize', () => {
    it('identity has length 1', () => {
      expect(Quaternion.identity().length()).toBeCloseTo(1)
    })

    it('normalize keeps unit quaternions unchanged', () => {
      const q = Quaternion.identity().normalize()
      expect(q.w).toBeCloseTo(1)
    })
  })
})

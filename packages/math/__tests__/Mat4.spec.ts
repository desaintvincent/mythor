import Mat4 from '../src/Mat4'
import Vec3 from '../src/Vec3'

describe('Mat4', () => {
  describe('identity', () => {
    it('returns identity matrix', () => {
      expect(Mat4.identity()).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ])
    })
  })

  describe('multiply', () => {
    it('identity * identity = identity', () => {
      expect(Mat4.multiply(Mat4.identity(), Mat4.identity())).toEqual(
        Mat4.identity()
      )
    })

    it('composes non-commuting matrices correctly (translate * rotateY)', () => {
      const translate = Mat4.translate(new Vec3(5, 0, 0))
      const rotateY = Mat4.rotateY(Math.PI / 2)
      const m = Mat4.multiply(translate, rotateY)

      // column-major matrix * homogeneous point (1, 0, 0, 1):
      // rotateY(90deg) should be applied first, then the translation.
      const point = [1, 0, 0, 1]
      const result = [
        m[0] * point[0] + m[4] * point[1] + m[8] * point[2] + m[12] * point[3],
        m[1] * point[0] + m[5] * point[1] + m[9] * point[2] + m[13] * point[3],
        m[2] * point[0] + m[6] * point[1] + m[10] * point[2] + m[14] * point[3],
        m[3] * point[0] + m[7] * point[1] + m[11] * point[2] + m[15] * point[3],
      ]

      expect(result[0]).toBeCloseTo(5)
      expect(result[1]).toBeCloseTo(0)
      expect(result[2]).toBeCloseTo(-1)
      expect(result[3]).toBeCloseTo(1)
    })
  })

  describe('translate', () => {
    it('places translation in last row', () => {
      const m = Mat4.translate(new Vec3(1, 2, 3))
      expect([m[12], m[13], m[14]]).toEqual([1, 2, 3])
    })
  })

  describe('scale', () => {
    it('places scale on diagonal', () => {
      const m = Mat4.scale(new Vec3(2, 3, 4))
      expect([m[0], m[5], m[10]]).toEqual([2, 3, 4])
    })
  })

  describe('perspective', () => {
    it('produces a valid 16-element matrix', () => {
      const m = Mat4.perspective(Math.PI / 4, 16 / 9, 0.1, 100)
      expect(m).toHaveLength(16)
      expect(m[11]).toBe(-1)
    })
  })

  describe('lookAt', () => {
    it('produces a valid 16-element matrix', () => {
      const m = Mat4.lookAt(new Vec3(0, 0, 5), Vec3.zero(), new Vec3(0, 1, 0))
      expect(m).toHaveLength(16)
    })
  })
})

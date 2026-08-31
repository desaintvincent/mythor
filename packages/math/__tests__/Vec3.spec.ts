import Vec3 from '../src/Vec3'

describe('Vec3', () => {
  describe('constructor', () => {
    it('single arg: x = y = z = value', () => {
      const v = new Vec3(5)
      expect(v.x).toBe(5)
      expect(v.y).toBe(5)
      expect(v.z).toBe(5)
    })

    it('three args: x, y and z independently set', () => {
      const v = new Vec3(3, 7, 2)
      expect(v.x).toBe(3)
      expect(v.y).toBe(7)
      expect(v.z).toBe(2)
    })
  })

  describe('static factories', () => {
    it('Vec3.zero()', () => {
      const v = Vec3.zero()
      expect(v.array()).toEqual([0, 0, 0])
    })

    it('Vec3.one()', () => {
      const v = Vec3.one()
      expect(v.array()).toEqual([1, 1, 1])
    })
  })

  describe('add / sub', () => {
    it('add', () => {
      const v = new Vec3(1, 2, 3).add(new Vec3(4, 5, 6))
      expect(v.array()).toEqual([5, 7, 9])
    })

    it('sub', () => {
      const v = new Vec3(4, 5, 6).sub(new Vec3(1, 2, 3))
      expect(v.array()).toEqual([3, 3, 3])
    })
  })

  describe('times / divide', () => {
    it('times', () => {
      const v = new Vec3(1, 2, 3).times(2)
      expect(v.array()).toEqual([2, 4, 6])
    })

    it('divide', () => {
      const v = new Vec3(2, 4, 6).divide(2)
      expect(v.array()).toEqual([1, 2, 3])
    })
  })

  describe('dot / cross', () => {
    it('dot', () => {
      expect(new Vec3(1, 2, 3).dot(new Vec3(4, 5, 6))).toBe(32)
    })

    it('cross', () => {
      const v = new Vec3(1, 0, 0).cross(new Vec3(0, 1, 0))
      expect(v.array()).toEqual([0, 0, 1])
    })
  })

  describe('length / normalize', () => {
    it('length', () => {
      expect(new Vec3(3, 4, 0).length()).toBe(5)
    })

    it('normalize', () => {
      const v = new Vec3(3, 4, 0).normalize()
      expect(v.x).toBeCloseTo(0.6)
      expect(v.y).toBeCloseTo(0.8)
      expect(v.z).toBeCloseTo(0)
    })

    it('normalize of zero vector returns zero', () => {
      const v = Vec3.zero().normalize()
      expect(v.array()).toEqual([0, 0, 0])
    })
  })

  describe('lerp', () => {
    it('midpoint by default', () => {
      const v = Vec3.lerp(Vec3.zero(), new Vec3(4, 8, 12))
      expect(v.array()).toEqual([2, 4, 6])
    })
  })

  describe('array / toString', () => {
    it('array() returns [x, y, z]', () => {
      expect(new Vec3(3, 7, 1).array()).toEqual([3, 7, 1])
    })

    it('toString() format', () => {
      expect(new Vec3(1.5, 2.5, 3.5).toString()).toBe('{x:1.50,y:2.50,z:3.50}')
    })
  })
})

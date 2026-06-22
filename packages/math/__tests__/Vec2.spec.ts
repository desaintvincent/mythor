import Vec2 from '../src/Vec2'

describe('Vec2', () => {
  describe('constructor', () => {
    it('single arg: x = y = value', () => {
      const v = new Vec2(5)
      expect(v.x).toBe(5)
      expect(v.y).toBe(5)
    })

    it('two args: x and y independently set', () => {
      const v = new Vec2(3, 7)
      expect(v.x).toBe(3)
      expect(v.y).toBe(7)
    })
  })

  describe('static factories', () => {
    it('Vec2.create(x) — y defaults to x', () => {
      const v = Vec2.create(4)
      expect(v.x).toBe(4)
      expect(v.y).toBe(4)
    })

    it('Vec2.create(x, y)', () => {
      const v = Vec2.create(2, 8)
      expect(v.x).toBe(2)
      expect(v.y).toBe(8)
    })

    it('Vec2.zero()', () => {
      const v = Vec2.zero()
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })
  })

  describe('set / vSet', () => {
    it('set(x) sets both x and y', () => {
      const v = new Vec2(0)
      v.set(9)
      expect(v.x).toBe(9)
      expect(v.y).toBe(9)
    })

    it('set(x, y) sets independently', () => {
      const v = new Vec2(0)
      v.set(3, 6)
      expect(v.x).toBe(3)
      expect(v.y).toBe(6)
    })

    it('vSet copies other vec', () => {
      const v = new Vec2(1, 2)
      const other = new Vec2(10, 20)
      v.vSet(other)
      expect(v.x).toBe(10)
      expect(v.y).toBe(20)
    })
  })

  describe('observe', () => {
    it('observer triggered on x assignment', () => {
      const v = new Vec2(0)
      const calls: Vec2[] = []
      v.observe((newPos) => calls.push(newPos))
      v.x = 5
      expect(calls).toHaveLength(1)
      expect(calls[0].x).toBe(5)
    })

    it('observer triggered on y assignment', () => {
      const v = new Vec2(0)
      const calls: Vec2[] = []
      v.observe((newPos) => calls.push(newPos))
      v.y = 7
      expect(calls).toHaveLength(1)
      expect(calls[0].y).toBe(7)
    })

    it('observer triggered on set()', () => {
      const v = new Vec2(0)
      let called = 0
      v.observe(() => called++)
      v.set(1, 2)
      expect(called).toBe(1)
    })

    it('set with triggerObservers=false does not notify', () => {
      const v = new Vec2(0)
      let called = 0
      v.observe(() => called++)
      v.set(1, 2, false)
      expect(called).toBe(0)
    })
  })

  describe('arithmetic', () => {
    it('times(n) scales', () => {
      const v = new Vec2(3, 4)
      const r = v.times(2)
      expect(r.x).toBe(6)
      expect(r.y).toBe(8)
    })

    it('Vec2.times(v, n) — static proxy', () => {
      const v = new Vec2(2, 5)
      const r = Vec2.times(v, 3)
      expect(r.x).toBe(6)
      expect(r.y).toBe(15)
    })

    it('vTimes(v) component-wise multiply', () => {
      const v = new Vec2(3, 4)
      const r = v.vTimes(new Vec2(2, 5))
      expect(r.x).toBe(6)
      expect(r.y).toBe(20)
    })

    it('Vec2.vTimes static', () => {
      const r = Vec2.vTimes(new Vec2(3, 4), new Vec2(2, 5))
      expect(r.x).toBe(6)
      expect(r.y).toBe(20)
    })

    it('divide(n)', () => {
      const r = new Vec2(6, 8).divide(2)
      expect(r.x).toBe(3)
      expect(r.y).toBe(4)
    })

    it('Vec2.divide static', () => {
      const r = Vec2.divide(new Vec2(6, 8), 2)
      expect(r.x).toBe(3)
      expect(r.y).toBe(4)
    })

    it('vDivide component-wise', () => {
      const r = new Vec2(6, 8).vDivide(new Vec2(2, 4))
      expect(r.x).toBe(3)
      expect(r.y).toBe(2)
    })

    it('add(v)', () => {
      const r = new Vec2(1, 2).add(new Vec2(3, 4))
      expect(r.x).toBe(4)
      expect(r.y).toBe(6)
    })

    it('Vec2.add static', () => {
      const r = Vec2.add(new Vec2(1, 2), new Vec2(3, 4))
      expect(r.x).toBe(4)
      expect(r.y).toBe(6)
    })

    it('sub(v)', () => {
      const r = new Vec2(5, 7).sub(new Vec2(2, 3))
      expect(r.x).toBe(3)
      expect(r.y).toBe(4)
    })

    it('Vec2.sub static', () => {
      const r = Vec2.sub(new Vec2(5, 7), new Vec2(2, 3))
      expect(r.x).toBe(3)
      expect(r.y).toBe(4)
    })

    it('arithmetic does not mutate source', () => {
      const v = new Vec2(1, 2)
      v.times(10)
      v.add(new Vec2(5, 5))
      v.sub(new Vec2(5, 5))
      expect(v.x).toBe(1)
      expect(v.y).toBe(2)
    })
  })

  describe('angles and rotation', () => {
    it('toAngle() — right vector is 0 rad', () => {
      expect(new Vec2(1, 0).toAngle()).toBeCloseTo(0)
    })

    it('toAngle() — up vector is π/2', () => {
      expect(new Vec2(0, 1).toAngle()).toBeCloseTo(Math.PI / 2)
    })

    it('Vec2.toAngle static', () => {
      expect(Vec2.toAngle(new Vec2(1, 0))).toBeCloseTo(0)
    })

    it('fromAngle(0) — right vector', () => {
      const v = Vec2.fromAngle(0)
      expect(v.x).toBeCloseTo(1)
      expect(v.y).toBeCloseTo(0)
    })

    it('fromAngle(π/2) — up vector', () => {
      const v = Vec2.fromAngle(Math.PI / 2)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(1)
    })

    it('rotate(π/2) rotates 90 degrees', () => {
      const v = new Vec2(1, 0).rotate(Math.PI / 2)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(1)
    })

    it('Vec2.rotate static', () => {
      const v = Vec2.rotate(new Vec2(1, 0), Math.PI)
      expect(v.x).toBeCloseTo(-1)
      expect(v.y).toBeCloseTo(0)
    })
  })

  describe('distanceSquared', () => {
    it('same point — distance is 0', () => {
      expect(new Vec2(3, 4).distanceSquared(new Vec2(3, 4))).toBe(0)
    })

    it('(0,0) to (3,4) — squared distance is 25', () => {
      expect(new Vec2(0, 0).distanceSquared(new Vec2(3, 4))).toBe(25)
    })

    it('Vec2.distanceSquared static', () => {
      expect(Vec2.distanceSquared(new Vec2(0, 0), new Vec2(3, 4))).toBe(25)
    })
  })

  describe('round', () => {
    it('rounds to given precision', () => {
      const v = new Vec2(1.2345, 2.6789)
      const r = v.round(2)
      expect(r.x).toBeCloseTo(1.23)
      expect(r.y).toBeCloseTo(2.68)
    })

    it('Vec2.round static', () => {
      const v = new Vec2(1.5678, 3.1415)
      Vec2.round(v, 1)
      expect(v.x).toBeCloseTo(1.6)
      expect(v.y).toBeCloseTo(3.1)
    })
  })

  describe('medium', () => {
    it('average of two vectors', () => {
      const r = Vec2.medium([new Vec2(0, 0), new Vec2(4, 8)])
      expect(r.x).toBe(2)
      expect(r.y).toBe(4)
    })

    it('average of three vectors', () => {
      const r = Vec2.medium([new Vec2(0, 0), new Vec2(3, 0), new Vec2(3, 3)])
      expect(r.x).toBeCloseTo(2)
      expect(r.y).toBeCloseTo(1)
    })
  })

  describe('array / toString', () => {
    it('array() returns [x, y]', () => {
      expect(new Vec2(3, 7).array()).toEqual([3, 7])
    })

    it('toString() format', () => {
      expect(new Vec2(1.5, 2.5).toString()).toBe('{x:1.50,y:2.50}')
    })
  })
})

import Vec2 from '../src/Vec2'
import { round, lerp, root, moveTowards, getPolygonCentroid } from '../src/util'

describe('util', () => {
  describe('round', () => {
    it('default precision 3', () => {
      expect(round(1.23456)).toBe(1.235)
    })

    it('precision 0 — integer', () => {
      expect(round(2.7, 0)).toBe(3)
    })

    it('precision 2', () => {
      expect(round(3.14159, 2)).toBe(3.14)
    })

    it('negative numbers', () => {
      expect(round(-1.2345, 2)).toBe(-1.23)
    })
  })

  describe('lerp', () => {
    it('amount 0 returns value1', () => {
      expect(lerp(0, 10, 0)).toBe(0)
    })

    it('amount 1 returns value2', () => {
      expect(lerp(0, 10, 1)).toBe(10)
    })

    it('amount 0.5 returns midpoint', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
    })

    it('amount < 0 clamps to 0', () => {
      expect(lerp(0, 10, -5)).toBe(0)
    })

    it('amount > 1 clamps to 1', () => {
      expect(lerp(0, 10, 5)).toBe(10)
    })

    it('default amount 0.5', () => {
      expect(lerp(4, 8)).toBe(6)
    })
  })

  describe('root', () => {
    // NOTE: `root` is misnamed — it computes x*x (square), not sqrt.
    // Used internally by Vec2.distanceSquared.
    it('root(3) = 9', () => {
      expect(root(3)).toBe(9)
    })

    it('root(0) = 0', () => {
      expect(root(0)).toBe(0)
    })

    it('root(-2) = 4', () => {
      expect(root(-2)).toBe(4)
    })
  })

  describe('moveTowards', () => {
    it('moves towards target', () => {
      expect(moveTowards(0, 10, 3)).toBe(3)
    })

    it('snaps to target if within maxDelta', () => {
      expect(moveTowards(8, 10, 5)).toBe(10)
    })

    it('moves in negative direction', () => {
      expect(moveTowards(10, 0, 3)).toBe(7)
    })

    it('already at target — stays', () => {
      expect(moveTowards(5, 5, 2)).toBe(5)
    })
  })

  describe('getPolygonCentroid', () => {
    it('square centered at origin', () => {
      const pts = [
        new Vec2(-1, -1),
        new Vec2(1, -1),
        new Vec2(1, 1),
        new Vec2(-1, 1),
      ]
      const { centroid, size } = getPolygonCentroid(pts)
      expect(centroid.x).toBeCloseTo(0)
      expect(centroid.y).toBeCloseTo(0)
      expect(size.x).toBeCloseTo(2)
      expect(size.y).toBeCloseTo(2)
    })

    it('triangle', () => {
      const pts = [new Vec2(0, 0), new Vec2(6, 0), new Vec2(3, 6)]
      const { centroid } = getPolygonCentroid(pts)
      expect(centroid.x).toBeCloseTo(3)
      expect(centroid.y).toBeCloseTo(2)
    })
  })
})

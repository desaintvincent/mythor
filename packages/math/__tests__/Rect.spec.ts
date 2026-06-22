import Vec2 from '../src/Vec2'
import { contains, overlaps, getTopLeft, getBottomRight, Rect } from '../src/Rect'

// Rects are center-position based:
// actual top-left = position - size/2

function rect(cx: number, cy: number, w: number, h: number): Rect {
  return { position: new Vec2(cx, cy), size: new Vec2(w, h) }
}

describe('Rect', () => {
  describe('getTopLeft', () => {
    it('returns position - size/2', () => {
      const r = rect(10, 10, 4, 6)
      const tl = getTopLeft(r)
      expect(tl.x).toBe(8)   // 10 - 4/2
      expect(tl.y).toBe(7)   // 10 - 6/2
    })
  })

  describe('getBottomRight', () => {
    it('returns position + size/2', () => {
      const r = rect(10, 10, 4, 6)
      const br = getBottomRight(r)
      expect(br.x).toBe(12)  // 10 + 4/2
      expect(br.y).toBe(13)  // 10 + 6/2
    })
  })

  describe('contains', () => {
    it('smaller rect fully inside — true', () => {
      const outer = rect(5, 5, 10, 10) // (0,0)-(10,10)
      const inner = rect(5, 5, 4, 4)   // (3,3)-(7,7)
      expect(contains(outer, inner)).toBe(true)
    })

    it('same size — false (boundary not included)', () => {
      const a = rect(5, 5, 10, 10)
      expect(contains(a, a)).toBe(false)
    })

    it('completely outside — false', () => {
      const a = rect(0, 0, 4, 4)  // (-2,-2)-(2,2)
      const b = rect(10, 10, 4, 4) // (8,8)-(12,12)
      expect(contains(a, b)).toBe(false)
    })

    it('partially inside — false', () => {
      const outer = rect(5, 5, 10, 10) // (0,0)-(10,10)
      const partial = rect(9, 5, 4, 4)  // (7,3)-(11,7) — extends outside right
      expect(contains(outer, partial)).toBe(false)
    })
  })

  describe('overlaps', () => {
    it('overlapping rects — true', () => {
      const a = rect(2, 2, 4, 4) // (0,0)-(4,4)
      const b = rect(3, 3, 4, 4) // (1,1)-(5,5)
      expect(overlaps(a, b)).toBe(true)
    })

    it('non-overlapping rects — false', () => {
      const a = rect(0, 0, 2, 2) // (-1,-1)-(1,1)
      const b = rect(5, 5, 2, 2) // (4,4)-(6,6)
      expect(overlaps(a, b)).toBe(false)
    })

    it('touching on edge — true (boundary included)', () => {
      const a = rect(0, 0, 2, 2)  // (-1,-1)-(1,1)
      const b = rect(2, 0, 2, 2)  // (1,1) touching
      // a.right=1, b.left=1 -> a.x + a.size.x (=1) >= b.position - b.size/2 (=1)
      expect(overlaps(a, b)).toBe(true)
    })

    it('rect overlaps itself', () => {
      const a = rect(5, 5, 10, 10)
      expect(overlaps(a, a)).toBe(true)
    })

    it('separated along x — false', () => {
      const a = rect(0, 0, 4, 4)   // (-2,-2)-(2,2)
      const b = rect(10, 0, 4, 4)  // (8,-2)-(12,2)
      expect(overlaps(a, b)).toBe(false)
    })

    it('separated along y — false', () => {
      const a = rect(0, 0, 4, 4)
      const b = rect(0, 10, 4, 4)
      expect(overlaps(a, b)).toBe(false)
    })
  })
})

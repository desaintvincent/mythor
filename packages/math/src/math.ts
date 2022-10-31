import Vec2 from './Vec2'

export const round = (number: number, precision = 3): number => {
  const coef = Math.pow(10, precision)

  return Math.round(coef * number) / coef
}

export const lerp = (value1: number, value2: number, amount = 0.5): number => {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount

  return value1 + (value2 - value1) * amount
}

export const root = (value: number): number => value * value

export const moveTowards = (
  current: number,
  target: number,
  maxDelta: number
): number => {
  if (Math.abs(target - current) <= maxDelta) {
    return target
  }

  return current + Math.sign(target - current) * maxDelta
}

export const getPolygonCentroid = (
  opts: Vec2[]
): {
  centroid: Vec2
  size: Vec2
} => {
  const pts = [...opts]
  const first = pts[0]
  const last = pts[pts.length - 1]
  if (first.x !== last.x || first.y !== last.y) pts.push(first)
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let twicearea = 0
  let x = 0
  let y = 0
  const nPts = pts.length
  let p1
  let p2
  let f
  for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i]
    p2 = pts[j]
    f = p1.x * p2.y - p2.x * p1.y
    twicearea += f
    x += (p1.x + p2.x) * f
    y += (p1.y + p2.y) * f
    if (p1.x > maxX) {
      maxX = p1.x
    }
    if (p1.x < minX) {
      minX = p1.x
    }
    if (p1.y > maxY) {
      maxY = p1.y
    }
    if (p1.y < minY) {
      minY = p1.y
    }

    if (p2.x > maxX) {
      maxX = p2.x
    }
    if (p2.x < minX) {
      minX = p2.x
    }
    if (p2.y > maxY) {
      maxY = p2.y
    }
    if (p2.y < minY) {
      minY = p2.y
    }
  }
  f = twicearea * 3

  return {
    centroid: new Vec2(x / f, y / f),
    size: new Vec2(Math.abs(maxX - minX), Math.abs(maxY - minY)),
  }
}

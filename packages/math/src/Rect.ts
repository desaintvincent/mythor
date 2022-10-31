import Vec2 from './Vec2'

export interface Rect {
  position: Vec2
  size: Vec2
}

export const contains = (rect: Rect, r: Rect): boolean => {
  const { position: rMiddleposition, size: rsize } = r
  const { position: middlePosition, size } = rect

  const position = Vec2.sub(middlePosition, Vec2.divide(size, 2))
  const rposition = Vec2.sub(rMiddleposition, Vec2.divide(rsize, 2))

  return (
    rposition.x >= position.x &&
    rposition.x + r.size.x < position.x + size.x &&
    rposition.y >= position.y &&
    rposition.y + r.size.y < position.y + size.y
  )
}

export const overlaps = (rect: Rect, r: Rect): boolean => {
  const { position: rMiddleposition, size: rsize } = r
  const { position: middlePosition, size } = rect

  const position = Vec2.sub(middlePosition, Vec2.divide(size, 2))
  const rposition = Vec2.sub(rMiddleposition, Vec2.divide(rsize, 2))

  return (
    position.x < rposition.x + r.size.x &&
    position.x + size.x >= rposition.x &&
    position.y < rposition.y + r.size.y &&
    position.y + size.y >= rposition.y
  )
}

export const getTopLeft = (rect: Rect): Vec2 =>
  rect.position.sub(rect.size.divide(2))

export const getBottomRight = (rect: Rect): Vec2 =>
  rect.position.add(rect.size.divide(2))

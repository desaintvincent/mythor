import Vec2 from '../src/Vec2'

describe('Vec2', () => {
  it('should create a Vec2', () => {
    const vec2 = new Vec2(5)

    expect(vec2.x).toBe(5)
    expect(vec2.y).toBe(5)
  })
})

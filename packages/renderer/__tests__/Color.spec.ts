import Color, {
  colorWhite,
  colorBlack,
  colorRed,
  colorGreen,
  colorBlue,
} from '../src/color/Color'

describe('Color', () => {
  it('colorWhite is [1,1,1,1]', () => {
    expect(colorWhite).toEqual([1, 1, 1, 1])
  })

  it('colorBlack is [0,0,0,1]', () => {
    expect(colorBlack).toEqual([0, 0, 0, 1])
  })

  it('colorRed is [1,0,0,1]', () => {
    expect(colorRed).toEqual([1, 0, 0, 1])
  })

  it('colorGreen is [0,1,0,1]', () => {
    expect(colorGreen).toEqual([0, 1, 0, 1])
  })

  it('colorBlue is [0,0,1,1]', () => {
    expect(colorBlue).toEqual([0, 0, 1, 1])
  })

  it('colorWhite and colorBlack are different', () => {
    expect(colorWhite).not.toEqual(colorBlack)
  })

  it('Color type is a 4-tuple of numbers', () => {
    const c: Color = [0.5, 0.5, 0.5, 1.0]
    expect(c).toHaveLength(4)
  })
})

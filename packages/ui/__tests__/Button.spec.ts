import Button from '../src/components/Button'

describe('Button', () => {
  it('defaults to not hovered/pressed/clicked and not disabled', () => {
    const button = new Button()

    expect(button.hovered).toBe(false)
    expect(button.pressed).toBe(false)
    expect(button.clicked).toBe(false)
    expect(button.disabled).toBe(false)
  })

  it('stores the provided options', () => {
    const onClick = jest.fn()
    const onHoverChange = jest.fn()
    const button = new Button({ disabled: true, onClick, onHoverChange })

    expect(button.disabled).toBe(true)
    expect(button.onClick).toBe(onClick)
    expect(button.onHoverChange).toBe(onHoverChange)
  })
})

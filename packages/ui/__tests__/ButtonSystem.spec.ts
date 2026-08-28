/**
 * @jest-environment jsdom
 */
import { Ecs, Transform } from '@mythor/core'
import { EventsManager } from '@mythor/events'
import { Vec2 } from '@mythor/math'
import Button from '../src/components/Button'
import ButtonSystem from '../src/systems/ButtonSystem'

describe('ButtonSystem', () => {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  document.body.appendChild(canvas)
  canvas.getBoundingClientRect = () =>
    ({
      bottom: canvas.height,
      height: canvas.height,
      left: 0,
      right: canvas.width,
      toJSON: () => '',
      top: 0,
      width: canvas.width,
      x: 0,
      y: 0,
    } as DOMRect)

  const ecs = new Ecs()
  const events = new EventsManager({ canvas })
  const system = new ButtonSystem()

  let button: Button

  beforeAll(async () => {
    ecs.registerManagers(events)
    ecs.registerSystems(system)
    await ecs.init()
  })

  function moveMouseTo(x: number, y: number): void {
    canvas.dispatchEvent(
      new MouseEvent('mousemove', { clientX: x, clientY: y })
    )
  }

  it('sets hovered to true and fires onHoverChange when the mouse enters the bounds', async () => {
    const onHoverChange = jest.fn()
    button = new Button({ onHoverChange })
    ecs.create().add(
      new Transform({
        position: Vec2.create(100, 100),
        size: Vec2.create(50, 50),
      }),
      button
    )

    moveMouseTo(1000, 1000)
    ecs.update(0, 0)
    expect(button.hovered).toBe(false)

    moveMouseTo(100, 100)
    ecs.update(0, 0)

    expect(button.hovered).toBe(true)
    expect(onHoverChange).toHaveBeenCalledWith(true)
  })

  it('sets hovered back to false and fires onHoverChange when the mouse leaves', () => {
    moveMouseTo(1000, 1000)
    ecs.update(0, 0)

    expect(button.hovered).toBe(false)
    expect(button.onHoverChange as jest.Mock).toHaveBeenCalledWith(false)
  })

  it('boundary point exactly on the bounds edge is not considered hovered (contains() uses a strict edge)', () => {
    // rect is centered on (100, 100) with a 50x50 size -> right edge at x=125
    moveMouseTo(125, 100)
    ecs.update(0, 0)

    expect(button.hovered).toBe(false)
  })

  it('sets pressed while the mouse button is held over the bounds, and clicked only on the press frame', () => {
    moveMouseTo(100, 100)
    ecs.update(0, 0)
    expect(button.hovered).toBe(true)

    canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    ecs.update(0, 0)

    expect(button.pressed).toBe(true)
    expect(button.clicked).toBe(true)

    ecs.update(0, 0)

    expect(button.pressed).toBe(true)
    expect(button.clicked).toBe(false)

    canvas.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))
    ecs.update(0, 0)

    expect(button.pressed).toBe(false)
  })

  it('invokes onClick exactly once for a single click', () => {
    const onClick = jest.fn()
    const clickButton = new Button({ onClick })
    ecs.create().add(
      new Transform({
        position: Vec2.create(300, 300),
        size: Vec2.create(50, 50),
      }),
      clickButton
    )

    moveMouseTo(300, 300)
    ecs.update(0, 0)

    canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    ecs.update(0, 0)
    expect(onClick).toHaveBeenCalledTimes(1)

    ecs.update(0, 0)
    expect(onClick).toHaveBeenCalledTimes(1)

    canvas.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))
    ecs.update(0, 0)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('short-circuits to false state and does not react to hover/press/click while disabled', () => {
    const onHoverChange = jest.fn()
    const disabledButton = new Button({ disabled: true, onHoverChange })
    ecs.create().add(
      new Transform({
        position: Vec2.create(500, 500),
        size: Vec2.create(50, 50),
      }),
      disabledButton
    )

    moveMouseTo(500, 500)
    ecs.update(0, 0)
    canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    ecs.update(0, 0)

    expect(disabledButton.hovered).toBe(false)
    expect(disabledButton.pressed).toBe(false)
    expect(disabledButton.clicked).toBe(false)
    expect(onHoverChange).not.toHaveBeenCalled()

    canvas.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))
    ecs.update(0, 0)
  })
})

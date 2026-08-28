/**
 * @jest-environment jsdom
 */
import { Ecs } from '@mythor/core'
import EventsManager from '../src/managers/EventsManager'

describe('EventsManager', () => {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  document.body.appendChild(canvas)
  canvas.getBoundingClientRect = () =>
    ({
      left: 0,
      right: canvas.width,
      top: 0,
      bottom: canvas.height,
      width: canvas.width,
      height: canvas.height,
      x: 0,
      y: 0,
      toJSON: () => '',
    } as DOMRect)

  const ecs = new Ecs()
  const manager = new EventsManager({ canvas })

  beforeAll(async () => {
    ecs.registerManagers(manager)
    await ecs.init()
  })

  describe('keyboard', () => {
    it('keyIsDown/keyPressed reflect a keydown event, keyPressed is only true on the frame it happened', () => {
      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))

      expect(manager.keyIsDown('a' as never)).toBe(true)
      expect(manager.keyPressed('a' as never)).toBe(true)

      manager.postUpdate()

      expect(manager.keyIsDown('a' as never)).toBe(true)
      expect(manager.keyPressed('a' as never)).toBe(false)
    })

    it('keyReleased becomes true the frame after a keyup event', () => {
      canvas.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))

      expect(manager.keyIsDown('a' as never)).toBe(false)
      expect(manager.keyReleased('a' as never)).toBe(true)

      manager.postUpdate()

      expect(manager.keyReleased('a' as never)).toBe(false)
    })
  })

  describe('mouse buttons', () => {
    it('mouseIsDown/mousePressed reflect a mousedown event', () => {
      canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))

      expect(manager.mouseIsDown(0)).toBe(true)
      expect(manager.mousePressed(0)).toBe(true)

      manager.postUpdate()

      expect(manager.mousePressed(0)).toBe(false)
    })

    it('mouseReleased becomes true the frame after a mouseup event', () => {
      canvas.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))

      expect(manager.mouseIsDown(0)).toBe(false)
      expect(manager.mouseReleased(0)).toBe(true)

      manager.postUpdate()

      expect(manager.mouseReleased(0)).toBe(false)
    })
  })

  describe('drag', () => {
    it('isDragging is true once the mouse moves past minDragDelta while a button is held', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 0, clientY: 0 })
      )
      manager.postUpdate()

      canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
      manager.postUpdate()

      canvas.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 50, clientY: 0 })
      )

      expect(manager.isDragging(0)).toBe(true)
      expect(manager.dragDelta().x).toBeGreaterThan(0)

      canvas.dispatchEvent(new MouseEvent('mouseup', { button: 0 }))
      manager.postUpdate()
    })
  })

  describe('wheel', () => {
    it('isWheeling/wheelDelta reflect a wheel event', () => {
      expect(manager.isWheeling()).toBe(false)

      canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 }))

      expect(manager.isWheeling()).toBe(true)
      expect(manager.wheelDelta()).toBe(10)
      expect(manager.wheelDelta(2)).toBe(20)

      manager.postUpdate()

      expect(manager.isWheeling()).toBe(false)
      expect(manager.wheelDelta()).toBe(0)
    })
  })

  describe('mousePosition', () => {
    it('returns the raw canvas-space position when no Renderer system is registered', () => {
      canvas.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 123, clientY: 45 })
      )

      const position = manager.mousePosition()

      expect(position.x).toBeCloseTo(123)
      expect(position.y).toBeCloseTo(45)
    })

    it('returns the same raw position when conversion is explicitly disabled', () => {
      const position = manager.mousePosition(false)

      expect(position.x).toBeCloseTo(123)
      expect(position.y).toBeCloseTo(45)
    })
  })

  describe('clear', () => {
    it('removes every registered listener from the canvas', () => {
      const removeSpy = jest.spyOn(canvas, 'removeEventListener')

      manager.clear()

      expect(removeSpy).toHaveBeenCalledTimes(8)
      removeSpy.mockRestore()
    })
  })

  describe('singleton behavior', () => {
    it('a second construction returns the first instance and ignores new options', () => {
      const otherCanvas = document.createElement('canvas')
      const second = new EventsManager({ canvas: otherCanvas })

      expect(second).toBe(manager)
    })
  })
})

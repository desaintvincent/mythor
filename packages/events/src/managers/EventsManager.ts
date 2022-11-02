import { Manager } from "@mythor/core";
import { Vec2 } from "@mythor/math";
import Key from "../definitions/Key";
import MouseButton from "../definitions/MouseButton";

interface EventManagerOptions {
  canvas?: HTMLCanvasElement
  canvasId?: string
  minDragDelta?: number
}

const getKey = (event: KeyboardEvent): Key => event.key as Key

const getMouse = (event: MouseEvent): MouseButton => event.button as MouseButton

class EventsManager extends Manager {
  private static instance?: EventsManager
  private readonly canvas: HTMLCanvasElement
  private canvasRect: DOMRect
  private readonly _keysDown: Map<Key, boolean>
  private readonly _previousKeysDown: Map<Key, boolean>
  private readonly _mousesDown: Map<MouseButton, boolean>
  private readonly _previousMousesDown: Map<MouseButton, boolean>
  private readonly _mousePosition: Vec2
  private readonly _previousMousePosition: Vec2
  private _wheelDelta: number
  private readonly _minDragDelta: number
  private initialized = false

  private readonly events = {
    blur: (event: FocusEvent) => {},
    contextmenu: (event: MouseEvent) => event.preventDefault(),
    focus: (event: FocusEvent) => {},
    keydown: (event: KeyboardEvent) => this.setKeyValue(event, true),
    keyup: (event: KeyboardEvent) => this.setKeyValue(event, false),
    mousedown: (event: MouseEvent) => this.setMouseValue(event, true),
    mouseenter: (event: MouseEvent) => this.canvas.focus(),
    mouseleave: (event: MouseEvent) => {},
    mousemove: (event: MouseEvent) => this.setMousePosition(event),
    mouseup: (event: MouseEvent) => this.setMouseValue(event, false),
    wheel: (event: WheelEvent) => this.setWheel(event),
  }

  public constructor (options?: EventManagerOptions) {
    super('EventsManager')
    if (EventsManager.instance) {
      return EventsManager.instance
    }
    EventsManager.instance = this

    if (options?.canvas) {
      this.canvas = options.canvas
    } else {
      const canvas = document.getElementById(options?.canvasId ?? 'canvas')
      if (!canvas) {
        throw new Error('Could not find canvas')
      }
      this.canvas = canvas as HTMLCanvasElement
    }
    this.canvas.tabIndex = 1
    this.canvas.focus()
    this.canvasRect = this.canvas.getBoundingClientRect()
    this._keysDown = new Map<Key, boolean>()
    this._previousKeysDown = new Map<Key, boolean>()
    this._mousesDown = new Map<MouseButton, boolean>()
    this._previousMousesDown = new Map<MouseButton, boolean>()
    this._mousePosition = Vec2.zero()
    this._previousMousePosition = Vec2.zero()
    this._wheelDelta = 0
    this._minDragDelta = options?.minDragDelta ?? 1
  }

  private setMousePosition (event: MouseEvent): void {
    this.canvasRect = this.canvas.getBoundingClientRect()

    const x = ((event.clientX - this.canvasRect.left) /
            (this.canvasRect.right - this.canvasRect.left)) *
        this.canvas.width

    const y = ((event.clientY - this.canvasRect.top) /
            (this.canvasRect.bottom - this.canvasRect.top)) *
        this.canvas.height

    this._mousePosition.set(x, y)
  }

  private setWheel (event: WheelEvent): void {
    event.preventDefault()
    this._wheelDelta += event.deltaY
  }

  private setKeyValue (event: KeyboardEvent, value: boolean): void {
    event.preventDefault()
    this._keysDown.set(getKey(event), value)
  }

  private setMouseValue (event: MouseEvent, value: boolean): void {
    event.preventDefault()
    this._mousesDown.set(getMouse(event), value)
  }

  public async init (): Promise<void> {
    if (this.initialized) {
      return
    }
    this.initialized = true

    Object.entries(this.events).forEach(([eventName, fn]) => {
      this.canvas.addEventListener(eventName, fn, false)
    })

    window.addEventListener('resize', () => {
      this.canvasRect = this.canvas.getBoundingClientRect()
    })
  }

  public clear (): void {
    Object.entries(this.events).forEach(([eventName, fn]) => {
      this.canvas.removeEventListener(eventName, fn, false)
    })
  }

  public postUpdate (): void {
    this._previousKeysDown.clear()
    this._previousMousesDown.clear()
    this._wheelDelta = 0
    this._previousMousePosition.set(this._mousePosition.x, this._mousePosition.y)

    this._keysDown.forEach((value, key) => {
      this._previousKeysDown.set(key, value)
    })

    this._mousesDown.forEach((value, key) => {
      this._previousMousesDown.set(key, value)
    })
  }

  private isDown<T>(map: Map<T, boolean>, key: T): boolean {
    return map.get(key) ?? false
  }

  private pressed<T>(map: Map<T, boolean>, previousMap: Map<T, boolean>, key: T): boolean {
    return this.isDown(map, key) && !this.isDown(previousMap, key)
  }

  private released<T>(map: Map<T, boolean>, previousMap: Map<T, boolean>, key: T): boolean {
    return !this.isDown(map, key) && this.isDown(previousMap, key)
  }

  public keyIsDown (key: Key): boolean {
    return this.isDown(this._keysDown, key)
  }

  public keyPressed (key: Key): boolean {
    return this.pressed(this._keysDown, this._previousKeysDown, key)
  }

  public keyReleased (key: Key): boolean {
    return this.released(this._keysDown, this._previousKeysDown, key)
  }

  public mouseIsDown (mouse: MouseButton): boolean {
    return this.isDown(this._mousesDown, mouse)
  }

  public mousePressed (mouse: MouseButton): boolean {
    return this.pressed(this._mousesDown, this._previousMousesDown, mouse)
  }

  public isWheeling (): boolean {
    return this._wheelDelta !== 0
  }

  public wheelDelta (coefficient = 1): number {
    return this._wheelDelta * coefficient
  }

  public isDragging (mouse: MouseButton): boolean {
    if (this.mouseIsDown(mouse) && !this.mousePressed(mouse)) {
      const delta = this.dragDelta()

      return Math.abs(delta.x) + Math.abs(delta.y) > this._minDragDelta
    }

    return false
  }

  public dragDelta (): Vec2 {
    return this._mousePosition.sub(this._previousMousePosition)
  }

  public mouseReleased (mouse: MouseButton): boolean {
    return this.released(this._mousesDown, this._previousMousesDown, mouse)
  }

  public mousePosition (convertToWorldPosition = true): Vec2 {
    if (!this.ecs.systems.has(Renderer)) {
      return this._mousePosition
    }
    const camera = this.ecs.system(Renderer).getCamera()

    return camera.screenToWorld(this._mousePosition)
  }
}

export default EventsManager

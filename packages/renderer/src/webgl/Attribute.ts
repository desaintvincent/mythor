import { throwError } from '@mythor/core'
import makeBuffer from './shaders/helpers/makeBuffer'

export interface AttributeOptions {
  size: number
  maxElements: number
  data?: number[]
  vertexAttribDivisor?: number
  isInstance?: boolean
  stride?: number
  usage?: number
}

class Attribute {
  private readonly _size: number
  private readonly stride: number = 0
  private readonly vertexAttribDivisor: number = 0
  public readonly isInstance: boolean = false
  private elemNumber = 0

  private readonly location: number
  private readonly arrayData: Float32Array
  private readonly buffer: WebGLBuffer

  public constructor(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    options: AttributeOptions
  ) {
    this._size = options.size
    this.vertexAttribDivisor =
      options.vertexAttribDivisor ?? this.vertexAttribDivisor
    this.isInstance = options.isInstance ?? this.isInstance
    this.stride = options.stride ?? this.stride
    this.location = gl.getAttribLocation(program, name)
    if (this.location < 0) {
      throwError(`could not get attribute location: ${name}`)
    }
    this.arrayData = options.data
      ? new Float32Array(options.data)
      : new Float32Array(options.maxElements * options.size)
    this.buffer = makeBuffer(
      gl,
      this.arrayData,
      options.usage ?? gl.DYNAMIC_DRAW
    )
  }

  private pushSingleData(data: number): void {
    if (this.size !== 1) {
      throw new Error('Only size 1 can not to be an array')
    }
    this.arrayData[this._size * this.elemNumber] = data
  }

  public get size(): number {
    return this._size
  }

  private pushMultiData(data: number[]): void {
    if (data.length !== this.size) {
      throw new Error('bad size')
    }

    for (let i = 0; i < this.size; i++) {
      this.arrayData[this.size * this.elemNumber + i] = data[i]
    }
  }

  public pushData(data: number[] | number): void {
    if (Array.isArray(data)) {
      this.pushMultiData(data)
    } else {
      this.pushSingleData(data)
    }

    this.elemNumber++
  }

  public pushManyData(data: Array<number[] | number>): void {
    for (let i = 0; i < data.length; i++) {
      this.pushData(data[i])
    }
  }

  public enable(gl: WebGL2RenderingContext): void {
    if (this.location < 0) {
      return
    }
    gl.enableVertexAttribArray(this.location)
  }

  public bindData(gl: WebGL2RenderingContext): void {
    if (this.location < 0) {
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    if (this.isInstance) {
      gl.bufferData(gl.ARRAY_BUFFER, this.arrayData, gl.STATIC_DRAW)
    } else {
      gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        this.arrayData,
        0,
        this.elemNumber * this.size
      )
    }

    this.elemNumber = 0
  }

  public pointer(gl: WebGL2RenderingContext, buffer?: WebGLBuffer): void {
    if (this.location < 0) {
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer ?? this.buffer)

    const type = gl.FLOAT
    const normalize = false
    const offset = 0
    gl.vertexAttribPointer(
      this.location,
      this.size, // size (num values to pull from buffer per iteration)
      type, // type of data in buffer
      normalize, // normalize
      this.stride, // stride, num bytes to advance to get to next set of values
      offset
    )
    if (this.vertexAttribDivisor > 0) {
      gl.vertexAttribDivisor(this.location, this.vertexAttribDivisor)
    }
  }

  public flush(gl: WebGL2RenderingContext): void {
    this.enable(gl)
    this.bindData(gl)
    this.pointer(gl)
  }
}

export default Attribute

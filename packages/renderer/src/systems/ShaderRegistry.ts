import { Component, Constructor, ConstructorMap } from '@mythor/core'
import type Renderer from './Renderer'
import Shader from '../webgl/shaders/Shader'
import FillTriangle from '../webgl/shaders/FillTriangle'
import ParticlesUpdate from '../webgl/shaders/ParticlesUpdate'
import ParticlesRender from '../webgl/shaders/ParticlesRender'
import Lines from '../webgl/shaders/Lines'
import Sprite from '../webgl/shaders/Sprite'
import FillRect from '../webgl/shaders/FillRect'
import Circle from '../webgl/shaders/Circle'
import Text from '../webgl/shaders/Text'

class ShaderRegistry {
  private readonly shaders: ConstructorMap<Shader> = new ConstructorMap()
  public readonly shapes: Map<Constructor<Component>, Shader[]> = new Map()

  public async addShader(shader: Shader, renderer: Renderer): Promise<void> {
    await shader.init(renderer)

    if (shader.component) {
      const shaders = this.shapes.get(shader.component)

      if (shaders) {
        shaders.push(shader)
      } else {
        this.shapes.set(shader.component, [shader])
      }
    }

    this.shaders.set(shader)
  }

  public get<T extends Shader>(shader: Constructor<T>): T | undefined {
    return this.shaders.get(shader)
  }

  public forEachShader(fn: (shader: Shader) => void): void {
    this.shaders.forEach(fn)
  }

  public async initDefaultShaders(
    gl: WebGL2RenderingContext,
    renderer: Renderer
  ): Promise<void> {
    await this.addShader(new Sprite(gl), renderer)
    await this.addShader(new FillTriangle(gl), renderer)
    await this.addShader(new Lines(gl), renderer)
    await this.addShader(new FillRect(gl), renderer)
    await this.addShader(new Circle(gl), renderer)
    await this.addShader(new Text(gl), renderer)
    await this.addShader(new ParticlesUpdate(gl), renderer)
    await this.addShader(new ParticlesRender(gl), renderer)
  }
}

export default ShaderRegistry

import PostProcessEffect from '../PostProcessEffect'
import grayscaleFragmentShader from '../glsl/grayscale.fs'

interface GrayscaleEffectOptions {
  intensity?: number
}

class GrayscaleEffect extends PostProcessEffect {
  private intensityUniform!: WebGLUniformLocation
  public intensity: number

  public constructor(options?: GrayscaleEffectOptions) {
    super(grayscaleFragmentShader)
    this.intensity = options?.intensity ?? 1
  }

  protected onInit(): void {
    this.intensityUniform = this.getUniformLocation('u_intensity')
  }

  protected setUniforms(): void {
    this.gl.uniform1f(this.intensityUniform, this.intensity)
  }
}

export default GrayscaleEffect

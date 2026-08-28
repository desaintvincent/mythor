import PostProcessEffect from '../PostProcessEffect'
import blurFragmentShader from '../glsl/blur.fs'

interface BlurEffectOptions {
  strength?: number
}

class BlurEffect extends PostProcessEffect {
  private strengthUniform!: WebGLUniformLocation
  public strength: number

  public constructor(options?: BlurEffectOptions) {
    super(blurFragmentShader)
    this.strength = options?.strength ?? 1
  }

  protected onInit(): void {
    this.strengthUniform = this.getUniformLocation('u_strength')
  }

  protected setUniforms(): void {
    this.gl.uniform1f(this.strengthUniform, this.strength)
  }
}

export default BlurEffect

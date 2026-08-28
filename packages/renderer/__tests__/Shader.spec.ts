import Shader, {
  DEFAULT_MATRIX_CAMERA_LOCATION,
  UniformType,
} from '../src/webgl/shaders/Shader'
import Camera from '../src/objects/Camera'

describe('Shader', () => {
  it('initializes without GL program when shaders are empty', () => {
    const gl = createGlStub()
    const shader = new Shader(gl as never, '', '')

    expect(shader).toBeInstanceOf(Shader)
    expect(
      (shader as unknown as { component?: unknown }).component
    ).toBeUndefined()
  })

  it('postRender clears without throwing when no vertices were pushed', () => {
    const gl = createGlStub()
    const shader = new Shader(gl as never, '', '')

    expect(() => shader.postRender(new Camera(), 0, 0)).not.toThrow()
  })

  it('exposes the default camera uniform name', () => {
    expect(DEFAULT_MATRIX_CAMERA_LOCATION).toBe('matrix_camera')
    expect(UniformType.M4).toBe('uniformMatrix4fv')
  })
})

function createGlStub(): WebGL2RenderingContext {
  const gl = {
    TRIANGLES: 0x0004,
    TEXTURE_2D: 0x0de1,
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    LINK_STATUS: 0x8b82,
    SEPARATE_ATTRIBS: 0x8c8d,
    createProgram: () => null,
    createVertexArray: () => null,
    bindVertexArray: jest.fn(),
    useProgram: jest.fn(),
    getUniformLocation: jest.fn(),
    attachShader: jest.fn(),
    transformFeedbackVaryings: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(),
    getProgramInfoLog: jest.fn(),
    createShader: jest.fn(),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(),
    getShaderInfoLog: jest.fn(),
    deleteShader: jest.fn(),
    drawArrays: jest.fn(),
    bindTexture: jest.fn(),
    uniform1i: jest.fn(),
    uniformMatrix4fv: jest.fn(),
    uniform4fv: jest.fn(),
    uniform2fv: jest.fn(),
  }

  return gl as unknown as WebGL2RenderingContext
}

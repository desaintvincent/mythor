export interface VertexAttribute {
  buffer: WebGLBuffer
  location: number
  numComponents: number
  type?: GLenum
  normalize?: boolean
  stride?: number
  offset?: number
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  attributes?: VertexAttribute[]
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()

  if (!vao) {
    throw new Error('Could not create vertex array')
  }

  gl.bindVertexArray(vao)

  if (attributes) {
    for (const attribute of attributes) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer)
      gl.enableVertexAttribArray(attribute.location)
      gl.vertexAttribPointer(
        attribute.location,
        attribute.numComponents,
        attribute.type ?? gl.FLOAT,
        attribute.normalize ?? false,
        attribute.stride ?? 0,
        attribute.offset ?? 0
      )
    }
  }

  return vao
}

export default makeVertexArray

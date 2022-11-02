function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData?: BufferSource | GLsizeiptr,
  usage?: GLenum
): WebGLBuffer {
  const buffer = gl.createBuffer()
  if (!buffer) {
    throw new Error('could not create buffer')
  }
  if (sizeOrData) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // sizeOrData can be BufferSource, but typescript is dumb
    gl.bufferData(
      gl.ARRAY_BUFFER,
      sizeOrData as number,
      usage ?? gl.DYNAMIC_DRAW
    )
  }

  return buffer
}

export default makeBuffer

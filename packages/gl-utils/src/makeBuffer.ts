function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData?: BufferSource | GLsizeiptr,
  usage?: GLenum
): WebGLBuffer {
  const buffer = gl.createBuffer()

  if (!buffer) {
    throw new Error('Could not create buffer')
  }

  if (sizeOrData) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      sizeOrData as number,
      usage ?? gl.STATIC_DRAW
    )
  }

  return buffer
}

export default makeBuffer

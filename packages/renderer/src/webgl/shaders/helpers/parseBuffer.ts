function parseBuffer(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer,
  size: number,
  maxElements: number
): string {
  const results = new Float32Array(maxElements * size)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.getBufferSubData(
    gl.ARRAY_BUFFER,
    0, // byte offset into GPU buffer,
    results
  )

  return results.join(' ')
}

export default parseBuffer

export async function loadAudio(src: string): Promise<ArrayBuffer> {
  const response = await fetch(src)

  if (!response.ok) {
    throw new Error(`Unable to load audio asset from ${src}`)
  }

  return await response.arrayBuffer()
}

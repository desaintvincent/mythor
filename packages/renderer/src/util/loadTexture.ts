import { loadImage } from '@mythor/assets'
import { log, Logger } from '@mythor/core'
import Texture from '../objects/Texture'

interface LoadTextureOptions {
  /** Custom logger. Pass `null` to suppress logging. */
  logger?: Logger | null
}

export async function loadTexture(
  name: string,
  path: string,
  gl: WebGL2RenderingContext,
  options?: LoadTextureOptions
): Promise<Texture> {
  const img = await loadImage(path)
  const texture = new Texture(img, gl)

  if (options?.logger !== null) {
    const logger = options?.logger ?? log
    logger(`Loaded %ctexture%c "${name}"`, 'tomato')
  }

  return texture
}

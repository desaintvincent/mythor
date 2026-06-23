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
  return await new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const texture = new Texture(img, gl)
      if (options?.logger !== null) {
        ;(options?.logger ?? log)(`Loaded %ctexture%c "${name}"`, 'tomato')
      }
      resolve(texture)
    }

    img.onerror = (err) => reject(err)

    img.src = path
  })
}

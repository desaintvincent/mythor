export async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      resolve(image)
    }

    image.onerror = (event) => {
      reject(event)
    }

    image.src = src
  })
}

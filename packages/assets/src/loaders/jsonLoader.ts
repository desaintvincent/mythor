export async function loadJson<T = unknown>(src: string): Promise<T> {
  const response = await fetch(src)

  if (!response.ok) {
    throw new Error(`Unable to load json asset from ${src}`)
  }

  const data: unknown = await response.json()

  return data as T
}

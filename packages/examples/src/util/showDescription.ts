/**
 * Displays a short description and a list of controls above the example
 * canvas, so visitors know what the example does and how to interact with it.
 */
export default function showDescription(
  description: string,
  controls: string[]
): void {
  const container = document.createElement('div')
  container.className = 'example-description'

  const text = document.createElement('p')
  text.innerText = description
  container.appendChild(text)

  if (controls.length > 0) {
    const list = document.createElement('ul')
    controls.forEach((control) => {
      const item = document.createElement('li')
      item.innerText = control
      list.appendChild(item)
    })
    container.appendChild(list)
  }

  document.getElementById('canvas')?.before(container)
}

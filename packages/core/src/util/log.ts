const log = (text: unknown, color = 'none'): void => {
  if (typeof text === 'string' && text.includes('%c')) {
    // eslint-disable-next-line no-console
    console.log(text, `color: ${color};`, 'color: none;')
  } else if (typeof text === 'string') {
    // eslint-disable-next-line no-console
    console.log(`%c${text}%c`, `color: ${color};`, 'color: none;')
  } else {
    // eslint-disable-next-line no-console
    console.log(text)
  }
}

export default log

export const round = (number: number, precision = 3): number => {
  const coef = Math.pow(10, precision)

  return Math.round(coef * number) / coef
}

export const lerp = (value1: number, value2: number, amount = 0.5): number => {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount

  return value1 + (value2 - value1) * amount
}

export const root = (value: number): number => value * value

export const moveTowards = (
  current: number,
  target: number,
  maxDelta: number
): number => {
  if (Math.abs(target - current) <= maxDelta) {
    return target
  }

  return current + Math.sign(target - current) * maxDelta
}


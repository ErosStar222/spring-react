import { EasingFunction, InterpolationConfig } from '../types/interpolation'
import { createStringInterpolator } from './Globals'
import { Interpolator } from '../types/animated'

type ExtrapolateType = InterpolationConfig['extrapolate']

export function createInterpolator<T extends Interpolator>(interpolator: T): T

export function createInterpolator<Out extends number | string>(
  config: InterpolationConfig<Out>
): (input: number) => Out extends number ? number : string

export function createInterpolator<Out extends number | string>(
  range: number[],
  output?: Out[],
  extrapolate?: ExtrapolateType
): (input: number) => Out extends number ? number : string

export function createInterpolator(
  range: number[] | InterpolationConfig | Interpolator,
  output?: (number | string)[],
  extrapolate?: ExtrapolateType
) {
  if (typeof range === 'function') {
    return range
  }
  if (Array.isArray(range)) {
    return createInterpolator({
      range,
      output: output!,
      extrapolate,
    })
  }
  if (typeof range.output[0] === 'string') {
    return createStringInterpolator(range as InterpolationConfig<string>)
  }
  const config = range as InterpolationConfig<number>
  const outputRange = config.output
  const inputRange = config.range || [0, 1]

  const extrapolateLeft =
    config.extrapolateLeft || config.extrapolate || 'extend'
  const extrapolateRight =
    config.extrapolateRight || config.extrapolate || 'extend'
  const easing = config.easing || (t => t)

  return (input: number) => {
    const range = findRange(input, inputRange)
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight,
      config.map
    )
  }
}

function interpolate(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  easing: EasingFunction,
  extrapolateLeft: ExtrapolateType,
  extrapolateRight: ExtrapolateType,
  map?: (x: number) => number
) {
  let result = map ? map(input) : input
  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === 'identity') return result
    else if (extrapolateLeft === 'clamp') result = inputMin
  }
  if (result > inputMax) {
    if (extrapolateRight === 'identity') return result
    else if (extrapolateRight === 'clamp') result = inputMax
  }
  if (outputMin === outputMax) return outputMin
  if (inputMin === inputMax) return input <= inputMin ? outputMin : outputMax
  // Input Range
  if (inputMin === -Infinity) result = -result
  else if (inputMax === Infinity) result = result - inputMin
  else result = (result - inputMin) / (inputMax - inputMin)
  // Easing
  result = easing(result)
  // Output Range
  if (outputMin === -Infinity) result = -result
  else if (outputMax === Infinity) result = result + outputMin
  else result = result * (outputMax - outputMin) + outputMin
  return result
}

function findRange(input: number, inputRange: number[]) {
  for (var i = 1; i < inputRange.length - 1; ++i)
    if (inputRange[i] >= input) break
  return i - 1
}

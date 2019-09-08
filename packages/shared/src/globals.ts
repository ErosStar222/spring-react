import { InterpolatorConfig, FrameRequestCallback } from './types'
import { ElementType } from 'react'

declare const window: {
  requestAnimationFrame: (cb: (time: number) => void) => number
  cancelAnimationFrame: (id: number) => void
}

//
// Required
//

export let defaultElement: string | ElementType

/** Provide custom logic for native updates */
export let applyAnimatedValues: (node: any, props: any) => boolean | void

/** Provide custom logic for string interpolation */
export let createStringInterpolator: (
  config: InterpolatorConfig<string>
) => (input: number) => string

/** Provide a custom `FrameLoop` instance */
export let frameLoop: {
  update: (time?: number) => boolean
  springs: Set<any>
  onFrame(cb: FrameRequestCallback): () => void
  start(spring: any): void
  stop(spring: any): void
}

//
// Optional
//

export let now = () => Date.now()

/** Provide custom color names for interpolation */
export let colorNames: { [key: string]: number } | null = null as any

/** Make all animations instant and skip the frameloop entirely */
export let skipAnimation = false

/** Intercept props before they're passed to an animated component */
export let getComponentProps = (props: any) => props

/** Wrap the `style` prop with an animated node */
export let createAnimatedStyle: ((style: any) => any) | null = null as any

/** Wrap the `transform` prop with an animated node */
export let createAnimatedTransform:
  | ((transform: any) => any)
  | null = null as any

export let requestAnimationFrame: typeof window.requestAnimationFrame =
  typeof window !== 'undefined' ? window.requestAnimationFrame : () => -1

export let cancelAnimationFrame: typeof window.cancelAnimationFrame =
  typeof window !== 'undefined' ? window.cancelAnimationFrame : () => {}

//
// Configuration
//

export interface AnimatedGlobals {
  now?: typeof now
  frameLoop?: typeof frameLoop
  colorNames?: typeof colorNames
  skipAnimation?: typeof skipAnimation
  defaultElement?: typeof defaultElement
  getComponentProps?: typeof getComponentProps
  applyAnimatedValues?: typeof applyAnimatedValues
  createStringInterpolator?: typeof createStringInterpolator
  createAnimatedTransform?: typeof createAnimatedTransform
  createAnimatedStyle?: typeof createAnimatedStyle
  requestAnimationFrame?: typeof requestAnimationFrame
  cancelAnimationFrame?: typeof cancelAnimationFrame
}

export const assign = (globals: AnimatedGlobals): AnimatedGlobals =>
  ({
    now,
    frameLoop,
    colorNames,
    skipAnimation,
    defaultElement,
    getComponentProps,
    applyAnimatedValues,
    createStringInterpolator,
    createAnimatedTransform,
    createAnimatedStyle,
    requestAnimationFrame,
    cancelAnimationFrame,
  } = Object.assign(
    {
      now,
      frameLoop,
      colorNames,
      skipAnimation,
      defaultElement,
      getComponentProps,
      applyAnimatedValues,
      createStringInterpolator,
      createAnimatedTransform,
      createAnimatedStyle,
      requestAnimationFrame,
      cancelAnimationFrame,
    },
    pluckDefined(globals)
  ))

// Ignore undefined values
function pluckDefined(globals: any) {
  const defined: any = {}
  for (const key in globals) {
    if (globals[key] !== undefined) defined[key] = globals[key]
  }
  return defined
}

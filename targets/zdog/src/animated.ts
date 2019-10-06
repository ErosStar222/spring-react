import * as Zdog from 'react-zdog'
import {
  ElementType,
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
} from 'react'
import { withAnimated, extendAnimated } from 'animated'
import { FluidValue } from 'shared'

type ZdogExports = typeof Zdog

type ZdogElements = {
  [P in keyof ZdogExports]: P extends 'Illustration'
    ? never
    : ZdogExports[P] extends ElementType
    ? P
    : never
}[keyof ZdogExports]

type ZdogComponents = {
  [Tag in ZdogElements]: AnimatedComponent<ZdogExports[Tag]>
}

const elements: ZdogElements[] = [
  'Anchor',
  'Shape',
  'Group',
  'Rect',
  'RoundedRect',
  'Ellipse',
  'Polygon',
  'Hemisphere',
  'Cylinder',
  'Cone',
  'Box',
]

type CreateAnimated = <T extends ElementType>(
  wrappedComponent: T
) => AnimatedComponent<T>

// Extend animated with all the available Zdog elements
export const animated: CreateAnimated & ZdogComponents = extendAnimated(
  withAnimated,
  elements
)

export { animated as a }

/** The type of an `animated()` component */
export type AnimatedComponent<
  T extends ElementType
> = ForwardRefExoticComponent<AnimatedProps<ComponentPropsWithRef<T>>>

/** The props of an `animated()` component */
export type AnimatedProps<Props extends object> = {
  [P in keyof Props]: (P extends 'ref' | 'key'
    ? Props[P]
    : AnimatedProp<Props[P]>)
}

// The animated prop value of a React element
type AnimatedProp<T> = [T, T] extends [infer T, infer DT]
  ? [DT] extends [never]
    ? never
    : DT extends void
    ? undefined
    : DT extends object
    ? AnimatedStyle<T>
    : DT | AnimatedLeaf<T>
  : never

// An animated object of style attributes
type AnimatedStyle<T> = [T, T] extends [infer T, infer DT]
  ? DT extends void
    ? undefined
    : [DT] extends [never]
    ? never
    : DT extends object
    ? { [P in keyof DT]: AnimatedStyle<DT[P]> }
    : DT | AnimatedLeaf<T>
  : never

// An animated value that is not an object
type AnimatedLeaf<T> = [T] extends [object]
  ? never
  : FluidValue<Exclude<T, object | void>>

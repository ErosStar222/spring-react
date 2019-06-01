import {
  Interpolator,
  ExtrapolateType,
  InterpolatorConfig,
} from './interpolation'
import { Arrify, OneOrMore } from './common'
/** These types can be animated */
export declare type Animatable<T = any> = T extends number
  ? number
  : T extends string
  ? string
  : T extends ReadonlyArray<any>
  ? ReadonlyArray<any> extends T
    ? ReadonlyArray<number | string>
    : { [P in keyof T]: Animatable<T[P]> }
  : never
/** An animated value which can be passed into an `animated` component */
export interface SpringValue<T = any> {
  /**
   * Get the animated value. Automatically invoked when an `AnimatedValue`
   * is assigned to a property of an `animated` element.
   */
  getValue(): T
  /**
   * Interpolate the value with a custom interpolation function,
   * a configuration object or keyframe-like ranges.
   *
   * @example
   *
   * interpolate(alpha => `rgba(255, 165, 0, ${alpha})`)
   * interpolate({ range: [0, 1], output: ['yellow', 'red'], extrapolate: 'clamp' })
   * interpolate([0, 0.25, 1], ['yellow', 'orange', 'red'])
   */
  interpolate: Interpolator<Arrify<T>>
}
declare type RawValues<T extends ReadonlyArray<any>> = {
  [P in keyof T]: T[P] extends SpringValue<infer U> ? U : never
}
/**
 * This interpolates one or more `SpringValue` objects.
 * The exported `interpolate` function uses this type.
 */
export interface SpringInterpolator {
  <In extends Animatable, Out extends Animatable>(
    parent: SpringValue<In>,
    interpolator: (...args: Arrify<In>) => Out
  ): SpringValue<Animatable<Out>>
  <In extends ReadonlyArray<SpringValue>, Out extends Animatable>(
    parents: In,
    interpolator: (...args: RawValues<In>) => Out
  ): SpringValue<Animatable<Out>>
  <Out extends Animatable>(
    parents: OneOrMore<SpringValue>,
    config: InterpolatorConfig<Out>
  ): SpringValue<Animatable<Out>>
  <Out extends Animatable>(
    parents: OneOrMore<SpringValue>,
    range: number[],
    output: Out[],
    extrapolate?: ExtrapolateType
  ): SpringValue<Animatable<Out>>
}
export {}

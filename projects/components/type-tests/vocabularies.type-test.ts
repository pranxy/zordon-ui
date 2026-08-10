import type {
  ZdBlockPlacement,
  ZdColor,
  ZdDensity,
  ZdInlinePlacement,
  ZdOrientation,
  ZdPlacement,
  ZdShape,
  ZdSize,
  ZdStyle,
} from '../src/public-api';

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;
type Expect<Value extends true> = Value;

export type VocabularyContract = [
  Expect<
    Equal<
      ZdColor,
      'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
    >
  >,
  Expect<Equal<ZdSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>>,
  Expect<Equal<ZdStyle, 'outline' | 'dash' | 'soft' | 'ghost' | 'border'>>,
  Expect<Equal<ZdShape, 'square' | 'circle'>>,
  Expect<Equal<ZdInlinePlacement, 'start' | 'center' | 'end'>>,
  Expect<Equal<ZdBlockPlacement, 'top' | 'middle' | 'bottom'>>,
  Expect<Equal<ZdPlacement, 'start' | 'center' | 'end' | 'top' | 'middle' | 'bottom'>>,
  Expect<Equal<ZdOrientation, 'horizontal' | 'vertical'>>,
  Expect<Equal<ZdDensity, 'compact' | 'comfortable' | 'spacious'>>,
];

// @ts-expect-error Theme base tokens are not component color modifiers.
export const invalidColor: ZdColor = 'base-100';
// @ts-expect-error Larger responsive breakpoints are not component sizes.
export const invalidSize: ZdSize = '2xl';
// @ts-expect-error Button's link treatment is component-specific.
export const invalidStyle: ZdStyle = 'link';
// @ts-expect-error Mask-specific shapes do not widen the shared shape contract.
export const invalidShape: ZdShape = 'squircle';
// @ts-expect-error Physical horizontal sides are intentionally not shared RTL-safe placements.
export const invalidPlacement: ZdPlacement = 'left';
// @ts-expect-error Axis names are not layout orientations.
export const invalidOrientation: ZdOrientation = 'inline';
// @ts-expect-error daisyUI's compact component modifiers are not the density vocabulary.
export const invalidDensity: ZdDensity = 'dense';

# Typed foundation vocabularies

Zordon UI exposes a small set of shared type-only vocabularies from `@pranxy/zordon-ui`. They keep
component APIs consistent without adding runtime code or restricting consumer CSS customization.

```ts
import type { ZdColor, ZdOrientation, ZdSize } from '@pranxy/zordon-ui';

const color: ZdColor = 'primary';
const size: ZdSize = 'lg';
const orientation: ZdOrientation = 'horizontal';
```

## Public types

| Type                | Values                                                                             | Contract                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `ZdColor`           | `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error` | daisyUI semantic component colors; base and content theme tokens are not component modifiers |
| `ZdSize`            | `xs`, `sm`, `md`, `lg`, `xl`                                                       | recurring daisyUI component sizes                                                            |
| `ZdStyle`           | `outline`, `dash`, `soft`, `ghost`, `border`                                       | reusable treatments; every component exposes only its supported subset                       |
| `ZdShape`           | `square`, `circle`                                                                 | basic cross-component shapes                                                                 |
| `ZdInlinePlacement` | `start`, `center`, `end`                                                           | logical inline alignment that follows LTR or RTL direction                                   |
| `ZdBlockPlacement`  | `top`, `middle`, `bottom`                                                          | block-axis placement                                                                         |
| `ZdPlacement`       | all inline and block placement values                                              | shared single-axis vocabulary; compound placement uses the axis-specific types               |
| `ZdOrientation`     | `horizontal`, `vertical`                                                           | linear layout orientation                                                                    |
| `ZdDensity`         | `compact`, `comfortable`, `spacious`                                               | library-owned spacing intent, not a direct daisyUI class                                     |

Omitting an optional component input selects that component's default. The shared unions therefore
do not contain artificial `default` or `solid` values.

## Component-specific values

Shared does not mean universally accepted. A component narrows the common type to the modifiers its
daisyUI implementation supports:

```ts
import type { ZdStyle } from '@pranxy/zordon-ui';

type AlertStyle = Extract<ZdStyle, 'outline' | 'dash' | 'soft'>;
```

Button's `link`, Tabs' `box` and `lift`, Mask's rich shapes, Loading's animation names, and similar
specialized values remain in their component entry points. Physical `left` and `right` placements
remain local to behavior where a physical side is intrinsic; shared directional APIs use logical
`start` and `end`.

## Customization boundary

These types describe library-owned inputs, not the complete styling surface. Consumers still add
classes, styles, data attributes, and CSS variables, and define daisyUI theme values in their own
Tailwind build. Do not widen a vocabulary with `| string`; use the documented customization surface
for values outside a component's typed modifiers.

The aliases are exported with `export type` and generate no runtime arrays, enums, validation, or
bundle payload. Component-specific runtime class maps will be introduced only where implementation
requires them.

# Loading

Status: automated implementation complete; manual accessibility pending.

Import `ZdLoading` from `@pranxy/zordon-ui/loading`. It presents indeterminate work with six daisyUI
animations, five sizes, optional semantic colors, custom artwork and delayed feedback. No Angular
Aria widget, CDK overlay or Forms value accessor is involved.

```ts
import { Component, signal } from '@angular/core';
import { ZdLoading } from '@pranxy/zordon-ui/loading';

@Component({
  imports: [ZdLoading],
  template: `
    <section aria-label="Results" [attr.aria-busy]="busy()">
      <!-- Application content; disable individual actions only when appropriate. -->
    </section>
    <zd-loading
      [active]="busy()"
      [delay]="250"
      label="Loading results"
      variant="spinner"
      size="md"
      layout="center"
      showLabel
    />
  `,
})
export class Results {
  readonly busy = signal(false);
}
```

Keep the status outside the region marked aria-busy so that busy state does not suppress its
announcement. Busy state starts with the work, independently of the visual delay.

## API

| Input/property | Default   | Contract                                                                                            |
| -------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `active`       | `true`    | Consumer-owned work state; false clears visual/status feedback immediately.                         |
| `variant`      | `spinner` | `spinner`, `dots`, `ring`, `ball`, `bars`, `infinity`, `custom`.                                    |
| `size`         | `md`      | `xs`, `sm`, `md`, `lg`, `xl`; native daisyUI size classes.                                          |
| `color`        | Unset     | `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error`; unset inherits. |
| `layout`       | `inline`  | `inline`, `center`, `overlay`; the last is a non-blocking positioned indicator.                     |
| `label`        | `Loading` | Nonempty localized status text.                                                                     |
| `showLabel`    | `false`   | Also shows the label visually beside the artwork.                                                   |
| `decorative`   | `false`   | Removes status semantics and hides the host from assistive technology.                              |
| `delay`        | `0`       | Milliseconds before visual/status feedback; finite 0–2147483647. Zero shows immediately.            |
| `visible()`    | Derived   | Read-only signal indicating whether active work has passed its delay.                               |

The package exports `ZdLoadingVariant`, `ZdLoadingSize`, `ZdLoadingColor`, and `ZdLoadingLayout`.
The template export is `zdLoading`. This is not determinate progress: there is no percentage/value
input, progressbar role, completion event, request wrapper or minimum display duration.

## State and accessibility

A non-decorative host keeps an atomic status region mounted. Its screen-reader text is empty while
inactive or delayed, then becomes the label when visible. Artwork and the optional visible label
are in a separate aria-hidden/inert wrapper to avoid duplicate announcements and focusable graphics.
Use decorative when another status message already communicates the work, such as a clearly
labelled busy button. Do not put meaningful controls inside loader artwork.

Loading does not mark ancestors busy, disable buttons, trap focus, lock scrolling or move focus.
Consumers own work state and aria-busy on the affected content. Labels should describe the work,
not just its animation. Routine status announcements can vary by screen reader, especially for
initial server content; no replay/forced-announcement mechanism is added.

## Delay and SSR

The same inputs give the same initial server and browser output. Active loaders with zero delay
show immediately; positive delays render empty status/hidden artwork until the browser timer
finishes. No timer runs on the server. Each rendered active cycle or changed delay resets pending
feedback; inactivity and destruction cancel the timer. Changing labels, colors or size does not
restart a delay. Quick work that finishes before its delay never adds a status message.

The linked signal resets elapsed state synchronously when active/delay changes, avoiding stale
visibility while waiting for the next browser render. Ordinary hydration is tested; independently
hydrated boundaries, delayed pre-hydration event replay and client/server input mismatches are not.

## Layout and custom artwork

Inline fits text or button composition. Center fills the available inline space and centers the
indicator. Overlay positions absolutely inside the nearest positioned ancestor:

```html
<div class="relative">
  <!-- Underlying content stays interactive. -->
  <zd-loading [active]="refreshing()" layout="overlay" label="Refreshing preview" showLabel />
</div>
```

Overlay has pointer-events none and adds no backdrop. It is a visual position, not a modal or a
disabled region. Applications that require blocked interaction must implement that behavior
explicitly and preserve a usable focus path. Choose a containing block with enough space for the
indicator and label.

```html
<zd-loading variant="custom" label="Preparing export" showLabel>
  <span zdLoadingCustom class="my-loader">◇</span>
</zd-loading>
```

`zdLoadingCustom` is a static projection selector, not a directive import. Wrap custom artwork in
one marked element. Projection remains instantiated even when hidden; it is not a lazy template.
Custom artwork owns its normal-motion dimensions and animation. Size controls the built-in glyph
and static fallback; custom artwork can read `--zd-loading-size` (4–8) and `--size-selector` if needed.

## Reduced motion, forced colors and theming

daisyUI's masks contain animated SVG content, so turning off CSS animation on the outer span is
not enough. Under reduced motion or forced colors, Loading hides the animated/custom artwork and
shows a static bordered ring. Visible label and status text remain available. Forced colors uses
CanvasText; reduced motion otherwise inherits the configured semantic color. Hidden custom content
may still own application timers; consumers remain responsible for those lifetimes.

Compile Loading candidates globally so styles can reach the component's internal glyph:

```css
@import 'tailwindcss' source(none);
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark;
}
@source inline("loading loading-spinner loading-dots loading-ring loading-ball loading-bars loading-infinity loading-xs loading-sm loading-md loading-lg loading-xl");
```

Glyph classes honor configured Tailwind/daisyUI prefixes. Semantic colors use the existing
`--color-*` variables on the decorative artwork, leaving label text in its inherited text color.
There is no extra package stylesheet to import for layout or motion fallback. Custom themes still
need contrast review; color alone must not communicate task state.

Automated browser tests cover real mask generation, sizes, status text, delay cancellation,
non-blocking overlay actions, RTL, forced colors and reduced motion. Deterministic visual snapshots
cover static fallback states; animated frames remain a human visual review item. See
[accessibility review](loading-accessibility-review.md), [visual matrix](loading-visual-matrix.md),
[ADR 0013](../architecture/0013-loading-status-and-motion.md), and
[daisyUI Loading](https://daisyui.com/components/loading/).

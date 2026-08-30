# Badge

**Component ID:** DSP-04  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/badge`

Badge applies daisyUI's compact status/count styling to a consumer-owned native element. It is a
standalone `[zdBadge]` directive, not a status service, counter formatter, removable chip,
selection widget, or form control.

## Native and semantic boundary

Use Badge on the native element that already has the required meaning. A static label can be a
`<span>`; an announced update requires consumer-owned `role="status"`/live-region policy; an
action remains a native `<button>`; and a selected value remains a native checkbox/radio or a
separately specified control. Badge never adds a role, label, focus behavior, event handler, ID,
ARIA state, or live announcement.

```html
<span zdBadge color="success" style="soft">Paid</span>

<button zdBadge color="primary" size="sm" type="button" (click)="removeFilter()">
  Filter: new ×
</button>
```

The second example is still a native button: its name, activation, disabled state, and removal
behavior belong to the application. A visual color is not a status announcement and must not be
used as the only indication of state.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                                           | Purpose                                          |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| `badge`                                                             | Required base compact container                  |
| `badge-outline`, `badge-dash`, `badge-soft`, `badge-ghost`          | Optional documented styles                       |
| `badge-neutral`, `badge-primary`, `badge-secondary`, `badge-accent` | Optional theme color modifiers                   |
| `badge-info`, `badge-success`, `badge-warning`, `badge-error`       | Optional semantic theme color modifiers          |
| `badge-xs`, `badge-sm`, `badge-md`, `badge-lg`, `badge-xl`          | Optional size modifiers; upstream base is medium |

The official examples permit arbitrary consumer text, an icon, and an empty Badge used as a dot.
Installed CSS uses `--badge-color` and `--size`; daisyUI documents both as internal,
exact-version-only variables. They are not Zordon APIs.

## Planned public API

| Input   | Type                                                                                                            | Intrinsic default | Contract                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `color` | `'neutral' \| 'primary' \| 'secondary' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'error' \| undefined` | none              | Adds one optional `badge-*` color candidate.                             |
| `style` | `'outline' \| 'dash' \| 'soft' \| 'ghost' \| undefined`                                                         | none              | Adds one optional documented style candidate.                            |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| undefined`                                                             | upstream medium   | Adds one optional size candidate; omission leaves the daisyUI base size. |

Unsupported values reject rather than create an uncompiled runtime class. `undefined` removes the
corresponding modifier. There are no models, outputs, methods, application defaults, Forms
integration, or Angular Aria/CDK dependency.

Static/dynamic consumer classes, non-overlapping `ngClass`, native styles and CSS custom
properties, `data-theme`, and native attributes remain additive. Explicit consumer candidate
classes are the documented per-token override boundary in
[host class composition](../foundations/host-class-composition.md).

## Content and compositions

Badge projects ordinary consumer content without named parts or markup requirements.

| Use              | Consumer responsibility                                  | Badge responsibility                            |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Text label/count | Text, number formatting, localization, accessible name   | Compact visual container                        |
| Empty dot        | Whether meaning is additionally named in text            | Empty visual marker only                        |
| Icon plus text   | SVG/image accessibility and visible label                | Spacing supplied by daisyUI base CSS            |
| Removable item   | Native button, activation, confirmation, and focus       | Optional Badge classes on that button           |
| Selectable value | Native input/button semantics, state, and form ownership | Optional Badge classes on the selected control  |
| Status/update    | `role`, `aria-live`, urgency, and announcement timing    | Color/style only; never an inferred live region |

## Styling, themes, and customization

Use documented Badge candidates, ordinary Tailwind utilities, theme tokens, and native style
bindings for appearance and responsive layout. Consumer classes can set layout, borders, radius,
colors, or `sm:`/other responsive candidates without new Angular inputs.

```html
<span
  zdBadge
  color="warning"
  style="outline"
  class="rounded-full px-3 sm:badge-lg"
  [style.max-inline-size.rem]="12"
>
  {{ localizedLabel }}
</span>
```

The local `color` input selects a documented daisyUI semantic modifier; it does not replace
consumer color classes or certify custom-theme contrast. Do not expose arbitrary color, radius,
padding, border, dot, icon, counter, or duration inputs. Consumers who override `--badge-color`
or `--size` accept daisyUI exact-version coupling and must follow
[safe customization](../foundations/safe-customization.md); Zordon neither sets nor documents them
as stable hooks.

## Accessibility, platform, and lifecycle

Badge has no component-owned keyboard, pointer, focus, motion, directionality, browser API,
timer, subscription, observer, or cleanup path. The host and projected content render identically
on server and client, so SSR and hydration need only prove native attributes/content and
deterministic classes survive.

Consumers must provide text or another accessible alternative for an empty visual dot and must
not use color alone to convey status. Confirm semantic-color contrast in supported/custom themes,
forced-colors, RTL, long localized strings, 200% zoom, and 400% reflow. When a Badge itself is a
live update, the consumer owns the live-region policy and must avoid duplicate or noisy
announcements.

## Examples

### Basic

```html
<span zdBadge color="primary">New</span>
```

### Status with explicit consumer semantics

```html
<p>
  Deployment:
  <span zdBadge color="success" role="status">Complete</span>
</p>
```

### Avoid

```html
<!-- Avoid: a color-only empty Badge has no accessible status. -->
<span zdBadge color="error"></span>

<!-- Provide an accessible text equivalent when the dot carries meaning. -->
<span class="inline-flex items-center gap-2">
  <span zdBadge color="error" aria-hidden="true"></span>
  <span>Payment failed</span>
</span>
```

## Evidence required before Preview

| Area             | Required proof                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API/package      | Intentional `./badge` entry, exact type tests, API extraction, tarball, and bundle review                                                                    |
| Native semantics | Span/button/input host preservation, no injected role/focus/ARIA/events, and native disabled behavior                                                        |
| Styling          | Every candidate/prefix, stale-token removal, consumer class/style precedence, empty/icon/text composition, and custom theme contrast boundary                |
| Accessibility    | Axe, manual status/dot alternatives, keyboard behavior for consumer interactive hosts, forced-colors, contrast, zoom/reflow, RTL, and long localized strings |
| SSR/hydration    | Stable host/classes/content and clean hydration without browser-only work                                                                                    |
| Visual           | Light/dark/custom themes; primary/neutral/status colors; outline/dash/soft/ghost; xs/xl; empty/icon/text; mobile RTL                                         |

## Sources

- [daisyUI Badge documentation](https://daisyui.com/components/badge/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Zordon Angular Aria adoption](../foundations/angular-aria-adoption.md)
- [Zordon safe customization](../foundations/safe-customization.md)

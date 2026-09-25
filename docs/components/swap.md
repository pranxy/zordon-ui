# Swap

**Maturity:** Preview; automated verification complete, manual accessibility pending.

**Entry point:** `@pranxy/zordon-ui/swap` · **Matrix row:** ACT-05.

**Verified target:** Angular 21.2.19 and installed daisyUI 5.7.16. No dependency upgrade.

Swap presents decorative on, off and indeterminate states around a native checkbox or toggle button.
Native HTML owns activation, focus and Forms; no Angular Aria or CDK primitive is needed. A manual
container only displays state. This is not a disclosure, router outlet or arbitrary interactive-content switcher.

## Setup

Import the directives you use and include the supplemental stylesheet **after daisyUI**:

```ts
import {
  ZdSwap,
  ZdSwapInput,
  ZdSwapOn,
  ZdSwapOff,
  ZdSwapIndeterminate,
} from '@pranxy/zordon-ui/swap';
```

```css
@import '@pranxy/zordon-ui/swap/swap.css';
```

Include `swap swap-active swap-on swap-off swap-indeterminate swap-rotate swap-flip` in your
Tailwind/daisyUI source discovery, with your configured prefix if any. The supplemental stylesheet
uses stable data attributes, so it does not depend on class prefixes. It is required for focus
indication, state visibility, the indeterminate flip correction and reduced-motion behavior.

## Native checkbox and Forms

```html
<label zdSwap swapEffect="rotate" [swapReadOnly]="locked()">
  <input
    type="checkbox"
    zdSwapInput
    [formControl]="notifications"
    [indeterminate]="partlyEnabled()"
    aria-label="Notifications"
    name="notifications"
    value="yes"
  />
  <span zdSwapOn>On</span>
  <span zdSwapOff>Off</span>
  <span zdSwapIndeterminate>Some</span>
</label>
```

Use one direct-child checkbox **before** the state parts. Checked state, `disabled`, `required`,
name/value, native input/change/blur, touched/dirty state and validation remain on that input.
Reactive Forms uses Angular's native checkbox value accessor. Template-driven forms can likewise
use the native accessor; no additional CVA is installed. Native `checked` plus `change` bindings
are also supported. Keep one owner for the checked value; do not bind Swap's `swapActive` or
`swapIndeterminate` inputs in this mode. The checkbox's live properties own the visual state.

Indeterminate is a visual/native mixed state, independent of the boolean submitted value. Native
activation clears it before changing checked state. Reset through the form/control when using Forms;
with an unmanaged checkbox, native form reset retains its normal default-checked behavior.

## Controlled toggle button

```html
<button
  type="button"
  zdSwap
  swapEffect="flip"
  [swapActive]="muted()"
  (swapActiveChange)="muted.set($event)"
  [disabled]="unavailable()"
  aria-label="Mute"
>
  <span zdSwapOn>Muted</span>
  <span zdSwapOff>Sound</span>
</button>
```

`swapActiveChange` is a request, not an internal mutation. Ignore it to veto a change. The consumer
must update `swapActive` to accept. Native click, Enter and Space produce one request, with no custom keyboard
emulation. Set `type="button"` when activation must not submit a surrounding form. A native disabled
button keeps its platform behavior. `swapIndeterminate` sets `aria-pressed="mixed"` and shows the third
part; accepting a mixed-state request also requires the consumer to clear `swapIndeterminate`.

Use a stable accessible name such as “Mute” for both states. The directive owns `aria-pressed`;
consumers own labels and descriptions. Read-only buttons remain focusable and expose `aria-disabled`.

## Manual presentation

```html
<div
  zdSwap
  [swapActive]="isDay()"
  [swapIndeterminate]="unknown()"
  swapEffect="custom"
  class="my-transition"
>
  <span zdSwapOn>Day</span>
  <span zdSwapOff>Night</span>
  <span zdSwapIndeterminate>Unknown</span>
</div>
```

`div` and `span` roots add no role, focus stop or activation. Use a separate semantic control or text
to communicate meaningful state. Manual Swap parts remain decorative. Do not add `aria-label` to a
generic root without a suitable semantic role. `swapActiveChange` only emits from a button root.

## API

Swap's inputs and output carry the `swap` prefix so they never bind to another directive on the
same element, such as `<button zdButton zdSwap>`, where Button has its own `active` input.

| Part/input/output                                                | Contract                                                                                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `label[zdSwap]`, `button[zdSwap]`, `div[zdSwap]`, `span[zdSwap]` | Native host; no wrapper DOM                                                                                                     |
| `swapActive: boolean = false`                                    | Controlled button/manual state; emits `swap-active`                                                                             |
| `swapIndeterminate: boolean = false`                             | Third button/manual state, takes precedence over swapActive                                                                     |
| `swapEffect: ZdSwapEffect = 'fade'`                              | `fade`, `rotate`, `flip`, `custom`                                                                                              |
| `swapReadOnly: boolean = false`                                  | Browser capture guard rejects native click activation, including keyboard-generated clicks; programmatic updates remain allowed |
| `swapActiveChange: boolean`                                      | Button-only request containing the inverse of swapActive                                                                        |
| `input[type="checkbox"][zdSwapInput]`                            | Adds the root's read-only ARIA state; retains native checkbox behavior                                                          |
| `[zdSwapOn]`, `[zdSwapOff]`, `[zdSwapIndeterminate]`             | Direct-child decorative states; respective daisyUI class, `aria-hidden` and `inert`                                             |

Boolean inputs accept Angular boolean-attribute syntax. Do not combine a checkbox and a button root,
nest Swap roots, or place interactive controls inside a state part. All state parts are inert, even
when visible. Apply semantic content or controls outside the parts.

## Styling and motion

The root uses `swap`; effects add `swap-rotate` or `swap-flip`. The part classes are `swap-on`,
`swap-off`, `swap-indeterminate`. Consumer classes, styles, dimensions, icons and text remain intact.
No size or color palette is imposed. Tokens `--color-primary` and current color provide focus styling.

`fade` retains the daisyUI opacity transition; `custom` adds no rotate/flip modifier. Define a custom
transition on `[data-zd-swap-part]` in consumer CSS. The supplemental stylesheet hides inactive
parts without collapsing their grid cells, preventing label-length layout jumps. Indeterminate
content requires its explicit third part. Long text can wrap using consumer sizing rules.

Reduced motion disables transitions, animations, transforms, rotation and scale on all state parts,
including custom effects, while immediately retaining the correct visible state. Forced colors uses
the system focus color. LTR/RTL inherit naturally; no physical keyboard arrows are introduced.

## SSR and verification

Server rendering preserves native controls, button pressed state and decorative parts. No IDs,
portals or global listeners are created. Native checkboxes still toggle without JavaScript.
Controlled buttons and read-only activation guards require hydration; for controls that must be
locked before hydration, render the native input/button `disabled` as well. The HTML platform has
no native read-only checkbox. Do not rely on a client guard as a security or authorization boundary.

Native `indeterminate` has no HTML attribute; its mixed semantics take effect after hydration.
Keep essential pre-hydration mixed-state information in adjacent server-rendered text if needed.

See [progress](../plans/phase-5-swap-progress.md), [visual matrix](swap-visual-matrix.md) and
[manual accessibility review](swap-accessibility-review.md). Angular 21.0/22, other browser engines
and human assistive-technology/device review remain unverified.

## Sources and decisions

- [daisyUI Swap](https://daisyui.com/components/swap/), checked against installed 5.7.16 CSS.
- [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) for stable names and pressed states.
- [Angular Aria adoption policy](../foundations/angular-aria-adoption.md): native HTML is sufficient here.

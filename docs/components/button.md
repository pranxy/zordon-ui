# Button

> **Maturity:** Planned  
> **Entry point:** `@pranxy/zordon-ui/button` (created with the first implementation)  
> **Selector:** `[zdButton]`  
> **daisyUI evidence:** 5.7.16, pinned in this repository  
> **Related matrix row:** ACT-01  
> **Last reviewed:** 2026-08-19

## Purpose and boundaries

Button applies documented daisyUI Button appearance to an existing native action element. It does
not replace that element's semantic role, activation behavior, form behavior, navigation, or
consumer event handlers.

The planned standalone `ZdButton` attribute directive supports exactly these hosts:

- `<button>` for actions and form submission/reset;
- `<a href>` for navigation; and
- `<input type="button|submit|reset">` for native input-button use cases.

Any other host is unsupported and must receive a descriptive configuration error. Button does not
turn a generic element or non-link anchor into a fake button with `role="button"`. Checkboxes and
radio inputs belong to their own future component entries.

`variant="link"` is appearance only: it never changes a button into a link or a link into a
button. Button has no service, overlay, Angular Aria dependency, generated IDs, outputs, or task
runner. Toolbar/roving-tabindex behavior belongs to a future parent composition.

## Planned import and setup

```ts
import { ZdButton } from '@pranxy/zordon-ui/button';
```

The entry point is published only with its implementation. Consumers must compile the complete
configured daisyUI/Tailwind class candidates. Button will use `ZdClassNames`, not concatenate
prefix strings or read host classes. It needs no provider.

## Anatomy and content

The native host is the entire component. Button creates no wrapper or icon slot; text, SVGs, and
loader markup remain consumer content in ordinary DOM order.

| Part                       | Required | Rule                              | Ownership                                | Accessible contribution                |
| -------------------------- | -------- | --------------------------------- | ---------------------------------------- | -------------------------------------- |
| Native host                | Yes      | One supported host                | Consumer semantics; Button classes/state | Native button or link name/state       |
| Content children           | No       | Any valid native child content    | Consumer                                 | Text/icon may form the accessible name |
| Loader/content replacement | No       | Consumer-controlled while loading | Consumer                                 | Must retain or supply a complete name  |

An icon-only square or circle Button needs an accessible name from visible text or the host, for
example `aria-label="Close"`. Button will not infer a name from an SVG, tooltip, or title.

## Planned public API

The Button entry point will export these component-local types:

```ts
type ZdButtonVariant = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';
type ZdButtonLayout = 'wide' | 'block' | 'square' | 'circle';

interface ZdButtonDefaults {
  color?: ZdColor;
  variant?: ZdButtonVariant;
  size?: ZdSize;
  layout?: ZdButtonLayout;
}
```

`ZdColor` and `ZdSize` remain existing stable root vocabularies. `variant` deliberately avoids the
name `style`, which would collide with Angular's native `[style]` binding. One exclusive `layout`
union prevents contradictory requests such as `wide` and `circle`.

Each defaultable intrinsic value is `undefined`, which means the unmodified documented daisyUI
`btn` appearance. An application default or an explicit local input adds a modifier; neither
silently invents a color, variant, size, or layout.

| Input        | Type                           | Default / precedence    | Meaning and limits                                                                      |
| ------------ | ------------------------------ | ----------------------- | --------------------------------------------------------------------------------------- |
| `color`      | `ZdColor \| undefined`         | intrinsic → app → local | Emits one semantic `btn-*` color when set.                                              |
| `variant`    | `ZdButtonVariant \| undefined` | intrinsic → app → local | Emits one appearance modifier. Omitted uses ordinary daisyUI Button appearance.         |
| `size`       | `ZdSize \| undefined`          | intrinsic → app → local | Emits `btn-xs` through `btn-xl`; no responsive parser.                                  |
| `layout`     | `ZdButtonLayout \| undefined`  | intrinsic → app → local | Emits exactly one wide/block/square/circle modifier.                                    |
| `active`     | `boolean \| undefined`         | local only              | Visual `btn-active` only; it is not a toggle state.                                     |
| `pressed`    | `boolean \| null \| undefined` | local only              | Boolean sets exact `aria-pressed`; nullish removes it. No self-toggle or change output. |
| `loading`    | `boolean \| undefined`         | local only              | Controlled pending presentation and host activation guard.                              |
| `zdDisabled` | `boolean \| undefined`         | local only              | Link-only unavailable-state and activation guard.                                       |

The first implementation will introduce `withButtonDefaults(...)`, passed to
`provideZordonUi(...)`, under the [component-defaults contract](../foundations/component-defaults.md).
Only `color`, `variant`, `size`, and `layout` are eligible. `active`, `pressed`, `loading`, and
disabled state are instance state and cannot be defaults.

Defaultable raw inputs preserve `undefined`; resetting locally to `undefined` restores the app or
intrinsic value. Button accepts no generic class string, style map, callback, promise, observable,
template, icon, or arbitrary daisyUI token.

### Native disabled state

Button declares no `disabled` input and never writes the native `disabled` property. On `<button>`
and supported `<input>` hosts, native static/bound `[disabled]` remains authoritative for keyboard,
pointer, focus, validation, and form semantics. daisyUI recognizes native disabled state, so no
extra class is needed.

Anchors have no native disabled state. `zdDisabled` is only valid on `<a href zdButton>` and adds
`btn-disabled`, `aria-disabled="true"`, and a directive activation guard while true. It does not
remove `href`, rewrite consumer `tabindex`, or change link semantics. The link remains focusable by
default; a workflow that must remove it from navigation owns that focus policy.

## States and interaction

| State           | Owner                        | Allowed interaction                  | Semantics                                       | Exit / cleanup                         |
| --------------- | ---------------------------- | ------------------------------------ | ----------------------------------------------- | -------------------------------------- |
| Enabled         | Native host / consumer       | Native pointer and keyboard behavior | Native role and name                            | Normal native behavior                 |
| Native disabled | Native button/input or Forms | None                                 | Native disabled semantics                       | Consumer removes native disabled state |
| Link disabled   | Consumer via `zdDisabled`    | No directive-accepted activation     | `aria-disabled`, daisyUI disabled presentation  | Consumer clears `zdDisabled`           |
| Loading         | Consumer via `loading`       | No directive-accepted activation     | `aria-disabled`; stable accessible name/content | Consumer clears `loading`              |
| Active          | Consumer via `active`        | Normal native behavior               | Visual only                                     | Consumer clears `active`               |
| Pressed         | Consumer via `pressed`       | Normal native behavior               | Exact controlled `aria-pressed` when boolean    | Consumer updates/nulls input           |

Loading adds `btn-disabled` and `aria-disabled="true"` as visual and operability signals while
keeping the current host focusable. It prevents the native default action of a user click, but does
not suppress consumer event listeners. It does not disable a native button, invoke/await work,
render a default spinner, emit a completion, or abort consumer work. Consumers project arbitrary
loader markup. daisyUI Loading classes, when used, belong to that consumer/Loading component and
need separate Tailwind candidates.

Loading does not make form submission safe. Enter in a form field, `requestSubmit()`, a second
submitter, and an application handler can bypass one Button's click guard. The form submit owner
must apply its own synchronous duplicate guard and server-side idempotency policy, per the
[async-actions contract](../foundations/async-actions.md).

| Interaction                           | Result                                  | Focus rule | Disabled / loading rule                                                             |
| ------------------------------------- | --------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| Tab / Shift+Tab                       | Native order                            | Native     | Native disabled controls are skipped; `zdDisabled` link stays focusable by default. |
| Enter / Space on button/input         | Native activation                       | Native     | Native disabled blocks it; loading guards accepted activation.                      |
| Enter on link                         | Native navigation                       | Native     | `zdDisabled`/loading guards navigation activation.                                  |
| Pointer / touch                       | Native click follows normal propagation | Native     | Native disabled blocks it; link guard prevents its activation only.                 |
| Programmatic `.click()` / form submit | Native platform behavior                | Native     | Not a Button loading/disabled-link duplicate-prevention mechanism.                  |

Button preserves consumer `(click)` listeners and native submit/reset behavior. It never prevents
default on an enabled host. A guarded link prevents navigation without stopping propagation.

## Accessibility and consumer content

- **Semantics:** retain native `<button>`, `<input>`, or `<a href>` semantics; no redundant role.
- **Name:** consumer provides visible text or an explicit accessible name; icon-only Buttons require one.
- **Toggle:** `pressed` is only for a controlled real toggle; `active` never substitutes for `aria-pressed`.
- **Pending:** loading applies `aria-disabled`; consumer content must communicate pending without
  spinner motion or color. Button does not add `aria-busy`: a busy region belongs to the workflow
  content that is actually updating. It creates no live region and never moves focus.
- **Focus:** preserve daisyUI/native `:focus-visible`; a consumer replacing it needs an equally
  visible forced-colors-safe indicator.
- **Manual evidence:** Preview needs NVDA+Chrome/Firefox and VoiceOver+Safari checks for name,
  activation, toggle state, disabled-link discoverability, and loading.

## Forms and validation

Button is not a field, ControlValueAccessor, or validator. It preserves native submit/reset buttons
and consumer `name`/`value` serialization. A native disabled submitter follows platform behavior.
`loading` and `zdDisabled` do not replace Angular Forms disabled state, validity, validation
pending, or the form submit guard.

## Styling, themes, and customization

Button owns only complete input-derived tokens through the class-prefix configuration. It uses
Angular's additive host class-map contract; consumer static classes, `[class]`, non-overlapping
`ngClass`, styles, and `data-theme` stay consumer-owned. Overlapping `ngClass` Button tokens are
unsupported; `[class.btn-primary]` is the intentional per-token override.

| Hook / candidate                                                                                                   | Label              | Purpose                                |
| ------------------------------------------------------------------------------------------------------------------ | ------------------ | -------------------------------------- |
| `btn`                                                                                                              | daisyUI documented | Required base class                    |
| `btn-neutral`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-info`, `btn-success`, `btn-warning`, `btn-error` | daisyUI documented | Semantic color candidates              |
| `btn-outline`, `btn-dash`, `btn-soft`, `btn-ghost`, `btn-link`                                                     | daisyUI documented | Variant candidates                     |
| `btn-xs`, `btn-sm`, `btn-md`, `btn-lg`, `btn-xl`                                                                   | daisyUI documented | Size candidates                        |
| `btn-wide`, `btn-block`, `btn-square`, `btn-circle`                                                                | daisyUI documented | Exclusive layout candidates            |
| `btn-active`, `btn-disabled`                                                                                       | daisyUI documented | Controlled visual-state candidates     |
| `[class]`, `[style]`, `data-theme`                                                                                 | consumer-owned     | Ordinary class/style/theme composition |

There are no Button-owned `--zd-*` properties and no direct dependency on daisyUI internal
`--btn-*` variables. Direct internal-variable use is not Button API. Candidate tests must compile
complete configured tokens under every prefix mode; runtime-built strings are not auto-discovered
by Tailwind.

## Platform, localization, and lifecycle

| Concern           | Contract                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SSR and hydration | Deterministic native classes and controlled ARIA only; no generated IDs, browser listeners, or client-only initial state. Hydrated clicks use the same guard once. |
| Directionality    | No physical-placement API. Content order stays consumer DOM order; consumers localize labels and directional icons.                                                |
| Localization      | Labels and pending replacement text are consumer-localized complete strings. Button ships no English strings.                                                      |
| Reduced motion    | No JavaScript animation. daisyUI Button transition is non-essential; projected Loading motion cannot be the only pending cue.                                      |
| Responsive / zoom | `block`/`wide` are layout classes, not breakpoints. Proof includes long labels, 200% zoom, and 400% reflow.                                                        |
| Cleanup           | No timers, subscriptions, overlays, global listeners, or consumer-task ownership.                                                                                  |

## Planned examples

```html
<button zdButton color="primary">Save changes</button>
<button zdButton variant="outline" color="success" size="sm">Save draft</button>
<a zdButton href="/settings" variant="link">Account settings</a>
```

```html
<button zdButton color="primary" [loading]="saving()" aria-label="Save account" (click)="save()">
  @if (saving()) {
  <span aria-hidden="true" class="loading loading-spinner"></span>
  Saving account } @else { Save account }
</button>
```

The application owns `saving()` and the form-level guard; loader classes need their own candidates.

```html
<!-- Avoid: visual link styling does not create navigation semantics. -->
<button zdButton variant="link" href="/settings">Settings</button>

<!-- Use a native anchor for navigation. -->
<a zdButton variant="link" href="/settings">Settings</a>
```

## Definition of Ready and evidence plan

| Area                  | Required evidence before Preview                                                                                   | Status  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| API and defaults      | API review for directive, aliases/transforms, `withButtonDefaults`, invalid host/input handling, extraction        | Planned |
| Native behavior       | button/link/input activation, disabled, link guard, click preservation, submit/reset, Enter/requestSubmit boundary | Planned |
| Async states          | loading focus/name/guard, rapid activation, form-level duplicate boundary, reduced-motion alternative              | Planned |
| Accessibility         | keyboard/native semantics, pressed, icon-only name, forced colors, manual AT                                       | Planned |
| SSR and hydration     | stable HTML, controlled ARIA, pre-hydration replay, no duplicate activation                                        | Planned |
| Styling/themes        | prefix candidates, theme scopes, class ownership/customization, daisyUI visual proof                               | Planned |
| Visual matrix         | colors/variants/sizes/layouts; disabled/loading/pressed; long text; RTL; themes; overrides                         | Planned |
| Package/compatibility | entry build, API extraction, tarball, bundle, Angular 21 floor/22 current, Changeset                               | Planned |

## Related contracts

- [Component defaults](../foundations/component-defaults.md)
- [Async actions](../foundations/async-actions.md)
- [Host class composition](../foundations/host-class-composition.md)
- [Class prefixes](../foundations/class-prefixes.md)
- [Safe customization](../foundations/safe-customization.md)
- [Reduced motion](../foundations/reduced-motion.md)
- [Component maturity](../contributing/component-maturity.md)

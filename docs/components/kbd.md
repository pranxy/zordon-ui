# Kbd

**Component ID:** DSP-13  
**Maturity:** Preview
**Planned entry point:** `@pranxy/zordon-ui/kbd`

Kbd applies daisyUI’s visual keycap treatment to a native `<kbd>` element. It is a presentation
directive, not a shortcut manager, platform detector, keyboard input control, localization service,
or interactive button.

## Native and semantic boundary

Use the native `<kbd>` element for a key or shortcut token. The consuming text, region, or command
owns the shortcut’s meaning, localization, operation, and accessible name. Zordon adds no role,
focusability, event listener, ID, ARIA state, model, output, or keyboard handler.

```html
<p>Press <kbd zdKbd size="sm">F</kbd> to search.</p>
```

For a key combination, keep every key as an individual native token and provide an accessible
expansion when symbols alone would be unclear.

```html
<span aria-label="Control plus Shift plus Delete">
  <kbd zdKbd aria-hidden="true">Ctrl</kbd> + <kbd zdKbd aria-hidden="true">Shift</kbd> +
  <kbd zdKbd aria-hidden="true">Del</kbd>
</span>
```

Do not make a keycap focusable or clickable merely because it looks interactive. Use a native
button or link for an action, then place Kbd content inside it only when that semantic composition
is appropriate.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                        | Purpose                                                 |
| ------------------------------------------------ | ------------------------------------------------------- |
| `kbd`                                            | Required keycap base class                              |
| `kbd-xs`, `kbd-sm`, `kbd-md`, `kbd-lg`, `kbd-xl` | Optional size modifiers; medium is the upstream default |

daisyUI examples cover inline keys, key combinations, symbols, and full keyboard layouts. It does
not document color, style, active, disabled, or separator modifiers for Kbd. Installed CSS uses
`--size`, `--radius-field`, `--color-base-200`, `--color-base-content`, `--border`, and
`--size-selector`; these are theme/internal implementation details, not Zordon public APIs.

## Planned public API

| Input  | Type                                                | Intrinsic default | Contract                                  |
| ------ | --------------------------------------------------- | ----------------- | ----------------------------------------- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| undefined` | upstream medium   | Adds one optional `kbd-*` size candidate. |

`undefined` removes the optional size modifier. Invalid values reject rather than create a runtime
class that Tailwind did not compile. There are no application defaults, Forms integration, models,
outputs, methods, Angular Aria, or CDK dependency.

Static and dynamic consumer classes, non-overlapping `NgClass`, native styles and custom
properties, `data-theme`, and native attributes remain additive. Explicit consumer candidate
classes are the documented per-token override boundary in
[host class composition](../foundations/host-class-composition.md).

## Content, localization, and composition

Kbd has no library-owned projected parts. Consumer content determines the displayed key label,
symbol, sequence separator, platform vocabulary, translated expansion, and command relationship.

| Concern            | Consumer responsibility                                | Zordon responsibility               |
| ------------------ | ------------------------------------------------------ | ----------------------------------- |
| Platform labels    | Choose `Ctrl`, `⌘`, or another accurate platform label | Preserve the provided content       |
| Localization       | Translate visible/accessible key names and separators  | Add only base/size classes          |
| Sequence           | Mark up individual keys and readable separators        | No parsing or shortcut registration |
| Active state       | Use consumer state/CSS where meaningful                | No undocumented active modifier     |
| Interactive action | Use a native button/link and manage activation         | Never infer interaction from Kbd    |

## Styling, themes, and customization

Use documented Kbd candidates, ordinary Tailwind utilities, theme scopes, and native style
bindings for responsive and visual customization.

```html
<kbd zdKbd size="lg" class="rounded-md px-3 sm:kbd-xl" [style.max-inline-size.ch]="12">
  {{ localizedShortcut }}
</kbd>
```

Do not expose arbitrary color, border, radius, padding, platform, symbol, separator, or active
inputs. Consumers who override daisyUI’s internal variables accept exact-version coupling and must
follow [safe customization](../foundations/safe-customization.md); Zordon does not set or document
them as stable hooks.

## Accessibility, platform, and lifecycle

Kbd has no component-owned keyboard, pointer, focus, motion, directionality, browser API, timer,
subscription, observer, or cleanup path. Native `<kbd>` markup and its text render identically on
server and client, so SSR/hydration only need stable host/class/content proof.

Consumers must keep shortcut labels understandable without relying on symbols alone, use semantic
controls for actions, and review custom-theme contrast, forced colors, RTL, long localized labels,
200% zoom, and 400% reflow. No screen-reader announcement occurs merely because a Kbd token is
rendered.

## Evidence required before Preview

| Area             | Required proof                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API/package      | Intentional `./kbd` entry, exact type tests, API extraction, tarball, and bundle review                                                                                   |
| Native semantics | Native `<kbd>` preservation; no injected role/focus/ARIA/events; consumer attributes remain intact                                                                        |
| Styling          | Every size candidate/prefix, stale-token removal, and consumer class/style precedence                                                                                     |
| Accessibility    | Axe; manual shortcut naming, symbol expansion, keyboard order for surrounding interactive controls, forced colors, contrast, zoom/reflow, RTL, and long localized strings |
| SSR/hydration    | Stable host/classes/content and clean hydration without browser-only work                                                                                                 |
| Visual           | Inline key and key-combination composition; xs/xl; light/dark/custom themes; mobile RTL                                                                                   |

## Sources

- [daisyUI Kbd documentation](https://daisyui.com/components/kbd/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Zordon Angular Aria adoption](../foundations/angular-aria-adoption.md)
- [Zordon safe customization](../foundations/safe-customization.md)

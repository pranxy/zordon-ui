# Divider

**Component ID:** LYT-01  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/divider`

Divider applies daisyUI's visual separator treatment to an existing native host. It is a standalone
`[zdDivider]` directive, not a layout wrapper, content-projection component, ARIA widget, or
responsive-layout abstraction.

## Native and semantic boundary

Use an empty `<hr>` when the markup represents a real thematic break. It remains the native semantic
element; Divider only supplies classes.

```html
<p>Billing contact details</p>
<hr zdDivider />
<p>Invoice delivery details</p>
```

Use a normal element when the separator has visible text or is purely decorative. The consumer owns
the surrounding heading, group semantics, text meaning, and any `aria-hidden` decision.

```html
<div zdDivider>Optional settings</div>
<div zdDivider aria-hidden="true"></div>
```

`ZdDivider` never adds `role="separator"`, `aria-orientation`, `aria-hidden`, generated IDs, focus,
or event handlers. It cannot infer whether consumer text is meaningful, and it does not turn a
visual line into a navigation, disclosure, or landmark boundary.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                                                   | Purpose                                                          |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `divider`                                                                   | Required base separator treatment                                |
| `divider-neutral`, `divider-primary`, `divider-secondary`, `divider-accent` | Semantic color                                                   |
| `divider-success`, `divider-info`, `divider-warning`, `divider-error`       | Semantic status color                                            |
| `divider-vertical`                                                          | Vertical-layout spelling; visually divides stacked elements      |
| `divider-horizontal`                                                        | Side-by-side layout spelling; visually divides adjacent elements |
| `divider-start`, `divider-end`                                              | Pushes a visible label toward the logical start or end           |

There is no daisyUI Divider size, loading, disabled, active, interactive, or structural part
modifier. The installed CSS uses `--divider-m` and `--divider-color`, but they are upstream internal
variables—not stable Zordon hooks.

## Planned public API

| Input         | Type                                        | Intrinsic default | Contract                                                         |
| ------------- | ------------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| `color`       | `ZdColor \| undefined`                      | none              | Adds one semantic `divider-*` color candidate.                   |
| `orientation` | `'vertical' \| 'horizontal' \| undefined`   | `vertical`        | Maps to daisyUI's layout direction vocabulary.                   |
| `placement`   | `'start' \| 'center' \| 'end' \| undefined` | `center`          | Places visible host text; empty hosts have no placement content. |

All three are appearance-only candidates for `withDividerDefaults(...)`, with intrinsic <
application < local precedence. `undefined` restores the application/intrinsic value; unsupported
values reject rather than emit a Tailwind class that was never compiled. No model, output, method,
Forms behavior, or `@angular/aria` dependency is planned.

Consumer static/dynamic classes, non-overlapping `ngClass`, styles, `data-theme`, ARIA attributes,
and native host attributes remain additive. An explicit `[class.divider-horizontal]` is the supported
per-token override; overlapping `ngClass` library tokens follow the documented
[host-class composition](../foundations/host-class-composition.md) limitation.

## Responsive, customization, and themes

Responsive direction belongs to Tailwind rather than a finite Angular breakpoint input:

```html
<div class="flex flex-col lg:flex-row">
  <section>Shipping</section>
  <div zdDivider class="lg:divider-horizontal">OR</div>
  <section>Pickup</section>
</div>
```

Because runtime class generation is not Tailwind source discovery, an application must register every
complete configured Divider candidate it uses. With combined prefixes, for example, that is
`tw:d-divider-horizontal`, not a prefix-neutral fragment. See the
[class-prefix guide](../foundations/class-prefixes.md).

Use consumer classes and native `[style]`/CSS variables for application-specific line thickness,
style, spacing, and responsive rules. `--divider-m` and `--divider-color` are direct, exact-version
daisyUI internal customizations only; they are not semver-stable Zordon API and need compiled-prefix
and visual verification under the installed version. No `--zd-*` Divider variable is planned.

## Platform and accessibility

Divider is deterministic server HTML: its output is only input-derived classes. It reads no browser
global, schedules no work, and has no cleanup. Server and client must start with matching inputs and
consumer content.

`divider-start` and `divider-end` are logical placement tokens. Long translated labels remain
consumer content; no strings are generated. There is no motion, keyboard interaction, focus movement,
or directionality service. Release evidence must still cover RTL, light/dark/custom themes,
forced-colors, 200% zoom, and 400% reflow.

## Examples

```html
<div zdDivider color="primary">OR</div>
<div zdDivider orientation="horizontal" placement="end">Advanced</div>
<hr zdDivider color="neutral" />
```

## Evidence required before Preview

| Area             | Required proof                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| API/package      | Intentional `./divider` entry, exact type tests, API extraction, tarball, and bundle review                          |
| Native semantics | `<hr>` thematic break, text-bearing/decorative host preservation, no injected role/focus/events                      |
| Styling          | All candidates/defaults/prefixes, responsive consumer class, stale-token removal, and custom class/style composition |
| Accessibility    | Axe, semantic/native host checks, forced-colors, zoom/reflow, RTL long label, and manual screen-reader review        |
| SSR/hydration    | Stable host/classes, clean hydration, and no browser-only work                                                       |
| Visual           | Light/dark/custom themes plus responsive stacked/side-by-side and RTL start/end labels                               |

## Sources

- [daisyUI Divider documentation](https://daisyui.com/components/divider/)
- [HTML `<hr>` thematic break](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr)

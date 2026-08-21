# Link

**Component ID:** NAV-03  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/link`

Link restores daisyUI’s underline treatment on a real navigation anchor. It is a standalone
native-host `[zdLink]` directive, not a wrapper, button substitute, Router abstraction, or
menu-item primitive.

```ts
import { ZdLink } from '@pranxy/zordon-ui/link';
```

## Native boundary

Use Link only on an `<a>` that already has navigation semantics:

```html
<a zdLink href="/account">Account settings</a>
<a zdLink [routerLink]="['/account', accountId]">Account settings</a>
```

Do not use it on a button, a `div`, or a role-only pseudo-link. A button that performs an in-page
action remains a [Button](button.md); a menu item, tab, breadcrumb, or pagination control owns its
own interaction pattern.

The directive does not import, wrap, or re-export Angular Router. `href`, `routerLink`, routing
options, navigation cancellation, prefetching, fragments, query parameters, and route matching
remain native/Router behavior. This keeps a Link-only consumer free of a Router runtime import.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16. Its Link CSS has no variables or structural parts.

| Candidate                                                       | Purpose                                             |
| --------------------------------------------------------------- | --------------------------------------------------- |
| `link`                                                          | Required underline and focus-visible treatment      |
| `link-hover`                                                    | Hide underline until a hover-capable pointer hovers |
| `link-neutral`, `link-primary`, `link-secondary`, `link-accent` | Semantic color                                      |
| `link-success`, `link-info`, `link-warning`, `link-error`       | Semantic status color                               |

There is no daisyUI Link size, loading, icon, disabled, active/current-route, or new-window
modifier. Zordon will not invent look-alike upstream tokens or depend on internal variables.

## Tailwind candidate source

Link generates classes from inputs at runtime, so Tailwind cannot infer its color candidates from
the directive alone. Register every Link candidate that an application can use in a scanned source
file or with Tailwind's explicit candidate mechanism. The documentation app registers the complete
installed inventory in its stylesheet; applications using a class prefix must register the complete
configured spelling (for example, `tw:d-link-primary`), as described in the
[class-prefix guide](../foundations/class-prefixes.md).

## Planned public API

| Input        | Type                   | Default | Contract                                                                           |
| ------------ | ---------------------- | ------- | ---------------------------------------------------------------------------------- |
| `color`      | `ZdColor \| undefined` | none    | Adds one semantic `link-*` color modifier.                                         |
| `hover`      | `boolean \| undefined` | `false` | Adds `link-hover`; it changes only the visual underline behavior.                  |
| `zdDisabled` | `boolean \| undefined` | `false` | Controlled unavailable state; it guards the directive-accepted navigation default. |

`color` and `hover` are the only candidates for a future `withLinkDefaults(...)` feature. They are
appearance modifiers, so their effective precedence will be intrinsic default < application default
< explicit local input. `zdDisabled` is local controlled state and is never globally defaulted.

Configure application defaults through the root provider when the application has a shared Link
appearance:

```ts
import { provideZordonUi } from '@pranxy/zordon-ui';
import { withLinkDefaults } from '@pranxy/zordon-ui/link';

provideZordonUi({}, withLinkDefaults({ color: 'primary', hover: true }));
```

Consumer classes, `[class]`, non-overlapping `ngClass`, `[style]`, `data-theme`, `aria-*`, `target`,
`rel`, `download`, and Router directives remain additive consumer-owned sources. An explicit
`[class.link-primary]` is the intentional way to override a library token; overlapping `ngClass`
library tokens follow the documented host-class limitation.

## Navigation, current route, and unavailable state

Current-route semantics belong to Angular Router, not Link. Pair the directives when needed:

```html
<a zdLink routerLink="/account" routerLinkActive="is-current" ariaCurrentWhenActive="page">
  Account settings
</a>
```

`ZdLink` never writes `aria-current`, an active class, or a route state. Native links outside the
Router can use consumer-supplied `aria-current` where their navigation context requires it.

An anchor has no native `disabled` state. While `zdDisabled` is true, Link will preserve its `href`,
Router directive, native role, and consumer `tabindex`; add `aria-disabled="true"`; and prevent the
directive-accepted click/keyboard navigation default without stopping propagation. It does not add
a non-existent daisyUI disabled class, suppress consumer click listeners, remove the link from Tab
order, or make direct programmatic navigation impossible. The consumer owns a workflow that must
hide or remove unavailable navigation from the focus order.

## Accessibility and content

- Use visible link text, or an explicit accessible name for icon-only links.
- `link-*` colors are daisyUI theme tokens. A custom theme must keep every Link color it exposes at
  the required contrast against its actual surface; Zordon does not override an upstream color with
  a different semantic token. The default inherited Link color is the accessible fixture baseline.
- Native Tab, Enter, context-menu, copy-link, download, and browser navigation behavior remain
  native while the link is enabled. Space is not a link activation key.
- Link creates no live region, focus movement, generated ID, or ARIA role.
- `target="_blank"` is consumer-owned. Consumers provide an understandable new-window indication
  and the appropriate `rel` policy for their security/privacy requirements.
- `download`, cross-origin URL handling, `ping`, `referrerpolicy`, and CSP are application security
  policy, not Link inputs.

## Platform and customization

Link is deterministic server HTML: input-derived classes and `aria-disabled` are the only
directive-owned output. It reads no browser global, schedules no work, and has no cleanup. A server
and client must begin with the same link destination and controlled disabled state; hydrated
activation uses the same guard once.

There is no physical placement API. Projected icon/text order is consumer DOM order, so consumers
localize labels and directional icon placement. daisyUI’s hover rule is already gated by
`@media (hover: hover)`; no JavaScript motion is introduced. The installed focus-visible rule has
a forced-colors fallback, but component release still requires real-browser and manual
forced-colors review.

## Examples

```html
<a zdLink href="https://example.com" color="primary">Read the guide</a>
<a zdLink href="/pricing" hover>Compare plans</a>
<a zdLink href="/billing" [zdDisabled]="billingUnavailable()">Billing</a>
```

```html
<a zdLink href="https://example.com/release-notes" target="_blank" rel="noopener noreferrer">
  Release notes <span class="sr-only">(opens in a new window)</span>
</a>
```

## Evidence required before Preview

| Area                   | Required proof                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| API/package            | Intentional `./link` entry, exact type tests, API extraction, tarball and bundle review                                             |
| Native/Router behavior | `href`, RouterLink, external/download, Enter/context menu, `RouterLinkActive` coexistence, disabled guard and listener preservation |
| Accessibility          | Accessible name, current-page ownership, disabled-link discovery, keyboard, forced colors, manual NVDA and VoiceOver review         |
| SSR/hydration          | Stable server `href`/classes/ARIA, clean hydration, post-hydration guard, and event-replay boundary                                 |
| Visual                 | Light/dark/custom themes, hover-capable versus touch profile, RTL/long labels, consumer class override, disabled consumer styling   |

Automated native, Router, SSR/hydration, axe, and visual evidence is recorded in the
[Link visual matrix](link-visual-matrix.md). Manual assistive-technology, forced-colors, and
semantic-color contrast work remains open in the
[Link accessibility review](link-accessibility-review.md).

## Sources

- [daisyUI Link documentation](https://daisyui.com/components/link/)
- [Angular current-route state and `RouterLinkActive`](https://angular.dev/guide/routing/read-route-state)

# Theme Controller

Status: automated implementation complete; manual accessibility pending.

Import from `@pranxy/zordon-ui/theme-controller`. A `ZdThemeController` boundary supplies isolated
`ZdThemeControllerState` to native controls in its Angular view. No Angular Aria or CDK widget is
needed: checkbox, radio, select and button already supply their keyboard and accessibility semantics.

## A scoped preference

```html
<section
  [zdThemeController]="themeOptions"
  #appearance="zdThemeController"
  (themeChange)="onThemeChange($event)"
>
  <label><input type="checkbox" zdThemeToggle="dark" offTheme="light" /> Dark theme</label>
  <label><input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark toggle</label>
  <fieldset>
    <legend>Appearance</legend>
    <label><input type="radio" name="appearance" zdThemeRadio="light" /> Light</label>
    <label><input type="radio" name="appearance" zdThemeRadio="dark" /> Dark</label>
    <label><input type="radio" name="appearance" zdThemeRadio="system" /> System</label>
  </fieldset>
  <label
    >Theme
    <select zdThemeSelect>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="brand/v2">Brand</option>
    </select>
  </label>
  <button zdThemeButton="system">Follow system</button>
  <p>{{ appearance.state.resolvedTheme() }}</p>
</section>
```

```ts
import { type ZdThemeControllerOptions } from '@pranxy/zordon-ui/theme-controller';

readonly themeOptions: ZdThemeControllerOptions = {
  themes: ['light', 'dark', 'brand/v2'],
  initial: 'system',
  lightTheme: 'light',
  darkTheme: 'dark',
  storageKey: 'my-app.appearance',
};
```

Import the controller and the control directives used by the template; also import `ZdToggle`
from `@pranxy/zordon-ui/toggle` for the styled toggle example. Compose the other controls with
the corresponding Checkbox, Radio, Select or Button styling directives as needed. Their native
labels, disabled state, keyboard behavior, focus indicators and form names stay consumer-owned.

## API and ownership

| API                         | Contract                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `[zdThemeController]`       | Options captured once at initialization. Recreate the scope to change configuration.                                                  |
| `themes`                    | Unique, nonempty exact CSS theme names; defaults to `['light', 'dark']`. No built-in-name union.                                      |
| `initial`                   | Registered name or `system`; defaults to `system`. Also used after external storage removal/clear.                                    |
| `lightTheme`, `darkTheme`   | Registered themes used to resolve system preference; default to `light` and `dark`.                                                   |
| `storageKey`                | Optional localStorage key; omitted/null/empty means memory-only.                                                                      |
| `target`                    | `host` by default; `document` explicitly owns `document.documentElement`.                                                             |
| `themeChange`               | `{theme, resolvedTheme, source}` after an actual selection/resolution change. Sources: `user`, `api`, `restore`, `storage`, `system`. |
| `state.theme()`             | Read-only selected name or `system`.                                                                                                  |
| `state.resolvedTheme()`     | Read-only concrete compiled theme name; never `system`.                                                                               |
| `state.themes()`            | Frozen copy of the configured registry.                                                                                               |
| `state.ready()`             | False on the server/initial browser render, true after browser initialization.                                                        |
| `state.setTheme(name)`      | Selects/persists a registered name or `system`; returns false for unknown or unchanged choices.                                       |
| `zdThemeToggle`, `offTheme` | Checked/unchecked choices, default `dark`/`light`. Checked reflects the explicit choice, not resolved system darkness.                |
| `zdThemeRadio`              | Required choice; use a native group name unique to this scope.                                                                        |
| `zdThemeSelect`             | Owns native selection, including serialized option `selected` attributes. Supply every supported choice as an option.                 |
| `zdThemeButton`             | Required choice, native button with default type button and synchronized `aria-pressed`.                                              |

The registry validates selection; it does not compile CSS or detect available CSS. Applications
must compile all registered themes. `system` is reserved as a preference and cannot be a registered
CSS theme name. Custom names, including punctuation such as `brand/v2`, are preserved exactly.
All control values must be registered names or `system`. A checkbox does not represent three
states; use radio, select or separate buttons when users need a system choice.

The controller is the sole owner of its target's `data-theme`. Do not also bind `zdTheme` or
`data-theme` there. `ZdTheme` remains the lightweight choice for a static or externally managed
boundary. Controller controls own checked/selected state and are not CVAs: do not combine them
with `ngModel`, `formControl`, Signal Forms fields, or independent checked/value bindings.
Native form reset restores the current selected preference; it is not a theme-reset command.
Use `state.setTheme('system')` for an explicit reset action.

## Document and nested scopes

Use `target: 'document'` on one application-level controller to include body-level overlay content.
Keep it outside routed content in a real app. Only one controller may own a document root at a
time. On destruction, the previous attribute is restored only if the controller still owns the
current value; a later consumer edit is preserved.

Nested controllers default to `target: 'host'`, have separate state and do not alter their parent.
Omit storage on previews or use a unique key per independent preference. Controls resolve the
nearest Angular injector; DOM-only relocation does not change their controller. Use distinct
native radio group names across scopes. System mode in a nested scope follows device preference,
not the parent selection. For simple inheritance, remove the controller and use normal CSS or
`ZdTheme` with an empty value.

With daisyUI's default `:root` configuration, a document target themes body-level overlays.
Custom CSS roots and nested themes still follow the existing overlay forwarding contract; this
component adds no portal propagation or second overlay theme manager.

## Persistence, SSR and hydration

Server rendering and the first browser render use `initial`; system initially resolves to the
configured light theme. No storage or media-query read is needed for those renders. After the
first browser render, the controller observes `prefers-color-scheme`, restores valid saved state
and subscribes to cross-tab events. Unsupported matchMedia keeps the light fallback. Storage
access and write failures leave in-memory controls usable. An API choice made before initialization
completes takes precedence over restoration.

Same-origin localStorage writes from other tabs synchronize without writing back; unrelated keys,
sessionStorage events and invalid names are ignored. Removal or clear restores `initial`. Multiple
controllers sharing a key in one tab do not receive each other's storage events: use one shared
scope for synchronized controls. Listeners are removed when the owning view is destroyed.

A stored or system preference may visibly change the initial server theme after hydration. This
component makes no no-flash claim. For a known server preference, supply the same explicit
`initial` on both server and client. An app-owned preboot script/cookie integration requires its
own hydration and CSP review. Delayed event replay and incremental hydration remain unverified.

## daisyUI migration and accessibility

Remove daisyUI's CSS-only `theme-controller` class when adopting these directives. Its global
`:has()` behavior can override intended scope ownership. Keep visual `checkbox`, `toggle`, `radio`,
`select`, `btn` and Swap classes/directives as appropriate. Zordon adds no theme CSS or motion and
does not apply the CSS-only controller class, including under prefixes.

Provide native labels, a legend for radio groups and stable button names. Buttons expose pressed
state; optional application status text can announce preference changes when useful. Test custom
themes for contrast, zoom/reflow and forced colors. Automated axe and keyboard tests do not replace
the pending [manual accessibility review](theme-controller-accessibility-review.md).

See [ADR 0011](../architecture/0011-theme-controller-scoped-preferences.md),
[theme scopes](../foundations/theme-scopes.md), and
[daisyUI Theme Controller](https://daisyui.com/components/theme-controller/).

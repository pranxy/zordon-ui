# Component documentation template

Copy this template into a component documentation directory when its specification begins. Replace
every bracketed field before publishing. Delete only genuinely inapplicable sections and record the
reason; do not leave empty headings or use an omission to hide an unresolved contract.

This is a component-local specification and documentation record. The component matrix remains the
delivery tracker and the [public API review](../contributing/api-review.md) remains the approval
gate.

---

# [Component name]

> **Maturity:** Planned | Preview | Stable | Deprecated | Removed  
> **Entry point:** `@pranxy/zordon-ui/[component]`  
> **Selector(s):** `[zdComponent]` / `zd-component`  
> **daisyUI evidence:** [version or supported range]  
> **Related matrix row:** [ID and link]  
> **Last reviewed:** YYYY-MM-DD

## Purpose and boundaries

State the user problem, semantic native element or WAI-ARIA pattern, and what the component does
not own. Record its shape—native directive, component, compound component, or declarative plus
service—and required Angular/CDK/Angular Aria or application dependencies.

## Import and setup

```ts
import { [ComponentSymbol] } from '@pranxy/zordon-ui/[component]';
```

Record required providers, parents, form directives, Tailwind/daisyUI candidates, themes, and
optional peers. Do not show a deep import.

## Anatomy and content

Describe rendered native elements and every public projection/content hook.

| Part / selector     | Required | Cardinality and order | Ownership / fallback | Accessible contribution |
| ------------------- | -------- | --------------------- | -------------------- | ----------------------- |
| Host                | Yes      | Once                  | [native host]        | [role/name/state]       |
| `[zdComponentPart]` | No       | [rule]                | [consumer/library]   | [contribution]          |

For a named part, state whether it is projection-only or a functional directive, its selector,
static-projection/cardinality rule, and fallback. Do not document internal DOM selectors or runtime
string slots. Follow the [named-parts contract](../foundations/named-parts-and-slots.md).

## API

### Inputs and models

| API         | Type   | Default / precedence              | Controlled behavior | Notes                             |
| ----------- | ------ | --------------------------------- | ------------------- | --------------------------------- |
| `[input]`   | `Type` | [intrinsic → app → local, or n/a] | [owner]             | [null/undefined/invalid behavior] |
| `[(state)]` | `Type` | [initial/required rule]           | [source of truth]   | [event order]                     |

List required inputs, aliases, transforms, coercion, nullability, invalid values, and default
precedence. Link defaults to the [component-defaults contract](../foundations/component-defaults.md)
when supported. Preserve `undefined` as omitted/inherited where that contract applies.

### Outputs and methods

| API             | Payload / return | When             | Ordering, cancellation, errors | Native-event relationship |
| --------------- | ---------------- | ---------------- | ------------------------------ | ------------------------- |
| `(stateChange)` | `Type`           | [transition]     | [details]                      | [preserved native event]  |
| `method()`      | `ReturnType`     | [imperative use] | [timing/cleanup]               | n/a                       |

Library outputs describe high-level transitions and do not silently replace native events. Document
every imperative method's SSR and lifecycle behavior.

## States and interaction

List enabled, disabled, readonly, pending/loading, selected, expanded, active, invalid, empty, and
error states where applicable.

| State   | Owner                    | Allowed interaction | Semantics / announcement    | Exit and cleanup |
| ------- | ------------------------ | ------------------- | --------------------------- | ---------------- |
| [state] | [consumer/library/Forms] | [actions]           | [native/ARIA/live behavior] | [rule]           |

### Keyboard, pointer, focus, and dismissal

| Interaction                           | Result | Focus rule | Disabled/pending rule |
| ------------------------------------- | ------ | ---------- | --------------------- |
| Tab / Shift+Tab                       |        |            |                       |
| Enter / Space                         |        |            |                       |
| Arrow / Home / End / Escape           |        |            |                       |
| Pointer / touch / outside interaction |        |            |                       |

Use native behavior first. For custom interaction, name the APG pattern and document the Angular
Aria/CDK evaluation. For overlays, separately state initial focus, containment, restoration,
Escape, backdrop, and outside-pointer reasons; do not overclaim stacking or modality not proved.

## Accessibility and consumer content

State native role, name, description, relationships, and state attributes. Identify the consumer's
label/content/error responsibility and the library-generated/preserved relationships.

- **Name and label:**
- **Hint, description, and error:**
- **Status and announcement:**
- **Focus behavior:**
- **Forced colors, zoom, and visible focus:**
- **Manual assistive-technology evidence:** [link or required future gate]

Do not move focus merely to announce advisory feedback or treat DOM/axe output as proof of spoken
phrases. Use the [live-accessibility contract](../foundations/live-announcements-and-descriptions.md).

## Forms and validation

Delete only if the component cannot represent a field or value. Otherwise say whether it is a native
styled control, concrete composite CVA, validator, or field composition only.

| Concern                 | Component contract                                       |
| ----------------------- | -------------------------------------------------------- |
| Value and serialization | [type, equality, null/reset, `name`/FormData]            |
| Angular Forms           | [Reactive Forms / `NgModel` / CVA callback/update rules] |
| Disabled and readonly   | [Forms authority, native/standalone behavior]            |
| Validation and pending  | [consumer/intrinsic validation and visibility]           |
| Touched and submitted   | [logical blur and form-owner rule]                       |

Follow [form-control behavior](../foundations/form-control-behavior.md). Never replace a native
accessor unnecessarily, emit changes from `writeValue`, or override a Forms-disabled state.

## Styling, themes, and customization

### Styling inventory

Label every styling hook. Record base/part/modifier/state/responsive classes and required Tailwind
candidates before implementation.

| Hook                  | Label              | Purpose          | Contract / evidence       |
| --------------------- | ------------------ | ---------------- | ------------------------- |
| `[input]` or class    | Zordon stable      | [purpose]        | [version/API]             |
| `btn`, `btn-primary`  | daisyUI documented | [purpose]        | [daisyUI evidence]        |
| `--zd-component-gap`  | Zordon stable      | [grammar/target] | [default/inheritance]     |
| `[class]`, `[style]`  | consumer-owned     | [override]       | [composition]             |
| `--upstream-variable` | daisyUI internal   | [exception]      | [pin/prefix/visual proof] |

Document consumer class/style/`NgClass`/`NgStyle` composition, `data-theme` inheritance, and every
stable CSS variable or part. Internal daisyUI variables require exact-version, compiled-prefix,
minimum/current compatibility, and visual evidence. Link [safe customization](../foundations/safe-customization.md),
[class prefixes](../foundations/class-prefixes.md), [theme scopes](../foundations/theme-scopes.md),
and [instance styles](../foundations/instance-style-overrides.md).

## Platform, localization, and lifecycle

| Concern           | Component-specific contract                          |
| ----------------- | ---------------------------------------------------- |
| SSR and hydration | [stable HTML, IDs/state, browser work, replay]       |
| Directionality    | [logical placement/keys; `Dir` behavior]             |
| Localization      | [strings, adapters, long text]                       |
| Reduced motion    | [CSS/JS, live change, essential-state alternative]   |
| Responsive / zoom | [breakpoints, 200% zoom, 400% reflow]                |
| Cleanup           | [listeners, timers, observers, portals, object URLs] |

Use consumer IDs first and `ZdIdGenerator` only for remaining library-owned relationships. Do not
claim raw `dir`, media emulation, or a fixture proves live directionality, physical high contrast,
or mobile assistive technology.

## Examples

Examples compile from the intended public entry point, include an accessible name, and use no
unsupported deep import, private selector, or daisyUI internal.

### Basic

```html
<!-- [minimal semantic, accessible use] -->
```

### Advanced composition

```html
<!-- [controlled state, parts, forms, theming, or overlay] -->
```

### Customization

```html
<!-- [stable or consumer-owned hook] -->
```

### Avoid

```html
<!-- [unsupported pattern and supported replacement] -->
```

Explain why the anti-pattern is unsafe. Before Done, prove long translated strings, RTL,
reduced-motion, forced-colors, and relevant mobile/zoom states through examples or fixtures.

## Evidence and release record

| Area                      | Evidence / command / review link | Status |
| ------------------------- | -------------------------------- | ------ |
| Unit and integration      |                                  |        |
| Browser and accessibility |                                  |        |
| Manual accessibility      |                                  |        |
| SSR and hydration         |                                  |        |
| Visual matrix             |                                  |        |
| Package, API, and bundle  |                                  |        |
| Compatibility             | [Angular/daisyUI/browser range]  |        |
| Changeset and migration   |                                  |        |

Record the API-review decision, maturity, matrix cells, known limitations, and release/migration
notes. A passing example alone does not make a component Preview or Stable.

## Author checklist

- [ ] Definition of Ready and this specification are complete before implementation.
- [ ] Public API review covers every exported and behavioral contract.
- [ ] Styling and Tailwind candidate inventories are complete and labeled.
- [ ] Accessibility, forms, SSR, direction, motion, forced-colors, and cleanup are proved or
      explicitly inapplicable with a reason.
- [ ] Basic, advanced, customization, and anti-pattern examples compile using public APIs.
- [ ] Matrix, maturity, tests, visuals, Changeset, and migration notes agree.

## Related contracts

- [Component API and composition ADR](../architecture/0002-component-api-and-composition.md)
- [Public API review](../contributing/api-review.md)
- [Component maturity](../contributing/component-maturity.md)
- [Manual accessibility review template](../testing/manual-accessibility-review-template.md)
- [Browser integration testing](../testing/browser-integration.md)
- [SSR and hydration testing](../testing/ssr-and-hydration.md)

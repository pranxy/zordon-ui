# Label

**Component ID:** INP-06  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/label`

Label applies daisyUI styling to a native `<label>`. It is not a field wrapper, form-value control, description/error manager, or generic ARIA relationship utility.

## Native association

```html
<label zdLabel for="email">Email address</label> <input id="email" class="input" type="email" />
```

```html
<label zdLabel>
  Accept terms
  <input class="checkbox" type="checkbox" />
</label>
```

Label never generates an ID, changes `for`, adds `aria-*`, sets required/optional text, manages validity, or implements a ControlValueAccessor. The control and any hint/error relationship remain consumer-owned until a concrete Fieldset, Validator, or form control owns them.

## daisyUI inventory and API

The implementation pin is daisyUI 5.7.16.

| Candidate        | Zordon directive          | Contract                                           |
| ---------------- | ------------------------- | -------------------------------------------------- |
| `label`          | `<label zdLabel>`         | Adds only the prefix-aware `label` class.          |
| `floating-label` | `<label zdFloatingLabel>` | Adds only the prefix-aware `floating-label` class. |

Current daisyUI Label has no colors, sizes, states, `label-text`, `label-text-alt`, or stable CSS variables. Historic tokens must not be emitted. Both directives preserve consumer classes, styles, `for`, nested controls, data attributes, and ARIA attributes, and add no events, roles, focus, IDs, browser-only work, or defaults API.

## Floating label

```html
<label zdFloatingLabel>
  <span>Email address</span>
  <input class="input" placeholder="Email address" type="email" />
</label>
```

The floating-label pattern is a native wrapping label. Its text must be a complete, localized consumer string; the control needs normal placeholder behavior for the upstream CSS state. Do not use it as an accessible-label replacement.

## Composition and evidence

Before/after layout, required markers, optional text, counters, help, validation errors, responsive layout, visually hidden labels, and compound field structure belong to consumer CSS or future Fieldset/Validator contracts. The directives are deterministic server HTML and use neither `@angular/aria`, CDK, Forms, DOM reads, timers, nor cleanup.

| Area             | Required proof before Preview                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------- |
| API/package      | Intentional entry, exact type tests, API extraction, tarball, and bundle review               |
| Native semantics | Explicit/implicit association, preservation, and no injected role/ID/event behavior           |
| Styling          | Prefixes, Input/Select anatomy, floating focus/prefilled/disabled states, and consumer layout |
| Accessibility    | Axe, manual screen-reader review, forced colors, zoom/reflow, and RTL long labels             |
| SSR/hydration    | Stable classes/associations and clean hydration                                               |
| Visual           | Light/dark/custom themes plus floating and inner-label layouts                                |

## Sources

- [daisyUI Label documentation](https://daisyui.com/components/label/)
- [HTML `<label>` reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label)

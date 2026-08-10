# Host class composition

Zordon UI declarations add daisyUI classes through Angular host class-map bindings. Angular keeps
that source separate from static and dynamic classes supplied by the consumer, so library state can
change without reading, copying, or replacing the element's current `class` attribute.

## Declaration pattern

Components and directives compute only the complete class tokens they own and bind the result with
host metadata:

```ts
import { computed, Directive, input } from '@angular/core';

import { zdHostClasses } from './internal/styling/host-classes';

@Directive({
  selector: 'button[zdExample]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ZdExample {
  readonly active = input(false);

  protected readonly hostClasses = computed(() =>
    zdHostClasses('btn', this.active() && 'btn-active'),
  );
}
```

The composer is a private implementation utility. It accepts complete tokens and omits absent
optional values; it does not inspect the DOM, parse consumer classes, generate prefixes, or define a
public component input.

## Ownership and updates

- The declaration owns only the tokens returned by its host class-map binding.
- Consumers continue to own static `class`, `[class]`, `[class.name]`, and non-overlapping `ngClass`
  tokens.
- Every library update emits the base class plus the currently selected modifiers. Angular removes
  a stale library modifier while preserving classes supplied by other binding sources.
- An explicit consumer per-class binding can suppress a token proposed by the host class map. This
  follows Angular styling precedence and is an intentional customization escape hatch.
- Use `[class.name]` when intentionally overriding a library-owned token. Angular's `NgClass`
  directive mutates the DOM class list independently; removing an overlapping token from `ngClass`
  can remove the host token until the library binding changes again. Overlapping `ngClass` tokens
  are therefore not a supported ownership source.
- If library and consumer sources both supply a token, neither side should infer ownership from the
  serialized `class` attribute.

Class-token order is not a contract. Preserving a consumer class also does not guarantee its CSS
rule wins the cascade; selector specificity, stylesheet order, and `!important` remain ordinary CSS
concerns.

## Prefix boundary

Host composition receives already-generated tokens. The daisyUI and Tailwind prefix foundation
will translate semantic component classes into complete tokens before they reach this composer.
Keeping those concerns separate means composition works with an empty prefix, `d-btn`, or tokens
containing Tailwind prefix punctuation without knowing their syntax.

## Prohibited patterns

Do not:

- expose a component `class` input that shadows the native class binding;
- assign `className`, call `setAttribute('class', ...)`, or replace the full class attribute through
  `Renderer2`;
- read existing DOM classes and concatenate them into the library binding;
- manually remove class tokens that the library's host binding does not own;
- use `ngClass` to toggle a token also owned by the library; use `[class.name]` for that override;
- assert exact class-string order in tests.

Those patterns either bypass Angular's styling-source tracking, retain stale consumer state, or
make SSR and hydration behavior harder to keep deterministic.

## Verification contract

Angular integration tests for this foundation verify static and dynamic consumer classes,
non-overlapping `ngClass` transitions, reactive library modifier replacement, reactive consumer
updates, explicit per-token suppression/restoration, and the unsupported overlapping `ngClass`
boundary. The tests assert token membership through `classList`, not incidental serialization
order.

## References

- [Angular host elements](https://angular.dev/guide/components/host-elements)
- [ADR 0002: Component API and composition conventions](../architecture/0002-component-api-and-composition.md)
- [ADR 0003: daisyUI styling, theming, and customization](../architecture/0003-styling-and-theming.md)

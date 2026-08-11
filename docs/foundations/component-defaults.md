# Global component defaults and local overrides

Zordon UI will support application-wide defaults for suitable optional component inputs. This
document fixes the precedence and authoring rules before component APIs are rebuilt; it does not
add a generic runtime defaults registry or a public provider feature yet.

The first real component that supports application defaults must implement and prove the provider
shape end to end before this foundation is considered complete.

## Precedence

Every defaultable value resolves in this order:

1. an explicit local component input;
2. an application-level default for that component;
3. the component's private intrinsic default.

An omitted local input is represented by `undefined`. Component code must distinguish omission
from an explicit value:

```ts
const effectiveSize = computed(() =>
  localSize() === undefined ? applicationDefaults.size : localSize(),
);
```

Do not use `localSize() ?? applicationDefaults.size`. `null` is not a universal inheritance or
reset value. When a concrete input type permits `null`, it is an explicit value and must override
the application default. The same applies to valid falsy values such as `false`, `0`, and `''`.

Updating a local input back to `undefined` restores the application default; if no application
override exists, it restores the intrinsic default.

## Which inputs can have application defaults

Each component defines its own narrow `Zd<Component>Defaults` type from optional inputs that are
safe to share across every instance. Appropriate candidates include:

- appearance, semantic color, size, shape, density, and placement;
- animation or static interaction-policy options;
- component-specific timing or layout policy when the component specification permits it.

Do not place these in component defaults:

- required content, labels, names, IDs, or accessibility descriptions;
- controlled state such as value, open, checked, selected item, or active index;
- outputs, callbacks, templates, element references, or generated IDs;
- disabled state owned by Angular Forms;
- localization, date, number, icon, or other adapters that require their own DI contract.

Required inputs remain `input.required(...)`; dependency injection must never satisfy a required
template contract.

There is intentionally no universal color, size, density, or behavior default. Button appearance,
Modal dismissal, Toast timing, and Calendar formatting are different contracts even when some
property names overlap.

## Input implementation rule

A defaultable input must preserve omission in its public raw signal. Use `input<T>()`, whose value
is `T | undefined`, rather than initializing the input with the intrinsic default. The component
then derives a private effective signal used by rendering and behavior.

Boolean inputs need a component-specific pure transform that preserves `undefined` before applying
boolean coercion. Applying `booleanAttribute` directly would turn an omitted/reset value into
`false` and incorrectly mask an application default of `true`.

Model inputs cannot use transforms and represent controlled state, so they are not globally
defaultable under this contract.

## Application provider boundary

Application defaults will be registered once through `provideZordonUi(...)`. Each component entry
point will contribute its own typed feature and private injection token when that component is
built. The package root must not import the types or runtime of all 68 components.

The eventual consumer flow is:

1. import a typed defaults feature from the component entry point;
2. pass that feature to `provideZordonUi(...)` at application bootstrap;
3. omit a local input to inherit it, or bind an explicit value to override it.

The exact feature protocol and component helper names will be added with the first real component,
where rendered behavior, package boundaries, and tree shaking can be verified. Until then, the
current `provideZordonUi(config)` API remains unchanged.

Do not introduce any of these substitutes:

- `Record<string, unknown>` or a string-keyed component registry;
- an empty interface intended for declaration merging;
- a mutable defaults service;
- raw public component-default tokens;
- both a `with<Component>Defaults` feature and a competing standalone provider API.

## Provider scope

The v1 contract is application-level only. Route-level, nested environment, and element-injector
defaults are unsupported. Local inputs are the per-instance override mechanism.

Nested providers would require separate rules for parent merging, projected content, lazy routes,
portaled overlays, and SSR routing. `provideZordonUi(...)` returns `EnvironmentProviders`, which
also prevents accidental use in a component's `providers` array.

## Merge, validation, and immutability

The future component-specific feature factory must understand its exact fields. It must:

- validate keys and values with the same semantics as local inputs;
- discard `undefined` fields so they do not erase intrinsic defaults;
- preserve `null` only where the concrete defaults type permits it;
- copy and shallow-freeze the resolved defaults record;
- copy and freeze owned arrays or nested records according to that component's contract;
- reject duplicate defaults features for the same component instead of relying on provider order.

Do not apply a generic deep clone or deep freeze to arbitrary values. Functions, adapters,
templates, and other identity-bearing references need component-specific ownership decisions.

Defaults are synchronous immutable configuration. They must not read browser storage, media
queries, DOM state, or platform-dependent globals, so server rendering and hydration start with
the same effective values.

## Required proof with the first component

The first defaults-aware component must add behavior-sensitive tests proving:

- intrinsic rendering without an application provider;
- application defaults when the local input is omitted;
- static and dynamic local overrides;
- reset to `undefined` restoring the application or intrinsic default;
- explicit `null`, `false`, `0`, or `''` where supported;
- partial application defaults retaining unrelated intrinsic values;
- caller mutation after provider creation does not alter existing configuration;
- invalid keys/values and duplicate component features have defined errors;
- independent component instances do not leak state;
- required inputs and Forms-owned state retain their existing authority;
- server HTML and hydrated behavior use the same effective defaults;
- packed declarations and tree shaking retain only intended component-entry code.

A synthetic token or pure merge-helper test cannot close this requirement because it would not
exercise real input omission, host classes, Forms precedence, SSR output, or secondary-entry
packaging.

## References

- [Angular hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
- [Angular `makeEnvironmentProviders`](https://angular.dev/api/core/makeEnvironmentProviders)
- [Angular signal inputs](https://angular.dev/guide/components/inputs)

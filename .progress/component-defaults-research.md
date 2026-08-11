# Global component defaults and local overrides research

Updated: 2026-08-10

## Question and constraints

Define the smallest Angular 21–22 foundation that lets future Zordon component entry points expose
typed global defaults through `provideZordonUi(...)`, while every explicit local input wins and no
68-component runtime registry or premature component schema is introduced.

## Evidence bar

- Accepted ADR 0002, root entry-point and public API policies.
- Existing immutable `provideZordonUi`/class-prefix implementation and type tests.
- Official Angular hierarchical-DI and `EnvironmentProviders` behavior plus installed 21.2.19
  behavior-sensitive tests.
- Packaging, SSR/hydration, tree-shaking, and bundle-budget evidence.

## Open questions

1. How can component entry points contribute exact defaults types without central root imports?
2. Should global defaults be one registry object, feature providers, or component-specific tokens?
3. Which values mean omitted, inherited, cleared, or explicit for `false`, `0`, `''`, and `null`?
4. Do route/component-scoped provider overrides belong in this application-global foundation?
5. How are built-in, global, and local layers copied/merged without retaining mutable inputs?
6. What behavior can be proven before the first real component exists without a false-green test?

## Sources and findings

- ADR 0002 requires tree-shakeable `provideZordonUi(...)` plus lightweight injection tokens, with
  local inputs always taking precedence.
- Angular's official hierarchical-DI guide says resolution starts at the requesting element and
  walks ancestors before the environment hierarchy; the nearest provider wins.
- Angular documents `EnvironmentProviders` as application/environment-only and
  `makeEnvironmentProviders` as accepting nested `Provider | EnvironmentProviders` values.
- Installed Angular 21.2.19 types declare `input<T>()` as `InputSignal<T | undefined>`. That raw
  `undefined` is required to distinguish omission/reset from explicit falsy or nullable values.
- The library has no rebuilt component with actual defaultable inputs, host behavior, Forms
  precedence, SSR output, or a published component entry point. A synthetic token could not verify
  the required behavior or packaging boundary.
- Component needs are heterogeneous: appearance defaults, dismissal/focus policy, timing/queue
  policy, and adapters cannot share one universal runtime schema.
- Installed Angular resolves the nearest provider and same-injector duplicates by provider order.
  Supporting route/nested defaults would add parent merging and portal/projection ownership that
  the plan does not require.

## Rejected evidence or approaches

- A string-keyed `Record<string, unknown>` registry: it loses component-specific keys and values.
- A declaration-merging defaults interface: before a component augments it, the empty shape cannot
  reject unknown configuration and couples root types to import order.
- A generic token/merge helper now: it would be false-green without a component's inputs, DOM,
  Forms, SSR, and secondary-entry packaging.
- A universal color/size/density defaults object: identical property names do not imply identical
  component support or semantics.
- Route or element-scoped defaults: these require a separate precedence, merge, projection, portal,
  and lazy-route contract; local inputs already solve per-instance overrides.
- Generic deep cloning/freezing: it can break functions, templates, adapters, and other
  identity-bearing values.

## Synthesis decisions

- Document intrinsic < application < explicit local precedence now; do not export runtime API yet.
- `undefined` means omitted/inherit/reset. Typed `null` and other valid falsy values are explicit.
- Defaultable inputs use an uninitialized optional input signal and a private effective signal.
- Required inputs, controlled/model state, accessibility identity/content, callbacks/templates, and
  Forms-owned disabled state cannot be application defaults.
- Each concrete component owns a narrow defaults type, validation, copying, and private root token
  in its secondary entry point. The root composes typed opaque features without importing component
  runtime or types.
- The first real defaults-aware component must prove rendering, dynamic resets, mutation safety,
  SSR/hydration, declaration shape, and tree shaking before the plan row can be completed.

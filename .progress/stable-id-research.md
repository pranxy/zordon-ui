# Stable ID generation research

Updated: 2026-08-11

## Question and constraints

Define the smallest shared Angular primitive that gives Zordon components deterministic, unique
IDs for accessible relationships during server rendering and ordinary hydration, without browser
globals, randomness, private framework APIs, or cross-request state.

## Evidence bar

- Public Angular 21 APIs and installed Angular/CDK 21 source.
- Accepted Zordon accessibility, SSR, packaging, and public-API policies.
- Unit behavior plus the real SSR/hydration example running in a browser.
- Explicit boundaries for multiple applications and incrementally hydrated `@defer` blocks.

## Open questions

1. Which Angular public primitive should namespace application IDs?
2. Where must counters live to isolate applications and server requests?
3. What scope grammar and output format can remain stable public API?
4. Which tests prove server/client equality rather than only uniqueness in one runtime?
5. Can an allocation-order generator promise stability across independently triggered incremental
   hydration boundaries?

## Sources and findings

- Angular's public `APP_ID` token defaults to `ng` and exists to distinguish multiple applications
  bootstrapped on one page.
- Installed Angular 21.2.19 also uses `APP_ID` to namespace framework-managed state.
- CDK exports `_IdGenerator` from `@angular/cdk/a11y`, but its underscored API uses module-global
  counters and an optional process-random infix. It is not an appropriate public Zordon dependency.
- A root-provided service instance is scoped to an Angular application/environment injector; in the
  SSR example, each request creates a new application injector and therefore a new counter set.
- Per-scope counters keep unrelated component families from changing one another's IDs.
- Angular hydration requires equivalent server/client DOM. A deterministic generator is safe only
  when each scope allocates in the same order on both sides.
- Angular incremental hydration can instantiate independently triggered `@defer` blocks in trigger
  order. A generic sequence generator cannot derive a stable template-tree position and therefore
  cannot promise order-independent IDs across such sibling boundaries.
- `TransferState` can carry data between server and client but does not solve out-of-order allocation;
  introducing it would add state and serialization without removing the core ambiguity.

## Rejected approaches

- Re-exporting or wrapping CDK `_IdGenerator`: private naming, module-global state, and optional
  randomness conflict with the required boundary.
- `Math.random()`, timestamps, UUIDs, browser globals, or module-global counters: nondeterministic or
  shared across applications/SSR requests.
- One global counter: unrelated component creation changes every later ID and makes compatibility
  unnecessarily fragile.
- A generic DOM-path or view-index algorithm: Angular exposes no stable public tree-position API for
  this purpose, and direct DOM traversal would violate SSR/hydration constraints.
- `TransferState`: cannot make independently hydrated sibling boundaries allocate in server order.

## Proposed contract

- Root-export an injectable `ZdIdGenerator` with `next(scope: string): string`.
- Accept one lowercase ASCII kebab token as the scope; component authors own stable scope names.
- Return `zd-${appId}-${scope}-${index}`, beginning at zero, with a counter per scope and service
  instance. Reject invalid scopes before modifying state.
- Treat the configured Angular `APP_ID` as an opaque, non-empty namespace and encode it before placing
  it in an HTML ID so consumer-supplied punctuation cannot create invalid/ambiguous output.
- Document deterministic render/allocation order as part of the contract. Components in independently
  triggered incremental-hydration boundaries must receive an explicit stable ID/key instead of relying
  on sequence allocation until a concrete component can prove another strategy.

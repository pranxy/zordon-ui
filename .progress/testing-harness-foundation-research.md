# Shared testing-harness foundation research

## Question

Define the smallest safe public/testing boundary for future Zordon component harnesses and interaction helpers, including how a future component may compose Angular Aria harnesses without exposing Angular Aria through `@pranxy/zordon-ui/testing`.

## Constraints

- No component currently imports `@angular/aria`.
- The package targets Angular 21–22 while Angular Aria is a preview dependency.
- `@pranxy/zordon-ui/testing` is a future, production-unreachable entry point, not an empty placeholder.
- This foundation must not publish a generic harness base or helper before a real component proves its API, package, and compatibility boundary.

## Evidence

- The installed `@angular/cdk` is `21.2.14`. Its supported `@angular/cdk/testing` and
  `@angular/cdk/testing/testbed` entry points expose `ComponentHarness`,
  `ContentContainerComponentHarness`, `HarnessPredicate`, `HarnessLoader`, and
  `TestbedHarnessEnvironment`.
- `@angular/aria` is not installed. ADR 0008 requires its first runtime consumer to add a
  version-aligned peer/development dependency and prove minimum/latest Angular, SSR/hydration,
  package isolation, and bundle impact.
- Angular's Accordion guide documents family-specific harnesses from
  `@angular/aria/accordion/testing`, loaded with the CDK Testbed harness environment. The upstream
  package's public testing surface is a useful implementation-test dependency, not a stable Zordon
  API.
- `docs/architecture/entry-points.md` reserves `@pranxy/zordon-ui/testing` for public component
  harnesses, fixtures, and helpers, but requires every published entry point to expose a deliberate
  API, build independently, remain side-effect free, and pass package/API checks. It forbids an
  empty placeholder.
- The package currently has no real component entry point and no testing secondary entry point.
  A generic base class, selectors, or interaction helper would therefore invent unsupported public
  contracts and cannot establish component semantics, overlay scope, Forms behavior, or browser
  fidelity.

## Sources

- https://material.angular.dev/cdk/testing/overview
- https://angular.dev/guide/aria/accordion
- https://github.com/angular/components
- `node_modules/@angular/cdk/types/testing.d.ts` and
  `node_modules/@angular/cdk/types/testing-testbed.d.ts` (installed 21.2.14)
- `docs/architecture/0008-angular-aria.md`
- `docs/architecture/entry-points.md`

## Decision

Mark the foundation as Partial. Document the acceptance contract now; introduce the testing entry
point, a component-specific public harness, and only the helpers that harness actually needs with
the first suitable component. Do not install Angular Aria, add a testing package, or ship a generic
base/helper in this tranche.

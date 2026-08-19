# Testing harnesses and interaction helpers

## Purpose and current boundary

Zordon component tests use the smallest credible layer for the behavior under test: unit or Angular
integration tests for deterministic component contracts, CDK harnesses for consumer-facing component
interaction, and real browser tests for focus, layout, native events, overlays, and browser/assistive
technology boundaries.

`@pranxy/zordon-ui/testing` is reserved for intentional, public component harnesses, fixtures, and
helpers. It does not exist yet because there is no published component whose semantics can define a
useful public test API. Do not add an empty entry point, a generic `ZdHarness`, or selector utilities
ahead of that proof.

## Ownership

| Layer                       | Owns                                                                                 | Must not claim                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Component harness           | Stable consumer-observable state and interactions of one Zordon component            | Browser layout, screen-reader speech, cross-component workflow, or private implementation structure |
| CDK testing                 | Harness environment, async stabilization, element interaction, and predicates        | Zordon component API or accessibility completeness                                                  |
| Angular Aria family harness | Characterization of the selected upstream directive family                           | A stable Zordon public API or Zordon-owned behavior outside that family                             |
| Playwright/browser fixture  | Real focus, keyboard, pointer, native-event, layout, hydration, and cleanup behavior | Screen-reader speech or physical-device behavior without manual evidence                            |

Angular Aria remains a preview implementation detail. A component may use its documented
`@angular/aria/<family>/testing` harness in its own implementation tests after the component has
installed and pinned the matching dependency. Never re-export an Angular Aria harness, type, token,
selector, or deep import from Zordon. A Zordon public harness must expose Zordon names and semantics
only.

## First public harness gate

The first component that needs a harness must add `@pranxy/zordon-ui/testing` and satisfy the
entry-point acceptance rules before publication:

1. Define a component-specific harness name, host selector, filter options, and method vocabulary
   from the component's published selector, inputs, outputs, ARIA/state contract, and user actions.
   Filters use public meaning such as text, value, selected state, or disabled state—not daisyUI
   classes, projected DOM shape, internal IDs, or directive instances.
2. Build the harness on public CDK testing APIs (`ComponentHarness`,
   `ContentContainerComponentHarness`, `HarnessPredicate`, and `TestElement`). Keep the base class
   private unless at least two published harnesses need the same behavior and their shared methods
   have a reviewed semantic contract.
3. Locate real content, overlays, and portals through the correct harness loader. A component with
   document-root content needs a documented document-root path; do not make a harness silently
   depend on a TestBed-only fixture root.
4. Treat every harness method as public API: document it, type-test it where useful, preserve its
   behavior under component internals refactors, and review it under the package semver policy.
5. Add a component-level browser and accessibility suite. Harness coverage complements, rather than
   replaces, keyboard, focus, pointer, SSR/hydration, visual, and manual assistive-technology gates.

## Interaction-helper rules

Create a helper only when at least two component tests need the same _observable_ interaction and
the helper can retain the required browser or CDK fidelity. Examples may include an explicit keyboard
sequence, a controlled overlay open/close helper, or a fixture setup with a documented provider
contract.

Helpers must:

- operate through public roles, labels, harness APIs, or component public semantics;
- await an observable ready state rather than sleep;
- own and clean up any fixture, subscription, overlay, listener, or test data they create;
- preserve event details relevant to the claim (key, modifiers, pointer button, submitter, or focus
  origin); and
- stay internal until their public use and package boundary are independently justified.

Do not create universal click, keypress, CSS-selector, `detectChanges`, timing, or `whenStable`
wrappers. Those abstractions conceal the behavior a component must state explicitly and routinely
become an accidental API.

## Angular Aria composition procedure

For a component using Angular Aria:

1. Run the required integration spike from [ADR 0008](../architecture/0008-angular-aria.md) against
   the exact pinned Angular/Aria/CDK version.
2. Use the upstream family harness only to characterize upstream-owned behavior. Add Zordon tests
   for the component's complete public semantics, styling, controlled state, Forms, overlay, async,
   SSR/hydration, and cleanup responsibilities.
3. Build a Zordon harness that delegates to public DOM semantics or public Zordon APIs. It may use
   an upstream harness internally in implementation tests, but its exported method signatures and
   return values cannot mention Angular Aria.
4. Prove the testing entry point is unreachable from every production entry point, inspect its
   declarations and packed exports, run its budget, and record the package/semver review.

## Required proof by layer

| Risk                                                                    | Minimum proof                                                                            |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Public component state/action                                           | Component harness and Angular integration test                                           |
| Roving focus, typeahead, selection, or expansion from Angular Aria      | Exact-version upstream harness characterization plus component keyboard/pointer test     |
| Focus, pointer, overlays, native form submission, layout, or hydration  | Real browser/SSR test                                                                    |
| Screen-reader output, forced colors, touch, or physical mobile behavior | Manual or device-specific evidence                                                       |
| Harness export and production isolation                                 | Partial-Ivy package build, declarations/tarball inspection, budget check, and API review |

## Current status

This is a documented contract, not a published harness runtime. Completion waits for the first
component-specific harness and the testing entry point's actual package, compatibility, and browser
evidence.

## References

- [Angular CDK testing overview](https://material.angular.dev/cdk/testing/overview)
- [Angular Aria Accordion testing guide](https://angular.dev/guide/aria/accordion)
- [Angular Aria adoption policy](angular-aria-adoption.md)
- [Public entry-point policy](../architecture/entry-points.md)
- [Browser integration policy](../testing/browser-integration.md)

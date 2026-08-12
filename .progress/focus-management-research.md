# Focus management foundation research

Updated: 2026-08-11

## Question and constraints

Define the smallest reusable focus-trap, initial-focus, restoration, and focus-visible foundation for
Zordon UI while preferring native CSS and supported Angular CDK behavior over custom runtime code.

## Evidence bar

- Accepted overlay, Angular Aria, accessibility, SSR, packaging, and public-API ADRs.
- Official Angular/CDK documentation plus installed `@angular/cdk` behavior and source.
- Real Angular tests for focus entry, containment, restoration, disabled/dynamic content, and teardown.
- Explicit SSR/hydration and browser-boundary guidance.

## Open questions

1. Which supported CDK declarations cover trapping, initial focus, and restoration?
2. When is native `:focus-visible` sufficient, and when is `FocusMonitor` justified?
3. Should Zordon ship a wrapper now, or standardize direct private composition until overlay lifecycle
   supplies a concrete gap?
4. What activation timing avoids focusing hidden/animating content or moving focus during SSR?
5. How should nested overlays, destroy, missing triggers, and explicit restoration opt-out compose with
   the future overlay stack?
6. Which tests can prove installed behavior without freezing private CDK markup or classes?

## Initial repository evidence

- ADR 0004 requires CDK A11y primitives, private overlay infrastructure, initial focus policy, focus
  restoration by default, nested-overlay coordination, cleanup, and SSR-safe activation.
- ADR 0008 assigns focus trapping and complementary focus mechanics to Angular CDK, not Angular Aria
  or a new generic Zordon keyboard utility.
- `@angular/cdk` is already a required Angular 21–22 peer and workspace dependency.
- No production Zordon overlay or component consumes focus management yet; the existing docs fixture
  uses native `<dialog>` and manual trigger focus only as baseline browser coverage.
- The two preceding Angular Aria plan rows remain gated on the first real consuming component and do
  not authorize installing `@angular/aria` during this step.

## Installed CDK 21.2.14 findings

- `CdkTrapFocus` is a public standalone directive from `@angular/cdk/a11y`. On the server its
  constructor sees `Platform.isBrowser === false` and creates no trap or DOM anchors.
- The directive creates the public `FocusTrap` only in a browser, attaches anchors after content
  initialization, retries attachment for a dynamically inserted host, destroys both anchors, and
  restores the element captured by `cdkTrapFocusAutoCapture` when the directive is destroyed.
- `cdkFocusInitial` is a marker inspected by `FocusTrap`; it only participates when focus is actually
  captured. The target must be focusable. If the marker is on a non-focusable container, CDK selects
  its first tabbable descendant; a disabled empty target does not fall back to the whole region.
- Plain `FocusTrap` constrains sequential Tab navigation with before/after anchors. It does not stop
  pointer or programmatic focus from leaving, and its documented traversal assumes DOM order rather
  than positive `tabindex`, CSS `order`, shadow-root, or iframe ordering.
- Public `ConfigurableFocusTrapFactory` adds a root-injector `FocusTrapManager`: activating a nested
  trap disables the previous one and destroying it re-enables the prior trap. Its default inert
  strategy also redirects focus events that leave the active trap, but it deliberately exempts CDK
  overlay panes. It does not own initial focus or restoration.
- Public `FocusMonitor` and `CdkMonitorFocus` identify mouse, keyboard, touch, and programmatic focus,
  support shadow-root event registration, apply documented `cdk-*-focused` classes, do nothing on the
  server, and require `stopMonitoring`/directive destruction to remove listeners and classes.
- Native `:focus-visible` already expresses the normal styling requirement without JavaScript or
  cleanup. `FocusMonitor` is justified only when component behavior needs the focus origin or when a
  documented composite styling boundary cannot be expressed by `:focus-visible`/`:focus-within`.

## Emerging synthesis

- Do not ship a Zordon focus wrapper or public export before the overlay lifecycle exists. Directly
  compose native `<dialog>` where suitable and public standalone CDK declarations internally.
- Use `CdkTrapFocus` with `cdkTrapFocusAutoCapture` and one focusable `cdkFocusInitial` target for a
  simple single in-DOM region. Let destruction perform ordinary restoration.
- The future shared overlay foundation should create a public CDK `FocusTrap` through
  `FocusTrapFactory` under Zordon's own lifecycle and stack. It must own initial focus, explicit
  restoration target/fallback, activation after visible content is rendered, opt-out policy, and
  stack coordination.
- Focus trapping is only one modal requirement. Background inertness, semantics, dismissal, scroll,
  stacking, pointer isolation, and focus restoration fallback belong to native dialog or the future
  overlay layer.
- Test supported observable behavior, not private anchor class names or exact CDK DOM scaffolding.

## Primary references

- https://material.angular.dev/cdk/a11y/overview
- https://material.angular.dev/cdk/a11y/api
- Installed `node_modules/@angular/cdk/fesm2022/_a11y-module-chunk.mjs`
- Installed `node_modules/@angular/cdk/fesm2022/a11y.mjs`
- Installed `node_modules/@angular/cdk/fesm2022/_focus-monitor-chunk.mjs`

# Reduced-motion foundation research

- **Plan item:** Phase 2 — Reduced-motion policy and animation state utilities
- **Updated:** 2026-08-19
- **Status:** In progress

## Questions

1. Which motion is decorative, spatially explanatory, or essential, and what must remain when motion is reduced?
2. What does daisyUI 5.7.16 already emit for `prefers-reduced-motion`, transitions, and animations?
3. Can CSS media queries remain authoritative, or is an Angular runtime service justified before a component needs JS timing/state coordination?
4. How must close/open state machines complete when durations are zero, events do not fire, animations are interrupted, or preference changes live?
5. What are the SSR/hydration, listener cleanup, testing, packaging, and release boundaries?

## Evidence bar

- Exact installed dependency source and compiled CSS behavior.
- Current primary standards/vendor documentation for the media feature and Web Animations/event semantics.
- Behavior-sensitive unit/browser checks only where a repository runtime contract is introduced.
- No public API or runtime abstraction without a concrete reusable behavior that existing CSS/native APIs cannot provide.

## Findings

- W3C defines `reduce` as removing or replacing non-essential motion that can cause vestibular
  discomfort or distraction. Static final-state CSS plus opt-in `no-preference` motion is the
  safest default.
- WCAG 2.2.2 pause/stop/hide obligations for automatically started motion or updates are separate
  from the system preference.
- Installed versions: Angular core 21.2.19, CDK 21.2.14, daisyUI 5.7.16, Tailwind 4.3.2.
- Thirty-three daisyUI component objects declare animation, transition, or smooth-scroll behavior;
  only fourteen contain a reduced-motion query. Aura and Loading retain slower infinite motion
  under `reduce`; Text Rotate can retain discrete infinite changes. Several spatial component
  transitions are unguarded. Component-specific inventory/override evidence is required.
- Angular deprecated `@angular/animations` in 20.2 in favor of native CSS and `animate.enter` /
  `animate.leave`. Installed class-based handling is not a complete live-cancellation protocol, so
  it must not solely own semantic or overlay completion.
- CSS needs no runtime preference service. The first real JS-driven animation should evaluate CDK
  `BreakpointObserver`/`MediaMatcher`, use one application-scoped source, initialize after the
  browser render boundary, and prove exactly-once cancellation/finalization.
- The smallest truthful deliverable is documentation plus a real-browser fixture. Keep the plan
  row Partial until a concrete component proves the runtime lifecycle, SSR/hydration, daisyUI
  override, and package boundary.
- The existing visual suite is not policy proof because it emulates `reduce` and forcibly zeros all
  durations. The new behavior fixture asserts real computed motion under both preferences and a
  live preference switch while semantic state remains active.

## Sources

- https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
- https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://angular.dev/guide/animations
- https://angular.dev/guide/animations/migration
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event
- https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event
- Installed `node_modules/daisyui/components/*/object.js`
- Installed Angular `node_modules/@angular/core/fesm2022/_debug_node-chunk.mjs`

# Visual story matrix research

## Question

What is the smallest reusable visual-story convention that gives all future components reviewable
theme, state, responsive, RTL, customization, and accessibility boundaries without building a
premature story generator?

## Evidence

- The build plan requires theme matrix, responsive states, and visual regression coverage, while its
  Definition of Done keeps accessibility as an independent completion column.
- ADR 0007 requires long translated strings and RTL before Done, plus forced-colors, visible-focus,
  reduced-motion, zoom, and reflow consideration.
- The existing Chromium visual suite already provides deterministic desktop/mobile, themes,
  reduced-motion, screenshot naming, and reviewed-baseline workflow.
- Environment profiles distinguish screenshot configuration from live directionality, physical
  high contrast, assistive technology, and motion-lifecycle proof.
- The manual accessibility template and browser/SSR guides define evidence that pixels cannot prove.

## Decision

- Add a component-local Markdown matrix template rather than a generator or new runtime/testing API.
- Require a default, visually distinct variant, meaningful state, theme, responsive, RTL/long-text,
  and documented-customization decision. Allow an explicit `N/A` or grouped rationale.
- Make forced colors, keyboard/focus, screen-reader, mobile, and SSR/hydration explicitly
  non-screenshot evidence classes.
- Keep actual snapshot implementation and baseline review in the existing Playwright visual policy.

## Sources

- `DAISYUI_ANGULAR_BUILD_PLAN.md`
- `docs/architecture/0007-accessibility-ssr-and-localization.md`
- `docs/testing/visual-regression.md`
- `docs/testing/environment-test-fixtures.md`
- `docs/testing/browser-integration.md`
- `docs/testing/manual-accessibility-review-template.md`

# Environment test-fixtures research

## Question

Create reusable, test-only browser profiles for themes, direction, viewport, motion, and forced
colors without hiding component behavior, creating global application state, or publishing a testing
entry point.

## Constraints

- Profiles must remain local to Playwright tests and must not ship from the library.
- A profile configures the browser/document only; a component test still owns navigation, actions,
  semantic assertions, and component-specific recovery.
- Raw HTML `dir` is appropriate for CSS/native direction fixtures but is not a live Angular CDK
  `Directionality` source. Components needing live nested RTL continue to use `Dir`.
- Emulated media proves browser query/style behavior, not screen-reader, physical-device, or OS
  high-contrast rendering.

## Evidence

- Installed `@playwright/test` is `1.62.1`. `Page.emulateMedia()` supports color scheme, reduced
  motion, forced colors, and contrast emulation; `Page.setViewportSize()` documents that viewport
  changes should happen before navigation.
- The existing browser fixture already proves live `prefers-reduced-motion`, component-local `Dir`,
  nested daisyUI themes, and representative desktop/mobile visual baselines, but its setup was
  duplicated and inconsistent across files.
- Existing directionality guidance correctly states that raw document `dir` cannot replace a live
  Angular CDK `Directionality`/`Dir` scope. The shared environment fixture must preserve that
  boundary.

## Sources

- https://playwright.dev/docs/api/class-page#page-emulate-media
- https://playwright.dev/docs/api/class-page#page-set-viewport-size
- `node_modules/playwright-core/types/types.d.ts` (installed 1.62.1)
- `docs/foundations/directionality-and-logical-placement.md`
- `docs/foundations/reduced-motion.md`
- `docs/testing/visual-regression.md`

## Decision

Create an internal `e2e/fixtures/environment.ts` with separate pre-navigation browser/media setup
and post-navigation document attributes. It contains canonical viewport, theme, and media profiles;
it does not navigate, wait for UI, operate a component, or provide a public package API. Use it in
visual tests and characterize every configured browser/document value in a real Chromium test.

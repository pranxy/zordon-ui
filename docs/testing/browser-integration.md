# Browser integration testing

Playwright provides the real-browser test layer for `@pranxy/zordon-ui`. The Angular documentation application hosts stable test-only fixtures under `/__zordon-tests__/`; those fixtures are not library APIs or component examples.

## Commands

```sh
# Required pull-request gate
npm run test:browser

# Accessibility scenarios only
npm run test:a11y

# Production SSR response and hydration scenarios
npm run test:ssr

# Compare the dedicated visual matrix with committed baselines
npm run test:visual

# Full locally installed desktop-browser matrix
npm run test:browser:all

# Interactive Playwright UI
npm run test:browser:ui
```

The default gate runs Chromium. The full command runs Chromium, Firefox, and WebKit projects. The dedicated visual project is deliberately excluded from both commands and runs through `test:visual`. CI uses one worker, retries failures twice, retains traces and videos for failures, and publishes the HTML report as an artifact.

Accessibility scenarios use `@axe-core/playwright` and attach the complete axe JSON result to the Playwright report. The shared fixture runs WCAG 2.0, 2.1, and 2.2 A/AA-tagged rules. Automated results must be paired with the [manual accessibility review template](manual-accessibility-review-template.md).

Theme and responsive screenshot coverage follows the [visual regression testing policy](visual-regression.md). Visual baselines are generated and compared on Windows to avoid cross-platform font-rendering noise.

## Coverage layers

Every interactive component must add scenarios to the applicable layer:

- focus entry, focus order, focus trapping, and focus restoration;
- Enter, Space, Escape, arrows, Home, End, Page Up, and Page Down where the interaction pattern requires them;
- pointer and touch behavior for interactions that are not keyboard-only;
- overlay positioning, outside interaction, scroll behavior, and cleanup;
- native form submission, Angular form state, validation, reset, and disabled behavior;
- SSR response content, hydration without mismatch errors, and post-hydration interaction;
- LTR/RTL, reduced motion, forced colors, themes, and responsive viewports where relevant.

The documentation fixture covers Angular boot, deterministic focus movement, native dialog Escape/focus restoration, and native form validation/submission. The separate SSR example verifies meaningful server HTML, a JavaScript-disabled render, hydration without browser errors, post-hydration interaction, and an axe scan. Component-specific scenarios extend these foundations as implementations are added.

The focus-management compatibility fixture additionally verifies native `:focus-visible`, CDK
initial focus, bidirectional Tab wrapping, focus-origin classes, destruction cleanup, and trigger
restoration. Its [foundation contract](../foundations/focus-management.md) explains why real-browser
evidence is required and which modal, overlay, SSR, and nesting behavior remains component-owned.

The dismissal compatibility fixture verifies controlled native-dialog cancellation plus public CDK
outside and keyboard streams: inside/origin exclusion, descendant Escape veto, modifier,
composition and repeat filtering, drag-across-boundary behavior, uninterrupted outside actions, and
detach cleanup. Nested one-event/one-surface arbitration remains an explicit requirement of the
pending overlay stack; see the
[dismissal foundation](../foundations/dismissal-and-outside-interaction.md).

The private overlay fixture uses real CDK portals and layout. It verifies connected-position
fallback at a viewport edge, viewport margin, scroll-driven repositioning, pane theme forwarding,
Escape/backdrop routing, pane/backdrop attachment, and final container cleanup. This is source-level foundation
evidence, not proof that independently packaged component entry points share one registry or that a
real component satisfies its hydration, focus, directionality, and accessibility policy. See the
[overlay foundation](../foundations/overlay-host-and-positioning.md).

The body-lock scenario covers two sibling blockers, arbitrary release order, background-wheel
suppression, inner overlay scrolling, exact page-position restoration, representative layout
stability, consumer state preservation, and cleanup. Desktop execution does not establish physical
iOS/Android keyboard, rubber-band, toolbar, safe-area, or visual-viewport behavior; see the
[body scroll-lock foundation](../foundations/body-scroll-lock.md).

The private overlay scenario also opens a logical-start panel in an Angular CDK `Dir` scope. It
asserts initial LTR host/content direction, changes the same scope to RTL while the overlay remains
open, and verifies right-edge alignment and portaled injected direction. The first published
consumer must repeat the direction scenario with its own API and supported-browser matrix; see the
[directionality foundation](../foundations/directionality-and-logical-placement.md).

The reduced-motion fixture keeps semantic state independent of presentation. It proves a decorative
transform and transition exist only under `no-preference`, then changes the emulated preference to
`reduce` while the state remains active and verifies the motion disappears without resetting ARIA,
text, or component state. Every animated component still owns its interruption, cancellation,
lifecycle, and SSR/hydration scenarios; see the
[reduced-motion foundation](../foundations/reduced-motion.md).

The production SSR fixture also provides the real-browser live-accessibility baseline. It verifies
a pre-existing native status region, one coherent post-hydration update without moving focus,
deterministic consumer-first hint/error relationships, valid/invalid transitions, and absence of
CDK global announcer/describer containers during server rendering. DOM and axe checks cannot prove
spoken output; each consuming component retains the manual screen-reader matrix in the
[live-accessibility foundation](../foundations/live-announcements-and-descriptions.md).

The Angular Forms compatibility spec uses a deliberately test-only composite accessor to pin the
framework pipeline: non-emitting programmatic writes, user change versus logical touch, blur/submit
update strategies, reset, initial and later disabled propagation, async pending/stale-result
behavior, state classes, and destroy cleanup. It is characterization evidence, not a Zordon base
class. The production SSR fixture separately uses Angular's built-in native input accessor and
proves submitted/touched error eligibility, Forms-owned disabling, reset, stable error IDs, and a
clean hydration. The first native directive and composite control must repeat the component-specific
matrix in the [form-control foundation](../foundations/form-control-behavior.md).

The async-action fixture is deliberately consumer-owned rather than a library task runner. It uses
controllable deferred work to prove synchronous single-flight activation, retry after success and
failure, cooperative cancellation, replacement with stale completion/finally suppression,
focusable pending semantics, explicit-disabled preservation, and form-level duplicate guards. The
first published action component must repeat those races through its real public API and add
pre-hydration event replay, package, and manual assistive-technology evidence; see the
[async-action foundation](../foundations/async-actions.md).

## Test authoring rules

- Prefer accessible roles, names, labels, and public component harnesses over CSS implementation selectors.
- Use `data-testid` only for test-fixture boundaries or elements without an appropriate user-facing locator.
- Test public behavior rather than private Angular state.
- Keep each test independent and safe to run in parallel.
- Record a regression test before fixing an interaction defect.
- Run the full browser matrix before widening the supported browser policy or releasing a candidate.

## Upstream references

- [Playwright web server configuration](https://playwright.dev/docs/test-webserver)
- [Playwright browser projects](https://playwright.dev/docs/test-projects)
- [Playwright continuous integration](https://playwright.dev/docs/ci)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [W3C accessibility evaluation overview](https://www.w3.org/WAI/test-evaluate/)

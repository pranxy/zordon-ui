# Browser integration testing

Playwright provides the real-browser test layer for `@pranxy/zordon-ui`. The Angular documentation application hosts stable test-only fixtures under `/__zordon-tests__/`; those fixtures are not library APIs or component examples.

## Commands

```sh
# Required pull-request gate
npm run test:browser

# Accessibility scenarios only
npm run test:a11y

# Full locally installed desktop-browser matrix
npm run test:browser:all

# Interactive Playwright UI
npm run test:browser:ui
```

The default gate runs Chromium. The full command runs Chromium, Firefox, and WebKit projects. CI uses one worker, retries failures twice, retains traces and videos for failures, and publishes the HTML report as an artifact.

Accessibility scenarios use `@axe-core/playwright` and attach the complete axe JSON result to the Playwright report. The shared fixture runs WCAG 2.0, 2.1, and 2.2 A/AA-tagged rules. Automated results must be paired with the [manual accessibility review template](manual-accessibility-review-template.md).

## Coverage layers

Every interactive component must add scenarios to the applicable layer:

- focus entry, focus order, focus trapping, and focus restoration;
- Enter, Space, Escape, arrows, Home, End, Page Up, and Page Down where the interaction pattern requires them;
- pointer and touch behavior for interactions that are not keyboard-only;
- overlay positioning, outside interaction, scroll behavior, and cleanup;
- native form submission, Angular form state, validation, reset, and disabled behavior;
- SSR response content, hydration without mismatch errors, and post-hydration interaction;
- LTR/RTL, reduced motion, forced colors, themes, and responsive viewports where relevant.

The initial fixture covers Angular boot, deterministic focus movement, native dialog Escape/focus restoration, and native form validation/submission. SSR and hydration scenarios remain pending until the SSR example is added.

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

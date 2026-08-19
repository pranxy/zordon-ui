# Browser environment test fixtures

The internal Playwright helper at `e2e/fixtures/environment.ts` gives component tests one explicit,
test-only way to configure representative viewport, theme, direction, motion, and forced-colors
conditions. It is not part of `@pranxy/zordon-ui`, does not navigate, and does not perform component
interactions.

## Use the two phases in order

Call `prepareZordonTestEnvironment` before navigation. It sets a canonical viewport and media
profile. After the test page loads, call `applyZordonDocumentEnvironment` to set the document's
`data-theme` and `dir` attributes.

```ts
await prepareZordonTestEnvironment(page, 'mobile', ZORDON_TEST_MEDIA_PROFILES.forcedColors);
await page.goto('/__zordon-tests__/browser');
await applyZordonDocumentEnvironment(page, { direction: 'rtl', theme: 'corporate' });
```

The profiles deliberately keep independent concerns separate:

| Concern        | Fixture contract                                                     | Does not prove                                                                                          |
| -------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Theme          | Exact daisyUI `data-theme` boundary                                  | The operating-system color scheme or theme-controller persistence                                       |
| Direction      | Native/CSS document `dir` for LTR/RTL rendering                      | Live nested Angular `Dir` or CDK overlay directionality                                                 |
| Viewport       | Canonical desktop `1280×900` and mobile `390×844` CSS-pixel profiles | Physical-device browser chrome, safe areas, or virtual keyboards                                        |
| Reduced motion | `prefers-reduced-motion` emulation                                   | Component lifecycle cancellation or semantic-motion policy unless that component test asserts it        |
| Forced colors  | `forced-colors` media-query emulation                                | Native Windows high-contrast rendering, screen-reader output, or physical-device accessibility settings |

`colorScheme` is available for tests that genuinely exercise `prefers-color-scheme`, but it is not a
daisyUI theme selector. Tests must set both deliberately when they need both conditions.

## Authoring rules

- Use the helper only for environment setup. Navigate explicitly and wait for a visible,
  component-owned ready state in the test.
- Assert the behavior affected by each profile. A media query matching is a fixture characterization,
  not proof that a component is usable in forced colors or reduced motion.
- Use a component's real `Dir` scope when testing live direction changes, CDK positioning, or portal
  injection; do not rely on raw `html[dir]` for that behavior.
- Keep visual tests deterministic with the reduced-motion profile and their existing animation
  suppression. Do not take ordinary color snapshots under forced-colors emulation.
- Browser emulation complements the [manual accessibility review](manual-accessibility-review-template.md);
  it does not replace physical Windows high-contrast, mobile, or assistive-technology checks.

## Required component coverage

Apply only the profiles relevant to the component's published behavior, then add the corresponding
semantic, keyboard/focus, layout, and accessibility assertions. The shared fixture lowers setup
drift; it does not reduce the component's obligations in the
[browser integration policy](browser-integration.md) or the
[visual regression policy](visual-regression.md).

## References

- [Playwright media emulation](https://playwright.dev/docs/api/class-page#page-emulate-media)
- [Playwright viewport sizing](https://playwright.dev/docs/api/class-page#page-set-viewport-size)
- [Directionality foundation](../foundations/directionality-and-logical-placement.md)
- [Reduced-motion foundation](../foundations/reduced-motion.md)

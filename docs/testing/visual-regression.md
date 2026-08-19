# Visual regression testing

Playwright protects the daisyUI styling contract with committed Chromium reference images. The suite renders the stable browser fixture rather than documentation navigation or legacy component examples.

## Covered matrix

The initial matrix includes:

- daisyUI `light` and `dark` themes at desktop and mobile breakpoints;
- `corporate` as the representative low-radius theme;
- `cupcake` as the representative high-radius theme;
- `zordon-visual` as a consumer-defined theme with custom semantic colors and geometry;
- the light theme with a modal dialog open.

Each component should extend this matrix only with representative visual boundaries: materially different variants, sizes, responsive layouts, theme behavior, and interactive states. Avoid snapshots that differ only in content.

Start each component's selection with the
[visual story matrix template](../templates/visual-story-matrix-template.md). It records why each
public visual boundary is represented, grouped, or inapplicable, and keeps forced-colors,
keyboard/focus, screen-reader, mobile, and SSR evidence outside ordinary screenshot claims.

## Commands

```sh
# Compare the current fixture with committed reference images
npm run test:visual

# Intentionally replace reference images after reviewing the rendered change
npm run test:visual:update
```

Reference images live under `e2e/__screenshots__/`. Updating them is a reviewable product change: inspect every changed PNG, explain the intended difference in the pull request, and never approve a failed snapshot by updating it blindly.

## Determinism policy

The visual project uses Playwright Chromium, a fixed viewport, reduced motion, disabled animations, hidden carets, CSS-pixel screenshots, and Arial in the isolated fixture. Snapshot comparison runs on `windows-latest` in CI because text and native-control rendering can differ across operating systems. Ordinary browser behavior tests remain OS-independent and run separately.

The suite uses the internal [environment test fixtures](environment-test-fixtures.md) for its
canonical desktop/mobile viewport, reduced-motion, light/dark/custom theme, and LTR setup. It does
not take standard color snapshots under forced-colors emulation; those scenarios require semantic
browser assertions and the component's manual high-contrast review.

The pixel tolerance absorbs small anti-aliasing differences; it is not intended to hide layout or theme regressions. A legitimate platform expansion should create and maintain an explicit platform-specific baseline rather than loosening the global tolerance.

## Failure workflow

1. Open the expected, actual, and diff images from `test-results/playwright/` or the CI Playwright report.
2. Decide whether the difference is an intended API/theme change, an unstable fixture, or a regression.
3. Fix regressions and sources of instability first.
4. For an intended change, run `npm run test:visual:update`, inspect every changed baseline, and rerun `npm run test:visual`.

## Upstream references

- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright test configuration](https://playwright.dev/docs/test-configuration)
- [Playwright continuous integration](https://playwright.dev/docs/ci)

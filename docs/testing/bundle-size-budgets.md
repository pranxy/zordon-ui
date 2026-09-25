# Bundle-size budgets

Zordon UI applies separate size gates to the documentation application and the published Angular package.

## Documentation application

The Angular application builder enforces its `initial` and `anyComponentStyle` budgets from `angular.json`. These measure the complete documentation application and are intentionally independent from the library package budgets.

The documentation application has a 450 KiB initial warning threshold and a 470 KiB error threshold.

- **Original calibration:** 360 KiB warning / 410 KiB error, against a measured 400.47 KiB production bundle (103.28 KiB estimated transfer size).
- **2026-09-23 re-measurement:** the site design system (`projects/docs/DESIGN_SYSTEM.md`) replaced the single shell component with composable shell components (utility bar, primary and mobile navigation, side navigation with maturity dots and legend, nested table of contents, breadcrumbs, card pager) plus global design tokens and primitives. The production initial bundle measured 444.77 kB (434.3 KiB) with a 118.51 kB estimated transfer size. Framework code is unchanged (about 339 kB); site code grew from about 16 kB to 43 kB and global CSS from 50.5 kB to 62.5 kB. The search dialog is deferred until idle and component-card summaries load only with the catalogue page to limit the increase.
- **2026-09-25 reduction:** 23 component reference pages had grown the bundle to 453.6 kB, about 0.35 kB per page (its catalogue entry, description and route loader). The documentation application now runs zoneless (`provideZonelessChangeDetection`, no `zone.js` polyfill; the SSR example keeps zone.js), saving 37.6 kB. Its global stylesheet no longer compiles the daisyUI classes only the browser test fixture renders (Avatar, Badge, Card, Divider modifiers, Link); that fixture compiles them itself, saving 13.7 kB. The initial bundle measures 402.3 kB. Thresholds are unchanged; the remaining 45 catalogue pages are expected to add about 16 kB.
- **Rationale:** the warning sits just above the measurement so any further growth is visible, and the error leaves about 25 kB of headroom for the remaining shell work.

These thresholds must not be raised without a new measurement and documented rationale.

## Library entry points

After the production library build, `tools/check-package-budgets.mjs` reads the generated Angular Package Format exports from `dist/components/package.json`. It measures each exported FESM file as:

- raw bytes, representing the emitted ESM artifact;
- gzip level-9 bytes, approximating compressed transfer size.

Source maps, declarations, licenses, and package metadata are excluded because they are not runtime JavaScript. Angular framework and peer dependencies are also excluded because ng-packagr leaves them external.

Budgets are defined in `bundle-size-budgets.json`:

| Entry-point class           | Maximum raw | Maximum gzip | Purpose                                                           |
| --------------------------- | ----------: | -----------: | ----------------------------------------------------------------- |
| Primary `.`                 |      50 KiB |       15 KiB | Shared public contracts and intentionally convenient root exports |
| Component secondary default |      40 KiB |       12 KiB | Every component entry point added in the future                   |
| `./testing`                 |      80 KiB |       24 KiB | Harnesses and test helpers, excluded from production imports      |
| `./signal-forms`            |      40 KiB |       12 KiB | Optional experimental forms integration                           |

Every generated runtime export except `./package.json` must resolve to an `.mjs` artifact. The primary export is mandatory. Secondary entry points are discovered automatically, so adding one cannot bypass the default budget; an exact override is used only when documented in the budget configuration.

These thresholds are guardrails, not targets. A component should remain as small as its behavior permits. Raising a limit requires a measured explanation, API review, and an update to this document.

## Commands

```sh
# Build the library and check all package entry points
npm run test:bundle-size

# Check an existing production build
npm run check:bundle-size

# Test the budget checker itself
npm run test:tooling
```

CI builds the library once, tests the checker, and then evaluates the generated package. Any raw or gzip violation fails the job and prints the measured and allowed sizes.

## Upstream references

- [Angular build budgets](https://angular.dev/tools/cli/build#configuring-size-budgets)
- [Angular library build behavior](https://angular.dev/cli/build)

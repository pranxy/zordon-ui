# Bundle-size budgets

Zordon UI applies separate size gates to the documentation application and the published Angular package.

## Documentation application

The Angular application builder enforces its `initial` and `anyComponentStyle` budgets from `angular.json`. These measure the complete documentation application and are intentionally independent from the library package budgets.

The legacy documentation application currently exceeds its 500 KiB initial warning threshold but remains below the 1 MiB error threshold. This warning is tracked in the build plan and must not be silenced by raising the threshold without an evidence-based replacement.

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

# Contributing to Zordon UI

Thank you for improving Zordon UI. This repository is rebuilding its Angular APIs from the tracked
product and architecture decisions; legacy component source is reference material, not the public
contract.

Before starting, read the [build plan](DAISYUI_ANGULAR_BUILD_PLAN.md), the relevant
[architecture decisions](docs/architecture/README.md), and the focused policies under
[`docs/contributing/`](docs/contributing/README.md).

## Prepare the workspace

Use Node 22.22.3+ or Node 24.15.0+ within those major lines, then install the exact lockfile:

```shell
npm ci
```

Useful baseline commands are:

```shell
npm run build:lib
npm run test:lib:types
npm run test:lib:coverage
npm run lint:lib
npm run format:check
```

## Choose and specify work

1. Select an item from `DAISYUI_ANGULAR_BUILD_PLAN.md` and check its dependencies and phase.
2. For a component, satisfy the plan's Definition of Ready before implementation. Record the
   daisyUI surface, Angular API shape, accessibility pattern, state/forms behavior, customization
   hooks, SSR implications, examples, and test scenarios.
3. Use the accepted ADRs for shared conventions. Propose a new or superseding ADR when a change
   alters the public API model, supported platforms, dependencies, accessibility behavior,
   packaging, or another cross-component rule.
4. Record the component's maturity according to the
   [component maturity policy](docs/contributing/component-maturity.md).

Do not revive or export a legacy entry point merely because source exists for it. New exports must
follow the [entry-point acceptance rules](docs/architecture/entry-points.md).

## Implementation expectations

Library changes must preserve the accepted contracts:

- standalone Angular declarations, OnPush change detection, signal-based public state, and native
  template control flow;
- native HTML semantics and events before custom widget behavior;
- `@angular/aria` directives before custom keyboard, focus, selection, expansion, tree, grid,
  listbox, menu, tabs, toolbar, or typeahead code when a documented pattern fits; keep the preview
  dependency behind Zordon public APIs and follow the
  [Angular Aria adoption guide](docs/foundations/angular-aria-adoption.md);
- controlled state for stateful APIs and Angular Forms behavior where the component represents a
  value;
- additive consumer classes/styles, documented CSS variables or parts, and configurable daisyUI
  class prefixes;
- Angular host class-map bindings for library-owned tokens; never replace or reconstruct a
  consumer's complete class attribute;
- native Angular style bindings for per-instance values; never shadow `style`, accept arbitrary raw
  CSS, use library-owned `!important`, or reconstruct a consumer's complete style attribute;
- component-specific named part selectors and functional directives for projected anatomy;
  document cardinality and ownership, keep markers static, and follow the
  [named parts and slots convention](docs/foundations/named-parts-and-slots.md);
- WCAG 2.2 AA-oriented behavior, keyboard and focus support, RTL, reduced motion, localization,
  SSR, and hydration safety;
- intentional public exports only, partial-Ivy packaging, tree shaking, cleanup, and no accidental
  global side effects.

Any new or changed public surface requires the
[public API review](docs/contributing/api-review.md). Stable API changes also follow the
[deprecation and breaking-change policy](docs/contributing/deprecation-policy.md).

## Validate the change

Run the smallest applicable set locally; pull-request CI remains authoritative and may run more.

| Change                                         | Required local checks                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Any tracked file                               | `npm run format:check`                                                                                                      |
| Library source or public API                   | `npm run lint:lib`, `npm run test:lib:types`, `npm run test:lib:coverage`, `npm run build:lib`, `npm run check:bundle-size` |
| Repository/release tooling                     | `npm run test:tooling`; add `npm run release:dry-run` when package contents or publishing behavior changes                  |
| Browser interaction, forms, focus, or overlays | `npm run typecheck:browser`, `npm run lint:browser`, `npm run test:browser`                                                 |
| SSR or hydration behavior                      | `npm run test:ssr`                                                                                                          |
| Intentional visual output                      | `npm run test:visual`; use `npm run test:visual:update` only to regenerate reviewed baselines                               |
| Documentation application                      | `npm run build:docs`                                                                                                        |

When a visual baseline changes, inspect the image rather than approving it from a passing command
alone. Commit approved files under `e2e/__screenshots__/`; generated Playwright reports and failure
artifacts remain ignored. Library tests follow the
[unit-testing and coverage contract](docs/testing/unit-testing-and-coverage.md): exercise observable
behavior, and do not use exclusions or line-execution-only tests to satisfy the per-file gate.

## Document and track the result

- Update the affected build-plan checkbox, component matrix cells, notes, and progress log in the
  same change as the verified work.
- Add API reference, examples, accessibility guidance, customization guidance, and migration notes
  required by the component Definition of Done.
- Update architecture or testing guides when their contract changes; do not leave the only
  explanation in a pull-request discussion.
- Add or update visual baselines only for intentional rendering changes.

## Add release intent

For every consumer-visible change to the published package, run:

```shell
npm run changeset
```

Select `@pranxy/zordon-ui`, choose the SemVer impact, and describe the change in consumer language.
Breaking changes must include or link migration instructions. Documentation, tests, CI, and
repository-only tooling may use an empty changeset or omit one when they cannot affect the packed
library. See the [release guide](docs/guides/releasing.md) for version preparation and prereleases.

## Pull-request readiness

A change is ready for review when:

- its plan/spec scope is clear and unrelated cleanup is excluded;
- applicable checks pass and any intentionally skipped gate is explained;
- public API review evidence is included when the consumer contract changes;
- accessibility and manual verification evidence is recorded where applicable;
- documentation, maturity, matrix status, visual baselines, and changeset agree with the code;
- no generated reports, credentials, deep imports, accidental exports, or unrelated legacy files
  are included.

Review approval does not by itself make a component stable. Maturity changes require the explicit
criteria in the component maturity policy.

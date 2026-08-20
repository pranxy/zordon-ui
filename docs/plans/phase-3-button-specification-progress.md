# Phase 3 Button specification progress

**Row:** ACT-01 Button
**Status:** In progress
**Last updated:** 2026-08-19

## Deliverable

The planned Button is a native-host `[zdButton]` directive, not a replacement control. Its specification fixes the semantic host boundary, public input vocabulary, default precedence, native disabled ownership, controlled loading/pressed behavior, class candidates, accessibility, form boundary, SSR, and Preview evidence.

## Decisions recorded

- Supported hosts are `button`, `a[href]`, and `input[type=button|submit|reset]`; role-button emulation is prohibited.
- `variant`, not `style`, owns daisyUI appearance modifiers so native `[style]` stays available.
- `layout` is one exclusive union for wide/block/square/circle.
- `color`, `variant`, `size`, and `layout` are the only candidates for typed application defaults.
- Native disabled remains authoritative; `zdDisabled` is link-only and does not remove `href`.
- `loading` is controlled presentation and host activation guarding only; it does not own work or form submission deduplication.
- There is no default spinner, icon slot, output, CVA, Angular Aria dependency, or generated ID.

## Completion evidence

- [x] Installed daisyUI 5.7.16 Button source reviewed for documented base, color, variant, size, layout, active, and disabled tokens.
- [x] Defaults, async-action, class-prefix, customization, motion, SSR, and maturity contracts applied to Button's boundary.
- [x] Planned public API and Preview evidence matrix documented in [Button](../components/button.md).
- [x] Matrix specification cell and plan log updated.

## Remaining to component completion

- Prove actual browser and SSR/hydration behavior, including event replay and native submit/link boundaries.
- Complete automated and manual accessibility evidence, visual stories, and the public API review.
- Promote documentation and visual matrix cells only after those component-facing gates pass.

## Implementation tracker

Template loaded from: `implement-plan/assets/progress-tracker-template.md`

| ID  | Requirement                                                              | Deps          | Status   | Acceptance check                                                                                                        |
| --- | ------------------------------------------------------------------------ | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| T01 | Add the Button secondary entry point and intentional public declarations | Specification | Verified | Partial-Ivy package builds `@pranxy/zordon-ui/button` without legacy exports                                            |
| T02 | Add native-host class/state behavior                                     | T01           | Verified | Unit tests prove modifiers, consumer class composition, pressed, disabled-link, loading, and enabled-default boundaries |
| T03 | Add typed Button application defaults through `provideZordonUi(...)`     | T01           | Verified | Omitted/global/local/reset/invalid/duplicate/immutable defaults tests pass                                              |
| T04 | Add type, package, API, browser/SSR, a11y, and visual evidence           | T01–T03       | Pending  | All applicable matrix gates and public API review are recorded                                                          |

No subagent was used: the workspace instruction requires the primary agent to keep this shared
implementation and its tracker serialized.

## Implementation evidence

- `test:lib:coverage`: 122 tests passed; 100% enforced per-file coverage.
- `test:lib:types`, `lint:lib`, `build:lib`, `test:tooling`, `check:api`, and package-budget/dry-run
  checks passed.
- The Button entry has its own generated API Extractor report. Its imports of root types resolve
  against built APF declarations during extraction, not TypeScript source paths.

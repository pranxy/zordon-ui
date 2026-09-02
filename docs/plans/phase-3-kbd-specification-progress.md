# Phase 3 Kbd specification progress

**Row:** DSP-13 Kbd  
**Status:** Partial — automated evidence verified; manual accessibility review remains
**Last updated:** 2026-09-02

Template loaded from: `implement-plan/assets/progress-tracker-template.md`

| ID  | Requirement                                                            | Deps    | Status   | Acceptance check                                                       | Evidence                                                   |
| --- | ---------------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| T01 | Record exact daisyUI candidates, CSS internals, and official examples  | —       | Verified | 5.7.16 inventory has only base and five size candidates                | `.progress/kbd-specification-research.md`                  |
| T02 | Define native host, public API, and ownership boundary                 | T01     | Verified | `<kbd>` semantics and an optional typed size candidate are explicit    | `docs/components/kbd.md`                                   |
| T03 | Define customization, accessibility, platform, and evidence boundaries | T01–T02 | Verified | Consumer ownership and Preview evidence are explicit                   | `docs/components/kbd.md`                                   |
| T04 | Approve the DSP-13 specification cell                                  | T01–T03 | Verified | Master row records the approved specification                          | `DAISYUI_ANGULAR_BUILD_PLAN.md`                            |
| T05 | Package native Kbd directive                                           | T04     | Verified | Public entry point, tests, API report, bundle, and package checks pass | `projects/components/kbd/`, `etc/api/zordon-ui-kbd.api.md` |
| T06 | Add browser, SSR/hydration, axe, and visual evidence                   | T05     | Verified | Native Kbd semantics survive supported render paths                    | `e2e/`, `docs/components/kbd-accessibility-review.md`      |

No subagent was used: the shared workspace remains serialized by instruction.

## Review

| Checkpoint             | Reviewer            | Findings                                                                                                                          | Disposition | Closure                                                                      |
| ---------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| Specification boundary | Parent scope review | Native Kbd and consumer-owned shortcut semantics avoid an unsupported interaction abstraction                                     | Validate    | Clear; independent review unavailable under serialized-workspace instruction |
| Package boundary       | Parent scope review | Native selector, typed upstream sizes, complete class prefixes, and no interaction surface match the approved specification       | Validate    | Clear; continue with render-path evidence                                    |
| Evidence boundary      | Parent scope review | Browser, SSR/hydration, axe, and visual checks prove native markup/class preservation only; shortcut meaning stays consumer-owned | Validate    | Clear; manual review remains required                                        |

## Next

Complete the manual accessibility review before advancing Kbd beyond Preview. Platform detection,
translated key dictionaries, shortcut registration, active state, and interactive behavior remain
separate consumer-owned concerns.

## T05 evidence

- `npm run lint:lib` passed.
- `npm run test:lib` passed: 31 test files and 177 tests.
- `npm run build:lib` passed, including `@pranxy/zordon-ui/kbd`.
- `npm run test:lib:types`, `npm run check:api`, and `npm run check:bundle-size` passed. The Kbd
  bundle is 2.09 KiB raw and 931 B gzip, below the secondary-entry-point budget.
- The archive portion of `npm run release:package-dry-run` passed and contains the Kbd runtime and
  declaration artifacts. Its publish simulation stopped at expected missing npm authentication; no
  registry action was attempted.

## T06 evidence

- Focused Chromium browser and axe tests passed for the native inline and key-combination fixture.
- The production SSR build plus server-render and hydration tests passed, including Kbd host, class,
  text, and consumer-owned accessibility attributes.
- The Kbd dark RTL mobile baseline passed. The full visual suite also passed: 21 checks.
- Manual shortcut naming, surrounding-control keyboard order, forced colors, contrast, zoom/reflow,
  RTL, localized labels, and assistive-technology checks remain recorded in
  `docs/components/kbd-accessibility-review.md`.

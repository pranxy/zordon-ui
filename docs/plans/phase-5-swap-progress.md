# Phase 5 Swap progress

**Row:** ACT-05 Swap

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-14

**Commit:** `feat(swap): add native checkbox and controlled toggle states`

Swap is the next independent Phase 5 milestone. FAB remains dependent on the unimplemented Tooltip;
no claim is made that either dependency is delivered by this change.

The public `@pranxy/zordon-ui/swap` entry provides native root/input directives, decorative on/off/mixed
parts, fade/rotate/flip/custom effects, controlled button requests and read-only activation guards.
Native HTML owns Forms, keyboard and focus. Aria/CDK are not needed for this pattern.

| Task                                           | Status   | Evidence                                                                                   |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Specification, native ownership and public API | Verified | `docs/components/swap.md`                                                                  |
| Unit tests and per-file coverage               | Verified | 259 tests in 65 files; 100% all four dimensions across 61 implementation files             |
| Build, types, lint and package API             | Verified | Partial-Ivy entry, reviewed API report, library/browser types and lint                     |
| Tooling and package budgets                    | Verified | 64 tooling tests; 48 entry budgets; Swap 8.65 KiB raw / 1.88 KiB gzip; package dry-run     |
| Browser and axe                                | Verified | Full Chromium suite: 121 passing, including `e2e/swap.spec.ts`                             |
| SSR/hydration                                  | Verified | Full production SSR suite: eight passing, including native no-JavaScript and hydrated Swap |
| Visual regression                              | Verified | Full suite: 56 passing; light desktop and dark RTL mobile baselines inspected              |
| Manual accessibility                           | Pending  | `docs/components/swap-accessibility-review.md`                                             |

The package exports the required `swap/swap.css` stylesheet as a side effect, preserving it in packed
artifacts. Fixture CSS stays lazy and build limits are unchanged. Carousel's test-only candidates
now compile with its fixture; the complete browser and visual suites pass without changing existing
baselines. Swap's fixture uses separate base, effect and supplemental stylesheets to stay within the
per-file build limits. No dependency versions changed.

The production docs initial bundle is 409.67 kB (410 kB hard limit); production SSR is 310.82 kB.
Both remain above their advisory initial warnings. SSR fixture styles of 6.45 kB and 4.25 kB exceed
their 4 kB advisory warning but remain below the unchanged 8 kB hard limit. Library, docs and SSR
builds pass; docs unit tests pass (nine tests). Library/docs/browser/SSR lint, library/browser types,
complete API comparison, touched-file formatting and whitespace checks pass.

Angular 21.0, Angular 22, Firefox, WebKit and human/device review remain unverified.

Automated delivery is **45/68**; overall maturity remains **0/68 Done**. No commit or publish was performed.

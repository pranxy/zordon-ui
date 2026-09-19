# Phase 5 Skeleton progress

**Row:** FDB-05 Skeleton

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-19

**Commit:** `feat(skeleton): add placeholder shapes and loading region semantics`

The `@pranxy/zordon-ui/skeleton` entry provides decorative text/rectangle/circle/custom shapes,
CSS dimensions/radius/clipping, multiline placeholders, paragraph/avatar-text/card presets,
shimmer/pulse/static modes and configurable duration. A separate native-host directive binds
aria-busy on consumer regions. Artwork stays aria-hidden and inert; active visibility, actual
content and region state remain explicitly controlled. ADR 0016 records ownership and semantics.

| Task                              | Status   | Evidence                                                                                        |
| --------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide, ADR 0016, generated API report and type contracts                              |
| Unit tests and per-file coverage  | Verified | 312 tests in 74 files; 100% all four dimensions across 70 implementation files                  |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds        |
| Package/API/tooling               | Verified | Full API comparison; 71 tooling tests; 57 entry budgets; package publish dry-run                |
| Browser and axe                   | Verified | Full Chromium suite: 152 passing, including three Skeleton scenarios                            |
| SSR/hydration                     | Verified | Full production suite: 17 passing, including server busy state and hydrated content replacement |
| Visual regression                 | Verified | Full suite: 65 passing; two new light/dark baselines inspected                                  |
| Manual accessibility              | Pending  | `docs/components/skeleton-accessibility-review.md`                                              |

Skeleton is 12.46 KiB raw / 2.51 KiB gzip, below unchanged 40/12 KiB entry limits.
Production docs initial output is 403.33 kB and SSR is 312.60 kB, below unchanged 410 kB hard limits.
Existing initial and fixture CSS advisories remain. Dependencies, budgets and coverage thresholds
are unchanged. Nine docs unit tests pass.

Unit evidence covers default/decorative semantics, shapes, dimensions/radius/clipping, prefixes,
multiline/preset structure, invalid line counts and durations, active visibility and region state.
Browser tests check real daisy shimmer, pulse/none, duration changes, circle geometry, last-line
width, custom clipping, consumer focus retention, content replacement and full axe. Reduced
motion stops both animation families; forced colors adds static system outlines. Narrow RTL
layouts preserve containment.

Applications own data loading, errors, real content, focus, busy-region naming and announcements.
The fixture's status message sits outside the busy region. No region discovery, focus management,
timers, overlay or widget dependency is added. CSS dimensions and custom layouts remain consumer
responsibilities.

Manual AT, theme perception, high-contrast painting, animation comfort, zoom/reflow and physical
devices remain pending. Delayed event replay, incremental hydration, Angular 21.0/22 and
Firefox/WebKit lanes remain unverified. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **54/68**; overall
maturity remains **0/68 Done**. No commit or publish was performed. Toast is next.

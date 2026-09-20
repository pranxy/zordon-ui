# Phase 6 Breadcrumbs progress

**Row:** NAV-01 Breadcrumbs

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(breadcrumbs): add native navigation trails and overflow`

The `@pranxy/zordon-ui/breadcrumbs` entry provides a named native navigation trail with href and
RouterLink destinations, current-page semantics, decorative icon templates/separators, responsive
visual labels with complete accessible names, bounded middle disclosure, horizontal scrolling and
opt-in full-trail structured data. ADR 0019 records native navigation and canonical URL ownership.

| Task                              | Status   | Evidence                                                                                                          |
| --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide, ADR 0019, generated API report and type contracts                                                |
| Unit tests and per-file coverage  | Verified | 333 tests in 77 files; 100% all four dimensions across 73 implementation files                                    |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds                          |
| Package/API/tooling               | Verified | Full API comparison; 74 tooling tests; 60 entry budgets; package publish dry-run                                  |
| Browser and axe                   | Verified | Full Chromium suite: 165 passing, including four Breadcrumbs scenarios                                            |
| SSR/hydration                     | Verified | Final full production suite: 20 passing, including native no-JavaScript disclosure and hydrated Router navigation |
| Visual regression                 | Verified | Full suite: 68 passing; two light desktop/dark RTL mobile baselines inspected                                     |
| Manual accessibility              | Pending  | `docs/components/breadcrumbs-accessibility-review.md`                                                             |

Breadcrumbs is 19.88 KiB raw / 3.77 KiB gzip, below unchanged 40/12 KiB entry limits.
Production docs initial output is 404.27 kB and SSR is 320.11 kB, below unchanged 410 kB hard limits.
Existing advisory warnings remain. Dependencies, budgets and coverage thresholds are unchanged.
Nine docs unit tests pass.

Unit evidence covers trail limits/identity validation, current-page policy, empty/plain-text
trails, native and RouterLink navigation, query/fragment forwarding, prefix classes, decorative
templates, short labels, full structured ordering/URL validation and safe binding. Browser checks
cover keyboard disclosure, Escape/outside dismissal, focus restoration, native modified-click
policy (unit), Router navigation, narrow RTL containment, keyboard horizontal scrolling, reduced
motion, forced-color focus and axe. SSR verifies native disclosure without JavaScript, real link
destinations, full structured metadata and hydrated navigation.

The native disclosure remains local to its DOM/theme context. It does not use application menu
roles, a shared overlay stack or collision flipping. Consumers own unclipped/viewport-edge
placement, localized hierarchy, focus after programmatic structural changes and canonical URLs.
The metadata describes the full user-accessible trail; actual search eligibility and production
structured-data validation remain consumer responsibilities. CSS relies on native bidi mirroring
for separator text; visual review corrected an initial double mirror in RTL.

Manual AT, custom theme/icon contrast, physical touch devices, high-contrast painting, long
translations and 200%/400% zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22, delayed
event replay and incremental hydration remain unverified. Baseline: Angular 21.2.19,
CDK/Aria 21.2.14, daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **57/68**; overall maturity remains **0/68 Done**. No commit or publish was performed. Dock is next in Phase 6.

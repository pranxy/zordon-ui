# Phase 6 Dock progress

**Row:** NAV-02 Dock

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(dock): add responsive route-aware navigation`

The `@pranxy/zordon-ui/dock` entry provides native navigation with RouterLinkActive synchronization,
manual current-page overrides, disabled destinations, decorative icon templates, meaningful badge
names, five sizes, three placement modes, responsive labels/visibility and native horizontal
overflow. ADR 0020 records navigation semantics and application-owned placement boundaries.

| Task                             | Status   | Evidence                                                                                         |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| Specification and public API     | Verified | Component guide, ADR 0020, generated report and type contracts                                   |
| Unit tests and per-file coverage | Verified | 338 tests in 78 files; 100% all four dimensions across 74 implementation files                   |
| Types, lint and builds           | Verified | Library/browser types; library/docs/SSR/browser lint; all three production builds                |
| Package/API/tooling              | Verified | Full API comparison; 75 tooling tests; 61 entry budgets; package publish dry-run                 |
| Browser and axe                  | Verified | Full Chromium suite: 169 passing, including four Dock scenarios                                  |
| SSR/hydration                    | Verified | Full production suite: 21 passing, including no-JavaScript destinations and hydrated route state |
| Visual regression                | Verified | Full suite: 69 passing; two light desktop/dark RTL mobile baselines inspected                    |
| Manual accessibility             | Pending  | `docs/components/dock-accessibility-review.md`                                                   |

Dock is 15.54 KiB raw / 3.11 KiB gzip, below unchanged 40/12 KiB limits. Production docs initial
output is 404.38 kB and SSR is 323.34 kB, below unchanged 410 kB hard limits. Existing advisory
warnings remain. Nine docs unit tests pass. Dependencies, budgets and coverage thresholds are unchanged.

Unit evidence covers identity/destination validation, empty and href-only operation without Router,
route matching, query/fragment forwarding, manual override/reset, all sizes, prefix classes,
disabled entries, badge zero/names, icon context and native modified clicks. Browser evidence
covers Tab/Enter, unavailable destinations, horizontal keyboard scrolling, narrow RTL containment,
responsive visibility/labels, fixed reservation, a simulated 24px safe area, sticky containment,
reduced motion, forced-color focus and axe. Geometry assertions wait for Angular signal rendering.

The component has no Aria widget, overlay, action-button or tab-panel behavior. Applications own
route uniqueness, nonfocusable icon templates, localized names, page clearance and containing
blocks. Label hiding retains visible text when an item has no icon. Badge updates are not live
announcements; responsive hiding requires application focus policy.

Manual AT, theme/icon contrast, physical notches/touch devices, high-contrast painting, long
translations and 200%/400% zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22, delayed
event replay and incremental hydration remain unverified. Baseline: Angular 21.2.19,
CDK/Aria 21.2.14, daisyUI 5.7.16. Overall maturity remains 0/68 Done.

Touched-file formatting and whitespace checks pass. Automated delivery is **58/68**. No commit or publish was performed. Megamenu is next in Phase 6.

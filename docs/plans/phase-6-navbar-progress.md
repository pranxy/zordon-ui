# Phase 6 Navbar progress

**Row:** NAV-06 Navbar

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(navbar): add responsive native navigation layout`

The `@pranxy/zordon-ui/navbar` entry provides a named native navigation landmark with projected
start/center/end regions, static/sticky/fixed positioning and transparent surfaces. Responsive
content uses CSS visibility at 48rem. A native toggle requests controlled panel state without
owning panel focus or overlays. Projected Router links retain current-page behavior. ADR 0023
records the semantic and composition boundaries.

| Task                             | Status   | Evidence                                                                                   |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Specification and public API     | Verified | Component guide, ADR 0023, generated API report and type contracts                         |
| Unit tests and per-file coverage | Verified | 349 tests in 81 files; 100% all four dimensions across 77 implementation files             |
| Types, lint and builds           | Verified | Library/browser types; library/docs/SSR/browser lint; three production builds              |
| Package/API/tooling              | Verified | Full API comparison; 78 tooling tests; 64 entry budgets; completed package publish dry-run |
| Browser and axe                  | Verified | Full Chromium suite: 181 passing, including four Navbar scenarios                          |
| SSR/hydration                    | Verified | Full production SSR/hydration suite: 24 passing                                            |
| Visual regression                | Verified | Full suite: 72 passing; new light desktop/dark RTL mobile baselines inspected              |
| Manual accessibility             | Pending  | `docs/components/navbar-accessibility-review.md`                                           |

Navbar is 10.11 KiB raw / 2.14 KiB gzip, below unchanged 40/12 KiB entry limits. Production docs
initial output is 405.00 kB and SSR is 323.66 kB, below unchanged 410 kB hard limits. Existing
advisory warnings remain. Nine docs unit tests pass. Dependencies, budgets and coverage thresholds
are unchanged.

Unit evidence covers native projection, default center content, prefix classes, state inputs,
Router current-page markers, SSR-safe defaults, toggle request acceptance boundaries and native/
synthetic disabled suppression. Browser checks native keyboard order, Enter/Space, controlled
rejection, owner Escape and navigation closure/focus, sticky scroll geometry, fixed viewport
placement, transparent background, responsive visibility, RTL, forced-color focus and axe.

The mobile fixture starts expanded, so its destinations are usable without JavaScript. Native
links and CSS layout need no hydration; toggle interaction does. Applications own panel identity,
focus when closing or resizing, route closure policy, projected-control styles and transparent
surface contrast. Fixed positioning does not reserve height; owners account for content wrapping,
safe areas, stacking and scroll targets. Hidden responsive views remain initialized.

The Drawer integration delivered here is the controlled toggle contract, verified against an inline
navigation panel. Concrete integration with Drawer focus/scroll/backdrop behavior will be verified
in LYT-02 after that component exists. No second overlay runtime, Router dependency, viewport
observer, roving-tabindex implementation or checkbox workaround is added.

Manual AT, custom theme/transparent contrast, physical touch, high-contrast painting, long labels,
device safe areas and 200%/400% zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22,
delayed event replay and incremental hydration remain unverified. Baseline: Angular 21.2.19,
CDK/Aria 21.2.14, daisyUI 5.7.16. Overall maturity remains 0/68 Done.

Touched-file formatting and whitespace checks pass. Automated delivery is **61/68**. No commit or publish was performed. Pagination is next in Phase 6.

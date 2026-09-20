# Phase 6 Steps progress

**Row:** NAV-08 Steps

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(steps): add native progress and controlled wizard navigation`

The `@pranxy/zordon-ui/steps` entry provides a named ordered progress list with optional native
buttons, controlled current-step requests, linear forward gating and explicit complete/current/
upcoming/error/disabled cues. It supports descriptions, decorative icons, eight colors, logical
RTL layout and responsive horizontal/vertical orientation. ADR 0025 records native semantics and
the consuming wizard's ownership of validation, panels and focus.

| Task                             | Status   | Evidence                                                                                      |
| -------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| Specification and public API     | Verified | Component guide, ADR 0025, generated API report and type contracts                            |
| Unit tests and per-file coverage | Verified | 360 tests in 83 files; 100% all four dimensions across 80 implementation files                |
| Types, lint and builds           | Verified | Library/browser types; library/docs/SSR/browser lint; three production builds                 |
| Package/API/tooling              | Verified | Full API comparison, 80 tooling tests, 66 entry budgets and completed package publish dry-run |
| Browser and axe                  | Verified | Full Chromium suite: 189 passing, including four Steps scenarios                              |
| SSR/hydration                    | Verified | Full production SSR/hydration suite: 26 passing                                               |
| Visual regression                | Verified | Full suite: 74 passing; light desktop/dark RTL mobile baselines inspected                     |
| Manual accessibility             | Pending  | `docs/components/steps-accessibility-review.md`                                               |

Steps is 16.87 KiB raw / 3.32 KiB gzip, below unchanged 40/12 KiB entry limits. Production docs
initial output is 405.43 kB and SSR is 324.06 kB, below unchanged 410 kB hard limits. Nine docs
unit tests pass. Fixture color CSS is 4.16 kB and retains an advisory SSR warning, below the
unchanged 8 kB hard limit. The fixture omits redundant generic daisyUI layout candidates because
Steps owns responsive geometry and marker rendering. Dependencies, budgets and coverage thresholds
are unchanged.

Unit evidence covers identity/current-ID validation, complete/current/error precedence, unavailable
items, icon template context, prefix-aware colors, localization, orientation, request rejection,
synthetic disabled activation and linear prerequisite behavior. Browser evidence verifies native
Tab/Enter/Space, rejected requests, native required validation, owner heading focus after accepted
progression, earlier-step access, combined current errors, all colors, 360px RTL containment,
explicit horizontal scrolling, forced-color focus and axe.

Server output contains meaningful ordered progress, descriptions, current/error state and disabled
buttons before hydration. Interaction requires hydration. The library does not render panels,
validate forms, fetch data, navigate routes or move focus. Linear mode controls button eligibility;
it does not block the owner's programmatic current state. Applications own completion consistency,
existing controls IDs, nonfocusable icon templates, async validation and panel announcements/focus.
No Aria widget, tab semantics, overlay, viewport observer or custom keyboard runtime is added.

Manual AT, custom theme/icon contrast, physical touch, high-contrast painting, long translations
and 200%/400% zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22, delayed event replay and
incremental hydration remain unverified. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16.
Overall maturity remains 0/68 Done.

Touched-file formatting and whitespace checks pass. Automated delivery is **63/68**. No commit or publish was performed. Tabs is next in Phase 6.

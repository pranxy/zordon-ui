# Phase 5 Tooltip progress

**Row:** FDB-07 Tooltip

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-14

**Commit:** `feat(tooltip): add accessible help and shared overlay integration`

The Angular 21 `@pranxy/zordon-ui/tooltip` entry supports descriptive text/templates and explicit
nonmodal interactive help, controlled state, hover/focus/manual/touch policies, delays, logical
placement, collision-aware arrows, eight colors and disabled-trigger wrappers. Native host actions
and Forms remain native. The existing CDK bridge covers the Tooltip gap in pinned Angular Aria 21.

| Task                             | Status   | Evidence                                                                                        |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Specification and public API     | Verified | `docs/components/tooltip.md`; generated Tooltip API report                                      |
| Unit tests and per-file coverage | Verified | 267 tests in 66 files; all four coverage dimensions 100% across 62 implementation files         |
| Types, lint and builds           | Verified | Library/browser types; library/docs/browser/SSR lint; library/docs/SSR production builds        |
| Package/API/tooling              | Verified | Complete API comparison, 64 tooling tests, 49 entry budgets, package publish dry-run            |
| Browser and axe                  | Verified | Full Chromium suite: 127 passing, including six Tooltip scenarios                               |
| SSR/hydration                    | Verified | Full production suite: nine passing; no-JavaScript and hydrated mixed Tooltip/Dropdown scenario |
| Visual regression                | Verified | Full suite: 57 passing; two new light/dark RTL color baselines inspected                        |
| Manual accessibility             | Pending  | `docs/components/tooltip-accessibility-review.md`                                               |

Tooltip is 30.37 KiB raw / 6.29 KiB gzip, below unchanged 40/12 KiB limits. Docs initial output is
401.92 kB (410 kB hard limit); SSR is 311.15 kB (410 kB hard limit). Advisory initial warnings remain.
Collapse's test-only daisyUI candidates now compile in its lazy fixture, reducing initial docs CSS;
the existing browser and visual checks pass without changing their baselines. That fixture's 10.78 kB
style exceeds the docs 8 kB advisory warning but stays below its hard limit. Existing SSR Swap style
warnings remain below their 8 kB hard limit. No limits or dependency versions changed.

Built Dropdown and Tooltip bundles both import one coordinator/stack bridge. Browser and production
SSR evidence verifies logical focus boundaries and top-only Escape across these actual components;
browser checks also verify parent destruction and controlled rejection. This closes the overlay
foundation's automated two-entry gate under ADR 0009. Body scroll lock remains Partial until a real
blocking component proves hydration and physical mobile behavior.

Docs unit tests pass (nine tests). Touched-file formatting and whitespace checks pass. Angular 21.0,
Angular 22, Firefox, WebKit, physical touch and human assistive-technology lanes remain unverified.
The installed baseline remains Angular 21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Automated delivery is **46/68**; overall maturity remains **0/68 Done**. FAB's Button and Tooltip
dependencies are now implemented, making FAB / Speed Dial the next component. No commit or publish
was performed.

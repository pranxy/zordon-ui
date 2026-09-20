# Phase 6 Pagination progress

**Row:** NAV-07 Pagination

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(pagination): add controlled paging and Router query navigation`

The `@pranxy/zordon-ui/pagination` entry composes Button and Join for native controlled buttons or
Router-backed links. It provides known/unknown totals, bounded sibling/ellipsis ranges, page-size
selection, boundary/loading/disabled states, query synchronization and polite status messages.
ADR 0024 records state ownership and native navigation semantics.

| Task                             | Status   | Evidence                                                                                      |
| -------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| Specification and public API     | Verified | Component guide, ADR 0024, generated API report and type contracts                            |
| Unit tests and per-file coverage | Verified | 355 tests in 82 files; 100% all four dimensions across 79 implementation files                |
| Types, lint and builds           | Verified | Library/browser types; library/docs/SSR/browser lint; all three production builds             |
| Package/API/tooling              | Verified | Full API comparison, 79 tooling tests, 65 entry budgets and completed package publish dry-run |
| Browser and axe                  | Verified | Full Chromium suite: 185 passing; four Pagination scenarios rechecked after SSR selection fix |
| SSR/hydration                    | Verified | Full production SSR/hydration suite: 25 passing, including no-JavaScript selected size        |
| Visual regression                | Verified | Full suite: 73 passing; light desktop/dark RTL mobile baselines inspected                     |
| Manual accessibility             | Pending  | `docs/components/pagination-accessibility-review.md`                                          |

Pagination is 21.98 KiB raw / 4.53 KiB gzip, below unchanged 40/12 KiB entry limits. Production docs
initial output is 405.14 kB and SSR is 323.79 kB, below unchanged 410 kB hard limits. Nine docs unit
tests pass. The fixture's combined daisyUI CSS is 7.90 kB, below the unchanged 8 kB SSR hard limit;
it retains an advisory warning. Redundant md/default and active/disabled candidates were omitted:
Button supplies the default size, and Pagination owns current/disabled state styling. Existing
advisory warnings remain. No dependency, budget or coverage threshold changed.

Unit evidence covers bounded ranges at safe integer limits, invalid configuration, gaps/ellipsis,
prefix-aware composition, localization and all sizes, unknown/empty totals, rejected state and
native select restoration, query values and normalized fallbacks. Browser evidence covers keyboard
activation and focus, query/fragment preservation, native new tabs, Back/Forward, page-size reset,
loading/disabled controls, empty/unknown results, 360px RTL wrapping, forced-color focus and axe.
Production SSR checks current query state, selected size, no-JavaScript link navigation and
hydrated native/Router updates. A no-JavaScript selected-size assertion exposed the need for an
explicit selected attribute, because an option property alone was not serialized into HTML.

Requests never optimistically change controlled inputs. Query mode instead follows Router-accepted
state, and request notifications do not cancel navigation. Page-size changes request page one with
one combined state payload. Out-of-range pages render clamped without rewriting URLs or emitting
corrective requests. Unknown totals expose no invented last page; owners supply hasNext. The range
algorithm performs bounded work regardless of total size. No Aria widget, overlay, fetcher or custom
keyboard runtime is introduced.

Applications own fetch cancellation/errors, result focus/announcements, custom-theme contrast,
loading timing and guard policy. Query links work before hydration; controlled buttons and size
changes require hydration. Manual AT, physical touch, high-contrast painting, localized long
labels/numbers and 200%/400% zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22, delayed
event replay and incremental hydration remain unverified. Baseline: Angular 21.2.19,
CDK/Aria 21.2.14, daisyUI 5.7.16. Overall maturity remains 0/68 Done.

Touched-file formatting and whitespace checks pass. Automated delivery is **62/68**. No commit or publish was performed. Steps is next in Phase 6.

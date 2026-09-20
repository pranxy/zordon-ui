# Phase 6 Menu progress

**Row:** NAV-05 Menu

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(menu): add native navigation and Aria tree hierarchies`

The `@pranxy/zordon-ui/menu` entry provides native recursive navigation and a separate selectable
Angular Aria Tree. Both support five sizes, orientation, decorative icons/badges/shortcut hints and
model-driven expansion. Native navigation includes titles/separators, Router state, disabled leaves
and manual current-page overrides. Commands compose existing Dropdown/Aria Menu behavior.
ADR 0022 records the semantic split and shared-runtime boundaries.

| Task                             | Status   | Evidence                                                                          |
| -------------------------------- | -------- | --------------------------------------------------------------------------------- |
| Specification and public API     | Verified | Component guide, ADR 0022, generated report and type contracts                    |
| Unit tests and per-file coverage | Verified | 346 tests in 80 files; 100% all four dimensions across 76 implementation files    |
| Types, lint and builds           | Verified | Library/browser types; library/docs/SSR/browser lint; all three production builds |
| Package/API/tooling              | Verified | Full API comparison; 77 tooling tests; 63 entry budgets; package publish dry-run  |
| Browser and axe                  | Verified | Full Chromium suite: 177 passing, including four Menu scenarios                   |
| SSR/hydration                    | Verified | Full production SSR/hydration suite: 23 passing                                   |
| Visual regression                | Verified | Full suite: 71 passing; light desktop/dark RTL mobile baselines inspected         |
| Manual accessibility             | Pending  | `docs/components/menu-accessibility-review.md`                                    |

Menu is 33.67 KiB raw / 4.56 KiB gzip, below unchanged 40/12 KiB entry limits. Production docs
initial output is 404.88 kB and SSR is 323.56 kB, below unchanged 410 kB hard limits. Existing
advisory warnings remain. Nine docs unit tests pass. Dependencies, budgets and coverage thresholds
are unchanged.

Unit evidence covers native and Router destinations, modified clicks, recursive identity/destination
validation, titles/separators, prefix classes, all sizes, manual current state, badge names/templates,
model updates, selection, disabled state and keyboard/pointer Tree expansion. Browser evidence covers
native Tab/Enter/disclosure, Router state, Tree expansion/selection/typeahead/disabled skipping,
horizontal wrapping, RTL, pointer expansion with focus return, 360px containment, forced-color focus,
axe and nested command-menu Escape ownership. SSR synchronizes keyboard navigation with Aria's
deferred children rather than sending the next key before the child list has rendered.

Visual review corrected title contrast and separator geometry. The fixture compiles only the
daisyUI modifiers needed by component-owned structural styling, eliminating duplicated generic
menu/layout rules without relaxing budgets. Fixture CSS is explicitly scoped. Megamenu's existing
companion re-exports were normalized to equivalent TypeScript export syntax to eliminate a coverage
parser warning; its generated API is unchanged. All implementation coverage remains measured.

Native initially expanded links work before hydration. Tree interaction and native disclosure
changes require hydration. Applications own data/selection consistency, localized labels, actual
shortcut registration, nonfocusable icons and focus after navigation or structural changes. Tree
selection is separate from Router navigation; models apply interaction immediately. No new overlay
runtime, global shortcut listener or viewport observer is introduced.

Manual AT, custom theme/icon contrast, physical touch devices, high-contrast painting, long
translations, large/deep trees and 200%/400% zoom/reflow remain pending. Firefox/WebKit,
Angular 21.0/22, delayed event replay and incremental hydration remain unverified. Baseline:
Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16. Overall maturity remains 0/68 Done.

Touched-file formatting and whitespace checks pass. Automated delivery is **60/68**. No commit or publish was performed. Navbar is next in Phase 6.

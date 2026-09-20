# Phase 6 Tabs progress

**Row:** NAV-09 Tabs

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-20

**Commit:** `feat(tabs): add Aria tabs with controlled panels and navigation`

The secondary entry provides Aria tab navigation, controlled selection, three variants, five
sizes, both orientations, disabled items, lazy/preserved typed panel templates, close/reorder
proposals, native overflow and Router query selection. ADR 0026 defines public Aria integration,
SSR initial content and stable panel identity across mutation.

| Task                   | Status   | Evidence                                                                                                    |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| Specification and API  | Verified | Component guide, ADR 0026, type contracts and generated API report                                          |
| Library unit coverage  | Verified | 371 tests in 84 files; 100% statements, branches, functions and lines across 81 implementation files        |
| Types, lint and builds | Verified | Library/browser types, library/docs/SSR/browser lint and all three production builds                        |
| API and package        | Verified | Full API comparison and final Tabs report; 81 tooling tests, 67 entry budgets and completed publish dry-run |
| Browser and axe        | Verified | 193 Chromium tests, including four Tabs scenarios                                                           |
| SSR/hydration          | Verified | 27 tests against the production SSR build                                                                   |
| Visual regression      | Verified | 75 tests; light desktop and dark RTL mobile baselines inspected                                             |
| Documentation app      | Verified | Nine unit tests                                                                                             |
| Manual accessibility   | Pending  | Tabs accessibility review and visual matrix                                                                 |

Tabs is **29.54 KiB raw / 5.49 KiB gzip**, below the unchanged 40/12 KiB entry limits.
Production docs initial output is **405.58 kB** and SSR is **324.19 kB**, both below the
unchanged 410 kB hard limit. Existing advisory build warnings remain; no budget was increased.

Unit evidence covers invalid identity/Router configuration, unknown/disabled/removed selection,
empty/all-disabled collections, controlled rejection, synthetic guards, lazy/preserved/eager
views, retained editable nodes, removal-neighbor proposals, immutable reorder proposals,
boundary guards, focus recovery, local labels, prefixed classes and TestBed host composition.
Browser evidence verifies actual pointer and keyboard acceptance/rejection, manual Enter,
disabled skipping, RTL, overflow, draft preservation/destruction, Delete, accepted reorder
keyboard order and URL history with unrelated parameters/fragments retained.

SSR evidence verifies selected attributes, roving entry, connected panel IDs and meaningful
selected text before JavaScript, then keyboard interaction and axe after hydration. Internal
host directives ensure accepted attributes take precedence over Aria's initial host state.
Only public Aria APIs are used; no private keyboard/overlay runtime is copied. Trigger instances
refresh on position changes while panel views remain keyed by stable item IDs.

Applications own accepting mutations, changing the URL after closing a tab, async data/form
state and focus when the last enabled tab closes. Native earlier/later controls provide
accessible reordering; drag-and-drop is not part of this milestone. Query mode represents
in-page panels, with Router as authority; independent route destinations remain native links.

Manual AT, custom theme contrast, physical touch, forced-color painting, high zoom, Firefox/WebKit,
other Angular lanes, delayed event replay and incremental hydration remain pending. Dependencies,
budgets and coverage thresholds are unchanged. Overall maturity remains 0/68 Done.

Verification logs are in ignored `tmp/tabs-*` files; reproducible checks are committed as source
tests and tooling contracts. Touched-file formatting and whitespace checks pass.
Automated delivery is **64/68**. Drawer (LYT-02) follows Tabs. No staging, commit or publish was performed.

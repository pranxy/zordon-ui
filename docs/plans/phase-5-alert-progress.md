# Phase 5 Alert progress

**Row:** FDB-01 Alert

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-18

**Commit:** `feat(alert): add inline feedback with controlled dismissal and paused timers`

The `@pranxy/zordon-ui/alert` entry provides semantic colors, filled/soft/outline/dash styles,
responsive/horizontal/vertical layouts and projected icon/title/body/actions/details regions.
Native buttons and details/summary retain their semantics. Live-region mode is explicit and off
by default; no Angular Aria widget, overlay or duplicated announcer is needed. ADR 0012 records
the controlled dismissal and browser-only paused timer contracts.

| Task                              | Status   | Evidence                                                                                     |
| --------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide, ADR 0012, generated Alert API report and type contracts                     |
| Unit tests and per-file coverage  | Verified | 294 tests in 70 files; 100% all four dimensions across 66 implementation files               |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds     |
| Package/API/tooling               | Verified | Full API comparison; 67 tooling tests; 53 entry budgets; package publish dry-run             |
| Browser and axe                   | Verified | Full Chromium suite: 140 passing; three Alert scenarios; neutral interactive axe scans       |
| SSR/hydration                     | Verified | Full production suite: thirteen passing; native no-JavaScript details and hydrated dismissal |
| Visual regression                 | Verified | Full suite: 61 passing; two new light/dark RTL baselines inspected                           |
| Manual accessibility              | Pending  | `docs/components/alert-accessibility-review.md`                                              |

Alert is 12.00 KiB raw / 2.93 KiB gzip, below unchanged 40/12 KiB limits. Production initial docs
output is 402.70 kB and SSR is 312.01 kB, below unchanged 410 kB hard limits. The compiled Alert
fixture styles remain below the 8 kB SSR hard limit and above its 4 kB advisory threshold. Existing
initial and fixture-style advisories remain; dependencies and budgets are unchanged. Nine docs
unit tests pass.

Tests prove exact prefixed classes, live modes, projection, controlled rejection/acceptance, one
request per cycle, preserved state, duration validation, paused remaining time, hidden-document
behavior and teardown. Browser checks include keyboard actions, native details, focus retained on
rejected requests, narrow RTL layout and forced colors. Timers never run on the server.

Visual review improved the fixture's title/body separation. Its new snapshots and targeted browser
checks were rerun after that fixture-only adjustment. Existing component baselines are unchanged.
Palette screenshots are visual regression evidence, not contrast certification; automated axe
checks cover the neutral interactive fixture. Semantic styles and consumer themes still need
contrast review, alongside screen readers, zoom/reflow and physical devices.

Consumers accept close requests, choose a surviving focus destination when needed, and decide
whether timed dismissal is appropriate for the content. Auto-dismiss defaults to disabled and
pauses for pointer, focus-within and hidden tabs. Delayed event replay, incremental hydration,
Angular 21.0/22 and Firefox/WebKit remain unverified. The installed baseline remains Angular
21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **50/68**; overall
maturity remains **0/68 Done**. No commit or publish was performed. Loading is next.

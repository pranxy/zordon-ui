# Phase 5 Toast progress

**Row:** FDB-06 Toast

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-19

**Commit:** `feat(toast): add queued notifications with actions and promise flows`

The `@pranxy/zordon-ui/toast` entry provides a scoped notification service and declarative outlet,
nine logical positions, semantic/custom content, persistent actions, promise flows, FIFO queue,
visible limit, deduplication, timeouts and local live-region priority. ADR 0017 records the native
fixed outlet and stable announcement regions; packaged Alert owns presentation and timer behavior.

| Task                              | Status   | Evidence                                                                                   |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Specification and public API      | Verified | Component guide, ADR 0017, generated API report and type contracts                         |
| Unit tests and per-file coverage  | Verified | 319 tests in 75 files; 100% all four dimensions across 71 implementation files             |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds   |
| Package/API/tooling               | Verified | Full API comparison; 72 tooling tests; 58 entry budgets; package publish dry-run           |
| Browser and axe                   | Verified | Full Chromium suite: 157 passing, including five Toast scenarios                           |
| SSR/hydration                     | Verified | Full production suite: 18 passing, including initial markup, queue promotion and hydration |
| Visual regression                 | Verified | Full suite: 66 passing; two new light desktop/dark RTL mobile baselines inspected          |
| Manual accessibility              | Pending  | `docs/components/toast-accessibility-review.md`                                            |

Toast is 15.76 KiB raw / 3.91 KiB gzip, below unchanged 40/12 KiB entry limits.
Production docs initial output is 403.44 kB and SSR is 312.70 kB, below unchanged 410 kB hard limits.
Existing initial and fixture CSS advisories remain. Dependencies, budgets and coverage thresholds
are unchanged. Nine docs unit tests pass.

Unit evidence covers validation, bounded queues, deduplication, option replacement, visible
projection, announcements, action pending/failure/stale settlement, promise lifecycle, focus and
outlet ownership. Browser tests cover promotion, timeout pause, custom templates, actions,
promise updates, teardown, all nine positions in LTR and nested RTL, narrow layouts, reduced
motion, forced colors and axe. Hidden-tab timing and cleanup are also covered by Alert tests.

Messages do not take focus on arrival. Actions persist by default; focused dismissal returns to
the origin or outlet. Only newly visible or updated messages enter local live regions after the
initial render. Native live regions can coalesce rapid batches and do not guarantee speech delivery.
The outlet stays within its DOM/theme context and does not escape native modal isolation or the
top layer. Applications own essential modal feedback, durable error records, custom template
lifetime and cancellation of underlying asynchronous work.

Manual AT, theme perception, high-contrast painting, animation comfort, zoom/reflow and physical
devices remain pending. Delayed event replay, incremental hydration, Angular 21.0/22 and
Firefox/WebKit lanes remain unverified. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **55/68**; overall maturity remains **0/68 Done**. No commit or publish was performed. Accordion is next.

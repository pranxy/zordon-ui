# Phase 5 Accordion progress

**Row:** DSP-01 Accordion

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-19

**Commit:** `feat(accordion): add Aria disclosure groups and lazy panels`

The `@pranxy/zordon-ui/accordion` entry composes Angular Aria Group, Trigger and Panel with
native heading/button anatomy and daisyUI Collapse styles. It supports single/multiple expansion,
model state, default-open content, disabled policies, keyboard movement, arrow/plus/custom/no
indicators, lazy recreation/preservation, explicit deep-link examples and nested component use.
Native details/radio alternatives reuse the existing Collapse entry. ADR 0018 records boundaries.

| Task                              | Status   | Evidence                                                                                 |
| --------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide, ADR 0018, generated API report and type contracts                       |
| Unit tests and per-file coverage  | Verified | 326 tests in 76 files; 100% all four dimensions across 72 implementation files           |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds |
| Package/API/tooling               | Verified | Full API comparison; 73 tooling tests; 59 entry budgets; package publish dry-run         |
| Browser and axe                   | Verified | Full Chromium suite: 161 passing, including four Accordion scenarios                     |
| SSR/hydration                     | Verified | Full production suite: 19 passing, including meaningful server HTML and Aria hydration   |
| Visual regression                 | Verified | Full suite: 67 passing; two new light desktop/dark RTL mobile baselines inspected        |
| Manual accessibility              | Pending  | `docs/components/accordion-accessibility-review.md`                                      |

Accordion is 13.23 KiB raw / 2.84 KiB gzip, below unchanged 40/12 KiB entry limits.
Production docs initial output is 403.94 kB and SSR is 313.18 kB, below unchanged 410 kB hard limits. Nine docs
unit tests pass. Dependencies, budgets and coverage thresholds are unchanged. Existing advisories
remain; the Accordion base fixture stylesheet is 7.33 kB, below the 8 kB SSR hard limit but above
its 4 kB advisory. Indicator styles are compiled separately, following existing fixture practice.

Unit evidence covers trigger/panel relationships, hidden/inert state, single/multiple expansion,
commands, external model synchronization, disabled state, lazy preservation/destruction,
prefix-aware classes, input event isolation, native synthetic activation and consumer presentation
overrides. Browser evidence covers grouped keyboard behavior, native details/radio alternatives,
deep links, supported nested component composition, narrow RTL, motion, focus and axe.

The native-button component has a narrowly scoped selector-lint exception because preserving
the actual button host is part of its accessibility contract. No general lint rules are relaxed.
One Calendar test timed out under concurrent build load; the complete coverage rerun passed
without changing its timeout or assertions.

Aria owns expansion and navigation. Zordon owns its small lazy-view policy, closing visibility
and panel event boundaries. Model binding is synchronous, not a vetoable request. Consumers own
consistent externally assigned single-mode state, focus recovery for external closing, stable
IDs, heading hierarchy, route-fragment reconciliation and custom indicator semantics. Nested
groups require a child component template boundary because Aria queries descendant triggers.

Manual AT, theme contrast, high-contrast painting, long translations, physical devices, motion
comfort and zoom/reflow remain pending. Firefox/WebKit, Angular 21.0/22, delayed event replay and
incremental hydration remain unverified. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **56/68**; overall maturity remains **0/68 Done**. No commit or publish was performed. Breadcrumbs begins Phase 6 next.

# Phase 5 Modal progress

**Row:** ACT-04 Modal

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-18

**Commit:** `feat(modal): add native and overlay dialogs with guarded lifecycle`

The `@pranxy/zordon-ui/modal` entry provides a controlled declarative template, typed service
references, queued dialogs and asynchronous confirmation. Native dialog is the default when
available; the explicit CDK overlay backend supports portaled Dropdown/Tooltip composition.
Both backends use the existing overlay coordinator and ref-counted body scroll lock. Native HTML
and CDK cover these semantics; no Angular Aria widget is required. ADR 0010 records this decision.

| Task                              | Status   | Evidence                                                                                                   |
| --------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | `docs/components/modal.md`; generated Modal API report                                                     |
| Unit tests and per-file coverage  | Verified | 280 tests in 68 files; 100% all four dimensions across 64 implementation files                             |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR builds                              |
| Package/API/tooling               | Verified | Full API comparison; 65 tooling tests; 51 entry budgets; package publish dry-run                           |
| Browser and axe                   | Verified | Complete Chromium suite: 134 passing, including four Modal scenarios                                       |
| SSR/hydration                     | Verified | Full production suite: eleven passing, including closed server output and hydrated native/overlay behavior |
| Visual regression                 | Verified | Complete suite: 59 passing; two new light/dark RTL baselines inspected                                     |
| Manual accessibility              | Pending  | `docs/components/modal-accessibility-review.md`                                                            |

Modal is 23.63 KiB raw / 5.32 KiB gzip, within unchanged 40/12 KiB limits. Production docs initial
output is 402.44 kB and SSR is 311.79 kB, both below unchanged 410 kB hard limits. Existing initial
and Collapse/Swap fixture style advisory warnings remain; no budgets or dependencies changed.
Docs unit tests pass (nine tests).

Behavior checks cover focus containment/restoration, background isolation, Escape/backdrop policy,
nested stack priority, controlled close rejection/acceptance, asynchronous guards and retry,
queue ordering, form submission, logical placement with live RTL, small/fullscreen sizes,
forced colors and reduced motion. Destroyed view owners reject queued opens before attachment;
a regression test verifies no orphaned pane remains. Modal fixture daisyUI styles are loaded
with that fixture so existing dialog styles and visual baselines remain unchanged.

Native top-layer dialogs cannot compose with body-portaled widgets; use the overlay backend for
that content. Mixed native/overlay nested Modal flows are unsupported. Options are captured at
open; declarative close requests require the consumer to accept the new open state. Confirmation
actions should be idempotent when a subsequent guard can veto closure. See the component guide.

The body-scroll-lock foundation now has real Modal ordinary-hydration evidence and remains Partial
pending physical mobile review. Delayed pre-hydration event replay, physical safe-area/keyboard
behavior, assistive technology, Angular 21.0/22 and Firefox/WebKit lanes remain unverified.
The installed baseline remains Angular 21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **48/68**; overall
maturity remains **0/68 Done**. No commit or publish was performed. Theme Controller is next.

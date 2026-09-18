# Phase 5 FAB / Speed Dial progress

**Row:** ACT-03 FAB / Speed Dial

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-14

**Commit:** `feat(fab): add native speed dial with responsive flower layout`

The `@pranxy/zordon-ui/fab` entry provides a native main/disclosure trigger, retained action template,
marked native actions, single/vertical/flower layouts, logical corners, safe-area offsets and
controlled requests. Button supplies daisyUI styling; descriptive Tooltip labels retain their own
Escape priority. FAB adds no Aria widget, CDK overlay, focus trap or scroll lock.

| Task                              | Status   | Evidence                                                                                         |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| Specification and public API      | Verified | `docs/components/fab.md`; generated FAB API report                                               |
| Unit tests and per-file coverage  | Verified | 270 tests in 67 files; 100% all four dimensions across 63 implementation files                   |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR builds                    |
| Package/API/tooling               | Verified | Full API comparison; 64 tooling tests; 50 entry budgets; package publish dry-run                 |
| Browser and axe                   | Verified | Complete Chromium suite: 130 passing, including three FAB scenarios                              |
| SSR/hydration                     | Verified | Full production suite: ten passing, including no-JavaScript FAB and hydrated Tooltip composition |
| Visual regression                 | Verified | Complete suite: 58 passing; two new light/dark RTL baselines inspected                           |
| Manual accessibility              | Pending  | `docs/components/fab-accessibility-review.md`                                                    |

FAB is 18.70 KiB raw / 3.82 KiB gzip, within unchanged 40/12 KiB limits. Production docs initial
output is 402.13 kB and SSR is 311.34 kB, both below unchanged 410 kB hard limits. Existing initial
and Collapse/Swap fixture style advisory warnings remain; no budgets or dependencies were changed.
Docs unit tests pass (nine tests).

Geometry checks verify all four fixed corners in both directions, separated action hit areas,
five-action fallback, small-screen vertical layout, forced colors and reduced motion. The trigger
has a dedicated decorative icon slot, preventing action templates from suppressing its default
plus/close glyph. The default flower radius leaves room for compact circular actions; longer labels
belong in vertical mode. Safe-area CSS is implemented; physical notch/keyboard review is not claimed.

The existing Swap browser test now waits for the rendered read-only attribute before pressing Space,
preventing an action from racing the state update. Swap implementation and existing visual baselines
are unchanged. The initial full visual attempt lost its shared development server when a concurrent
browser runner exited; the final suites run sequentially.

Angular 21.0, Angular 22, Firefox, WebKit and human/device lanes remain unverified. The installed
baseline remains Angular 21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **47/68**; overall maturity remains **0/68 Done**. No commit or publish was performed. Modal is the next component.

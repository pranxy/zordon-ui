# Phase 5 Theme Controller progress

**Row:** ACT-06 Theme Controller

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-18

**Commit:** `feat(theme-controller): add scoped native theme controls and persistence`

The `@pranxy/zordon-ui/theme-controller` entry provides scoped signal state and native
checkbox/toggle, radio, select and button controls. It supports consumer-defined registries,
light/dark/system selection, optional storage, real cross-tab synchronization, nested previews,
explicit document ownership and source-aware change events. Native semantics need no Aria/CDK
widget. ADR 0011 records the decision to omit daisyUI's global CSS-only controller class.

| Task                              | Status   | Evidence                                                                                          |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide; ADR 0011; generated Theme Controller API report                                  |
| Unit tests and per-file coverage  | Verified | 290 tests in 69 files; 100% all four dimensions across 65 implementation files                    |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds          |
| Package/API/tooling               | Verified | Full API comparison; 66 tooling tests; 52 entry budgets; package publish dry-run                  |
| Browser and axe                   | Verified | Complete Chromium suite: 137 passing, including three Theme Controller scenarios                  |
| SSR/hydration                     | Verified | Complete production suite: twelve passing; server choices and hydrated storage/system restoration |
| Visual regression                 | Verified | Complete suite: 60 passing; two new light/dark RTL baselines inspected                            |
| Manual accessibility              | Pending  | `docs/components/theme-controller-accessibility-review.md`                                        |

The entry is 16.08 KiB raw / 3.29 KiB gzip, within unchanged 40/12 KiB limits. Production docs
initial output is 402.58 kB and SSR is 311.91 kB, below unchanged 410 kB hard limits. The fixture's
compiled toggle styling plus layout is 7.98 kB, below the unchanged 8 kB SSR style limit and above
its 4 kB advisory threshold. Existing initial and Collapse/Swap style advisories remain. No
dependencies, coverage thresholds or budgets changed. Nine docs unit tests pass.

Tests verify synchronized native selection, keyboard activation, nested isolation, disabled controls,
custom names, unknown preferences, blocked storage, quota failures, listener teardown and document
attribute ownership. Real tabs restore and synchronize saved preferences; unit tests verify removal,
clear, unrelated storage events and no echo writes. SSR verifies meaningful native selected state
without JavaScript, then preference restoration and system observation after hydration.

Final review added empty-attribute normalization so bare `zdThemeToggle` selects the documented
dark default. The full unit/coverage suite and targeted Theme Controller browser, visual and SSR
checks were repeated after that fix; visual baselines were unchanged.

The controller uses the existing single-owner data-theme boundary contract; `ZdTheme` remains
unchanged. Consumers compile registered CSS themes, supply labels and distinct native radio group
names, and use one owner for the document root. Controls own checked/selected state and do not
compose with competing Forms value accessors. Configuration is captured once per scope.

System defaults to the configured light theme on the server. Preference restoration may change
the initial appearance; no no-flash guarantee is claimed. Preboot/cookie integration, delayed event
replay, incremental hydration, Angular 21.0/22, Firefox/WebKit and human/device lanes remain
unverified. The baseline stays Angular 21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **49/68**; overall
maturity remains **0/68 Done**. No commit or publish was performed. Alert is next.

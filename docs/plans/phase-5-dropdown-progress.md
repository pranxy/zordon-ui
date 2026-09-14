# Phase 5 Dropdown progress

**Row:** ACT-02 Dropdown

**Status:** Automated implementation complete; manual accessibility pending

**Updated:** 2026-09-14

**Commit:** `feat(dropdown): add Angular 21 menu and overlay component`

The public `@pranxy/zordon-ui/dropdown` entry provides root, native trigger, lazy panel, menu and
item parts. Angular 21.2.19 and Aria/CDK 21.2.14 are unchanged. Aria Menu/MenuItem own navigation,
typeahead and disabled-item behavior; CDK and the shared Zordon coordinator own portal placement
and overlay lifecycle. Native arbitrary-content panels retain their form semantics and tab order.

| Task                                                                        | Status                | Evidence                                                                                                                |
| --------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Public behavior and ownership                                               | Verified              | `docs/components/dropdown.md`, ADRs 0008/0009                                                                           |
| Controlled/internal state and close policies                                | Verified              | Unit tests, public Chromium fixture                                                                                     |
| Click/hover/focus/manual triggers; recursive LTR/RTL menus                  | Verified              | Unit and Chromium tests; three-level nesting, top-only Escape, focus restoration                                        |
| Placement, live direction, theme, reduced motion, forced colors and cleanup | Verified in Chromium  | Unit contracts and geometric/browser assertions                                                                         |
| One packaged overlay runtime                                                | Verified for Dropdown | Partial-Ivy build, complete API reports, built-bundle tooling assertion and package dry-run                             |
| Unit coverage                                                               | Verified              | 256 tests in 64 files; 100% statements, branches, functions and lines per file; 60 implementation files audited         |
| Browser behavior and automated accessibility                                | Verified              | Full Chromium suite: 118 passing, including public Dropdown and Aria prototype                                          |
| SSR and hydration                                                           | Verified              | Production SSR build and seven Chromium hydration regressions                                                           |
| Visual matrix                                                               | Verified              | Full suite: 55 passing; new light desktop and dark RTL narrow-viewport baselines inspected; existing baselines retained |
| Types, lint, API and packaging                                              | Verified              | Library/browser types; library/docs/browser/SSR lint; 63 tooling tests; API reports; 47 bundle budgets; package dry-run |
| Manual accessibility and release maturity                                   | Pending               | `docs/components/dropdown-accessibility-review.md`; no human evidence claimed                                           |

The public adapter uses independent, lazily attached Aria menus. It does not inherit the prototype's
eager hidden child shells or detached-parent focusout workaround. Zordon connects initial first/last
focus, logical submenu opening/collapse, selection close and controlled vetoes around Aria's menu
navigation. The prototype remains as integration evidence; its render-time focus handoff now also
waits for the child's hidden attribute to clear before focusing the active item.

The version-locked `internal-overlay` secondary entry packages a single coordinator/stack identity;
the primary bundle remains lightweight. Consumer Dropdown inputs, outputs and methods do not accept
Aria/CDK objects. Angular's generated static host-directive metadata necessarily references Aria and
is retained in the complete API report under the explicit ADR 0008 exception.

Dropdown measures **28.21 KiB raw / 5.75 KiB gzip**; the shared bridge measures **18.82 KiB raw /
4.22 KiB gzip**, within unchanged 40/12 KiB entry budgets. The docs initial bundle is **409.84 kB**,
below its unchanged 410 kB hard limit but above its 360 kB warning. Test-only Aura CSS is now loaded
with its lazy fixture, using the existing fixture CSS pattern; its live reduced-motion behavior and
scoped animation name are verified. No dependency upgrade or budget increase was used.

The broader overlay foundation remains Partial until a second actual overlay component proves
cross-component stacking. Angular 21.0, Angular 22, Firefox, WebKit, vertical writing modes and
human assistive-technology/device review remain unverified. Nothing is published or marked Done.

Automated component delivery is **44 / 68**. Overall maturity remains **0 / 68 Done**.

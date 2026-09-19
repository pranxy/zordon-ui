# Phase 5 Loading progress

**Row:** FDB-02 Loading

**Status:** Automated implementation complete; manual accessibility pending.

**Updated:** 2026-09-19

**Commit:** `feat(loading): add delayed status feedback and static motion fallbacks`

The `@pranxy/zordon-ui/loading` entry provides six daisyUI mask animations, five sizes, semantic
colors, inline/center/non-blocking overlay layouts, custom artwork and delayed status feedback.
Artwork and optional visible labels remain separate from mounted status text. Reduced motion and
forced colors replace visible animation with a static ring. ADR 0013 records these contracts.

| Task                              | Status   | Evidence                                                                                 |
| --------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| Specification and public API      | Verified | Component guide, ADR 0013, generated Loading API report and type contracts               |
| Unit tests and per-file coverage  | Verified | 297 tests in 71 files; 100% all four dimensions across 67 implementation files           |
| Types, lint and production builds | Verified | Library/browser types; library/docs/SSR/browser lint; library/docs/SSR production builds |
| Package/API/tooling               | Verified | Full API comparison; 68 tooling tests; 54 entry budgets; package publish dry-run         |
| Browser and axe                   | Verified | Full Chromium suite: 143 passing, including three Loading scenarios                      |
| SSR/hydration                     | Verified | Full production suite: fourteen passing; server status and hydrated delayed feedback     |
| Visual regression                 | Verified | Full suite: 62 passing; two static fallback baselines inspected                          |
| Manual accessibility              | Pending  | `docs/components/loading-accessibility-review.md`                                        |

Loading is 10.81 KiB raw / 2.51 KiB gzip, below unchanged 40/12 KiB limits. Production docs initial
output is 402.82 kB and SSR is 312.17 kB, below unchanged 410 kB hard limits. Ring/bars fixture CSS
produces 4.06/5.67 kB advisory warnings but remains below the unchanged 8 kB SSR hard limit.
Existing initial and fixture-style advisories remain. Dependencies, budgets and coverage thresholds
are unchanged. Nine docs unit tests pass.

Unit tests prove delayed display cancellation, changed-delay reset, immediate hiding, teardown,
server timing boundaries, custom projection, prefixed classes and accessible/decorative modes.
Browser checks verify all six actual SVG mask families and 16/20/24/28/32px default size geometry,
non-blocking pointer/keyboard overlay actions, RTL, reduced motion and forced colors. The consuming
application's aria-busy state starts immediately while Loading status text remains delayed.

The fixture loads global daisyUI styles lazily so they reach internal glyphs. Animation-family
stylesheets include only the Loading plugin, avoiding unrelated duplicated CSS and preserving
unchanged per-file budgets. No application-wide stylesheet or existing baseline changed.
The final narrow screenshot uses a taller capture viewport so the documentation's sticky header
does not cover the gallery; its targeted visual check was repeated after that capture adjustment.

Static fallback screenshots intentionally do not sample animated SVG frames. Human animation,
assistive-technology, theme contrast, zoom/reflow and physical device review remain pending.
Loading is not determinate progress or a modal blocking layer; consumers own work state, affected
region busy semantics and disabled actions. Custom artwork may retain application-owned timers
while hidden. Delayed event replay, incremental hydration, Angular 21.0/22 and Firefox/WebKit lanes
remain unverified. The baseline stays Angular 21.2.19, CDK/Aria 21.2.14 and daisyUI 5.7.16.

Touched-file formatting and whitespace checks pass. Automated delivery is **51/68**; overall
maturity remains **0/68 Done**. No commit or publish was performed. Progress is next.

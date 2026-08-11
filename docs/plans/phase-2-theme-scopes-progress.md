# Phase 2 global, nested, and per-component themes implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 global, nested, and per-component themes
- **Status:** `Complete`
- **Updated:** 2026-08-10

`Complete` means every row is Verified, global/native and Angular theme-scope ownership is explicit,
nested and per-component scopes work with built-in and consumer-defined daisyUI themes, SSR and
hydration behavior is deterministic, validation passes, and the independent final review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID    | Plan ref / requirement                                  | Deps       | Status   | Acceptance check                                                                                                             | Evidence                                                                                          |
| ----- | ------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| T01   | Audit official and installed theme behavior             | —          | Verified | Contract matches daisyUI 5.7.16 theme compilation, `data-theme` inheritance, accepted ADRs, current fixtures, and SSR policy | Official docs, installed-source audit, real PostCSS fixture, `.progress/theme-scopes-research.md` |
| T02   | Define global, nested, and per-component ownership      | T01        | Verified | Native global setup, Angular scope API, inheritance, clearing, updates, and collision precedence are unambiguous             | Native global ownership plus exact `[zdTheme]` contract recorded in research/tracker              |
| T03   | Implement the smallest public theme-scope primitive     | T02        | Verified | Any native or Zordon host can establish a theme boundary without DOM mutation, global state, storage, or stylesheet access   | `ZdTheme` declarative host binding; root export and exact-string transform                        |
| T03.1 | Add behavior, composition, and SSR/hydration tests      | T03        | Verified | Tests prove nesting, per-component use, arbitrary compiled theme names, updates/clearing, consumer ownership, SSR, hydration | 6 unit, 2 compiler, 9 browser, and 3 SSR tests pass; empty-value mutation failed as intended      |
| T04   | Document consumer setup and contributor/component rules | T02, T03.1 | Verified | CSS/native/Angular examples agree; system preference and the future Theme Controller are separated                           | Foundation contract plus consumer, contributor, root, and packed README updates                   |
| T05   | Review public API, packaging, and release intent        | T03, T04   | Verified | Exports, declaration shape, bundle effect, package contents, and Changeset are intentional                                   | Root declaration inspected; 4.74 KiB/1.64 KiB budget; seven-file tarball; minor Changeset         |
| T06   | Validate and independently review the complete step     | T05        | Verified | Coverage, lint, types, build, budget, package, format, sensitivity, SSR, and final review gates pass                         | 100% coverage; 43 tooling tests; all lint/types/build/browser/SSR/package gates pass; final Clear |

## Loop log

| ID        | Owner   | Worktree / isolation  | Checks                                                                                                                                          | Review                                | Cleanup                                      |
| --------- | ------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------- |
| T01–T05   | parent  | shared root           | Focused unit/compiler, production app/SSR/library builds, coverage, types, lint, browser/SSR, tooling, budget, pack/publish dry-run, and format | Self-review complete; final delegated | Mutation restored; generated reports ignored |
| T01 audit | Russell | read-only shared root | Official/installed daisyUI, Angular/SSR, ADR, API/package, and fixture audit                                                                    | Six risks incorporated or bounded     | No audit edits                               |

## Reviews

| Checkpoint           | Reviewer | Findings                                                                                                                        | Disposition                                                                                                                  | Closure                                |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Read-only audit      | Russell  | Attribute-only inheritance, native-host fixture, system preference, SSR claim, same-host precedence, and portaled-overlay risks | Added compiled CSS/system tests and Angular-host fixture; narrowed SSR/ownership claims; documented the overlay boundary     | Focused and full gates pass            |
| Mutation sensitivity | parent   | Preserving the empty string must be caught                                                                                      | Temporarily retained `''`; the removal test failed on the retained attribute; restored the implementation                    | Focused suite passes after restoration |
| Independent final    | Anscombe | TS-01 custom-root guidance was unconditional; TS-02 same-host precedence was overstated                                         | Added `#app` compile evidence and custom-root/overlay guidance; made competing bindings unsupported and transition-sensitive | Focused re-review Clear                |

## Decisions / deviations

| Item                | Need / change                                                                                      | Evidence                                               | Status                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Same-host ownership | Two bindings updating `data-theme` have no stable authoritative source                             | Focused Angular 21.2.19 transition test                | Combining `[zdTheme]` and `[attr.data-theme]` is unsupported; consumers must choose exactly one owner      |
| Custom names        | daisyUI's custom-theme plugin escapes non-identifier characters instead of restricting theme names | Installed 5.7.16 `theme/index.js` and compiler fixture | Preserve every non-empty name exactly; do not trim or impose built-in-name unions                          |
| System preference   | daisyUI preferred-dark targets only a root without `data-theme`                                    | Official docs and installed `pluginOptionsHandler.js`  | Global selection remains native; removal/absence means default plus preferred dark, never literal `system` |
| Portaled overlays   | A CDK overlay under `body` leaves a nested or custom-root DOM theme boundary                       | DOM ancestry plus ADR 0004 overlay ownership           | Document as future overlay forwarding; `<html>` covers it only with daisyUI's default `:root`              |
| Custom daisy root   | Direct variables on a configured root override a theme inherited from `<html>`                     | Real daisyUI compile for `root: "#app"`                | Global boundary/absence belongs on the configured root; `<html>` guidance applies to default `:root` only  |

# daisyUI Angular Library Build Plan

Last updated: 2026-08-11
Planning baseline: daisyUI 5.7.16 documentation, 68 components  
Implementation status at plan creation: not started  
Scope note: this plan is intentionally independent of the repository's existing component implementation.

## Purpose

Build a modern Angular component library that uses daisyUI as its visual foundation while adding Angular-native APIs, controlled state, accessibility, form integration, overlay behavior, SSR safety, localization, testing, and complete customization.

This file is the source of truth for delivery progress. Update checkboxes and the progress log in the same pull request as the related work.

## Status conventions

- `[ ]` Not started
- `[~]` In progress. Markdown does not render this as a checkbox, so use it only temporarily.
- `[x]` Complete and verified
- `BLOCKED` Add the reason and owner in the Notes column.
- `DEFERRED` Accepted as out of the current release, with an issue or decision link.

Component matrix columns:

- **Spec**: API, semantics, variants, states, slots, and edge cases are approved.
- **Build**: implementation and public exports are complete.
- **Tests**: unit, integration, and form/overlay tests pass as applicable.
- **A11y**: keyboard, focus, screen-reader, contrast, RTL, and reduced-motion checks pass as applicable.
- **Docs**: API reference, examples, usage guidance, and migration notes exist.
- **Visual**: theme matrix, responsive states, and visual regression coverage pass.
- **Done**: all applicable columns are complete and the Definition of Done is satisfied.

## Progress dashboard

| Phase | Outcome                                                            | Status | Exit condition                                                |
| ----- | ------------------------------------------------------------------ | -----: | ------------------------------------------------------------- |
| 0     | Product and architecture decisions                                 |    [x] | All blocking ADRs approved                                    |
| 1     | Workspace, packaging, docs, and CI foundation                      |    [x] | A publishable empty library and documentation app build in CI |
| 2     | Styling, configuration, composition, and accessibility foundations |    [~] | Shared contracts are tested and documented                    |
| 3     | Native primitives and layout components                            |    [ ] | Stage 3 component rows are Done                               |
| 4     | Angular form controls                                              |    [ ] | Every value control works with typed Reactive Forms           |
| 5     | Actions, disclosure, overlays, and feedback                        |    [ ] | Overlay/focus infrastructure and Stage 5 rows are Done        |
| 6     | Navigation and responsive application layout                       |    [ ] | Router integration and Stage 6 rows are Done                  |
| 7     | Advanced data display and visual effects                           |    [ ] | Stage 7 rows are Done                                         |
| 8     | Hardening, compatibility, and release                              |    [ ] | Release gates pass and v1.0.0 is published                    |

Overall component progress: **0 / 68 Done**.

## Definition of Ready for a component

- [ ] The component's daisyUI classes, parts, modifiers, examples, and CSS variables are recorded.
- [ ] Native element, directive, component, service, or compound-component shape is chosen.
- [ ] Public inputs, models, outputs, methods, slots, and exported types are written down.
- [ ] Controlled/uncontrolled behavior and Angular Forms behavior are defined where relevant.
- [ ] Keyboard and screen-reader interaction follows the appropriate WAI-ARIA pattern.
- [ ] Native HTML, `@angular/aria`, and Angular CDK were evaluated in that order; any custom
      interaction primitive has a documented gap and test plan.
- [ ] SSR, hydration, RTL, localization, reduced-motion, and mobile behavior are considered.
- [ ] Dependencies on shared primitives or other components are identified.
- [ ] Examples and test scenarios are agreed before implementation begins.

## Definition of Done for a component

- [ ] Uses standalone Angular APIs, OnPush change detection, signal inputs/outputs/models, and native control flow.
- [ ] Preserves native HTML semantics and forwards applicable attributes.
- [ ] Reuses the approved `@angular/aria` pattern when applicable without exposing its
      developer-preview APIs as Zordon public contracts.
- [ ] Supports every applicable documented daisyUI variant, size, color, placement, and state.
- [ ] Exposes consumer classes, styles, CSS variables, ARIA/data attributes, and named projected parts.
- [ ] Has controlled state and two-way state binding where applicable.
- [ ] Implements ControlValueAccessor and validation behavior when it represents a form value.
- [ ] Passes unit and integration tests, including edge cases and cleanup.
- [ ] Passes automated accessibility tests and documented manual keyboard checks.
- [ ] Works in LTR and RTL, light and dark themes, reduced motion, SSR, and hydrated rendering where applicable.
- [ ] Has API documentation, basic and advanced examples, customization guidance, and anti-pattern guidance.
- [ ] Has visual regression coverage for representative variants, themes, breakpoints, and states.
- [ ] Is exported from the intended public entry point with no accidental private exports.
- [ ] Has no unresolved critical or high-severity defects.

## Phase 0 — Product and architecture decisions

### Product boundaries

- [x] Record the current official daisyUI component catalog.
- [x] Create an initial feature inventory for all 68 components.
- [x] Create this trackable build plan.
- [x] Decide supported Angular version range and update policy.
- [x] Decide supported daisyUI and Tailwind version ranges and pinning policy.
- [x] Decide browser support matrix, including CSS anchor positioning and popover fallbacks.
- [x] Decide whether v1 ships all 68 components or uses preview/stable maturity labels.
- [x] Retain `@pranxy/zordon-ui`, selector prefix `zd`, component entry points, and use the MIT license.
- [x] Decide whether Angular CDK is a required, optional, or avoided dependency.
- [x] Decide whether advanced Select, Range, Table, Calendar, and List behavior belongs in core or optional packages.

### Architecture decision records

- [x] ADR: Native directive versus wrapper component policy.
- [x] ADR: Compound component and content projection conventions.
- [x] ADR: Controlled/uncontrolled state and two-way model conventions.
- [x] ADR: ControlValueAccessor and typed Reactive Forms strategy.
- [x] ADR: Optional Signal Forms integration boundary.
- [x] ADR: Overlay, portal, positioning, focus trap, and scroll-lock architecture.
- [x] ADR: Theme configuration, CSS prefixes, token overrides, and nested themes.
- [x] ADR: Global defaults through dependency injection.
- [x] ADR: Icons and consumer-supplied icon templates.
- [x] ADR: Localization, date adapters, number formatting, and RTL.
- [x] ADR: SSR/hydration and browser-only API policy.
- [x] ADR: Public API compatibility, deprecation, and semver policy.
- [x] ADR: Angular Aria adoption, preview containment, and custom-interaction fallback policy.

## Phase 1 — Workspace, packaging, documentation, and CI

- [x] Establish the Angular library workspace without carrying forward obsolete API decisions. Legacy source remains unexported reference material.
- [x] Add the library package and a separate documentation/playground application.
- [x] Define secondary entry points only where they materially improve tree shaking or optional dependencies. The accepted component and optional integration map is documented in `docs/architecture/entry-points.md`.
- [x] Configure Tailwind and daisyUI with a documented version and class-prefix policy. The docs app uses the agreed empty-prefix light/dark defaults, and the consumer contract is documented in `docs/guides/styling-and-theming.md`.
- [x] Configure production builds, package exports, typings, source maps, and side-effect metadata for the primary entry point.
- [x] Add linting, formatting, type checking, unit tests, coverage, and build verification. Angular/Vitest force-includes every implementation source and applies 100% per-file statement, branch, function, and line thresholds; a tested structural check distinguishes the empty bootstrap package from missing or uncovered runtime code, and CI runs the combined gate.
- [x] Add browser integration tests for focus, keyboard, overlays, forms, SSR, and hydration. The client fixture has nine passing boot/focus/dialog/form/theme/accessibility scenarios, while the isolated production SSR fixture has three passing server-HTML, JavaScript-disabled, hydration/interaction, and accessibility scenarios; the three-engine project matrix and Chromium CI gates are configured.
- [x] Add automated accessibility checks and a manual accessibility test template. The axe Playwright fixture, passing light/dark and dialog-state scans, JSON report attachments, and manual WCAG/keyboard/screen-reader review template are implemented and verified.
- [x] Add visual regression testing across representative daisyUI themes and breakpoints. Eight reviewed Chromium baselines cover light/dark desktop and mobile layouts, low/high-radius themes, a consumer-defined theme, and an open-dialog state; comparison mode passes locally and has a dedicated Windows CI gate.
- [x] Add bundle-size budgets for the primary and optional entry points. The generated-export gate enforces raw and gzip FESM ceilings for the primary entry point, every future component entry point, and optional testing/Signal Forms integrations; tooling tests, the production build-and-check command, and the CI gate pass. The current primary artifact is 4.74 KiB raw and 1.64 KiB gzip.
- [x] Add an SSR example and hydration smoke test. The clean Angular application uses `AngularNodeAppEngine`, server render mode, client hydration with event replay, deterministic signal state, and browser-safe render hooks. Its production build and three Playwright server/hydration/accessibility scenarios pass with zero production audit findings.
- [x] Add a release pipeline with changelog generation, prerelease channels, provenance, and dry-run publishing. Changesets prepares reviewable version/changelog PRs; stable and `next`/`alpha`/`beta`/`rc` releases have tested tag/lineage guards, package dry runs, protected OIDC publishing, and maintainer recovery/bootstrap documentation.
- [x] Add contribution, API review, deprecation, and component maturity documentation. The contributor workflow and focused governance policies define actual validation commands, manual public API review until extraction tooling exists, pre-1.0/stable deprecation rules, and maturity promotion gates tied to the component matrix.

## Phase 2 — Shared foundations

### Styling and customization

- [x] Define typed color, size, style, shape, placement, orientation, and density vocabularies. Nine public `Zd*` aliases cover recurring daisyUI modifiers and logical layout concepts without runtime payload; component-specific values remain local, exact compile-time tests reject widening, and the customization boundary is documented.
- [x] Define host class composition without blocking consumer classes. A private token composer and Angular host class-map convention preserve static and dynamic consumer sources, replace stale library modifiers, and honor explicit consumer per-token precedence without DOM class mutation.
- [x] Define per-instance CSS variable and style overrides. Native Angular style bindings remain the public API; tested host-source composition covers static/map/per-property styles, custom properties, units, updates, fallback and clearing semantics, plus the documented overlapping `NgStyle` boundary without a duplicate generic input.
- [x] Define named part/slot conventions for compound components. Component-scoped static selectors
      use optional functional directives only when styling or behavior requires them; Angular's
      projection, ordering, fallback, forwarding, customization, and SSR boundaries are tested and
      documented without a generic runtime abstraction.
- [x] Support daisyUI class prefixes and Tailwind prefixes. One immutable application provider and
      shared class-name service cover empty, daisyUI-only, Tailwind-only, and combined spelling;
      exact build-time candidate registration, validation, source detection, SSR boundaries, and
      the `theme-controller` exception are documented and tested against installed and floor lanes.
- [x] Support global, nested, and per-component themes. Native global boundaries follow daisyUI's
      configured root, while the standalone `ZdTheme` directive establishes exact, inheritable
      boundaries on native or Angular component hosts. Built-in/custom scopes, default and custom
      roots, preferred dark, clearing, SSR/hydration, and portaled-overlay ownership are tested and
      documented without adding browser-global state or duplicating the future Theme Controller.
- [~] Support global component defaults and local overrides. The precedence, eligible-input,
  omission/null, application-only DI, immutability, SSR, entry-point, and first-component proof
  contracts are documented. The typed provider feature remains intentionally pending until the
  first real component can validate it without an untyped registry or premature catalog schema.
- [x] Document safe customization versus reliance on non-semver internal daisyUI variables. The
      supported hierarchy distinguishes Zordon-owned hooks, documented upstream classes/theme
      tokens, consumer CSS, exact-version daisyUI component internals, and unsupported source-only
      details; contributor inventory, prefix, compatibility, and visual-test gates are defined.

### Interaction primitives

- [x] Define the Angular Aria adoption, ownership, preview-containment, and 68-component mapping policy. Eight underlying directive families and four documented compositions are mapped to direct, conditional, and native-first component use without adding a runtime dependency before the first consuming component.
- [ ] Unique ID generation that is stable across SSR and hydration.
- [ ] Integrate and version-align `@angular/aria` with Angular/CDK when the first consuming component is built; validate minimum/latest Angular, SSR/hydration, public API isolation, bundle impact, and published peer ranges.
- [ ] Use Angular Aria roving tabindex, active-descendant, and typeahead behavior where available; add a private utility only for a documented unsupported pattern.
- [ ] Focus trap, initial focus, focus restoration, and focus-visible utilities.
- [ ] Outside interaction and Escape-key dispatching.
- [ ] Overlay/portal host, stacking, positioning, collision detection, and scroll strategies.
- [ ] Body scroll lock and scrollbar-gutter handling.
- [ ] Directionality and logical placement mapping.
- [ ] Reduced-motion policy and animation state utilities.
- [ ] Live announcer and accessible description/error association.
- [ ] Form control base behavior, touched state, disabled state, validation, and error IDs.
- [ ] Async action state and cancellation conventions.

### Testing and documentation foundations

- [ ] Shared test harness base and interaction helpers that compose Angular Aria's private implementation harnesses without leaking them from `@pranxy/zordon-ui/testing`.
- [ ] Theme, direction, viewport, motion, and forced-colors test fixtures.
- [ ] Component documentation template covering anatomy, API, accessibility, forms, theming, and examples.
- [ ] Visual story matrix generator or equivalent documented convention.
- [ ] Public API extraction and breaking-change detection.

## Recommended delivery sequence

The component IDs refer to the master matrix below.

### Phase 3 — Native primitives and layout

Build lightweight directives and structural components first so later composites can reuse them.

- ACT-01 Button
- NAV-03 Link
- INP-06 Label
- INP-03 Fieldset
- DSP-02 Avatar
- DSP-03 Aura
- DSP-04 Badge
- DSP-05 Card
- DSP-07 Chat Bubble
- DSP-13 Kbd
- DSP-15 Stat
- DSP-16 Status
- LYT-01 Divider
- LYT-03 Footer
- LYT-04 Hero
- LYT-05 Indicator
- LYT-06 Join
- LYT-07 Mask
- MCK-01 Browser Mockup
- MCK-02 Code Mockup
- MCK-03 Phone Mockup
- MCK-04 Window Mockup

Exit gate: **22 / 22 rows Done**.

### Phase 4 — Angular form controls

- INP-02 Checkbox
- INP-04 File Input
- INP-05 Filter
- INP-07 Radio
- INP-08 Range
- INP-09 Rating
- INP-10 Select
- INP-11 Text Input
- INP-12 Textarea
- INP-13 Toggle
- INP-14 Validator
- INP-15 OTP
- INP-01 Calendar

Exit gate: **13 / 13 rows Done**, with typed Reactive Forms coverage and consistent validation behavior.

### Phase 5 — Actions, disclosure, overlays, and feedback

- ACT-02 Dropdown
- ACT-03 FAB / Speed Dial
- ACT-04 Modal
- ACT-05 Swap
- ACT-06 Theme Controller
- FDB-01 Alert
- FDB-02 Loading
- FDB-03 Progress
- FDB-04 Radial Progress
- FDB-05 Skeleton
- FDB-06 Toast
- FDB-07 Tooltip
- DSP-01 Accordion
- DSP-08 Collapse
- DSP-09 Countdown
- DSP-10 Diff
- DSP-06 Carousel

Exit gate: **17 / 17 rows Done**, including overlay, focus, scroll, and live-region integration tests.

### Phase 6 — Navigation and application layout

- NAV-01 Breadcrumbs
- NAV-02 Dock
- NAV-04 Megamenu
- NAV-05 Menu
- NAV-06 Navbar
- NAV-07 Pagination
- NAV-08 Steps
- NAV-09 Tabs
- LYT-02 Drawer

Exit gate: **9 / 9 rows Done**, including Angular Router, responsive, RTL, and keyboard coverage.

### Phase 7 — Advanced data display and effects

- DSP-11 Hover 3D Card
- DSP-12 Hover Gallery
- DSP-14 List
- DSP-17 Table
- DSP-18 Text Rotate
- DSP-19 Timeline
- LYT-08 Stack

Exit gate: **7 / 7 rows Done**, including performance and reduced-motion checks.

## Master component matrix

### Actions — 6

| ID     | Component        | Required feature scope                                                                                                                                                                   | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                                  |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | ------------------------------------------------------------------------------------------------------ |
| ACT-01 | Button           | Semantic colors; outline/dash/soft/ghost/link; xs–xl; wide/block/square/circle; active, disabled, loading; icons; native button/link/input modes; pressed and async action states        |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| ACT-02 | Dropdown         | All placements/alignments; click/hover/focus/manual triggers; controlled state; auto-flip; outside/Escape close; focus restoration; arbitrary/menu content; nested menus; close policies |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Menu for action/menu mode; arbitrary content keeps separate semantics; depends on overlay |
| ACT-03 | FAB / Speed Dial | Single, vertical, and flower arrangements; labels/tooltips; main/close action; corner/offset configuration; controlled state; keyboard; safe areas                                       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on Button and Tooltip                                                                          |
| ACT-04 | Modal            | Declarative and service APIs; native dialog/fallback; placements/sizes/fullscreen; focus trap/restore; backdrop/Escape; scroll; nesting/queue; async confirmation; close guards          |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay foundation                                                                          |
| ACT-05 | Swap             | On/off/indeterminate; rotate/flip/custom transition; projected states; checkbox/toggle/manual modes; controlled value; disabled/read-only; reduced motion                                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| ACT-06 | Theme Controller | Checkbox/toggle/radio/select/button UIs; theme registry; light/dark/system; persistence; cross-tab sync; nested scopes; SSR-safe initialization; change events                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on theme foundation                                                                            |

### Data display — 19

| ID     | Component     | Required feature scope                                                                                                                                                        | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                             |
| ------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | ------------------------------------------------------------------------------------------------- |
| DSP-01 | Accordion     | Single and optional multi-open; radio/details/controlled modes; arrow/plus/custom indicators; disabled/default-open; keyboard; lazy/preserved content; deep links; nested use |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Base on Angular Aria Accordion; Zordon owns daisyUI anatomy and public state                      |
| DSP-02 | Avatar        | Image/initial/icon placeholders; fallback; online/offline/custom presence; sizing, masks, rings; lazy loading; selectable mode; groups and overflow counter                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on Mask/Status only for compositions, not core                                            |
| DSP-03 | Aura          | Dual/rainbow/holo/gold/silver/glow; xs–xl; custom colors/background/radius/padding/intensity/duration; conditional activation; reduced motion; directive use                  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-04 | Badge         | Colors; outline/dash/soft/ghost; xs–xl; text/icon/dot; removable/selectable; status and counter behavior; embedding compositions                                              |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-05 | Card          | Figure/title/subtitle/body/actions/footer/badge slots; border/dash; side/image-full; xs–xl; responsive layout; interactive/disabled/loading/expandable states                 |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-06 | Carousel      | Horizontal/vertical; start/center/end snap; controls/dots/thumbnails; controlled index; pointer/wheel/keyboard; loop/autoplay; responsive/variable slides; lazy/virtual; RTL  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Performance review required                                                                       |
| DSP-07 | Chat Bubble   | Start/end; semantic colors; avatar/header/time/body/footer; delivery/read/error; grouping; media/attachments/reactions/replies; typing/loading; RTL                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-08 | Collapse      | Focus/checkbox/details/controlled modes; arrow/plus/custom indicator; force open/close; outside close; disabled; lazy/preserved content; animated size                        |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Native disclosure first; Angular Aria Accordion only for grouped mode                             |
| DSP-09 | Countdown     | Animated 0–999 segments; digit count; count up/down; target date/duration; time units; pause/resume/reset; completion/tick; formatting/timezone; SSR timing                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-10 | Diff          | Image/text/projected layers; controlled position; horizontal/vertical; pointer/touch/keyboard resizer; min/max/step; labels; reset                                            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-11 | Hover 3D Card | Tilt/perspective/glare/scale/shadow; pointer values; hover/focus activation; reset; mobile policy; static and reduced-motion modes                                            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Optional effects entry point decision                                                             |
| DSP-12 | Hover Gallery | Data/projected images; hover-position, click, pointer and swipe selection; controlled index; preload/lazy/fallback; captions; keyboard; autoplay; responsive ratio            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-13 | Kbd           | xs–xl; single key and sequences; platform-aware labels; separators; accessible expanded names; custom symbols; active state                                                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-14 | List          | Projected/data rows; leading/main/wrapping/grow/trailing parts; dividers/groups; active/disabled/selection; actions; keyboard; reorder; empty/loading; virtualization         |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Listbox only for selectable mode; plain lists remain native; virtualization decision |
| DSP-15 | Stat          | Title/value/description/figure/actions; groups and responsive orientation; trends; formatting; live values; delta; loading/error; chart slot                                  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-16 | Status        | Semantic colors; xs–xl; dot/pulse/custom marker; state presets; visible/hidden labels; conditional animation; live announcements                                              |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-17 | Table         | Sizes/zebra/pinning; data/projected columns; sort/filter/page/select/expand/actions; sticky/resizable/reorderable columns; responsive/virtual; keyboard/caption               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Native table for read-only mode; Angular Aria Grid for interactive data-grid mode                 |
| DSP-18 | Text Rotate   | Data-driven values; timing/transitions; loop/finite; pause; controlled index; controls; dynamic content; announcement policy; reduced motion                                  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |
| DSP-19 | Timeline      | Horizontal/vertical/compact; start/end/alternate; icons/connectors; state colors; rich content; responsive orientation; interactive events; progress semantics                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                   |

### Navigation — 9

| ID     | Component   | Required feature scope                                                                                                                                         | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                         |
| ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | --------------------------------------------------------------------------------------------- |
| NAV-01 | Breadcrumbs | Router links; icons; current page; separators; middle collapse; maximum items; scrolling; responsive labels; overflow dropdown; structured data                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                               |
| NAV-02 | Dock        | xs–xl; icons/labels/badges; active/disabled; Router sync; keyboard; safe area; fixed/sticky; responsive visibility and overflow                                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                               |
| NAV-03 | Link        | Semantic colors; hover underline; native and Router links; external/download; disabled; current route; icons; new-window indication                            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Prefer directive                                                                              |
| NAV-04 | Megamenu    | Anchored/full-width panels; click/hover/focus/manual; arbitrary multi-column content; Router state; menubar keyboard; delays; outside/Escape; mobile fallback  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Menubar/Menu only for application commands; site navigation remains native       |
| NAV-05 | Menu        | Vertical/horizontal; xs–xl; titles/separators/submenus; active/focus/disabled; Router; icons/badges/shortcuts; roving focus/typeahead; controlled tree; RTL    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Choose Angular Aria Menu for commands or Tree for hierarchy; native links for site navigation |
| NAV-06 | Navbar      | Start/center/end slots; brand/menu/actions; sticky/fixed/static; transparent state; desktop/mobile; drawer integration; Router state; landmark semantics       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                               |
| NAV-07 | Pagination  | Page/page-size/total; first/previous/next/last; sibling/ellipsis algorithms; unknown total; loading/disabled; query-param sync; responsive; announcements      |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on Button/Join                                                                        |
| NAV-08 | Steps       | Horizontal/vertical; colors/icons; complete/current/upcoming/error/disabled; interactive or display-only; linear mode; wizard integration; responsive          |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                               |
| NAV-09 | Tabs        | Box/border/lift; sizes/orientations; controlled active tab; disabled/closable/reorderable; lazy/preserved panels; keyboard; activation modes; overflow; Router |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Base on Angular Aria Tabs; Zordon owns Router, overflow, close/reorder, and styling           |

### Feedback — 7

| ID     | Component       | Required feature scope                                                                                                                                      | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                             |
| ------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | --------------------------------- |
| FDB-01 | Alert           | Info/success/warning/error; soft/outline/dash; responsive direction; icon/title/body/actions; dismiss/auto-dismiss; details; live-region modes              |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                   |
| FDB-02 | Loading         | Spinner/dots/ring/ball/bars/infinity; xs–xl; colors; accessible labels; inline/center/overlay; delayed display; custom loader; reduced motion               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                   |
| FDB-03 | Progress        | Determinate/indeterminate; value/max; colors; labels/formatting; optional buffer; animation; completion; reduced motion                                     |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                   |
| FDB-04 | Radial Progress | Value/max; size/thickness; colors; projected label/icon; indeterminate; animation; thresholds; reduced motion                                               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                   |
| FDB-05 | Skeleton        | Text/rectangle/circle/custom; dimensions/radius; multiline and composition presets; animation/speed; loading-region semantics; reduced motion               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                   |
| FDB-06 | Toast           | Declarative outlet and service; all positions; semantic/custom content; timeout/pause/actions/dismiss; promise flow; queue/limit/dedupe; live priority; SSR |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay/live announcer |
| FDB-07 | Tooltip         | All placements; colors; hover/focus/touch/manual; delay; auto-flip/shift; arrow; rich content; interactive mode; disabled triggers; ARIA                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay foundation     |

### Data input — 15

| ID     | Component  | Required feature scope                                                                                                                                       | Spec | Build | Tests | A11y | Docs | Visual |                              Done | Notes                                                                                            |
| ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---: | ----: | ----: | ---: | ---: | -----: | --------------------------------: | ------------------------------------------------------------------------------------------------ |
| INP-01 | Calendar   | Inline/popup; single/multiple/range; min/max/disabled dates; month/year navigation; locale/week start/date adapter; custom cells; keyboard; forms; timezone  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Angular Aria Grid for date-grid interaction; Zordon owns date/locale/forms logic                 |
| INP-02 | Checkbox   | Colors; xs–xl; checked/unchecked/indeterminate; disabled/read-only; custom true/false values; labels/descriptions; groups/select-all; forms/validation       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native input directive plus group component                                               |
| INP-03 | Fieldset   | Native legend; label/description/help/error slots; horizontal/vertical/responsive; disabled group; required marker; summaries; nested groups                 |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] |                                                                                                  |
| INP-04 | File Input | Colors/sizes; single/multiple; accept/capture; drag/drop; list/remove/clear; count/size/type validation; previews; upload progress; forms                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Security and object URL cleanup tests                                                            |
| INP-05 | Filter     | Radio selection and reset; styles/sizes; controlled state; disabled; icons/counts; data options; Router/query sync; keyboard; responsive overflow            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Depends on Button/Radio concepts                                                                 |
| INP-06 | Label      | Before/after; native association and stable IDs; required/optional; description/hint/counter/error; hidden mode; compound control support                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer directive/component pair                                                                  |
| INP-07 | Radio      | Colors; xs–xl; group value; disabled/read-only; layouts; descriptions/custom options; arrow-key navigation; forms/validation                                 |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Native radio directive plus group component                                                      |
| INP-08 | Range      | Colors/sizes; min/max/step; marks/ticks/labels; value tooltip; vertical/RTL; keyboard; formatting; discrete/continuous; optional dual thumb; forms           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] | Dual-thumb packaging/API decision |
| INP-09 | Rating     | Custom maximum; whole/half; masks/colors/sizes; clear; hover preview; controlled/read-only/disabled; keyboard; custom icons; forms                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] |                                                                                                  |
| INP-10 | Select     | Colors/ghost/sizes; native single/multiple/optgroups/placeholder; disabled options; forms/validation; optional searchable async/tag/virtual advanced variant |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Native select stays distinct; advanced modes compose Angular Aria Combobox/Listbox + CDK Overlay |
| INP-11 | Text Input | Colors/ghost/xs–xl; native types; icons/add-ons/prefix/suffix; clear/password actions; count/mask/debounce; native attrs; forms/validation                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native input directive plus field composition                                             |
| INP-12 | Textarea   | Colors/ghost/sizes; controlled value; resize/auto-grow; min/max rows; count; validation; disabled/read-only; forms and field parts                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native textarea directive                                                                 |
| INP-13 | Toggle     | Colors; xs–xl; checked/unchecked/optional indeterminate; disabled/read-only/loading; labels/icons; forms; switch semantics                                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native checkbox directive                                                                 |
| INP-14 | Validator  | Valid/invalid/pending; hints/errors; touched/dirty/submitted policies; native constraints; Reactive Forms; optional Signal Forms; ARIA association           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Cross-cutting dependency for all form controls                                                   |
| INP-15 | OTP        | Configurable length/character set; visual cells; input strategy; auto-advance/backspace; paste/autofill; masking; states; validation; completion; forms      |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Mobile and password-manager testing required                                                     |

### Layout — 8

| ID     | Component | Required feature scope                                                                                                                              | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                         |
| ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | ----------------------------- |
| LYT-01 | Divider   | Vertical/horizontal/responsive; start/center/end label; colors; empty separator; custom line thickness/style/spacing; semantic/decorative modes     |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |
| LYT-02 | Drawer    | Start/end; controlled state; responsive persistent/modal/push modes; backdrop/Escape; focus/scroll; widths; swipe; nesting; route close; safe areas |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay foundation |
| LYT-03 | Footer    | Responsive direction; centered variant; brand/link groups/social/newsletter/legal slots; collapsible mobile groups; theme scope; landmark           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |
| LYT-04 | Hero      | Media/background/overlay/content; centered/side layouts; responsive reversal; height; image/video; title/body/actions; loading; heading semantics   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |
| LYT-05 | Indicator | All logical placements; multiple indicators; offsets; badge/status/arbitrary content; responsive placement; conditional visibility; RTL             |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |
| LYT-06 | Join      | Horizontal/vertical/responsive; automatic radii; arbitrary items; segmented behavior; optional keyboard; disabled; equal width; wrapping            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |
| LYT-07 | Mask      | All daisyUI shapes; image/projected content; sizing/object fit; custom CSS mask; accessible image handling; unsupported fallback                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Prefer directive              |
| LYT-08 | Stack     | Layered items; alignment/offset/depth/count; active layer; next/previous; click/drag; z-order; animations; static/reduced-motion modes              |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                               |

### Mockups — 4

| ID     | Component      | Required feature scope                                                                                                                         | Spec | Build | Tests | A11y | Docs | Visual |                            Done | Notes                                        |
| ------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ------------------------------: | -------------------------------------------- |
| MCK-01 | Browser Mockup | Chrome/content slots; URL/title; controls; themes; responsive sizing; loading/screenshot/content modes; visual overrides                       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                             [ ] | Decorative semantics by default              |
| MCK-02 | Code Mockup    | Lines; prompts/numbers; highlighted/error/success rows; title/actions; copy; language label; highlighting integration; overflow; copy feedback |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                             [ ] | Do not force a syntax highlighter dependency |
| MCK-03 | Phone Mockup   | Screen slot; dimensions/color/border; portrait/landscape; device details; safe area; responsive scale; optional frame variants                 |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                             [ ] | Decorative semantics by default              |
| MCK-04 | Window Mockup  | Window chrome/content; title/toolbar/actions; active/inactive; dimensions; themes; loading/empty; border/shadow/radius overrides               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] | Decorative semantics by default |

## Cross-cutting verification matrix

These are release-level checks in addition to component-level tests.

### Compatibility

- [ ] Minimum supported Angular version.
- [ ] Latest supported Angular version.
- [ ] Zone-based and zoneless applications.
- [ ] Development and production builds.
- [ ] SSR render and client hydration.
- [ ] Chrome, Edge, Firefox, Safari, iOS Safari, and Android Chrome in the approved support matrix.
- [ ] Pointer, touch, keyboard-only, and screen-reader interaction.

### Styling

- [ ] Default light and dark themes.
- [ ] At least one low-radius and one high-radius theme.
- [ ] At least one custom consumer theme.
- [ ] Nested theme scopes.
- [ ] daisyUI class prefix enabled.
- [ ] Consumer class/style/CSS variable overrides.
- [ ] LTR and RTL.
- [ ] Narrow mobile, tablet, desktop, and high-zoom layouts.
- [ ] Forced-colors/high-contrast and reduced-motion modes.

### Forms

- [ ] Standalone FormControl.
- [ ] Typed FormGroup.
- [ ] FormArray/dynamic controls.
- [ ] Disabled state set by Angular Forms.
- [ ] Programmatic value changes and reset.
- [ ] Touched, dirty, pending, valid, and invalid states.
- [ ] Synchronous and asynchronous validators.
- [ ] Native form submission and browser autofill.

### Performance and packaging

- [ ] Every component is independently tree-shakeable.
- [ ] Services do not retain destroyed component instances.
- [ ] Overlays, timers, observers, object URLs, and global listeners are cleaned up.
- [ ] Large List, Table, Select, Carousel, and Gallery scenarios meet agreed performance budgets.
- [ ] No unexpected global CSS or theme leakage.
- [ ] Package contains only intended public files and exports.
- [ ] Bundle budgets pass for core and optional entry points.

## Release milestones

### Foundation preview

- [ ] Phases 0–2 complete.
- [ ] Documentation app and CI publicly usable.
- [ ] First primitives published under a preview tag.

### Alpha

- [ ] Phase 3 complete.
- [ ] Public API extraction and visual regression are stable.
- [ ] Consumer feedback collected on composition and customization.

### Beta

- [ ] Phases 4–6 complete.
- [ ] Forms, overlays, Router, SSR, and accessibility suites pass.
- [ ] No known architecture changes expected before 1.0.

### Release candidate

- [ ] Phase 7 complete: all 68 component rows are Done.
- [ ] Migration and upgrade documentation complete.
- [ ] Bundle, browser, theme, and compatibility matrices pass.
- [ ] No critical or high-severity defects.

### Version 1.0.0

- [ ] Phase 8 complete.
- [ ] Public API and semver policy approved.
- [ ] Package provenance, changelog, release notes, and documentation are published.
- [ ] Post-release support and patch process is assigned.

## Risks and decision watchlist

| Risk                                                                                                                                                 | Mitigation                                                                                                                 | Status |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -----: |
| daisyUI minor releases can change internal component CSS variables                                                                                   | Use the documented customization hierarchy; pin exact versions for internals; add per-component compatibility tests        |    [~] |
| Wrapping native controls can damage semantics or form behavior                                                                                       | Prefer directives on native elements and keep advanced composites separate                                                 |    [ ] |
| Overlay components can diverge in focus, stacking, and dismissal behavior                                                                            | Build and test one shared overlay foundation before composites                                                             |    [ ] |
| Advanced components can make the core package heavy                                                                                                  | Use optional entry points and explicit dependency budgets                                                                  |    [ ] |
| SSR-generated IDs can mismatch during hydration                                                                                                      | Use a deterministic shared ID strategy and hydration tests                                                                 |    [ ] |
| Theme customization can be blocked by view encapsulation                                                                                             | Establish host/part/CSS variable conventions before component work                                                         |    [ ] |
| Signal Forms API stability may change                                                                                                                | Keep stable CVA/Reactive Forms core; isolate optional adapter                                                              |    [ ] |
| Angular Aria is developer preview in Angular 21 and can change before stabilization                                                                  | Keep it behind Zordon APIs, pin/test supported minor lines, use official harnesses, and run minimum/latest + SSR gates     |    [~] |
| Visual completeness can hide accessibility gaps                                                                                                      | A11y is an independent completion column and release gate                                                                  |    [ ] |
| “Implemented” can be confused with “production ready”                                                                                                | Mark Done only after tests, a11y, docs, and visual verification pass                                                       |    [ ] |
| The current documentation app exceeds its initial bundle warning budget by 91.97 kB                                                                  | Replace legacy demo dependencies and set evidence-based budgets before beta                                                |    [ ] |
| Production npm audit is clean; the full workspace has 5 development-only findings (1 high, 4 moderate) upstream in Angular 21 CLI/build dependencies | Monitor Angular 21 patches; do not accept npm's Angular 22 upgrade or invalid CLI downgrade while v1 targets Angular 21–22 |    [~] |

## Progress log

Add newest entries first.

| Date       | Change                                                                                                                                                                                                        | Components/phases     | Owner or link                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- |
| 2026-08-11 | Defined stable Zordon, documented upstream, consumer-owned, exact-version internal, and unsupported customization layers, with component inventory, prefix, compatibility, and visual-test gates.             | Phase 2 customization | `docs/foundations/safe-customization.md`    |
| 2026-08-10 | Defined intrinsic/application/local component-default precedence, eligible inputs, DI scope, immutable merge rules, and the evidence required before the first typed defaults provider is exported.           | Phase 2 defaults      | `docs/foundations/component-defaults.md`    |
| 2026-08-10 | Added native global theme-root guidance and the public `ZdTheme` directive for exact nested/component-host scopes, with real CSS inheritance, preferred-dark, custom-root, SSR/hydration, and package tests.  | Phase 2 themes        | `docs/foundations/theme-scopes.md`          |
| 2026-08-10 | Added immutable application-level daisyUI/Tailwind prefix configuration, centralized class generation, exact candidate-source guidance, installed/floor compiler gates, and public integration documentation. | Phase 2 prefixes      | `docs/foundations/class-prefixes.md`        |
| 2026-08-10 | Defined component-scoped named part selectors, optional functional directives, anatomy/cardinality rules, static projection and forwarding boundaries, plus focused Angular integration coverage.             | Phase 2 composition   | `docs/foundations/named-parts-and-slots.md` |
| 2026-08-10 | Adopted Angular Aria as the native-first headless interaction foundation, mapped its eight directive families and four composed patterns to the catalog, and contained preview APIs behind Zordon contracts.  | Phase 2 interaction   | `docs/foundations/angular-aria-adoption.md` |
| 2026-08-10 | Defined native Angular per-instance style and CSS-variable ownership with tested updates, fallbacks, explicit clearing, units, security, SSR, and `NgStyle` boundaries.                                       | Phase 2 styles        | `docs/foundations/`                         |
| 2026-08-10 | Added the private host-class token composer and Angular integration contract for additive static/dynamic consumer classes, reactive modifier updates, and explicit per-token precedence.                      | Phase 2 host classes  | `docs/foundations/`                         |
| 2026-08-10 | Added public type-only color, size, style, shape, placement, orientation, and density vocabularies with exact compile-time contracts and customization guidance.                                              | Phase 2 vocabularies  | `docs/foundations/`                         |
| 2026-08-10 | Added force-included implementation coverage, 100% per-file thresholds, a tested empty/missing/uncovered-report guard, contributor guidance, and a controlled failure proof.                                  | Phase 1 coverage      | `docs/testing/`                             |
| 2026-08-10 | Added the contributor workflow plus public API review, deprecation/breaking-change, and component maturity policies tied to the plan, ADRs, Changesets, and actual validation commands.                       | Phase 1 governance    | `docs/contributing/`                        |
| 2026-08-10 | Added Changesets version/changelog preparation, stable and four prerelease channels, tested package/tag/lineage guards, npm dry runs, and protected OIDC provenance publishing.                               | Phase 1 release       | `.github/workflows/`                        |
| 2026-08-09 | Added a clean Angular SSR application and production hydration gate covering server HTML, JavaScript-disabled rendering, post-hydration interaction, browser errors, and accessibility.                       | Phase 1 SSR           | `projects/ssr-example/`                     |
| 2026-08-09 | Added automatic raw/gzip package budgets for primary, component, testing, and Signal Forms entry points; checker tests and the production build-and-check command pass.                                       | Phase 1 bundle size   | `bundle-size-budgets.json`                  |
| 2026-08-09 | Added eight reviewed Playwright visual baselines across representative themes, breakpoints, and dialog state, with isolated comparison/update commands and a Windows CI gate.                                 | Phase 1 visual tests  | `e2e/__screenshots__/`                      |
| 2026-08-07 | Patched Angular to 21.2.19/CLI 21.2.20, PostCSS to 8.5.26, ng-packagr to 21.2.7, and compatible transitives. Production audit is clean; all build/test gates pass.                                            | Phase 1 security      | Dependency manifests                        |
| 2026-08-07 | Confirmed MIT, added repository/package license files, and completed Phase 0.                                                                                                                                 | Phase 0               | `LICENSE`                                   |
| 2026-08-07 | Added a clean `src/public-api.ts`, scoped linting away from legacy sources, consolidated formatting configuration, and added lint/format CI gates.                                                            | Phase 1               | Workspace configuration                     |
| 2026-08-07 | Re-ran the local CI-equivalent gates: partial-Ivy library build, Vitest with coverage, and deterministic production docs build all pass. The docs build retains a tracked budget warning.                     | Phase 1 verification  | Local build/test                            |
| 2026-08-07 | Added the initial GitHub Actions build/test/coverage/docs workflow and disabled network-dependent font inlining for deterministic production builds.                                                          | Phase 1               | `.github/workflows/ci.yml`                  |
| 2026-08-07 | Replaced the empty Karma target with Angular's Vitest runner, jsdom, coverage tooling, and a library smoke test.                                                                                              | Phase 1               | Test configuration                          |
| 2026-08-07 | Verified the documentation application development build with daisyUI 5.7.16 and replaced obsolete installation claims in the root README with current project status and commands.                           | Phase 1               | `README.md`                                 |
| 2026-08-07 | Verified a clean partial-Ivy production build and npm pack dry run for `@pranxy/zordon-ui@0.0.0-next.0`; synchronized the workspace to daisyUI 5.7.16.                                                        | Phase 1               | Build output                                |
| 2026-08-07 | Aligned the library manifest with the accepted package and peer-dependency policy, and disabled legacy Button/Badge secondary-entry-point manifests without deleting their source.                            | Phase 1               | `projects/components/`                      |
| 2026-08-07 | Accepted the initial platform, API, styling, overlay, forms, packaging, accessibility, SSR, and localization ADRs. Kept Phase 0 open for the package license decision.                                        | Phase 0               | `docs/architecture/`                        |
| 2026-08-07 | Baseline production build reached the legacy `components/badge` entry point and failed during partial compilation. The obsolete implementation will not define the new API.                                   | Phase 1 baseline      | Local build                                 |
| 2026-08-07 | Created the initial build plan and 68-component tracking matrix                                                                                                                                               | Planning              | Codex                                       |

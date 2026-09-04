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
- [x] Add bundle-size budgets for the primary and optional entry points. The generated-export gate enforces raw and gzip FESM ceilings for the primary entry point, every future component entry point, and optional testing/Signal Forms integrations; tooling tests, the production build-and-check command, and the CI gate pass. The current primary artifact is 6.62 KiB raw and 2.14 KiB gzip.
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
- [x] Add deterministic ID generation for SSR and hydration. The public, root-provided
      `ZdIdGenerator` uses Angular `APP_ID`, collision-free application namespaces, and
      instance-owned per-scope counters without DOM, random, or module-global state. Unit and real
      SSR tests prove application/request isolation, accessible relationships, consecutive-response
      equality, and ordinary hydration; independently triggered incremental-hydration boundaries
      require explicit stable IDs until a concrete component proves that path.
- [ ] Integrate and version-align `@angular/aria` with Angular/CDK when the first consuming component is built; validate minimum/latest Angular, SSR/hydration, public API isolation, bundle impact, and published peer ranges.
- [ ] Use Angular Aria roving tabindex, active-descendant, and typeahead behavior where available; add a private utility only for a documented unsupported pattern.
- [x] Standardize focus trapping, initial focus, restoration, and focus-visible behavior. Simple
      structurally created regions compose public `CdkTrapFocus`; future animated, portaled, or
      nested overlays privately coordinate `FocusTrapFactory` with the Zordon overlay stack. Native
      `:focus-visible` is the styling default, while FocusMonitor remains an opt-in behavior tool.
- [x] Standardize outside interaction and Escape-key dispatch policy. Native dialog and popover
      behavior stays native-first, while future portaled surfaces consume public CDK `OverlayRef`
      event streams without global listeners or leaked CDK APIs. Installed-CDK and real-browser
      fixtures lock down cancellation, Escape classification, outside boundaries, drag behavior,
      cleanup, and SSR limits. Atomic top-only arbitration remains with the next private overlay
      stack because it requires real overlay references, parents, and lifecycles.
- [~] Overlay/portal host, stacking, positioning, collision detection, and scroll strategies. A
  private CDK-backed coordinator, handle, semantic stack, positioning mapper, scroll-policy
  boundary, and real-browser fixture are implemented. Completion waits for two actual overlay
  component secondary entry points to prove one shared package-level stack identity plus the
  first consumer's SSR/hydration path.
- [~] Body scroll lock and scrollbar-gutter handling. A private ref-counted CDK block-strategy
  adapter prevents sibling/nested overlays from unlocking underneath each other, preserves CDK's
  scroll-position and classic-gutter fallback, and documents consumer-owned `scrollbar-gutter`.
  Completion waits for a real blocking component's hydration and physical mobile proof plus the
  overlay foundation's two-entry shared-identity gate.
- [~] Directionality and logical placement mapping. CDK `Directionality` is the sole horizontal
  LTR/RTL source; private overlays resolve the content scope, propagate it into portals, and update
  plus reposition on live changes without pre-flipping logical start/end. Completion waits for the
  first published component's browser and SSR/hydration proof.
- [~] Reduced-motion policy and animation state utilities. Static semantic state is the default;
  non-essential CSS motion is enabled only under `prefers-reduced-motion: no-preference`, daisyUI
  motion is inventoried per component, and a real-browser fixture proves live preference changes do
  not reset state. A reusable JavaScript/lifecycle utility remains pending until the first concrete
  consumer can define and verify its cancellation, SSR/hydration, and package boundary.
- [~] Live announcer and accessible description/error association. Native status/alert semantics,
  deterministic consumer-first description/error relationships, CDK reuse boundaries, SSR rules,
  and a real hydration fixture are documented and tested. A reusable imperative wrapper and manual
  assistive-technology proof remain pending until the first concrete Status, form, or Toast consumer.
- [~] Form control base behavior, touched state, disabled state, validation, and error IDs. Native
  controls retain Angular's built-in accessors; composite CVA ownership, Forms state, validation,
  error relationships, and SSR rules are documented and compatibility-tested without a premature
  generic base. Completion waits for one real native directive and one real composite control.
- [~] Async action state and cancellation conventions. Native events and form submission remain
  consumer-owned; pending, single-flight activation, cancellation versus stale-result rejection,
  errors, accessible feedback, cleanup, and SSR/hydration rules are documented and characterized
  without a generic task runner. Completion waits for ACT-01 Button's public API, package path,
  pre-hydration event replay, and manual assistive-technology proof.

### Testing and documentation foundations

- [~] Shared test harness base and interaction helpers. The component-first public-harness,
  Angular Aria composition, browser-proof, package-isolation, and helper-ownership contract is
  documented without an empty `@pranxy/zordon-ui/testing` entry point or a premature generic base.
  Completion waits for the first published component harness and its package/compatibility proof.
- [x] Theme, direction, viewport, motion, and forced-colors test fixtures. Internal Playwright
      profiles establish canonical before-navigation viewport/media and after-navigation document
      boundaries; Chromium characterizes every configured value, visual tests reuse deterministic
      profiles, and component/manual proof remains explicitly component-owned.
- [x] Component documentation template covering anatomy, API, accessibility, forms, theming, and examples. The reusable specification template records component-local decisions and evidence while linking the accepted shared contracts; it is discoverable from contributor and maturity workflows.
- [x] Visual story matrix generator or equivalent documented convention. The component-local story matrix selects and records material visual boundaries, grouped or inapplicable values, and the non-screenshot accessibility/SSR proof that image comparison cannot establish.
- [x] Public API extraction and breaking-change detection. API Extractor tracks the built primary
      declaration surface in a reviewed report, CI/release preparation reject drift, and public API
      review retains explicit DOM/behavioral evidence beyond declarations.

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

| ID     | Component        | Required feature scope                                                                                                                                                                   | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                                                                                                                                                               |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACT-01 | Button           | Semantic colors; outline/dash/soft/ghost/link; xs–xl; wide/block/square/circle; active, disabled, loading; icons; native button/link/input modes; pressed and async action states        |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Maturity: Planned. Native directive and typed defaults ship from `@pranxy/zordon-ui/button`; automated browser/SSR/axe/visual evidence is recorded, while manual AT, forced-colors, and Angular 21/22 compatibility remain pending. |
| ACT-02 | Dropdown         | All placements/alignments; click/hover/focus/manual triggers; controlled state; auto-flip; outside/Escape close; focus restoration; arbitrary/menu content; nested menus; close policies |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Menu for action/menu mode; arbitrary content keeps separate semantics; depends on overlay                                                                                                                              |
| ACT-03 | FAB / Speed Dial | Single, vertical, and flower arrangements; labels/tooltips; main/close action; corner/offset configuration; controlled state; keyboard; safe areas                                       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on Button and Tooltip                                                                                                                                                                                                       |
| ACT-04 | Modal            | Declarative and service APIs; native dialog/fallback; placements/sizes/fullscreen; focus trap/restore; backdrop/Escape; scroll; nesting/queue; async confirmation; close guards          |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay foundation                                                                                                                                                                                                       |
| ACT-05 | Swap             | On/off/indeterminate; rotate/flip/custom transition; projected states; checkbox/toggle/manual modes; controlled value; disabled/read-only; reduced motion                                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                                     |
| ACT-06 | Theme Controller | Checkbox/toggle/radio/select/button UIs; theme registry; light/dark/system; persistence; cross-tab sync; nested scopes; SSR-safe initialization; change events                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on theme foundation                                                                                                                                                                                                         |

### Data display — 19

| ID     | Component     | Required feature scope                                                                                                                                                        | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DSP-01 | Accordion     | Single and optional multi-open; radio/details/controlled modes; arrow/plus/custom indicators; disabled/default-open; keyboard; lazy/preserved content; deep links; nested use |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Base on Angular Aria Accordion; Zordon owns daisyUI anatomy and public state                                                                                                                                                                                                                                                                                                            |
| DSP-02 | Avatar        | Image/initial/icon placeholders; fallback; online/offline/custom presence; sizing, masks, rings; lazy loading; selectable mode; groups and overflow counter                   |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native consumer markup; Mask/Status and interactive host semantics remain compositions. Automated browser, SSR, axe, and visual evidence is recorded; manual AT, forced-colors, contrast, zoom/reflow, and image-fallback review remain pending.                                                                                                                                        |
| DSP-03 | Aura          | Dual/rainbow/holo/gold/silver/glow; xs–xl; custom colors/background/radius/padding/intensity/duration; conditional activation; reduced motion; directive use                  |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native wrapper directive with an exported scoped static reduced-motion stylesheet; custom appearance remains consumer CSS. Automated browser, SSR, axe, and visual evidence is recorded; manual AT, forced-colors, contrast, zoom/reflow, and product auto-motion review remain pending.                                                                                                |
| DSP-04 | Badge         | Colors; outline/dash/soft/ghost; xs–xl; text/icon/dot; removable/selectable; status and counter behavior; embedding compositions                                              |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native presentational directive: removable/selectable/status/counter behavior stays a consumer-owned native composition; custom appearance remains consumer CSS. Automated browser, SSR, axe, and visual evidence is recorded; manual AT, semantic-color contrast, forced-colors, zoom/reflow, and live-update review remain pending.                                                   |
| DSP-05 | Card          | Figure/title/subtitle/body/actions/footer/badge slots; border/dash; side/image-full; xs–xl; responsive layout; interactive/disabled/loading/expandable states                 |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native compound directives ship from `@pranxy/zordon-ui/card`; automated browser, SSR, axe, and visual evidence is recorded; manual image/semantic/interactive, contrast, forced-colors, zoom/reflow, RTL, and assistive-technology review remains pending.                                                                                                                             |
| DSP-06 | Carousel      | Horizontal/vertical; start/center/end snap; controls/dots/thumbnails; controlled index; pointer/wheel/keyboard; loop/autoplay; responsive/variable slides; lazy/virtual; RTL  |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native scroll-snap directives ship from `@pranxy/zordon-ui/carousel`; automated browser, SSR, axe, and visual evidence is recorded. Manual keyboard/control, semantic, contrast, forced-colors, zoom/reflow, RTL, assistive-technology, and performance review remain pending; controls, state, looping, autoplay, virtualization, and lazy loading require separate approved behavior. |
| DSP-07 | Chat Bubble   | Start/end; semantic colors; avatar/header/time/body/footer; delivery/read/error; grouping; media/attachments/reactions/replies; typing/loading; RTL                           |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native compound directives ship from `@pranxy/zordon-ui/chat-bubble`; automated browser, SSR, axe, and visual evidence is recorded; manual conversation, media, state, live-update, contrast, forced-colors, reflow, RTL, and assistive-technology review remains pending.                                                                                                              |
| DSP-08 | Collapse      | Focus/checkbox/details/controlled modes; arrow/plus/custom indicator; force open/close; disabled; lazy/preserved content; animated size                                       |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native disclosure directives ship from `@pranxy/zordon-ui/collapse`; `<details>/<summary>` remains preferred and checkbox/radio markup consumer-owned. Automated browser, SSR, axe, and visual evidence is recorded; manual AT and visual accessibility review remains pending. Angular Aria Accordion is reserved for a separately approved grouped mode.                              |
| DSP-09 | Countdown     | Animated 0–999 segments; digit count; count up/down; target date/duration; time units; pause/resume/reset; completion/tick; formatting/timezone; SSR timing                   |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native styling directive ships from `@pranxy/zordon-ui/countdown`; automated browser, SSR, axe, and visual evidence is recorded. Timer, scheduling, formatting, live announcements, and SSR timing require separate approved contracts; manual accessibility review remains pending.                                                                                                    |
| DSP-10 | Diff          | Image/text/projected layers; controlled position; horizontal/vertical; pointer/touch/keyboard resizer; min/max/step; labels; reset                                            |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native CSS-driven compound directives ship from `@pranxy/zordon-ui/diff`; automated browser, SSR, axe, and visual evidence is recorded. Consumer markup owns semantics, focusability, content, and styling; controlled position, custom interaction, and other behavior require a separately approved accessible contract.                                                              |
| DSP-11 | Hover 3D Card | Tilt/perspective/glare/scale/shadow; pointer values; hover/focus activation; reset; mobile policy; static and reduced-motion modes                                            |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native CSS wrapper directive ships from `@pranxy/zordon-ui/hover-3d`; automated browser, SSR, axe, and visual evidence is recorded. Consumer markup owns semantics and eight hover zones; custom motion behavior requires a separately approved interaction contract.                                                                                                                   |
| DSP-12 | Hover Gallery | Data/projected images; hover-position, click, pointer and swipe selection; controlled index; preload/lazy/fallback; captions; keyboard; autoplay; responsive ratio            |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native CSS wrapper directive ships from `@pranxy/zordon-ui/hover-gallery`; automated browser, SSR, axe, and visual evidence is recorded. Consumer markup owns media, alternatives, captions, loading, and semantics; selection, gesture, keyboard, and loading behavior require a separately approved accessible contract.                                                              |
| DSP-13 | Kbd           | xs–xl; single key and sequences; platform-aware labels; separators; accessible expanded names; custom symbols; active state                                                   |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native `<kbd>` directive is verified in browser, SSR/hydration, axe, and dark RTL mobile visual tests; manual shortcut naming, surrounding-control, forced-colors, contrast, zoom/reflow, RTL, localization, and assistive-technology review remain required.                                                                                                                           |
| DSP-14 | List          | Projected/data rows; leading/main/wrapping/grow/trailing parts; dividers/groups; active/disabled/selection; actions; keyboard; reorder; empty/loading; virtualization         |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Listbox only for selectable mode; plain lists remain native; virtualization decision                                                                                                                                                                                                                                                                                       |
| DSP-15 | Stat          | Title/value/description/figure/actions; groups and responsive orientation; trends; formatting; live values; delta; loading/error; chart slot                                  |  [x] |   [ ] |   [ ] |  [ ] |  [x] |    [ ] |  [ ] | Native compound Stat directives are specified; formatting, trends, live values, loading/error, charts, and actions remain consumer-owned.                                                                                                                                                                                                                                               |
| DSP-16 | Status        | Semantic colors; xs–xl; dot/pulse/custom marker; state presets; visible/hidden labels; conditional animation; live announcements                                              |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native Status directive is verified in browser, SSR/hydration, axe, and dark RTL mobile visual tests; labels, live updates, animation, forced colors, contrast, reflow, RTL, localization, and assistive-technology review remain consumer-owned manual gates.                                                                                                                          |
| DSP-17 | Table         | Sizes/zebra/pinning; data/projected columns; sort/filter/page/select/expand/actions; sticky/resizable/reorderable columns; responsive/virtual; keyboard/caption               |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Native table for read-only mode; Angular Aria Grid for interactive data-grid mode                                                                                                                                                                                                                                                                                                       |
| DSP-18 | Text Rotate   | Data-driven values; timing/transitions; loop/finite; pause; controlled index; controls; dynamic content; announcement policy; reduced motion                                  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                                                                                                                                                                                         |
| DSP-19 | Timeline      | Horizontal/vertical/compact; start/end/alternate; icons/connectors; state colors; rich content; responsive orientation; interactive events; progress semantics                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                                                                                                                                                                                         |

### Navigation — 9

| ID     | Component   | Required feature scope                                                                                                                                         | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                                  |
| ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | ------------------------------------------------------------------------------------------------------ |
| NAV-01 | Breadcrumbs | Router links; icons; current page; separators; middle collapse; maximum items; scrolling; responsive labels; overflow dropdown; structured data                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| NAV-02 | Dock        | xs–xl; icons/labels/badges; active/disabled; Router sync; keyboard; safe area; fixed/sticky; responsive visibility and overflow                                |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| NAV-03 | Link        | Semantic colors; hover underline; native and Router links; external/download; disabled; current route; icons; new-window indication                            |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native anchor directive; Router/current-route and external/new-window semantics remain consumer-owned. |
| NAV-04 | Megamenu    | Anchored/full-width panels; click/hover/focus/manual; arbitrary multi-column content; Router state; menubar keyboard; delays; outside/Escape; mobile fallback  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Angular Aria Menubar/Menu only for application commands; site navigation remains native                |
| NAV-05 | Menu        | Vertical/horizontal; xs–xl; titles/separators/submenus; active/focus/disabled; Router; icons/badges/shortcuts; roving focus/typeahead; controlled tree; RTL    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Choose Angular Aria Menu for commands or Tree for hierarchy; native links for site navigation          |
| NAV-06 | Navbar      | Start/center/end slots; brand/menu/actions; sticky/fixed/static; transparent state; desktop/mobile; drawer integration; Router state; landmark semantics       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| NAV-07 | Pagination  | Page/page-size/total; first/previous/next/last; sibling/ellipsis algorithms; unknown total; loading/disabled; query-param sync; responsive; announcements      |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on Button/Join                                                                                 |
| NAV-08 | Steps       | Horizontal/vertical; colors/icons; complete/current/upcoming/error/disabled; interactive or display-only; linear mode; wizard integration; responsive          |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                        |
| NAV-09 | Tabs        | Box/border/lift; sizes/orientations; controlled active tab; disabled/closable/reorderable; lazy/preserved panels; keyboard; activation modes; overflow; Router |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Base on Angular Aria Tabs; Zordon owns Router, overflow, close/reorder, and styling                    |

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

| ID     | Component  | Required feature scope                                                                                                                                       | Spec | Build | Tests | A11y | Docs | Visual |                              Done | Notes                                                                                                                                                     |
| ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---: | ----: | ----: | ---: | ---: | -----: | --------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INP-01 | Calendar   | Inline/popup; single/multiple/range; min/max/disabled dates; month/year navigation; locale/week start/date adapter; custom cells; keyboard; forms; timezone  |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Angular Aria Grid for date-grid interaction; Zordon owns date/locale/forms logic                                                                          |
| INP-02 | Checkbox   | Colors; xs–xl; checked/unchecked/indeterminate; disabled/read-only; custom true/false values; labels/descriptions; groups/select-all; forms/validation       |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native input directive plus group component                                                                                                        |
| INP-03 | Fieldset   | Native legend; label/description/help/error slots; horizontal/vertical/responsive; disabled group; required marker; summaries; nested groups                 |  [x] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Native fieldset, legend, and label directives; validation and projected content stay consumer-owned.                                                      |
| INP-04 | File Input | Colors/sizes; single/multiple; accept/capture; drag/drop; list/remove/clear; count/size/type validation; previews; upload progress; forms                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Security and object URL cleanup tests                                                                                                                     |
| INP-05 | Filter     | Radio selection and reset; styles/sizes; controlled state; disabled; icons/counts; data options; Router/query sync; keyboard; responsive overflow            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Depends on Button/Radio concepts                                                                                                                          |
| INP-06 | Label      | Before/after; native association and stable IDs; required/optional; description/hint/counter/error; hidden mode; compound control support                    |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |                               [ ] | Native label and floating-label directives; automated browser, SSR, axe, and visual evidence is recorded; manual AT and forced-colors review remain open. |
| INP-07 | Radio      | Colors; xs–xl; group value; disabled/read-only; layouts; descriptions/custom options; arrow-key navigation; forms/validation                                 |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Native radio directive plus group component                                                                                                               |
| INP-08 | Range      | Colors/sizes; min/max/step; marks/ticks/labels; value tooltip; vertical/RTL; keyboard; formatting; discrete/continuous; optional dual thumb; forms           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] | Dual-thumb packaging/API decision |
| INP-09 | Rating     | Custom maximum; whole/half; masks/colors/sizes; clear; hover preview; controlled/read-only/disabled; keyboard; custom icons; forms                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] |                                                                                                                                                           |
| INP-10 | Select     | Colors/ghost/sizes; native single/multiple/optgroups/placeholder; disabled options; forms/validation; optional searchable async/tag/virtual advanced variant |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Native select stays distinct; advanced modes compose Angular Aria Combobox/Listbox + CDK Overlay                                                          |
| INP-11 | Text Input | Colors/ghost/xs–xl; native types; icons/add-ons/prefix/suffix; clear/password actions; count/mask/debounce; native attrs; forms/validation                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native input directive plus field composition                                                                                                      |
| INP-12 | Textarea   | Colors/ghost/sizes; controlled value; resize/auto-grow; min/max rows; count; validation; disabled/read-only; forms and field parts                           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native textarea directive                                                                                                                          |
| INP-13 | Toggle     | Colors; xs–xl; checked/unchecked/optional indeterminate; disabled/read-only/loading; labels/icons; forms; switch semantics                                   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Prefer native checkbox directive                                                                                                                          |
| INP-14 | Validator  | Valid/invalid/pending; hints/errors; touched/dirty/submitted policies; native constraints; Reactive Forms; optional Signal Forms; ARIA association           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Cross-cutting dependency for all form controls                                                                                                            |
| INP-15 | OTP        | Configurable length/character set; visual cells; input strategy; auto-advance/backspace; paste/autofill; masking; states; validation; completion; forms      |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |                               [ ] | Mobile and password-manager testing required                                                                                                              |

### Layout — 8

| ID     | Component | Required feature scope                                                                                                                              | Spec | Build | Tests | A11y | Docs | Visual | Done | Notes                                                                                                                                                                                                                 |
| ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---: | ----: | ----: | ---: | ---: | -----: | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LYT-01 | Divider   | Vertical/horizontal/responsive; start/center/end label; colors; empty separator; custom line thickness/style/spacing; semantic/decorative modes     |  [x] |   [x] |   [x] |  [~] |  [x] |    [x] |  [ ] | Native host directive; `<hr>` is semantic, while text-bearing/decorative host semantics remain consumer-owned. Automated browser/SSR/axe/visual evidence is recorded; manual AT and forced-colors review remain open. |
| LYT-02 | Drawer    | Start/end; controlled state; responsive persistent/modal/push modes; backdrop/Escape; focus/scroll; widths; swipe; nesting; route close; safe areas |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Depends on overlay foundation                                                                                                                                                                                         |
| LYT-03 | Footer    | Responsive direction; centered variant; brand/link groups/social/newsletter/legal slots; collapsible mobile groups; theme scope; landmark           |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                       |
| LYT-04 | Hero      | Media/background/overlay/content; centered/side layouts; responsive reversal; height; image/video; title/body/actions; loading; heading semantics   |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                       |
| LYT-05 | Indicator | All logical placements; multiple indicators; offsets; badge/status/arbitrary content; responsive placement; conditional visibility; RTL             |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                       |
| LYT-06 | Join      | Horizontal/vertical/responsive; automatic radii; arbitrary items; segmented behavior; optional keyboard; disabled; equal width; wrapping            |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                       |
| LYT-07 | Mask      | All daisyUI shapes; image/projected content; sizing/object fit; custom CSS mask; accessible image handling; unsupported fallback                    |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] | Prefer directive                                                                                                                                                                                                      |
| LYT-08 | Stack     | Layered items; alignment/offset/depth/count; active layer; next/previous; click/drag; z-order; animations; static/reduced-motion modes              |  [ ] |   [ ] |   [ ] |  [ ] |  [ ] |    [ ] |  [ ] |                                                                                                                                                                                                                       |

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
| Wrapping native controls can damage semantics or form behavior                                                                                       | Prefer directives on native elements, retain built-in accessors, and keep advanced composites separate                     |    [~] |
| Overlay components can diverge in focus, stacking, and dismissal behavior                                                                            | Build and test one shared overlay foundation before composites; prove shared package identity with two real entries        |    [~] |
| Advanced components can make the core package heavy                                                                                                  | Use optional entry points and explicit dependency budgets                                                                  |    [ ] |
| SSR-generated IDs can mismatch during hydration                                                                                                      | Use the shared generator; require explicit IDs for independent incremental hydration                                       |    [~] |
| Theme customization can be blocked by view encapsulation                                                                                             | Establish host/part/CSS variable conventions before component work                                                         |    [ ] |
| Signal Forms API stability may change                                                                                                                | Keep stable CVA/Reactive Forms core; isolate optional adapter                                                              |    [ ] |
| Angular Aria is developer preview in Angular 21 and can change before stabilization                                                                  | Keep it behind Zordon APIs, pin/test supported minor lines, use official harnesses, and run minimum/latest + SSR gates     |    [~] |
| Visual completeness can hide accessibility gaps                                                                                                      | A11y is an independent completion column and release gate                                                                  |    [ ] |
| “Implemented” can be confused with “production ready”                                                                                                | Mark Done only after tests, a11y, docs, and visual verification pass                                                       |    [ ] |
| The current documentation app exceeds its initial bundle warning budget by 101.47 kB                                                                 | Replace legacy demo dependencies and set evidence-based budgets before beta                                                |    [ ] |
| Production npm audit is clean; the full workspace has 5 development-only findings (1 high, 4 moderate) upstream in Angular 21 CLI/build dependencies | Monitor Angular 21 patches; do not accept npm's Angular 22 upgrade or invalid CLI downgrade while v1 targets Angular 21–22 |    [~] |

## Progress log

Add newest entries first.

| Date       | Change                                                                                                                                                                                                                                                                                                                    | Components/phases      | Owner or link                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| 2026-09-02 | Completed the DSP-15 Stat implementation-ready specification: exact container/part/direction candidates, native compound directives, consumer-owned data and accessibility boundaries, customization, SSR, and Preview evidence requirements are recorded.                                                                | Phase 3 specification  | `docs/components/stat.md`                            |
| 2026-09-02 | Added Kbd browser, production SSR/hydration, axe, and dark RTL mobile visual evidence; refreshed three inspected CSS-regenerated visual baselines (Aura, Chat Bubble, Carousel). Manual shortcut-name, surrounding-control, forced-colors, contrast, reflow, RTL, localization, and assistive-technology review remain.   | Phase 3 evidence       | `docs/components/kbd-accessibility-review.md`        |
| 2026-09-02 | Added the native `kbd[zdKbd]` secondary entry point with an optional typed xs–xl size, prefix-aware classes, unit/type/API/package verification, static Tailwind candidates, and a minor Changeset. Browser, SSR/hydration, axe, and visual evidence remain open.                                                         | Phase 3 implementation | `projects/components/kbd/`                           |
| 2026-09-02 | Completed the DSP-13 Kbd implementation-ready specification: exact base/size candidates, native `<kbd>` semantics, consumer-owned platform/localization/sequence boundaries, customization, accessibility, SSR, and Preview evidence requirements are recorded.                                                           | Phase 3 specification  | `docs/components/kbd.md`                             |
| 2026-09-02 | Added Collapse production SSR/hydration proof, an automated axe scan, a focused dark RTL mobile visual baseline, and explicit manual accessibility boundaries for native disclosure, checkbox/radio composition, indicator state, forced colors, reflow, RTL, and assistive technology.                                   | Phase 3 evidence       | `docs/components/collapse-accessibility-review.md`   |
| 2026-09-01 | Completed the DSP-08 Collapse implementation-ready specification: exact native candidates and state mechanisms, the details-first directive boundary, Angular Aria group deferral, customization, accessibility, SSR, and evidence requirements are recorded.                                                             | Phase 3 specification  | `docs/components/collapse.md`                        |
| 2026-09-01 | Added Carousel browser and SSR/hydration native-list proof, an automated axe scan, a focused dark RTL mobile baseline, and explicit manual accessibility boundaries. The SSR fixture now uses directive bindings for style variants and embedded sample images so its existing no-error hydration gate is self-contained. | Phase 3 evidence       | `docs/components/carousel-accessibility-review.md`   |
| 2026-09-01 | Added the public native Carousel secondary entry point with exact axis/alignment candidates, focused unit/type/API coverage, bundle validation, tarball review, and a minor Changeset.                                                                                                                                    | Phase 3 implementation | `projects/components/carousel/`                      |
| 2026-09-01 | Added the public native Chat Bubble compound secondary entry point with required placement, exact Bubble color candidates, API report and type coverage, bundle validation, tarball review, and a minor Changeset.                                                                                                        | Phase 3 implementation | `projects/components/chat-bubble/`                   |
| 2026-09-01 | Completed the DSP-07 Chat Bubble implementation-ready specification: exact candidate/internal-variable inventory, native compound directive boundary, consumer-owned conversation/message/media/time/state/action/live-update semantics, customization, accessibility, SSR, and evidence requirements are recorded.       | Phase 3 specification  | `docs/components/chat-bubble.md`                     |
| 2026-08-31 | Added Card browser and SSR/hydration native-compound proof, automated axe coverage, a focused dark RTL mobile baseline, compile-candidate coverage, and explicit manual accessibility boundaries for media, semantics, interaction ownership, contrast, forced colors, reflow, RTL, and assistive technology.             | Phase 3 evidence       | `docs/components/card-accessibility-review.md`       |
| 2026-08-31 | Added the public native Card compound secondary entry point with exact size/style/layout candidates, API report and type coverage, bundle validation, tarball review, and a minor Changeset.                                                                                                                              | Phase 3 implementation | `projects/components/card/`                          |
| 2026-08-31 | Completed the DSP-05 Card implementation-ready specification: exact candidate/internal-variable inventory, native compound directive boundary, consumer-owned media/title/action/selection/navigation/state semantics, customization, accessibility, SSR, and evidence requirements are recorded.                         | Phase 3 specification  | `docs/components/card.md`                            |
| 2026-08-30 | Added Badge browser and SSR/hydration host-semantics proof, automated axe coverage, a focused dark RTL mobile baseline, and explicit manual accessibility boundaries for status/dot alternatives, semantic colors, forced colors, contrast, reflow, assistive technology, and live updates.                               | Phase 3 evidence       | `docs/components/badge-accessibility-review.md`      |
| 2026-08-30 | Added the public native `[zdBadge]` secondary entry point, exact optional color/style/size candidates, API report and type coverage, bundle validation, and a reviewed minor Changeset. The bundle scanner now ignores declared non-runtime asset exports.                                                                | Phase 3 implementation | `projects/components/badge/`                         |
| 2026-08-30 | Completed the DSP-04 Badge implementation-ready specification: exact candidate/internal-variable inventory, native directive boundary, consumer-owned status/removal/selection/count semantics, customization, accessibility, SSR, and evidence requirements are recorded.                                                | Phase 3 specification  | `docs/components/badge.md`                           |
| 2026-08-30 | Added Aura browser and SSR/hydration host-semantics proof, automated axe coverage, live reduced-motion verification, a focused dark RTL mobile baseline, and explicit manual accessibility boundaries for forced-colors, contrast, reflow, assistive technology, and auto-motion context.                                 | Phase 3 evidence       | `docs/components/aura-accessibility-review.md`       |
| 2026-08-30 | Added the public native `[zdAura]` secondary entry point, optional exact variant/size inputs, scoped reduced-motion stylesheet export, package side-effect declaration, API report, type/unit coverage, bundle review, and minor Changeset.                                                                               | Phase 3 implementation | `projects/components/aura/`                          |
| 2026-08-30 | Completed the DSP-03 Aura implementation-ready specification: exact candidate/internal-variable inventory, native wrapper ownership, optional variant/size API, consumer customization boundary, and a scoped static reduced-motion requirement are recorded.                                                             | Phase 3 specification  | `docs/components/aura.md`                            |
| 2026-08-30 | Added Avatar browser and SSR/hydration host-semantics proof, automated axe coverage, a focused dark RTL mobile baseline, and explicit manual accessibility boundaries for image alternatives, presence, fallback, forced colors, contrast, and reflow.                                                                    | Phase 3 evidence       | `docs/components/avatar-accessibility-review.md`     |
| 2026-08-30 | Added the public native `[zdAvatar]` and `[zdAvatarGroup]` secondary entry point, exact presence type, API report drift gate, type coverage, bundle validation, and a reviewed minor Changeset.                                                                                                                           | Phase 3 implementation | `projects/components/avatar/`                        |
| 2026-08-21 | Completed the INP-06 Label implementation-ready specification: current daisyUI inventory, native association, floating-label ownership, and evidence boundaries are recorded.                                                                                                                                             | Phase 3 specification  | `docs/components/label.md`                           |
| 2026-08-21 | Completed the LYT-01 Divider implementation-ready specification: native thematic/decorative boundary, daisyUI token inventory, defaults candidates, responsive/customization ownership, platform limits, and Preview evidence are recorded.                                                                               | Phase 3 specification  | `docs/components/divider.md`                         |
| 2026-08-21 | Added the public native `[zdDivider]` secondary entry point, typed immutable defaults feature, unit/type/package API gates, and reviewed minor Changeset.                                                                                                                                                                 | Phase 3 implementation | `projects/components/divider/`                       |
| 2026-08-21 | Added Divider browser and SSR/hydration host-semantics proof, an automated axe scan, and a focused dark RTL mobile visual baseline. Manual AT, forced-colors, and semantic-color contrast remain explicit release gates.                                                                                                  | Phase 3 evidence       | `docs/components/divider-accessibility-review.md`    |
| 2026-08-20 | Added real-browser native/Router/unavailable Link coverage, production SSR/hydration proof, an automated axe scan, and a dark RTL mobile visual baseline. daisyUI semantic Link colors remain custom-theme contrast and manual forced-colors/AT review gates.                                                             | Phase 3 evidence       | `docs/components/link-accessibility-review.md`       |
| 2026-08-20 | Added the native `[zdLink]` directive, immutable Link defaults feature, Link package entry point, Tailwind candidate source, API extraction report, exact type/unit coverage, bundle gate, and minor Changeset; browser, SSR, a11y, and visual proof remain open.                                                         | Phase 3 implementation | `projects/components/link/`                          |
| 2026-08-20 | Completed the NAV-03 Link implementation-ready specification: native anchor/Router ownership, daisyUI token inventory, unavailable-state guard, accessibility, SSR, customization, and Preview evidence boundaries are recorded.                                                                                          | Phase 3 specification  | `docs/components/link.md`                            |
| 2026-08-20 | Added Button browser/SSR/axe coverage and a focused dark RTL mobile visual baseline, while retaining manual AT, forced-colors, pre-hydration replay-race, and Angular 21/22 compatibility as explicit release gates.                                                                                                      | Phase 3 evidence       | `docs/components/button.md`                          |
| 2026-08-19 | Added the public native `[zdButton]` secondary entry point, typed app defaults feature, unit/type/package API gates, and a reviewed minor Changeset.                                                                                                                                                                      | Phase 3 implementation | `projects/components/button/`                        |
| 2026-08-19 | Completed the ACT-01 Button implementation-ready specification: native host/API/defaults/async/a11y/forms/styling/SSR boundaries and Preview evidence are recorded; no component code is published yet.                                                                                                                   | Phase 3 specification  | `docs/components/button.md`                          |
| 2026-08-19 | Added a tracked API Extractor report for the built primary APF declaration, a drift-failing CI/release gate, update workflow, tooling tests, and documentation that preserves manual behavioral API review.                                                                                                               | Phase 2 packaging      | `etc/api/zordon-ui.api.md`                           |
| 2026-08-19 | Added internal Playwright environment profiles for themes, direction, desktop/mobile viewports, reduced motion, and forced colors with a real-browser characterization and visual-suite reuse.                                                                                                                            | Phase 2 testing        | `e2e/fixtures/environment.ts`                        |
| 2026-08-19 | Defined public harness, interaction-helper, Angular Aria composition, and package-isolation conventions without publishing an empty testing entry point or generic base.                                                                                                                                                  | Phase 2 testing        | `docs/foundations/`                                  |
| 2026-08-19 | Defined async action ownership, concurrency, cancellation, stale-result, accessibility, and SSR contracts with browser/SSR characterization and no task framework.                                                                                                                                                        | Phase 2 interaction    | `docs/foundations/async-actions.md`                  |
| 2026-08-19 | Defined native-versus-composite Angular Forms ownership, CVA callback/state/validation/error-ID rules, and added test-only pipeline plus native SSR/hydration evidence without a generic base.                                                                                                                            | Phase 2 interaction    | `docs/foundations/form-control-behavior.md`          |
| 2026-08-19 | Defined native live-region and description/error ownership, bounded future CDK reuse, and added deterministic SSR/hydration relationship and status-update evidence without a premature runtime wrapper.                                                                                                                  | Phase 2 interaction    | `docs/foundations/`                                  |
| 2026-08-19 | Defined static-first reduced-motion ownership, Angular/daisyUI animation boundaries, lifecycle and SSR rules, and a live real-browser preference fixture without a premature runtime service.                                                                                                                             | Phase 2 interaction    | `docs/foundations/reduced-motion.md`                 |
| 2026-08-13 | Defined horizontal LTR/RTL ownership through CDK Directionality and added private overlay source propagation, live logical repositioning, cleanup, SSR, and writing-mode boundaries.                                                                                                                                      | Phase 2 interaction    | `docs/foundations/`                                  |
| 2026-08-11 | Added a private ref-counted CDK body-scroll-lock lease, arbitrary-release tests, consumer-owned gutter guidance, and explicit hydration/mobile/shared-identity completion gates.                                                                                                                                          | Phase 2 interaction    | `docs/foundations/body-scroll-lock.md`               |
| 2026-08-19 | Added a reusable component specification/documentation template with anatomy, API, interaction, accessibility, forms, styling inventory, platform, examples, and evidence records, linked from contribution and maturity workflows.                                                                                       | Phase 2 documentation  | `docs/templates/component-documentation-template.md` |
| 2026-08-19 | Added a component-local visual story matrix convention that selects material visual boundaries and records theme, responsive, RTL, customization, and non-screenshot accessibility/SSR evidence.                                                                                                                          | Phase 2 visual testing | `docs/templates/visual-story-matrix-template.md`     |
| 2026-08-11 | Added a private CDK overlay host, semantic stack, two-phase lifecycle, portal ownership, atomic dismissal, positioning and scroll-policy foundation with package/hydration gates.                                                                                                                                         | Phase 2 interaction    | `docs/foundations/overlay-host-and-positioning.md`   |
| 2026-08-11 | Standardized native/CDK Escape and outside-interaction ownership, cancellation, boundaries, cleanup, and SSR limits while assigning atomic top-only arbitration to the pending private overlay stack.                                                                                                                     | Phase 2 interaction    | `docs/foundations/`                                  |
| 2026-08-11 | Defined native/CDK focus composition, restoration, `:focus-visible`, SSR boundaries, and real-browser behavior without adding a public wrapper.                                                                                                                                                                           | Phase 2 interaction    | `docs/foundations/focus-management.md`               |
| 2026-08-11 | Added application/request-scoped deterministic IDs with unit and SSR/hydration relationship coverage plus an explicit incremental-hydration boundary.                                                                                                                                                                     | Phase 2 interaction    | `docs/foundations/stable-ids.md`                     |
| 2026-08-11 | Defined stable Zordon, documented upstream, consumer-owned, exact-version internal, and unsupported customization layers, with component inventory, prefix, compatibility, and visual-test gates.                                                                                                                         | Phase 2 customization  | `docs/foundations/safe-customization.md`             |
| 2026-08-10 | Defined intrinsic/application/local component-default precedence, eligible inputs, DI scope, immutable merge rules, and the evidence required before the first typed defaults provider is exported.                                                                                                                       | Phase 2 defaults       | `docs/foundations/component-defaults.md`             |
| 2026-08-10 | Added native global theme-root guidance and the public `ZdTheme` directive for exact nested/component-host scopes, with real CSS inheritance, preferred-dark, custom-root, SSR/hydration, and package tests.                                                                                                              | Phase 2 themes         | `docs/foundations/theme-scopes.md`                   |
| 2026-08-10 | Added immutable application-level daisyUI/Tailwind prefix configuration, centralized class generation, exact candidate-source guidance, installed/floor compiler gates, and public integration documentation.                                                                                                             | Phase 2 prefixes       | `docs/foundations/class-prefixes.md`                 |
| 2026-08-10 | Defined component-scoped named part selectors, optional functional directives, anatomy/cardinality rules, static projection and forwarding boundaries, plus focused Angular integration coverage.                                                                                                                         | Phase 2 composition    | `docs/foundations/named-parts-and-slots.md`          |
| 2026-08-10 | Adopted Angular Aria as the native-first headless interaction foundation, mapped its eight directive families and four composed patterns to the catalog, and contained preview APIs behind Zordon contracts.                                                                                                              | Phase 2 interaction    | `docs/foundations/angular-aria-adoption.md`          |
| 2026-08-10 | Defined native Angular per-instance style and CSS-variable ownership with tested updates, fallbacks, explicit clearing, units, security, SSR, and `NgStyle` boundaries.                                                                                                                                                   | Phase 2 styles         | `docs/foundations/`                                  |
| 2026-08-10 | Added the private host-class token composer and Angular integration contract for additive static/dynamic consumer classes, reactive modifier updates, and explicit per-token precedence.                                                                                                                                  | Phase 2 host classes   | `docs/foundations/`                                  |
| 2026-08-10 | Added public type-only color, size, style, shape, placement, orientation, and density vocabularies with exact compile-time contracts and customization guidance.                                                                                                                                                          | Phase 2 vocabularies   | `docs/foundations/`                                  |
| 2026-08-10 | Added force-included implementation coverage, 100% per-file thresholds, a tested empty/missing/uncovered-report guard, contributor guidance, and a controlled failure proof.                                                                                                                                              | Phase 1 coverage       | `docs/testing/`                                      |
| 2026-08-10 | Added the contributor workflow plus public API review, deprecation/breaking-change, and component maturity policies tied to the plan, ADRs, Changesets, and actual validation commands.                                                                                                                                   | Phase 1 governance     | `docs/contributing/`                                 |
| 2026-08-10 | Added Changesets version/changelog preparation, stable and four prerelease channels, tested package/tag/lineage guards, npm dry runs, and protected OIDC provenance publishing.                                                                                                                                           | Phase 1 release        | `.github/workflows/`                                 |
| 2026-08-09 | Added a clean Angular SSR application and production hydration gate covering server HTML, JavaScript-disabled rendering, post-hydration interaction, browser errors, and accessibility.                                                                                                                                   | Phase 1 SSR            | `projects/ssr-example/`                              |
| 2026-08-09 | Added automatic raw/gzip package budgets for primary, component, testing, and Signal Forms entry points; checker tests and the production build-and-check command pass.                                                                                                                                                   | Phase 1 bundle size    | `bundle-size-budgets.json`                           |
| 2026-08-09 | Added eight reviewed Playwright visual baselines across representative themes, breakpoints, and dialog state, with isolated comparison/update commands and a Windows CI gate.                                                                                                                                             | Phase 1 visual tests   | `e2e/__screenshots__/`                               |
| 2026-08-07 | Patched Angular to 21.2.19/CLI 21.2.20, PostCSS to 8.5.26, ng-packagr to 21.2.7, and compatible transitives. Production audit is clean; all build/test gates pass.                                                                                                                                                        | Phase 1 security       | Dependency manifests                                 |
| 2026-08-07 | Confirmed MIT, added repository/package license files, and completed Phase 0.                                                                                                                                                                                                                                             | Phase 0                | `LICENSE`                                            |
| 2026-08-07 | Added a clean `src/public-api.ts`, scoped linting away from legacy sources, consolidated formatting configuration, and added lint/format CI gates.                                                                                                                                                                        | Phase 1                | Workspace configuration                              |
| 2026-08-07 | Re-ran the local CI-equivalent gates: partial-Ivy library build, Vitest with coverage, and deterministic production docs build all pass. The docs build retains a tracked budget warning.                                                                                                                                 | Phase 1 verification   | Local build/test                                     |
| 2026-08-07 | Added the initial GitHub Actions build/test/coverage/docs workflow and disabled network-dependent font inlining for deterministic production builds.                                                                                                                                                                      | Phase 1                | `.github/workflows/ci.yml`                           |
| 2026-08-07 | Replaced the empty Karma target with Angular's Vitest runner, jsdom, coverage tooling, and a library smoke test.                                                                                                                                                                                                          | Phase 1                | Test configuration                                   |
| 2026-08-07 | Verified the documentation application development build with daisyUI 5.7.16 and replaced obsolete installation claims in the root README with current project status and commands.                                                                                                                                       | Phase 1                | `README.md`                                          |
| 2026-08-07 | Verified a clean partial-Ivy production build and npm pack dry run for `@pranxy/zordon-ui@0.0.0-next.0`; synchronized the workspace to daisyUI 5.7.16.                                                                                                                                                                    | Phase 1                | Build output                                         |
| 2026-08-07 | Aligned the library manifest with the accepted package and peer-dependency policy, and disabled legacy Button/Badge secondary-entry-point manifests without deleting their source.                                                                                                                                        | Phase 1                | `projects/components/`                               |
| 2026-08-07 | Accepted the initial platform, API, styling, overlay, forms, packaging, accessibility, SSR, and localization ADRs. Kept Phase 0 open for the package license decision.                                                                                                                                                    | Phase 0                | `docs/architecture/`                                 |
| 2026-08-07 | Baseline production build reached the legacy `components/badge` entry point and failed during partial compilation. The obsolete implementation will not define the new API.                                                                                                                                               | Phase 1 baseline       | Local build                                          |
| 2026-08-07 | Created the initial build plan and 68-component tracking matrix                                                                                                                                                                                                                                                           | Planning               | Codex                                                |

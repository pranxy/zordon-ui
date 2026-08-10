# Angular ARIA foundation research

## Question and intended output

Determine how the current `@angular/aria` package can replace custom accessibility interaction
boilerplate in Zordon UI, document its contracts and limits, map its primitives to the 68-component
delivery plan, and record the dependency/packaging decision without implementing components yet.

## Constraints and evidence bar

- Target the repository's supported Angular range (`>=21.0.0 <23.0.0`) and installed Angular
  21.2.19 context.
- Prefer current official Angular documentation, package metadata, source, tests, and release notes.
- Distinguish developer-preview APIs from stable Angular/CDK/browser behavior.
- Do not claim daisyUI styling, component semantics, forms, overlays, SSR, or testing are supplied
  where `@angular/aria` does not supply them.
- Avoid adding a package dependency until the architectural and package-surface consequences are
  explicit.

## Research questions

1. What is `@angular/aria`, what version/status does Angular 21 expose, and how is it installed?
2. Which behavior directives/primitives exist and what keyboard, focus, selection, expansion,
   orientation, disabled, and typeahead behavior do they own?
3. Which Zordon UI components can directly compose those primitives, and which only benefit
   partially or not at all?
4. How does `@angular/aria` differ from native HTML semantics, `@angular/cdk/a11y`, overlays,
   Angular Forms, and daisyUI?
5. What SSR/hydration, styling, public API, dependency, testing, and versioning rules must the
   library adopt?

## Local context

- Root Angular packages are 21.2.19 (CLI/build 21.2.20); `@angular/cdk` is 21.2.14.
- `@angular/aria` is not currently installed or declared.
- The published package currently peers on Angular/CDK 21–22 and uses component entry points.
- The plan currently schedules custom roving-tabindex and typeahead utilities; this must be
  reconsidered against Angular ARIA before custom code is written.

## Search angles

- Official Angular ARIA overview and individual behavior guides.
- Official Angular v21 release/status and npm/package metadata.
- Angular monorepo source/exports/tests for version-specific behavior and SSR constraints.
- Existing repository ADRs and component matrix for integration and packaging consequences.

## Sources and findings

- Angular's v21 roadmap identifies Angular Aria as a developer-preview feature introduced in v21
  with eight headless WAI-ARIA patterns. The roadmap says Angular supplies interaction behavior and
  consumers supply styling.
  - https://v21.angular.dev/roadmap
- The v21 overview describes headless directives that own keyboard interaction, ARIA attributes,
  focus management, and screen-reader support while applications retain HTML, CSS, and business
  logic.
  - https://v21.angular.dev/guide/aria/overview
- The eight underlying package families are Accordion, Combobox, Grid, Listbox, Menu, Tabs,
  Toolbar, and Tree. Autocomplete, Select, Multiselect, and Menubar are documented compositions of
  those primitives rather than four additional foundation packages.
- Official v21 guides confirm the reusable behavior:
  - Accordion: group expansion, trigger navigation, lazy/preserved content, disabled policy, RTL.
    https://v21.angular.dev/guide/aria/accordion
  - Listbox: single/multi selection, orientation, typeahead, follow/explicit selection.
    https://v21.angular.dev/guide/aria/listbox
  - Menu/Menubar: commands, nested submenus, typeahead, check/radio items, disabled and close policy.
    https://v21.angular.dev/guide/aria/menu and https://v21.angular.dev/guide/aria/menubar
  - Tabs: follow/explicit activation, orientation, lazy/preserved panels, focus management.
    https://v21.angular.dev/guide/aria/tabs
  - Toolbar: roving navigation, orientation, grouping, selection, wrapping, RTL.
    https://v21.angular.dev/guide/aria/toolbar
  - Tree: hierarchy, selection, expansion, typeahead, roving/activedescendant focus, RTL.
    https://v21.angular.dev/guide/aria/tree
  - Grid: two-dimensional navigation, roving/activedescendant focus, selection/ranges, wrapping,
    disabled cells, RTL. https://v21.angular.dev/guide/aria/grid
- Official examples compose Combobox/Listbox with CDK Overlay for Select, Multiselect, and
  Autocomplete. Filtering, display formatting, form state, overlay policy, and empty-result live
  announcements remain application/library work.
- Pattern-specific testing harnesses are published from subpaths such as
  `@angular/aria/accordion/testing`, `listbox/testing`, `menu/testing`, `tabs/testing`, and
  `toolbar/testing`, using CDK's harness environment.
- The official package metadata declares `@angular/cdk` and `@angular/core` peers, `tslib` as its
  runtime dependency, and `sideEffects: false`.
  - https://raw.githubusercontent.com/angular/components/21.2.x/src/aria/package.json
- npm identifies 21.2.14 as the Angular 21 LTS release line for `@angular/aria`, matching the
  workspace's installed CDK 21.2.14 line. The workspace does not currently declare Angular Aria.
  - https://www.npmjs.com/package/@angular/aria?activeTab=versions

## Conflicts, rejected evidence, and open questions

- The current Angular v22 overview lists twelve named experiences, while the roadmap says v21
  launched eight patterns. This is not a package contradiction: four experiences are documented
  compositions built from the eight directive families. Documentation must preserve that
  distinction.
- `angular-aria` without the `@angular/` scope is the deprecated AngularJS 1.x package and is
  rejected as irrelevant.
- Angular Aria's developer-preview status means its APIs must not leak into Zordon UI's public
  signatures. Exact integration and SSR/hydration behavior require a component spike before the
  first consuming declaration is promoted.
- No package dependency is added in this documentation-only step. The first consuming component
  must add and validate the version-aligned peer/development dependency.

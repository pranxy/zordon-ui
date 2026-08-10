# ADR 0008: Angular Aria as the default headless interaction foundation

Status: Accepted  
Date: 2026-08-10

## Context

Zordon UI needs keyboard navigation, focus management, typeahead, selection, expansion, ARIA
relationships, disabled policies, and RTL behavior across many compound components. Rebuilding
those mechanics independently would duplicate difficult accessibility work and create a large
library-owned maintenance surface.

Angular 21 introduced `@angular/aria` in developer preview. It provides headless directives for
eight WAI-ARIA pattern families: Accordion, Combobox, Grid, Listbox, Menu, Tabs, Toolbar, and Tree.
Angular also documents Autocomplete, Select, Multiselect, and Menubar as compositions of those
families. The package supplies behavior rather than visual styling, which aligns with daisyUI as
Zordon UI's visual foundation.

## Decision

- Use native HTML semantics and controls when they already provide the required behavior.
- When a custom widget matches an Angular Aria pattern, compose the relevant `@angular/aria/*`
  directives before considering a Zordon-owned keyboard, focus, selection, expansion, or
  typeahead implementation.
- Use Angular CDK for complementary mechanics that Angular Aria examples deliberately compose
  separately, including overlays, portals, positioning, focus trapping, directionality, and test
  harness infrastructure.
- Keep daisyUI classes, Zordon public inputs/models/outputs, form integration, business rules,
  overlay lifecycle policy, SSR contracts, and customization in the Zordon layer.
- Do not re-export Angular Aria declarations or expose its classes, signals, or types in Zordon
  public signatures. It remains a replaceable implementation detail behind Zordon declarations.
- Do not create generic roving-tabindex, active-descendant, typeahead, tree, listbox, menu, tabs, or
  grid utilities where Angular Aria already supplies the required behavior.
- A small private gap implementation is allowed only when the component specification identifies
  the missing behavior, records why native HTML, Angular Aria, and CDK are insufficient, and adds
  behavior-focused tests.
- The first consuming component adds `@angular/aria` as a required runtime peer and a root
  development dependency. The development version must match the tested `@angular/cdk` release
  line. While Angular Aria remains developer preview, supported peer ranges are limited to tested
  minor lines rather than assuming every Angular 21–22 minor is compatible.
- Each consuming component must pass an integration spike before implementation approval. The
  spike verifies directive composition, public API isolation, emitted ARIA/state attributes,
  keyboard and pointer behavior, disabled policy, RTL, SSR output, hydration, teardown, and bundle
  impact on the minimum and latest supported Angular lines.
- Re-evaluate the adapter and peer-range policy when Angular promotes the used Aria APIs to stable.

## Ownership boundary

Angular Aria owns only the behavior its selected directive family documents. It does not replace:

- semantic HTML selection or the decision that a widget pattern is appropriate;
- daisyUI/Tailwind classes, themes, layout, motion, or consumer customization;
- Angular Forms/CVA behavior, validation, touched state, serialization, or domain data;
- filtering, async loading, virtualization, display formatting, or empty/error content;
- overlay stacking, collision handling, scroll strategy, outside interaction, or focus trap policy;
- component-specific announcements and accessible names supplied by consumer content;
- Zordon's browser, screen-reader, SSR/hydration, accessibility, and visual verification gates.

## Consequences

- Most complex collection widgets begin from first-party accessible behavior instead of custom key
  managers.
- Zordon's public API can remain stable while developer-preview Angular Aria APIs evolve behind it.
- `@angular/aria` becomes an installation peer only when runtime code first imports it; this ADR
  alone does not change the published tarball.
- Components cannot claim accessibility solely because they compose Angular Aria. The component's
  complete semantics, styling, forms, overlay, content, and assistive-technology behavior remain
  independently verified.

## References

- [Angular Aria overview](https://v21.angular.dev/guide/aria/overview)
- [Angular Aria roadmap status](https://v21.angular.dev/roadmap)
- [Angular Components repository](https://github.com/angular/components)
- [Angular Aria foundation and component mapping](../foundations/angular-aria-adoption.md)

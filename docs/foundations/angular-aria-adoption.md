# Angular Aria adoption guide

This guide applies [ADR 0008](../architecture/0008-angular-aria.md). It is the starting point for
component specifications that need compound keyboard, focus, selection, or expansion behavior.

## What Angular Aria is

`@angular/aria` is Angular's first-party collection of headless directives for common WAI-ARIA
patterns. It supplies interaction and accessibility mechanics while Zordon UI supplies the DOM
composition, daisyUI styling, public API, application state, and integration policy.

Angular 21 launched the package in **developer preview**. Treat it as an approved implementation
foundation, not as a stable Zordon public API. The package named `angular-aria` without the
`@angular/` scope is the unrelated, deprecated AngularJS 1.x package.

The package has eight underlying directive families:

| Family    | Reusable behavior                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Accordion | Group expansion, trigger/panel relationships, keyboard movement, lazy/preserved content, disabled policy, RTL     |
| Combobox  | Input/trigger and popup coordination, expanded state, active descendant, keyboard delegation                      |
| Grid      | Two-dimensional navigation, roving or active-descendant focus, selection/ranges, wrapping, disabled cells, RTL    |
| Listbox   | Single/multiple selection, vertical/horizontal navigation, typeahead, explicit/follow selection, disabled options |
| Menu      | Triggered/standalone menus, menubars, nested submenus, typeahead, check/radio items, close and disabled policies  |
| Tabs      | Tab/panel relationships, follow/manual activation, orientation, lazy/preserved panels, disabled policy, RTL       |
| Toolbar   | One-tab-stop widget groups, orientation-aware navigation, selection groups, wrapping, disabled policy, RTL        |
| Tree      | Hierarchical navigation, expansion, single/multiple selection, typeahead, focus strategies, disabled nodes, RTL   |

The Angular 21 documentation exposes these building blocks from public subpaths:

- `@angular/aria/accordion`: `AccordionGroup`, `AccordionTrigger`, `AccordionPanel`, and
  `AccordionContent`;
- `@angular/aria/combobox`: `Combobox`, `ComboboxInput`, and `ComboboxPopupContainer`;
- `@angular/aria/grid`: `Grid`, `GridRow`, `GridCell`, and `GridCellWidget`;
- `@angular/aria/listbox`: `Listbox` and `Option`;
- `@angular/aria/menu`: `Menu`, `MenuBar`, `MenuContent`, `MenuItem`, and `MenuTrigger`;
- `@angular/aria/tabs`: `Tabs`, `TabList`, `Tab`, `TabPanel`, and `TabContent`;
- `@angular/aria/toolbar`: `Toolbar`, `ToolbarWidget`, and `ToolbarWidgetGroup`;
- `@angular/aria/tree`: `Tree`, `TreeItem`, and `TreeItemGroup`.

These names are a versioned research baseline, not a license to expose them. Inspect the pinned
package API before each integration because developer-preview names can change.

Angular's Autocomplete, Select, Multiselect, and Menubar guides are composed experiences built
from those families. For example, Select combines Combobox and Listbox and uses CDK Overlay for
positioning.

## Selection rule

Use this order for every interactive component specification:

1. **Native HTML first.** Keep `<button>`, `<a>`, `<input>`, `<select>`, `<details>`, `<table>`, and
   other native semantics when they satisfy the required experience.
2. **Angular Aria for a matching custom widget.** Compose the smallest relevant directive family;
   do not copy its key handlers, focus model, ARIA bookkeeping, or typeahead into Zordon code.
3. **Angular CDK for complementary infrastructure.** Add Overlay, Portal, A11y, Bidi, Layout, or
   testing utilities only where the component needs them.
4. **Private gap code last.** Record the unsupported requirement and test it. Never create a
   generic utility merely because a component needs one additional policy.

Do not force an ARIA widget pattern onto ordinary content. A read-only table remains a semantic
`<table>`, site navigation remains `<nav>` with links, a small form choice can remain native radios,
and a single disclosure can remain `<details>` or a native button/content relationship.

## Zordon component mapping

The mapping is a specification starting point, not permission to attach a directive based only on
visual resemblance.

| Zordon component or mode                            | Angular Aria starting point  | Boundary                                                                                                         |
| --------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| DSP-01 Accordion                                    | Accordion                    | Direct fit; Zordon owns daisyUI anatomy, state API, headings, animation, and controlled/uncontrolled policy      |
| DSP-08 Collapse                                     | Accordion only for groups    | A standalone disclosure is not an accordion; prefer native disclosure semantics                                  |
| ACT-02 Dropdown action/menu mode                    | Menu + CDK Overlay           | Arbitrary interactive content is not a menu and needs its own semantics/focus policy                             |
| NAV-05 Menu application-command mode                | Menu or Tree                 | Choose Menu for commands and Tree for hierarchical navigation; ordinary site links remain native navigation      |
| NAV-04 Megamenu application-command mode            | Menubar/Menu + CDK Overlay   | Website navigation is not automatically a menubar; preserve navigation landmarks and links                       |
| NAV-09 Tabs                                         | Tabs                         | Direct fit; Zordon owns Router sync, overflow, close/reorder policy, visuals, and persistence                    |
| INP-10 advanced Select/Multiselect/Autocomplete     | Combobox + Listbox + Overlay | Native `<select>` stays a separate lightweight API; filtering, async data, tags, virtualization, CVA remain ours |
| DSP-14 selectable List                              | Listbox                      | Plain display lists use native list markup; reorder and virtualization remain separate concerns                  |
| DSP-17 interactive data grid                        | Grid                         | Read-only tables stay semantic tables; sorting/filtering/editing/virtualization are Zordon/data-layer concerns   |
| INP-01 Calendar date grid                           | Grid                         | Date math, locale, range rules, unavailable dates, forms, and popup overlay remain Zordon responsibilities       |
| Related action groups in Button, Join, FAB, mockups | Toolbar when semantics fit   | Use only when the controls form one logical toolbar with arrow-key navigation and a reduced tab-stop model       |
| Future hierarchical browser/navigation compositions | Tree                         | No current catalog row is a generic Tree; adopt only when the component semantics actually match                 |

### Full 68-component triage

This table prevents visual similarity from becoming an accessibility decision. `Conditional`
means the component specification must select that semantic mode explicitly.

| ID     | Component        | Default interaction foundation                                                                            |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------- |
| ACT-01 | Button           | Native `<button>`, `<a>`, or button-like input; Toolbar belongs to a parent composition only              |
| ACT-02 | Dropdown         | Conditional Angular Aria Menu for command items; CDK Overlay and separate semantics for arbitrary content |
| ACT-03 | FAB / Speed Dial | Native buttons; conditional Menu or Toolbar only after the action-group semantics are approved            |
| ACT-04 | Modal            | Native `<dialog>` plus CDK Overlay/A11y fallback and lifecycle policy; no Angular Aria family             |
| ACT-05 | Swap             | Native button or checkbox state; no Angular Aria family                                                   |
| ACT-06 | Theme Controller | Native checkbox, radio, select, or button according to mode                                               |
| DSP-01 | Accordion        | Angular Aria Accordion                                                                                    |
| DSP-02 | Avatar           | Native image/text/status semantics; presentational unless selectable                                      |
| DSP-03 | Aura             | Presentational directive with native host semantics                                                       |
| DSP-04 | Badge            | Text/status semantics; native button only for removable/selectable modes                                  |
| DSP-05 | Card             | Native article/section/figure/link/button composition                                                     |
| DSP-06 | Carousel         | Carousel-specific APG behavior, native controls, and live-region policy; no Angular Aria family           |
| DSP-07 | Chat Bubble      | Native list/article/log/status semantics and component-specific announcements                             |
| DSP-08 | Collapse         | Native disclosure by default; Angular Aria Accordion only when grouped                                    |
| DSP-09 | Countdown        | Native output/timer text plus deliberate announcement policy                                              |
| DSP-10 | Diff             | Native range/slider semantics with component-specific pointer and keyboard behavior                       |
| DSP-11 | Hover 3D Card    | Native focus/pointer activation and reduced-motion fallback                                               |
| DSP-12 | Hover Gallery    | Native gallery controls; conditional Listbox only for an explicit selectable-thumbnail model              |
| DSP-13 | Kbd              | Native `<kbd>` and text semantics                                                                         |
| DSP-14 | List             | Native list by default; Angular Aria Listbox only for selectable mode                                     |
| DSP-15 | Stat             | Native data/output/text semantics and component-specific live updates                                     |
| DSP-16 | Status           | Native status text/live-region policy; no Angular Aria family                                             |
| DSP-17 | Table            | Native `<table>` by default; Angular Aria Grid only for interactive data-grid mode                        |
| DSP-18 | Text Rotate      | Native text with reduced-motion and announcement policy                                                   |
| DSP-19 | Timeline         | Native ordered/unordered list and time semantics                                                          |
| NAV-01 | Breadcrumbs      | Native `<nav>` and ordered list                                                                           |
| NAV-02 | Dock             | Native navigation links/buttons; conditional Toolbar only for a true action group                         |
| NAV-03 | Link             | Native `<a>` plus Angular Router integration                                                              |
| NAV-04 | Megamenu         | Native navigation by default; Angular Aria Menubar/Menu only for application commands                     |
| NAV-05 | Menu             | Angular Aria Menu for commands, Tree for hierarchy, or native navigation links according to approved mode |
| NAV-06 | Navbar           | Native `<nav>`; conditional Toolbar only for a related action subset                                      |
| NAV-07 | Pagination       | Native navigation landmark with links/buttons                                                             |
| NAV-08 | Steps            | Native ordered list/current-step semantics; not Tabs unless it actually controls tab panels               |
| NAV-09 | Tabs             | Angular Aria Tabs                                                                                         |
| FDB-01 | Alert            | Native content with `alert`/`status` chosen by urgency                                                    |
| FDB-02 | Loading          | Native status/progress semantics and `aria-busy` ownership                                                |
| FDB-03 | Progress         | Native `<progress>` where possible                                                                        |
| FDB-04 | Radial Progress  | Native progress value plus visual radial presentation                                                     |
| FDB-05 | Skeleton         | Presentational placeholder plus owning region's busy/name policy                                          |
| FDB-06 | Toast            | Live-region semantics plus CDK overlay/outlet lifecycle; no Angular Aria family                           |
| FDB-07 | Tooltip          | Accessible-description relationship plus CDK overlay/positioning; no Angular Aria family                  |
| INP-01 | Calendar         | Angular Aria Grid for the date grid; Zordon date, locale, form, and overlay logic                         |
| INP-02 | Checkbox         | Native checkbox input                                                                                     |
| INP-03 | Fieldset         | Native `<fieldset>` and `<legend>`                                                                        |
| INP-04 | File Input       | Native file input plus Zordon drop/list/upload behavior                                                   |
| INP-05 | Filter           | Native radio/button controls by default; conditional Listbox only if the approved value model matches     |
| INP-06 | Label            | Native `<label>` and deterministic description/error relationships                                        |
| INP-07 | Radio            | Native radio inputs and radiogroup semantics                                                              |
| INP-08 | Range            | Native range input; dual-thumb slider requires a separate reviewed pattern                                |
| INP-09 | Rating           | Native radio inputs by default                                                                            |
| INP-10 | Select           | Native `<select>` for native mode; Angular Aria Combobox/Listbox plus CDK Overlay for advanced modes      |
| INP-11 | Text Input       | Native input; conditional Combobox/Listbox only for an explicitly specified autocomplete mode             |
| INP-12 | Textarea         | Native `<textarea>`                                                                                       |
| INP-13 | Toggle           | Native checkbox input with switch semantics when appropriate                                              |
| INP-14 | Validator        | Angular Forms, native constraint state, descriptions, errors, and live-region policy                      |
| INP-15 | OTP              | Native input/autofill semantics with dedicated focus, paste, and announcement behavior                    |
| LYT-01 | Divider          | Native `<hr>` or semantic/presentational separator according to mode                                      |
| LYT-02 | Drawer           | Native navigation/dialog semantics plus CDK overlay, focus, scroll, and dismissal infrastructure          |
| LYT-03 | Footer           | Native `<footer>` and navigation landmarks                                                                |
| LYT-04 | Hero             | Native section/heading/media semantics                                                                    |
| LYT-05 | Indicator        | Presentational placement plus Badge/Status semantics from its content                                     |
| LYT-06 | Join             | Layout only; conditional Toolbar when joined controls form one logical toolbar                            |
| LYT-07 | Mask             | Presentational styling on the underlying native element                                                   |
| LYT-08 | Stack            | Native list/section semantics; interactive deck behavior needs its own reviewed pattern                   |
| MCK-01 | Browser Mockup   | Decorative/presentational wrapper around semantic projected content                                       |
| MCK-02 | Code Mockup      | Native `<pre><code>`; conditional Toolbar for copy/format actions                                         |
| MCK-03 | Phone Mockup     | Decorative/presentational wrapper around semantic projected content                                       |
| MCK-04 | Window Mockup    | Decorative/presentational wrapper; conditional Toolbar for actual window actions                          |

## Ownership in a composed component

### Angular Aria can own

- pattern roles, relationships, and state attributes that its directives document;
- item registration and active-item tracking;
- roving `tabindex` or `aria-activedescendant` focus strategies where offered;
- arrow/Home/End/typeahead behavior;
- selection, expansion, wrapping, orientation, disabled navigation, and RTL behavior where offered;
- lazy/preserved pattern content where the directive family supports it.

### Zordon UI still owns

- the public `zd*` selectors, inputs, models, outputs, methods, defaults, and error behavior;
- native element choice, projected parts, accessible names/descriptions, headings, and domain semantics;
- daisyUI classes, themes, prefixing, CSS variables, focus visuals, forced colors, and reduced motion;
- Angular Forms/CVA integration, value identity/equality, validation, reset, touched state, and
  disabled-state precedence;
- overlay lifecycle, positions, collision/scroll strategy, outside/Escape policy, nesting, and
  focus restoration beyond the selected pattern;
- filtering, remote data, loading/empty/error states, formatting, virtualization, Router behavior,
  drag/reorder, and business actions;
- live announcements that are specific to results, async work, validation, or application state.

Never mark one state as owned by both layers. The component specification must describe how a
Zordon model drives or observes the Angular Aria directive and which event is emitted first.

## Preview containment and dependency policy

- Import only documented subpaths such as `@angular/aria/listbox`; never deep-import package files.
- Do not re-export Angular Aria directives, harnesses, types, or injection tokens from a Zordon
  entry point.
- Do not mention Angular Aria types in public inputs, outputs, models, methods, or template contexts.
- Prefer internal composition or a thin private adapter so upstream API changes do not become
  Zordon breaking changes.
- When the first component consumes the package, add a root development dependency matching the
  tested `@angular/cdk` patch line and a runtime peer dependency restricted to verified Angular
  Aria minor lines while the package remains developer preview.
- Test the minimum and latest supported Angular lines before broadening the peer range. Do not infer
  Angular 22 compatibility from an Angular 21 build.
- Do not create an `aria` secondary entry point. The dependency belongs only in component entry
  points that use it and remains tree-shakeable (`@angular/aria` declares `sideEffects: false`).

## Styling and daisyUI composition

Angular Aria is headless. Apply daisyUI classes through Zordon host/part bindings and style
interactive states through documented ARIA or data attributes emitted by the selected directive,
such as expanded, selected, active, visible, or disabled states. Verify the exact attributes in the
pinned version before treating them as internal selectors.

Required roles, accessible names, relationships, and ARIA states are observable Zordon behavior and
remain part of accessibility review even when Angular Aria emits them. Incidental `data-*`
attributes, generated ID text, and upstream implementation selectors are not automatically public
Zordon customization contracts. Expose stable Zordon part directives, classes, and CSS variables
instead of documenting those internals.

When Zordon owns a relationship, use the [stable ID foundation](stable-ids.md). Do not allocate a
second relationship when Angular Aria already owns it, and do not parse or expose an upstream
generated ID as a Zordon customization contract.

Visible focus remains Zordon's responsibility. Never remove an outline without supplying a tested
replacement that works in forced-colors mode.

## Forms, overlays, and application state

Angular Aria models pattern interaction; it is not a ControlValueAccessor and does not replace the
forms decisions in ADR 0005. Value-bearing components still implement and test typed Reactive Forms
behavior. Advanced Select also needs Zordon-owned equality, serialization, touched, validation,
reset, async-data, and native-form policies.

Angular Aria documentation frequently composes CDK Overlay. Continue to use the private overlay
architecture from ADR 0004 for trigger/content lifecycle, positioning, stacking, dismissal, scroll,
focus restoration, and cleanup. Do not assume a Menu or Combobox directive is a complete overlay.

## SSR and hydration gate

Developer-preview status makes local proof mandatory. The first integration for each used family
must verify:

- server HTML contains deterministic roles, IDs, relationships, selected/expanded state, and lazy
  content policy;
- hydration reports no mismatch and preserves the initial active/selected/expanded state;
- no browser global or layout access occurs during server rendering;
- keyboard and pointer interaction work after hydration and cleanup occurs on destroy;
- deferred or overlay content has an explicit server-rendering policy.

Do not promise SSR support from source inspection or Angular branding alone.

## Testing contract

Use the pattern's published `@angular/aria/<family>/testing` harness when it helps exercise the
upstream behavior, but keep Zordon's public harnesses in `@pranxy/zordon-ui/testing`. Upstream
harnesses are implementation-test dependencies and must not leak into the production or public
testing API.

For each component, test observable behavior rather than the presence of a directive:

- native and generated roles, names, relationships, and state attributes;
- complete keyboard table, focus entry/movement/exit, typeahead, pointer/touch parity, and RTL;
- controlled/programmatic state updates and event order;
- disabled, read-only, loading, empty, invalid, and dynamic item changes;
- forms, overlay, Router, virtualization, or async-data integration owned by Zordon;
- SSR HTML, hydration, destroy/recreate cleanup, and no duplicate IDs;
- axe plus the repository's manual keyboard and screen-reader matrix.

A passing Angular Aria harness test does not replace browser and assistive-technology verification
of the complete Zordon component.

## Component readiness checklist

Before implementing a component that might use Angular Aria, record:

- [ ] Native HTML was evaluated first.
- [ ] The exact WAI-ARIA pattern and Angular Aria family/composition are named.
- [ ] Angular Aria-owned behavior and Zordon-owned behavior do not overlap.
- [ ] Public APIs contain no Angular Aria declaration or type.
- [ ] The pinned version's inputs, outputs, signals, emitted attributes, and harnesses were inspected.
- [ ] Forms, overlay, SSR/hydration, RTL, localization, and dynamic-content gaps are specified.
- [ ] A fallback/private gap is justified and behavior-tested if Angular Aria cannot cover it.
- [ ] Minimum/latest Angular compatibility and bundle impact are included in acceptance evidence.

## Official references

- [Angular Aria overview](https://v21.angular.dev/guide/aria/overview)
- [Accordion](https://v21.angular.dev/guide/aria/accordion)
- [Autocomplete](https://v21.angular.dev/guide/aria/autocomplete)
- [Grid](https://v21.angular.dev/guide/aria/grid)
- [Listbox](https://v21.angular.dev/guide/aria/listbox)
- [Menu](https://v21.angular.dev/guide/aria/menu) and [Menubar](https://v21.angular.dev/guide/aria/menubar)
- [Select](https://v21.angular.dev/guide/aria/select) and [Multiselect](https://v21.angular.dev/guide/aria/multiselect)
- [Tabs](https://v21.angular.dev/guide/aria/tabs)
- [Toolbar](https://v21.angular.dev/guide/aria/toolbar)
- [Tree](https://v21.angular.dev/guide/aria/tree)
- [Angular roadmap](https://v21.angular.dev/roadmap)

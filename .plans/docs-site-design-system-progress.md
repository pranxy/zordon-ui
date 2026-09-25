# Documentation site design system — implementation progress

- **Plan:** `.plans/docs-site-design-system.md`
- **Spec:** `projects/docs/DESIGN_SYSTEM.md` (see "As built")
- **Status:** In progress
- **Updated:** 2026-09-25 (Feedback pages: Alert, Loading, Progress, Radial Progress, Skeleton, Toast, Tooltip; initial bundle 404.8 kB)

Status: `Pending` | `In progress` | `Blocked` | `Verified` | `Descoped`

| ID  | Requirement                                    | Status      | Evidence / notes                                                                                                                                                                                                                   |
| --- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T01 | Tokens, fonts and primitives                   | Verified    | `styles/tokens.css`, `styles/primitives.css`; fonts not bundled (performance policy forbids font files)                                                                                                                            |
| T02 | Highlighter, code block, tabs, copy            | Verified    | `ui/code/*`; `highlight.spec.ts` (round-trip, classification, determinism); SSR hydration e2e green                                                                                                                                |
| T03 | Shell and navigation components                | Verified    | `ui/shell/*`, `navigation.ts` + `navigation.spec.ts`; navigation/a11y/SSR e2e green; search dialog deferred on idle                                                                                                                |
| T04 | Page scaffolding and reference building blocks | Verified    | `ui/page/*`, `ui/reference/*`; `/__zordon-tests__/ui` gallery renders every component and variant (reviewed in light/dark at 1440 and 390)                                                                                         |
| T05 | Playground and catalogue                       | Verified    | `docs-playground` (schema-driven, real `ZdButton`), 68-entry catalogue with URL category filter; `component-catalogue.spec.ts`, playground e2e                                                                                     |
| T06 | Migrate Get started, Components, Button        | Verified    | All three pages plus Home, Resources, Styling, Typed vocabularies and 404 are composed from `app/ui`; content corrections applied; manual side-by-side review in light/dark at 1440/390                                            |
| T07 | Guardrails and handover                        | In progress | Design-system check + CI step; `e2e/visual-docs-site.spec.ts` (gallery × 3, pages × 6, playground, catalogue) stable across repeated runs. **Windows baselines not yet generated**; CI's visual job fails until they are committed |

## Component reference pages

| Page            | Status                  | Evidence                                                                                                                                                     |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button          | Verified                | Original template page                                                                                                                                       |
| Dropdown        | Verified                | Playground (side/align/trigger/disabled), action, nested, content and controlled examples; SSR, keyboard, playground-snippet and open-menu axe checks in e2e |
| Kbd             | Verified                | Playground (size), size/in-text/combination examples; SSR and axe checks in e2e                                                                              |
| Swap            | Verified                | Playground (effect/readOnly); checkbox with Forms, toggle button, indeterminate, effects; toggle and axe checks in e2e                                       |
| Carousel        | Verified                | Playground (align/orientation); previous/next controls, partial items, vertical; scroll and axe checks in e2e                                                |
| Collapse        | Verified                | Playground (indicator); native details, indicators, forced state, group; SSR open state, toggle and axe checks in e2e                                        |
| Megamenu        | Verified                | Playground (columns/width/trigger); site navigation, full width on hover, command bar; SSR closed state, open/Escape, command-bar keyboard, open-panel axe   |
| Menu            | Verified                | Playground (size/orientation); navigation with groups, horizontal, selectable tree, badges and shortcuts; SSR, group toggle, tree selection and axe checks   |
| Alert           | Verified (Planned page) | Playground (color/variant/direction/dismissible); colors and variants, controlled dismissal, auto-dismiss, actions and details; dismissal and axe checks     |
| Loading         | Verified (Planned page) | Playground (variant/size/color/showLabel); variants and sizes, delayed feedback with aria-busy, overlay, custom artwork; delay/busy and axe checks           |
| Progress        | Verified (Planned page) | Playground ([value]/color/[showLabel]); upload with buffer and formatter, unknown total, colors; value-text/completion and axe checks                        |
| Radial Progress | Verified (Planned page) | Playground ([value]/color/size); thresholds, center content, custom text; aria-valuenow/valuetext and axe checks                                             |
| Skeleton        | Verified (Planned page) | Playground (preset/shape/animation); loading region with zdSkeletonRegion, shapes, presets; aria-busy/content swap and axe checks                            |
| Toast           | Verified (Planned page) | Page-scoped service and outlet; playground (color/position); actions with Undo, track(), custom template; queue/action/track and visible-toast axe           |
| Tooltip         | Verified (Planned page) | Playground (side/align/color); rich content, interactive help, disabled-action wrapper, controlled; focus/Escape/describedby and open-dialog axe             |
| Calendar        | Verified                | Playground (mode/week start/readOnly/disabled); bounds, range, popup, Forms, day template; SSR today, range/popup/Forms e2e, open-popup axe check            |
| Checkbox        | Verified (Planned page) | Playground (color/size/disabled); colors, sizes, mixed state, Reactive Forms; indeterminate, terms validity and axe checks in e2e                            |
| Radio           | Verified (Planned page) | Playground; radio group with Reactive Forms, colors, sizes; selection and axe checks in e2e                                                                  |
| Range           | Verified (Planned page) | Playground (incl. vertical); value with output and aria-valuetext, ticks, colors, sizes, vertical; keyboard and axe checks                                   |
| Rating          | Verified (Planned page) | Playground (size/disabled); star rating with Forms and clear, half stars, sizes; selection/keyboard/clear and axe checks                                     |
| Select          | Verified (Planned page) | Playground (color/size/ghost/disabled); optgroups with Forms, multiple, colors, sizes; selection and axe checks                                              |
| Text Input      | Verified (Planned page) | Playground (color/size/ghost/disabled); validation, input types, colors, sizes; aria-invalid flow and axe checks                                             |
| Textarea        | Verified (Planned page) | Playground; character count, colors, sizes; count and axe checks                                                                                             |
| Toggle          | Verified (Planned page) | Playground; settings list with FormGroup, colors, sizes; state and axe checks                                                                                |
| Fieldset        | Verified (Planned page) | Playground (native disabled); grouping, disabling a group, nested groups; disabled-propagation and axe checks                                                |
| File Input      | Verified (Planned page) | Playground (color/size/variant/disabled); reading the selection, colors, sizes; file selection and axe checks                                                |
| Filter          | Verified (Planned page) | Playground (color/size/variant); single choice with reset and Forms, variants, sizes; selection/reset and axe checks                                         |
| Label           | Verified (Planned page) | Playground (directive); association, floating label; label-focus and axe checks                                                                              |
| Validator       | Verified (Planned page) | Playground (type/required); native constraints, pattern and hint, Angular Forms via aria-invalid; hint and aria-invalid checks                               |
| OTP             | Verified (Planned page) | Playground (length); Reactive Forms, letters and digits, completion; typing/completion and axe checks                                                        |

Built with the "add a component page" recipe and no new site components. Two reusable additions: the
playground accepts a multi-line snippet (`render`), and `.docs-popover` styles consumer-owned overlay
panels. Catalogue cards and side navigation now link any component that has a `/components/<id>`
page. Compiling daisyUI's `menu` class for Dropdown adds about 8.5 kB of CSS; the initial bundle is
445 KiB, under the 450 KiB warning. The existing visual baselines are unaffected (checked against a
pre-change render); the new pages are not yet in the visual suite.

**Preview pages round (2026-09-24).** Six more pages from the same recipe. Changes along the way:

- `defineComponentPage` in `site-catalog.ts` builds each reference page's standard outline, which
  removed the repeated TOC skeletons and kept the initial bundle under the warning (449.2 KB). A unit
  test checks every reference page's outline and the previous/next chain.
- daisyUI classes that only reference pages use are compiled per page (`pages/styles/*.daisy.css`,
  loaded by a template-less unencapsulated component). The generic `menu` rule moved out of the
  global stylesheet into the shared `menu-base.daisy.css` (Dropdown, Megamenu, Menu). The Menu test
  fixture now compiles it in its own `menu-base-fixture.css`, which keeps its baseline identical.
- `.docs-stack` was specified but never implemented; it is now a primitive.
- `docs-section` and `docs-step` no longer leave their `id` on the host, which duplicated the heading's id.
- The design-system guard lets content modules show `--zd-*` overrides in consumer code samples.
- Carousel slide labels sit on a surface chip: some themes' `secondary-content` on `secondary` is
  only 3:1, which axe flagged.
- The Calendar page centres the popup dialog itself: Tailwind's preflight removes the dialog's auto
  margin and `calendar.css` does not restore it. **Library follow-up:** add `margin: auto` to the
  `dialog` rule in `projects/components/calendar/src/calendar.css`.
- **Library docs follow-up:** `docs/components/menu.md` says the generic `menu` rule is unnecessary,
  but it sets item spacing: without it the Menu fixture's baseline changes.
- The Swap visual test is flaky before and after this change (3 of 4 runs failed at HEAD on Linux).

**Data input round (2026-09-24).** Eight Planned-maturity pages, labelled like Button as an
implementation contract rather than a Stable claim.

- `docs-reference-page` renders the standard sections from a typed `DocsReference`; pages add only
  their playground and examples. `content/form-controls.content.ts` shares colors, sizes, controls,
  API rows and notices. New primitives: `.docs-choice`, `.docs-field`, `.docs-status`.
- Per-page daisyUI stylesheets as before; the generic `select` rule is 11 kB, so Select splits its
  modifiers into a second file.
- Vertical Range needs a size container: daisyUI measures the fill in `cqh`, which otherwise falls
  back to the viewport.
- Rating: axe's WCAG 2.2 target-size rule fails daisyUI's defaults (8 px clear option, 14 px half
  stars at `lg`, `xs`/`sm` stars). The page widens the clear option, uses a 3rem `--size` for half
  stars and shows the small sizes as display-only, and documents all three.
- **Resolved (native attribute names):** inputs no longer reuse native attribute names. `style`
  became `variant` on Alert, Badge, Card, File Input, Filter, Text Input and Textarea; Select and
  Text Input use `zdSize`; Select's `ghost` became `variant`; `ZdStyle` became `ZdVariant`.
  `tools/check-native-attribute-inputs.mjs` (in `npm run test:tooling`) enforces the rule, and
  docs/contributing/api-review.md records it.
- **Budget:** the initial bundle is 452.7 kB, over Angular's 450 kB (450,000-byte) warning but under
  the site policy's 450 KiB. Each page adds about 0.4 kB to the eager page catalogue (mostly its
  outline); see the proposal to load outlines per route before the next batches.

**Data input completed (2026-09-25).** Six more Planned pages; every Data input component now has
a page. Previous/next links are derived from the catalogue order (`componentReferencePages`), with
a unit test that the order matches the catalogue. `docs-reference-page` makes the Types section
optional for entry points without public types. Initial bundle: 453.6 kB. **Library note:** OTP's
cells hard-code the `input` class instead of using `ZdClassNames`, so they ignore a configured
daisyUI prefix.

**Bundle reduction (2026-09-25).** Measuring showed page outlines are a tiny share of the
per-page cost (27 characters on average), so the per-route outline idea was dropped. Instead, the
docs app runs zoneless (-37.6 kB), and daisyUI classes only the browser test fixture uses moved from
the global stylesheet into that fixture (-13.7 kB). Initial bundle 453.6 → 402.3 kB. Visual suite
84/84 identical; browser 196/197 (known Menu flake), docs e2e 38/38. See
docs/testing/bundle-size-budgets.md.

**Feedback round (2026-09-25).** Seven Planned pages; every Feedback component now has a page.

- Numeric inputs use `[value]`-style playground keys, so the snippet shows a property binding.
- Toast provides its own `ZdToastService` on the page, so examples never leak into other pages.
- Alert's soft, outline and dash variants colour text with the status colour, which fails contrast
  on the light theme (1.6–1.9:1). The page uses the base text colour for them and shows that rule
  under Customization.
- Loading's glyphs are split over three stylesheets (SVG masks); Tooltip needs no page stylesheet.
- **Library follow-up (input collision):** Tooltip and Button both have a `color` input, so
  `<button zdButton [zdTooltip] color="…">` colours both. The page uses plain `.btn` hosts where it
  sets a tooltip colour. Consider `tooltipColor`, like `tooltipLabel`/`tooltipDisabled`.
- Initial bundle 402.3 → 404.8 kB. Docs e2e 41/41; visual docs-site suite identical to the
  pre-change render (no baseline updates needed).

## Validation run (2026-09-25)

| Check                                         | Result                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run lint:docs`                           | Pass                                                                                                    |
| `npm run test:docs`                           | 7 files / 41 tests pass                                                                                 |
| `npm run build:docs`                          | Pass; warnings: preview sketch styles 9.5 kB (> 8 kB warning, < 12 kB error), existing collapse fixture |
| Docs Playwright (`playwright.docs.config.ts`) | 41 / 41 pass                                                                                            |
| Visual suite vs. pre-change render            | 84 / 84 match                                                                                           |
| `npm run check:docs:links`                    | Pass (36 sitemap routes, 43 documents)                                                                  |
| `npm run check:docs:performance`              | Pass at 404.8 kB initial                                                                                |
| `npm run check:docs:design-system`            | Pass (152 files)                                                                                        |
| `npm run typecheck:browser`, `lint:browser`   | Pass                                                                                                    |

## Decisions / deviations

| Item | Decision                                                                                                                                      | Status                   |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| D01  | Codebase wins over mockup copy (package name, provider, `variant`/`layout`/`zdDisabled`, maturity)                                            | Accepted                 |
| D02  | Button `loading` documented as `aria-disabled` (the mockup said `aria-busy`, which the directive does not set)                                | Accepted                 |
| D03  | Initial-bundle budget raised to 450/470 kB after re-measurement                                                                               | Needs owner confirmation |
| D04  | Tabs/Accordion/Table/Filter/Breadcrumbs/Modal/Badge/Theme Controller left native for now                                                      | Revisit                  |
| D05  | TOC stays catalogue data (a runtime registry breaks SSR ordering)                                                                             | Accepted                 |
| D07  | Visual baselines are generated on Windows (repo policy); Linux-generated images were used only to check the tests are stable and were deleted | Accepted                 |
| D06  | Palette 2a + logo 2f until the Components Board decision                                                                                      | Open                     |

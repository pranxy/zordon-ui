# Documentation site design system — implementation progress

- **Plan:** `.plans/docs-site-design-system.md`
- **Spec:** `projects/docs/DESIGN_SYSTEM.md` (see "As built")
- **Status:** In progress
- **Updated:** 2026-09-23 (Dropdown and Kbd reference pages added)

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

| Page     | Status   | Evidence                                                                                                                                                     |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button   | Verified | Original template page                                                                                                                                       |
| Dropdown | Verified | Playground (side/align/trigger/disabled), action, nested, content and controlled examples; SSR, keyboard, playground-snippet and open-menu axe checks in e2e |
| Kbd      | Verified | Playground (size), size/in-text/combination examples; SSR and axe checks in e2e                                                                              |

Built with the "add a component page" recipe and no new site components. Two reusable additions: the
playground accepts a multi-line snippet (`render`), and `.docs-popover` styles consumer-owned overlay
panels. Catalogue cards and side navigation now link any component that has a `/components/<id>`
page. Compiling daisyUI's `menu` class for Dropdown adds about 8.5 kB of CSS; the initial bundle is
445 KiB, under the 450 KiB warning. The existing visual baselines are unaffected (checked against a
pre-change render); the new pages are not yet in the visual suite.

## Validation run (2026-09-23)

| Check                                         | Result                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run lint:docs`                           | Pass                                                                                                    |
| `npm run test:docs`                           | 7 files / 34 tests pass                                                                                 |
| `npm run build:docs`                          | Pass; warnings: preview sketch styles 9.5 kB (> 8 kB warning, < 12 kB error), existing collapse fixture |
| Docs Playwright (`playwright.docs.config.ts`) | 24 / 24 pass                                                                                            |
| `npm run check:docs:links`                    | Pass (7 sitemap routes, 14 documents)                                                                   |
| `npm run check:docs:performance`              | Pass at 444.7 kB initial (budget re-measured; see `docs/testing/bundle-size-budgets.md`)                |
| `npm run check:docs:design-system`            | Pass (67 files)                                                                                         |
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

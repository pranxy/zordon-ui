# Documentation site design system and mockup implementation

> **Status:** In progress. T01–T06 implemented; T04's gallery route and T07's lint rule are partly done. Palette and logo still default to Board 2a + 2f.
> **Progress:** [`.plans/docs-site-design-system-progress.md`](docs-site-design-system-progress.md)
> **Design contract:** [Claude Design project](https://claude.ai/design/p/f4d8f1ff-7317-4763-9029-31911e3d4113?file=Zordon+Components+Board.dc.html) (Get Started, Components, Button, Components Board); see `projects/docs/DESIGN_SYSTEM.md#design-source`
> **Design system spec:** [`projects/docs/DESIGN_SYSTEM.md`](../projects/docs/DESIGN_SYSTEM.md)
> **Builds on:** [`.plans/docs-site-ssr-and-ui-architecture.md`](docs-site-ssr-and-ui-architecture.md) (T02–T06 verified)

## Outcome and boundaries

- **Problem and target:** The SSR docs site works, but it doesn't look like the new mockups. Its
  shell also lives in one 859-line `app.component.ts` with about 550 lines of inline styles, and its
  pages hand-roll their markup. The mockups have 1,165 inline styles, of which 375 are unique. The
  target is a token → primitive → component design system in `projects/docs`, then a rebuild of the
  shell and the Get Started, Components and Button pages that matches the mockups in light and dark,
  on desktop and at 375 px.
- **In scope:** Tokens, global primitives, `docs-*` UI components, syntax highlighting, the component
  catalogue data model, the three mockup pages, the shell, and visual/a11y/SSR regression coverage.
- **Out of scope:** Library component APIs, visual changes to library components, new routes, content
  for the other 67 component pages (the templates must support them), hosting (T01 of the SSR plan),
  and the palette/logo exploration itself.
- **Approach:** Extract, don't transcribe. Build the tokens first, then the components bottom-up
  (atoms → composites → page templates), each with a story-style fixture route and unit tests.
  Migrate pages last, one at a time, keeping every existing docs test green at each step. The
  mockups are the visual authority; the catalogue and library source are the content authority (see
  _Content corrections_ in the spec).

## Key files, evidence, and decisions

| File or source                                                                            | Why it matters                                                                                                                                                                | Decision or plan impact                                                                                                                                               |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Design `Zordon *.dc.html`                                                          | Visual contract; inline styles only; React/`dc-runtime` driven                                                                                                                | Treat as reference only; don't import `support.js` or `zd-highlight.js`                                                                                               |
| `projects/docs/src/app/app.component.ts`                                                  | Shell template plus ~550 lines of component styles                                                                                                                            | Split into `ui/shell/*` components; the root becomes composition only                                                                                                 |
| `projects/docs/src/styles.css`                                                            | Already defines `--docs-*` aliases and a daisyUI light/dark setup                                                                                                             | Keep the aliases; move them into `styles/tokens.css`; add the maturity, code, type, space and radius tokens                                                           |
| `projects/docs/src/app/site-catalog.ts`                                                   | Typed page catalogue that drives nav, metadata and the sitemap                                                                                                                | Extend with `DocsComponentEntry` (category, maturity, summary, preview key) for all 68 components; derive the TOC from `DocsTocRegistry`, not from hand-written lists |
| `projects/docs/src/app/pages/shared/*`                                                    | `docs-code-example` and `docs-page-header` already exist                                                                                                                      | Evolve them into `docs-code-block` and `docs-page-header`, without keeping a parallel copy                                                                            |
| `projects/components/*/src`                                                               | Library components are available to the site (`ZdButton`, `ZdBadge`, `zd-tabs`, `zdTable`, `zdKbd`, `zdAccordion`, `zdFilter`, `zd-breadcrumbs`, `zdModal`, theme controller) | Dogfood them. A gap goes to the library tracker, not a site workaround                                                                                                |
| `docs/architecture/0003-styling-and-theming.md`, `docs/foundations/safe-customization.md` | daisyUI is the colour source; `--zd-*` is public API                                                                                                                          | Site tokens are `--docs-*`; no `--color-*` overrides                                                                                                                  |
| `e2e/docs-*.spec.ts`                                                                      | Role-based selectors (headings, links, navigation, table, dialog)                                                                                                             | Keep landmark and role semantics stable; add visual snapshots for the three pages × 2 themes × 2 viewports                                                            |
| Button source vs. mockup                                                                  | `variant`/`layout`/`zdDisabled` vs. `appearance`/`shape`/`disabled`                                                                                                           | The playground and API table are generated from real input metadata                                                                                                   |

- **Decision:** Build the design system inside `projects/docs/src/app/ui/` rather than as a separate
  library. It has one consumer, and promoting it later is cheap.
- **Decision:** Highlight syntax at render time with a pure tokenizer. Client-side DOM rewriting
  (the mockup's `zdHighlight`) would cause hydration mismatches and a flash of unstyled code.
- **Decision:** Load catalogue card previews with `@defer (on viewport; hydrate on viewport)` and
  incremental hydration, so the 68-card catalogue doesn't load or hydrate every preview up front,
  while the server HTML still contains the text content.
- **Open gate:** Palette (2a–2e) and logo mark (2f–2j). Neither blocks T01–T05, because both are
  isolated to a theme block and `docs-brand`.

## Target structure

```
projects/docs/src/
  styles.css                  # @import tailwind/daisyUI, then the three files below
  styles/
    tokens.css                # §1 of the spec
    fonts.css                 # self-hosted Inter variable + IBM Plex Mono
    primitives.css            # §2 of the spec
  app/
    ui/
      shell/      docs-shell, utility-bar, brand, nav-link, primary-nav, mobile-nav,
                  breadcrumbs, layout, side-nav, toc, pager, footer, search-dialog
      page/       page-header, meta-grid, section, subsection, callout, hero
      code/       code-block, code-tabs, copy-button, example, highlight.ts
      reference/  playground, chip-group, api-table, feature-grid, link-card, steps, faq
      catalogue/  maturity-badge, maturity-dot, maturity-legend, component-card, catalogue,
                  previews/ (one tiny preview component per catalogue entry)
      services/   toc-registry.ts, preferences.ts
      index.ts    # barrel for pages
    content/
      components.catalogue.ts   # 68 entries: id, name, category, maturity, summary, previewKey
      button.content.ts         # examples, API rows, a11y rows, theming vars
      getting-started.content.ts
    pages/        # thin templates composed only from ui/*
    testing/ui-gallery.component.ts  # /__zordon-tests__/ui — every component, every variant
```

## Tasks

#### T01 — Tokens, fonts and primitives

- **Change:**
  - Create `styles/tokens.css` with the spec's §1: aliases, maturity, code, type, space, radius,
    layout, motion, and dark overrides under `[data-theme='dark']`.
  - Self-host Inter (variable) and IBM Plex Mono; preload them from `index.html`.
  - Create `styles/primitives.css` (`.docs-eyebrow`, `.docs-lead`, `.docs-prose`,
    `.docs-code-inline`, `.docs-panel`, `.docs-stack`, `.docs-cluster`).
  - Make no visual change to the current pages yet, apart from the font.
- **Starts at:** `projects/docs/src/styles.css`, `projects/docs/src/index.html`, `angular.json` (assets)
- **Depends on:** None
- **Tests:** Stylelint/Prettier; a unit test that parses `tokens.css` and fails on any `--zd-*` or
  `--color-*` definition.
- **Verify:** `npm run build:docs`; the initial CSS stays within the budget in `check:docs:performance`.
- **Risk/recovery:** Font files add weight. Subset to Latin and use `font-display: swap`; revert to system fonts if the budget fails.

#### T02 — Code primitives: highlighter, code block, tabs, copy

- **Change:**
  - Port `zd-highlight.js` rules into `ui/code/highlight.ts`, a pure function returning a
    `Token[]`, with `ts`, `html` (with Angular control-flow keywords), `css`, `bash` and `json`.
  - `docs-code-block` renders the tokens as spans; `docs-copy-button` (post-hydration, live region);
    `docs-code-tabs` built on `zd-tabs`, with an optional persisted package-manager choice.
  - Replace `docs-code-example` at its current call sites.
- **Starts at:** `pages/shared/code-example.component.ts`
- **Depends on:** T01
- **Tests:** Unit tests for the highlighter (golden outputs per language, HTML escaping, no
  `innerHTML`); component tests for copy and live-region behaviour; an SSR test for identical
  server/client markup.
- **Verify:** `test:docs`, `test:docs:ssr`; no hydration warnings on `/docs/getting-started`.

#### T03 — Shell and navigation components

- **Change:**
  - Split `app.component.ts` into `docs-shell`, `docs-utility-bar`, `docs-brand`,
    `docs-nav-link`, `docs-primary-nav`, `docs-mobile-nav`, `docs-breadcrumbs` (on
    `zd-breadcrumbs`), `docs-layout`, `docs-side-nav`, `docs-toc` (rail and disclosure),
    `docs-pager` (card design), `docs-footer` and `docs-search-dialog` (on `zdModal`).
  - Replace the hand-rolled theme toggle with the library theme controller.
  - Add `DocsTocRegistry`, so `docs-section` anchors feed the TOC. Drop the hand-written
    `tableOfContents` arrays from the catalogue once all pages have migrated.
  - Implement the responsive rules (64/48/30 rem) inside each component's styles.
- **Starts at:** `app.component.ts`, `site-catalog.ts`
- **Depends on:** T01
- **Tests:** The existing `docs-navigation`, `docs-accessibility` and `docs-ssr-foundation` suites must
  stay green unchanged. Add a unit test that the TOC registry reports the order of IDs in the DOM.
- **Verify:** Desktop and 375 px keyboard walk: skip link, primary nav, mobile menu, search (`/` opens, Escape closes and restores focus), theme toggle persists without a hydration mismatch.
- **Risk/recovery:** This is the largest diff. Land it in two PRs: (a) extraction with identical visuals, (b) restyle to the mockup.

#### T04 — Page scaffolding and reference building blocks

- **Change:** Build `docs-page-header` (extended), `docs-meta-grid` (facts/stats), `docs-section`,
  `docs-subsection`, `docs-callout` (4 variants), `docs-hero`, `docs-example`, `docs-feature-grid`,
  `docs-link-card`, `docs-steps` (with optional progress), `docs-faq` (on `zdAccordion`, with a
  `<details>` fallback), `docs-api-table` (on `zdTable`/`zdKbd`) and `docs-chip-group` (on `zdFilter`).
  Add every variant to the `/__zordon-tests__/ui` gallery route, which is `noindex` and excluded from
  the sitemap like the other test fixtures.
- **Depends on:** T01, T02
- **Tests:** Component unit tests per input/variant; an axe scan of the gallery in both themes; visual
  snapshots of the gallery (`test:visual`).
- **Verify:** The gallery matches the mockup crops side by side in light and dark.

#### T05 — Playground and catalogue

- **Change:**
  - `docs-playground`: a typed control schema, a render template, a generated snippet that
    omits default values, and the real library component in the preview.
  - `content/components.catalogue.ts`: all 68 components with category, maturity (sourced from the
    build plan's status column), summary and preview key. Counts and "N / 68" are derived from it.
  - `docs-maturity-badge/dot/legend`, `docs-component-card` and the lazy preview components (start
    with the 31 shown in the mockup; the rest fall back to a neutral placeholder).
  - `docs-catalogue`: category chips (a `<select>` below 48 rem), text filter, grouped sections with
    "shown of total" counts, an empty state, and URL query-param state so filtered views can be linked.
- **Depends on:** T04
- **Tests:** Unit tests for filter logic and derived counts; a browser test that filtering works by
  keyboard and that the server HTML lists every card without JS; a unit test that playground snippets
  round-trip (the snippet produces the same rendered classes).
- **Risk/recovery:** 68 preview components can bloat the bundle. Each is `@defer`-loaded; enforce a
  per-chunk budget in `check:docs:performance`.

#### T06 — Migrate the three mockup pages

- **Change:**
  - **Get started:** requirements meta-grid, the fast-path callout (hidden by flag until `ng add`
    ships), a 5-step `docs-steps` with package-manager tabs, the result example, troubleshooting FAQ,
    next-step link cards and the pager. The side nav has _Get started_ and _Guides_ groups.
  - **Components:** hero with stats, "three commitments" feature grid, the catalogue, the maturity
    note callout, and the side nav with the maturity legend.
  - **Button:** header with fact meta-grid, import block, playground, the five examples, API
    (inputs/outputs/types), accessibility (feature grid + keyboard table), theming (variables table +
    code) and pager. The side nav is the Actions group plus other groups with counts.
  - Apply every row of the spec's _Content corrections_ table.
  - Pages contain no styles of their own. A page that needs CSS is missing a component.
- **Depends on:** T03, T04, T05
- **Tests:** Update `docs-pages.spec.ts` for the new sections; add visual snapshots for 3 pages × light/dark × 1440/375.
- **Verify:** A side-by-side review against the mockup screenshots; the no-JS render of each page is complete and readable.

#### T07 — Guardrails and handover

- **Change:**
  - Lint rules: forbid `style="…"` attributes and hex/oklch literals in `projects/docs/src/app/**`
    (a template lint rule plus a grep check in `check:docs:*`).
  - Document the "add a new component page" recipe in `DESIGN_SYSTEM.md`: a content file, a catalogue
    entry, a preview component and a page composed from `ui/*`.
  - Run the full release gates (`test:docs:ssr`, `test:visual`, `check:docs:links`, `check:docs:performance`).
- **Depends on:** T06
- **Verify:** CI is green, and a trial second component page (e.g. Badge) is built from the recipe without adding any CSS.

## Sequencing

```
T01 ─┬─ T02 ─┬─ T04 ── T05 ─┐
     │       │              ├─ T06 ── T07
     └─ T03 ─┴──────────────┘
```

T02 and T03 can run in parallel after T01. The palette and logo decision can land any time before T06's visual snapshots are recorded.

## Final acceptance

- **Checks:**
  - The three pages and the shell match the mockups in light and dark, at 1440 px and 375 px.
  - `projects/docs/src/app` has no inline style attributes and no colour literals outside `tokens.css`.
  - Every repeated mockup pattern maps to exactly one `docs-*` component or primitive, and the gallery route shows them all.
  - Library components are used wherever one exists for the pattern.
  - All existing docs SSR, navigation, accessibility, link and performance gates pass, plus the new visual snapshots.
  - Rendered content matches the shipped API: package name, provider, `variant`/`layout`/`zdDisabled`, and maturity.
- **End state:** Adding a component page means writing a content file and a catalogue entry, with no new CSS.

# Zordon UI documentation site — design system

> **Status:** Implemented (first pass, 2026-09-23) — derived from the mockups in `docs/html/` (Get Started, Components, Button, Components Board). See [As built](#as-built-2026-09-23) for deviations.
> **Scope:** The documentation website (`projects/docs`) only. This is not the library's public styling API.
> **Implementation plan:** [`.plans/docs-site-design-system.md`](../../.plans/docs-site-design-system.md)

## Why this exists

The four mockups contain **1,165 inline `style` attributes, of which only 375 are unique**. The same
declarations repeat across pages: the uppercase eyebrow label appears 44 times, the catalogue card's
four-part structure 31 times each, the code-block frame 17 times, and the maturity pill 35 times in four
hand-written colour variants. The mockups are a visual contract, not source. This document turns
them into three layers, so each pattern is defined once:

1. **Tokens** — CSS custom properties (colour aliases, type, space, radius, layout, code, maturity).
2. **Primitives** — a small set of global classes for typographic and surface patterns that are not worth a component.
3. **Components** — Angular `docs-*` components for every repeated structure, fed by typed data.

## Ground rules

| Rule                                                                                                                                                                                       | Why                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Colour comes from daisyUI.** The mockup colours are the exact daisyUI 5.7.16 `light`/`dark` tokens. The site redefines no `--color-*` value; it only aliases them.                       | [ADR 0003](../../docs/architecture/0003-styling-and-theming.md): daisyUI is the visual source of truth. A palette change (Board directions 2a–2e) becomes a theme switch, not a refactor. |
| **Site tokens use `--docs-*`, never `--zd-*`.** The mockups' `--zd-sans`/`--zd-mono` are renamed to `--docs-font-sans`/`--docs-font-mono`.                                                 | The [safe customization contract](../../docs/foundations/safe-customization.md) reserves `--zd-*` for Zordon's public API.                                                                |
| **Dogfood the library where it fits.** When a Zordon component matches the pattern's visuals and bundle cost, the site uses it (today `ZdButton`, `ZdKbd`, `ZdIdGenerator`; see As built). | The docs site is the first consumer, and any visual gap it finds is a library finding.                                                                                                    |
| **No inline styles and no `data-zd` hooks.** Responsive behaviour lives in the component's own styles or in layout primitives.                                                             | The mockups use `[data-zd='…'] { … !important }` to override inline styles at breakpoints. Once styles live in classes, those overrides are not needed.                                   |
| **SSR first.** Everything renders meaningful HTML on the server. Syntax highlighting, copy buttons, filters and playgrounds only enhance that HTML after hydration.                        | Required by the [docs-site SSR plan](../../.plans/docs-site-ssr-and-ui-architecture.md).                                                                                                  |
| **Content comes from data, not from mockup copy.** API names, maturity, import paths and versions come from the site catalogue and the library.                                            | Several mockup strings don't match the shipped API (see [Content corrections](#content-corrections)).                                                                                     |

---

## 1. Tokens

File: `projects/docs/src/styles/tokens.css` (imported by `styles.css`).

### 1.1 Semantic colour aliases (already in `styles.css`, keep)

| Token                   | Value                                                      | Use                                           |
| ----------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `--docs-surface`        | `var(--color-base-100)`                                    | Page, cards                                   |
| `--docs-surface-raised` | `var(--color-base-200)`                                    | Preview areas, meta strips, table headers     |
| `--docs-subtle`         | `color-mix(primary 12%, base-100)`                         | Active nav item, hover fills, accent callout  |
| `--docs-text`           | `var(--color-base-content)`                                | Body text                                     |
| `--docs-muted-text`     | `color-mix(base-content 70%, transparent)`                 | Secondary text, nav links                     |
| `--docs-border`         | `var(--color-base-300)`                                    | Default hairlines                             |
| `--docs-border-strong`  | `color-mix(base-content 35%, transparent)`                 | Chips, outline buttons, breadcrumb separators |
| `--docs-accent`         | `var(--color-primary)`                                     | Brand, focus ring, step rails                 |
| `--docs-accent-strong`  | `color-mix(primary 72%, base-content)`                     | Accent text on light fills, link hover        |
| `--docs-accent-text`    | `var(--color-primary-content)`                             | Text on accent fill                           |
| `--docs-shadow`         | `0 24px 64px rgb(15 23 42 / 18%)`; dark `rgb(0 0 0 / 45%)` | Popovers, search dialog, mobile nav           |

### 1.2 Maturity tokens (new)

Maturity colours are derived from the theme, never hard-coded, so they follow any palette.

| Token set                        | bg                           | border                           | fg                                           | Border style                |
| -------------------------------- | ---------------------------- | -------------------------------- | -------------------------------------------- | --------------------------- |
| `--docs-maturity-planned-*`      | `transparent`                | `--docs-border-strong`           | `--docs-muted-text`                          | solid                       |
| `--docs-maturity-experimental-*` | `mix(warning 20%, base-100)` | `mix(warning 45%, base-content)` | `mix(warning 30%, base-content)`; dark `78%` | **dashed**                  |
| `--docs-maturity-preview-*`      | `mix(info 18%, base-100)`    | `mix(info 45%, base-content)`    | `mix(info 26%, base-content)`; dark `78%`    | solid                       |
| `--docs-maturity-stable-*`       | `--color-primary`            | `--color-primary`                | `--color-primary-content`                    | solid (the only filled one) |

### 1.3 Code tokens (new)

The code frame stays dark in both themes.

| Token                                       | Light                                                                                                                                                  | Dark                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `--docs-code-bg`                            | `oklch(22% .025 277)`                                                                                                                                  | `oklch(19% .014 254)` |
| `--docs-code-line`                          | `oklch(30% .03 277)`                                                                                                                                   | `oklch(28% .018 254)` |
| `--docs-code-fg` / `--docs-code-muted`      | `oklch(93% .012 277)` / `oklch(72% .025 277)`                                                                                                          | same                  |
| `--docs-token-{kw,str,com,tag,attr,fn,num}` | `oklch(78% .13 305)`, `oklch(83% .12 150)`, `oklch(68% .025 277)`, `oklch(77% .12 245)`, `oklch(85% .11 80)`, `oklch(82% .1 200)`, `oklch(80% .12 30)` | same                  |

### 1.4 Typography

Fonts: `--docs-font-sans: Inter, 'IBM Plex Sans', ui-sans-serif, system-ui, …` and
`--docs-font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace`.
**Fonts are not bundled.** The repository's documentation performance policy
(`tools/check-docs-performance.mjs`) rejects bundled font files, so the stack falls back to system
fonts when Inter and IBM Plex are not installed. The mockups also use weights 650 and 750, which
static webfonts would synthesise. Self-hosting a variable Inter would need a policy change first.

The mockups use 16 font sizes. They collapse into this scale (usage counts from the mockups):

| Token                 | Size                                       | Weight / tracking      | Used for                                    |
| --------------------- | ------------------------------------------ | ---------------------- | ------------------------------------------- |
| `--docs-text-display` | `clamp(2.75rem, 7vw, 5rem)`, lh .97        | 800 / -.035em          | Landing hero only                           |
| `--docs-text-h1`      | `clamp(2.5rem, 6vw, 4rem)`, lh 1           | 800 / -.035em          | Page title                                  |
| `--docs-text-h2`      | `clamp(1.35rem, 3vw, 1.75rem)`, lh 1.2     | 750 / -.02em           | Section title                               |
| `--docs-text-h3`      | `1.125rem`                                 | 750 / -.01em           | Sub-section, group heading                  |
| `--docs-text-h4`      | `1.0625rem`                                | 750                    | Card titles (×34)                           |
| `--docs-text-lead`    | `clamp(1.0625rem, 1.5vw, 1.25rem)`, lh 1.6 | 400                    | Page description                            |
| `--docs-text-body`    | `.9375rem`, lh 1.6                         | 400                    | Section prose, nav links                    |
| `--docs-text-sm`      | `.875rem`, lh 1.5                          | 400                    | Card descriptions, breadcrumbs              |
| `--docs-text-xs`      | `.8125rem`                                 | 400                    | Code, TOC, utility bar                      |
| `--docs-text-eyebrow` | `.6875rem`                                 | 800 / .1em / uppercase | Eyebrows, table headers, meta labels (×131) |
| `--docs-text-badge`   | `.6875rem`                                 | 700 / .04em            | Maturity pills, counts                      |

Normalise the stray values: `.75rem` → `xs`, `.5625rem`/`.625rem` → preview-only (inside card
thumbnails, not tokenised), and `.9em` → the `docs-code-inline` primitive.

### 1.5 Space, radius, layout, motion

| Group       | Tokens                                                                                                                                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Space       | `--docs-space-{1:.25rem, 1.5:.375rem, 2:.5rem, 3:.75rem, 3.5:.875rem, 4:1rem, 5:1.25rem, 6:1.5rem, 8:2rem, 10:2.5rem}` (collapse `.3`/`.35`/`.4` → `.375`)                                                                                                                   |
| Radius      | `--docs-radius-xs .25rem` (kbd, copy button) · `sm .375rem` (utility buttons) · `md .5rem` (nav items, inputs, code frame) · `lg .75rem` (cards, panels, tables) · `pill 999px` (chips, badges)                                                                              |
| Layout      | `--docs-container 90rem` · `--docs-gutter clamp(1rem, 4vw, 4rem)` · `--docs-measure 62ch` · `--docs-content 52rem` · `--docs-sidebar minmax(11rem, 14rem)` · `--docs-toc minmax(9rem, 12rem)` · `--docs-header-offset 8.25rem` (sticky offset) · `--docs-scroll-margin 9rem` |
| Breakpoints | `64rem`: TOC hidden, sidebar narrows · `48rem`: single column, mobile nav, category select replaces chip row · `30rem`: GitHub link hidden                                                                                                                                   |
| Motion      | `--docs-duration 150ms`, `--docs-ease cubic-bezier(.2,0,0,1)`, with all transitions disabled under `prefers-reduced-motion`                                                                                                                                                  |
| Focus       | `:focus-visible { outline: 3px solid var(--docs-accent); outline-offset: 3px }` (kept global)                                                                                                                                                                                |

---

## 2. Primitives (global classes)

File: `projects/docs/src/styles/primitives.css`. These patterns have no behaviour, so a class is enough.

| Class                           | Replaces                                                 | Notes                                                                                      |
| ------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `.docs-eyebrow`                 | 44 identical uppercase label spans                       | Optional `--accent` modifier for the primary-coloured kickers ("CATALOGUE", "GET STARTED") |
| `.docs-lead`                    | Page and section intro paragraphs (×11)                  | Includes `max-inline-size: var(--docs-measure)`                                            |
| `.docs-muted`                   | Scattered `color: var(--docs-muted-text)`                | —                                                                                          |
| `.docs-code-inline`             | 44 inline `<code>` styles                                | Mono, `.9em`, text colour; applied automatically inside `.docs-prose`                      |
| `.docs-prose`                   | Heading and paragraph rhythm inside `<main>`             | Maps `h2`–`h4` to the type tokens, sets `scroll-margin` and `text-wrap: balance/pretty`    |
| `.docs-panel`                   | Bordered `lg`-radius surface (×6 + cards)                | Base for cards, tables and callouts                                                        |
| `.docs-stack` / `.docs-cluster` | `display:grid; gap` and `display:flex; wrap; gap` (×30+) | `--gap` custom property                                                                    |
| `.docs-visually-hidden`         | (exists)                                                 | Keep                                                                                       |

---

## 3. Components

All components are standalone, `OnPush`, signal-input based and prefixed `docs-`. They live in
`projects/docs/src/app/ui/`, grouped by folder. "Lib" means the component wraps or composes a Zordon
library component.

### 3.1 Shell and navigation

| Component                              | Replaces in mockups                                                                                                                                       | Inputs / slots                                                                                                      | Lib                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `docs-shell` (root layout)             | The header + breadcrumb + grid + footer, repeated on every page                                                                                           | Reads the current page from the catalogue                                                                           | —                                |
| `docs-utility-bar`                     | Version note, GitHub, search trigger with `/` key hint, theme toggle                                                                                      | `note`, `repoUrl`                                                                                                   | `zdKbd`, `button[zdThemeButton]` |
| `docs-brand`                           | Logo mark + wordmark (header, footer, Board 2f–2j)                                                                                                        | `size: 'sm' \| 'md'`, `variant` (filled/outlined/…)                                                                 | —                                |
| `docs-nav-link`                        | Primary nav, mobile nav, side nav links (4 hand-styled variants)                                                                                          | `appearance: 'primary' \| 'menu' \| 'side'`, `routerLink`, active via `routerLinkActive`                            | —                                |
| `docs-primary-nav` / `docs-mobile-nav` | Desktop nav and `<details>` mobile menu with the same links                                                                                               | `items` (from catalogue)                                                                                            | —                                |
| `docs-breadcrumbs`                     | Breadcrumb `<ol>`                                                                                                                                         | `items`                                                                                                             | — (native `<ol>`)                |
| `docs-layout`                          | 3-column `docgrid` with responsive collapse                                                                                                               | Slots: `[docsSidebar]`, default, `[docsToc]`; `variant: 'doc' \| 'landing'`                                         | —                                |
| `docs-side-nav`                        | Three sidebar variants: Get started groups; Documentation + maturity legend; component group with maturity dots, a back link and other groups with counts | `groups: { label, items: { label, link, maturity?, count? }[] }[]`, optional `backLink`, `[docsSideNavFooter]` slot | —                                |
| `docs-toc`                             | "On this page" list with nested levels and "Edit this page"                                                                                               | `items: { id, label, level }[]`, `editUrl?`, `variant: 'rail' \| 'disclosure'` (mobile)                             | —                                |
| `docs-pager`                           | Previous/next. The mockups show two different designs; use the **card** design everywhere                                                                 | `previous?`, `next?`                                                                                                | —                                |
| `docs-footer`                          | Footer                                                                                                                                                    | `links`                                                                                                             | —                                |
| `docs-search-dialog`                   | (exists, restyle)                                                                                                                                         | —                                                                                                                   | — (native `<dialog>`, deferred)  |

### 3.2 Page scaffolding

| Component                            | Replaces                                                                                                                               | Inputs / slots                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `docs-page-header` (extend existing) | Eyebrow + maturity + h1 + lead                                                                                                         | `eyebrow`, `maturity?`, `heading`, `description`, `[docsHeaderMeta]` slot                                  |
| `docs-meta-grid`                     | Three look-alike strips: requirements (Angular ≥ 21…), component facts (selector/class/since/source), hero stats (68 · 7 · 21 · 5 · 4) | `items: { label, value, suffix?, href?, mono? }[]`, `variant: 'facts' \| 'stats'`; 2-column wrap on mobile |
| `docs-section`                       | `h2` + intro + body, repeated 10×                                                                                                      | `id`, `heading`, `description?`, `eyebrow?`. Registers its anchor for the TOC                              |
| `docs-subsection`                    | `h3` + intro + example (Color, Appearance, Size…)                                                                                      | `id`, `heading`, `description?`                                                                            |
| `docs-callout`                       | Fast-path box, maturity note (left bar), "Outputs: none" (dashed), Result box                                                          | `variant: 'accent' \| 'note' \| 'empty' \| 'result'`, `heading?`, `label?`                                 |
| `docs-hero`                          | Components hero card with radial glow, CTA row and stats                                                                               | `eyebrow`, `heading`, `description`, `[docsHeroActions]`, `[docsHeroMeta]`                                 |

### 3.3 Code

| Component                                        | Replaces                                                                               | Inputs / behaviour                                                                                                                                                                                                                                                                             |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs-code-block` (replaces `docs-code-example`) | 17 dark code frames: filename header, copy button and highlighted body                 | `code`, `language: 'ts' \| 'html' \| 'css' \| 'bash' \| 'json'`, `label` (filename). Highlighting runs through a **pure TS tokenizer during render**, ported from `zd-highlight.js`. It emits `<span class="tk-kw">`, not `innerHTML`, so server and client output match and there is no flash |
| `docs-code-tabs`                                 | Tabbed files (`save-button.html` / `.ts`) and package-manager tabs (npm/pnpm/yarn/bun) | `files: { label, code, language }[]`, `persistKey?` (remembers the package manager per viewer) · native ARIA tablist                                                                                                                                                                           |
| `docs-copy-button`                               | 16 copy buttons                                                                        | `text`; shows "Copied" for 1.4s and announces through a polite live region; rendered after hydration only                                                                                                                                                                                      |
| `docs-example`                                   | Preview surface + attached code block (Colors, Appearance, Size, Loading, Links)       | Default slot = live preview; `code`/`files`; `surface: 'plain' \| 'dotted'`                                                                                                                                                                                                                    |

### 3.4 Component-reference building blocks

| Component             | Replaces                                                                                     | Inputs / behaviour                                                                                                                                                                                                                                             | Lib                    |
| --------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `docs-playground`     | Button playground: preview, controls panel and generated snippet                             | `controls: PlaygroundControl[]` (typed schema: `choice`, `boolean`) and a `render` template that receives the current values. **Renders the real library component** (the mockup re-implements button styling in JS). It generates the snippet from the schema | —                      |
| `docs-chip-group`     | Playground choices (with optional colour dot) **and** catalogue category chips (with counts) | `options: { value, label, count?, swatch? }[]`, `value` (model), `selectedStyle: 'inverse' \| 'accent'`                                                                                                                                                        | — (native radios)      |
| `docs-api-table`      | Inputs table, theming-variables table, keyboard table                                        | `columns`, `rows`, cell templates (`name`, `type`, `default`, `description`)                                                                                                                                                                                   | `zdKbd`                |
| `docs-feature-grid`   | Joined bordered grids: accessibility 2×2, "Three commitments" with 01/02/03                  | `items: { title, body, index? }[]`, `columns`                                                                                                                                                                                                                  | —                      |
| `docs-link-card`      | "Next steps" cards                                                                           | `eyebrow`, `title`, `description`, `link`                                                                                                                                                                                                                      | —                      |
| `docs-steps`          | Numbered vertical rail for installation, with optional per-step "done" tracking              | `steps: { id, title, body }[]`, `trackProgress`; each step projects content                                                                                                                                                                                    | —                      |
| `docs-faq`            | Troubleshooting accordion                                                                    | `items: { question, answer }[]`; native `<details>` fallback                                                                                                                                                                                                   | — (native `<details>`) |
| `docs-reference-page` | The repeated reference-page skeleton (added after the first pages)                           | `reference: DocsReference` (header facts, notice, install code, API tables, types, accessibility notes and keyboard table, customization, SSR); projects the playground (`docsReferencePlayground`) and the examples                                           | —                      |

### 3.5 Catalogue

| Component              | Replaces                                                               | Inputs / behaviour                                                                                                             | Lib               |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `docs-maturity-badge`  | 35 hand-coloured pills                                                 | `maturity` → token set §1.2                                                                                                    | — (site tokens)   |
| `docs-maturity-dot`    | Sidebar status dots                                                    | `maturity`                                                                                                                     | —                 |
| `docs-maturity-legend` | Sidebar legend                                                         | — (reads the maturity vocabulary)                                                                                              | —                 |
| `docs-component-card`  | 31 catalogue cards: preview, category, badge, title, description       | `entry: CatalogueEntry`; the whole card is one link; the preview is lazy (`@defer (on viewport; hydrate on viewport)`)         | —                 |
| `docs-catalogue`       | Filter chips + search + grouped grids ("Actions 3 of 6") + empty state | `entries`, `categories`; the query and category sync to URL query params; the mobile category `<select>` replaces the chip row | — (native inputs) |

### 3.6 Services and utilities

| Unit                    | Responsibility                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `highlight(code, lang)` | Pure, deterministic tokenizer (unit-tested, SSR-safe)                                                                       |
| `navigation.ts`         | Pure functions deriving header, mobile menu, side nav, breadcrumbs, pager and search from the page and component catalogues |
| `DocsPreferences`       | Per-viewer storage for the package manager and the theme, wrapped in try/catch and read after render only                   |
| `docs-theme-toggle`     | Light/dark switch; SSR renders light and a saved choice applies after hydration                                             |

---

## As built (2026-09-23)

**Where things live**

| Layer                     | Location                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Tokens                    | `projects/docs/src/styles/tokens.css`                                                                        |
| Base rules and primitives | `projects/docs/src/styles/primitives.css` (base rules sit in `@layer base`, so daisyUI components still win) |
| Components                | `projects/docs/src/app/ui/{shell,page,code,reference,catalogue}/`; pages import from `app/ui/index.ts`       |
| Content                   | `projects/docs/src/app/content/` (component catalogue index, card summaries, page content)                   |
| Navigation                | `projects/docs/src/app/navigation.ts`                                                                        |
| Guardrail                 | `tools/check-docs-design-system.mjs` (`npm run check:docs:design-system`, also in CI)                        |

**Deviations from the proposal, and why**

- **Dogfooding.** The shell uses only `ZdButton`, `ZdKbd` and `ZdIdGenerator`. Reference pages also
  render the component they document (Dropdown, Swap, Carousel, Collapse, Megamenu, Menu, Calendar)
  in their examples, never in the shell. Tabs, Accordion, Table,
  Filter, Breadcrumbs, Modal, Badge and the Theme Controller were left native: their daisyUI visuals
  differ from the mockups (for example the dark code-frame tabs), or they add initial-bundle weight to
  the shell. Revisit each one once its visuals can be matched with supported hooks.
- **Table of contents.** It stays in the page catalogue (`tableOfContents`, now with `level`)
  instead of a runtime registry. A registry updates the shell after the page renders, which breaks
  SSR/hydration ordering. The e2e suite checks that TOC links resolve.
- **Maturity.** The repository's maturity policy has planned, preview, stable, deprecated and removed.
  The mockup's "experimental" is reserved for optional integrations, so the legend omits it (the token
  set is kept for integrations).
- **Catalogue previews** are decorative CSS sketches (`aria-hidden`, no JavaScript), not live
  components. Components without a sketch show a named placeholder.
- **Not implemented yet:** the fast-path callout (waits for `ng add`) and per-step "done" tracking in
  `docs-steps`. The `docs-*` gallery is at `/__zordon-tests__/ui`.
- **Budget.** The initial bundle grew from 405.7 kB to 444.7 kB. The budget was re-measured and raised
  with a rationale in `docs/testing/bundle-size-budgets.md`.

**Adding a component reference page**

1. Add the page to `site-catalog.ts` with `defineComponentPage` (id, label, description, maturity
   and its example sub-sections; the shared outline is added for you), list it in
   `componentReferencePages` in catalogue order, and add a loader to `app.routes.ts`. Previous and
   next links are derived from that order, and the catalogue card and side navigation link to the
   page automatically.
2. Put the page's copy, API rows and snippets in `content/<component>.content.ts`, mirroring the
   library source. Describe everything except the playground and examples as one `DocsReference`
   object. Native form controls share their vocabulary (colors, sizes, playground controls, API
   rows, notices) through `content/form-controls.content.ts`.
3. Render it with `docs-reference-page`, which owns the header, maturity notice, install, API,
   accessibility, customization and SSR sections in the order the outline expects. Project the
   playground with `docsReferencePlayground`; everything else projected becomes the examples,
   usually level-3 `docs-section` + `docs-example` blocks whose ids match the page's outline. Lay
   examples out with `.docs-stack`, `.docs-cluster`, `.docs-choice` (a label around a checkbox,
   radio or toggle), `.docs-field` (a labelled text field) and `.docs-status` (a live status line).
   Small, page-local example styling is fine in the page's `styles`; anything reused belongs in
   `app/ui` or the primitives. The Preview pages built before this component still spell the
   sections out; migrate them when they next change.
4. If the component emits daisyUI classes the global stylesheet does not compile, compile them for
   that page only: a stylesheet in `pages/styles/<name>.daisy.css`
   (`@import 'tailwindcss/utilities' source(none)`, `@plugin 'daisyui' { themes: false; include: … }`
   and an `@source inline(…)` list) loaded by a template-less, unencapsulated component rendered at
   the top of the page. This keeps them out of the initial bundle. Keep each stylesheet under the
   component-style budget; split a large rule (such as the generic `menu`, shared in
   `menu-base.daisy.css`, or the generic `select`) into its own file. daisyUI's Loading glyphs
   carry SVG masks of 2.5–5.6 kB each, so Loading spreads its glyphs over three files. A component
   that ships its own stylesheet (Tooltip) needs none.
5. Add the route to the e2e route lists and the accessibility loop, then run `npm run test:docs:ssr`,
   which includes the design-system check.

## Content corrections

Where the mockups and the codebase disagree, **the codebase wins**. The implementation must render these corrections:

| Mockup says                                                               | Codebase says                                                                  | Action                                                                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `import … from 'zordon-ui/button'`, `npm install zordon-ui`               | Package is `@pranxy/zordon-ui`                                                 | Use the real package name everywhere                                            |
| `provideZordon({ theme, devWarnings })`                                   | `provideZordonUi(config?, ...features)`                                        | Show the real provider and options                                              |
| Button input `appearance="soft"` with a `'solid'` default                 | `variant` (`outline \| dash \| soft \| ghost \| link`); solid means no variant | Rename in the playground, examples and API table                                |
| Button input `shape` (`square \| circle \| wide \| block`)                | `layout`                                                                       | Rename                                                                          |
| `disabled` on `<a>`                                                       | `zdDisabled`                                                                   | Use the real input                                                              |
| `sc-camel-router-link="/billing"`                                         | Artefact of the mockup tool                                                    | `routerLink`                                                                    |
| "Fast path: `ng add zordon-ui`"                                           | README: `ng add` is not available yet                                          | Hide the fast-path callout behind a catalogue flag until the schematic ships    |
| Button "stable · since v0.4.0"; hero "0 / 68 Done"                        | Build plan: Button maturity is _Planned_                                       | Take maturity and counts from the catalogue so they can't contradict each other |
| Previous/next shown as cards on two pages and as plain text on Components | —                                                                              | One `docs-pager` design (cards)                                                 |

## Open design decisions (from the Components Board)

1. **Palette direction**: 2a daisyUI `light` (current baseline), 2b `corporate`, 2c bespoke `zordon-terminal`, 2d `nord`, or 2e bespoke `zordon-ink`. The tokens make this a theme swap; 2c and 2e would need a custom daisyUI theme block.
2. **Logo mark**: 2f filled square (current), 2g outlined, 2h constructed Z, 2i selector brackets, or 2j split diagonal. `docs-brand` isolates this choice to one component.

The plan defaults to **2a + 2f** until you decide.

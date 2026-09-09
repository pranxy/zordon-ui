# Claude Design prompt — Zordon UI documentation site

Copy everything below into Claude Design. It specs the whole documentation site as a linked set of artboards: shared chrome, home, the component showcase/catalogue, a component detail page template, a standard documentation-content template (reused for Foundations/Guides/Getting started), the Resources hub, and 404.

---

Design the documentation site for **Zordon UI**, an Angular component library built on daisyUI 5 and Tailwind CSS 4 (package `@pranxy/zordon-ui`, element prefix `zd`). The site's job is a hybrid of marketing (make the library look worth adopting) and reference documentation (an honest, technical spec sheet developers will actually read while coding) — closer in spirit to Angular Material's or Radix's docs than a startup landing page.

## Brand and tone (applies to every screen)

- Name: **Zordon UI**. Logo mark is a bold letter "Z" in a small square/monogram, paired with the "Zordon UI" wordmark.
- Tagline: "Angular + daisyUI." Positioning line: "A customizable Angular component library that keeps daisyUI's styling system in your hands."
- Voice: engineering spec-sheet, not marketing fluff. Every component and doc page is honest about maturity — labeled `planned`, `experimental`, `preview`, or `stable` — and that status is never hidden or dressed up, including on the component's own detail page.
- Typography: oversized, confident display headings on the home page (system sans stack — Inter / IBM Plex Sans), tight line-height; interior doc pages use smaller, denser headings since they're reference material, not marketing copy. Uppercase micro-labels ("eyebrows") with wide letter-spacing sit above every page's H1.
- UI chrome is spare: thin 1–2px borders, no heavy drop shadows, generous whitespace, a subtle radial-gradient accent glow in the corner of hero-type sections using the primary color at low opacity.
- Buttons favor an outlined style (2px solid border, no fill) for secondary actions; a solid primary-color fill is reserved for the one main CTA per page.
- Support both a **light theme** and a **dark theme** (daisyUI's standard `light`/`dark` palettes: light background/dark text/single primary accent; dark mode inverts to a near-black surface with the same accent). A theme toggle lives in the header on every page.
- Maturity badges are a recurring, consistently-styled element across the whole site: `planned` (neutral/outline), `experimental`, `preview`, `stable` (solid, most confident color) — keep these four states visually identical wherever they appear (catalogue cards, component detail headers, etc.).

## Shared site chrome (design once, reuse on every interior page)

- **Header**: left — "Z" logomark + wordmark, links home. Center/right — primary nav (Get started, Components, Foundations, Guides, Resources), a GitHub link, a "Search documentation" button, and the light/dark theme toggle. Collapses to a hamburger/"Navigation menu" disclosure on mobile.
- **Breadcrumb trail** under the header on every page except home (e.g. Home / Components / Button).
- **Two-column documentation layout** on interior content pages: a left sidebar listing the primary sections (Get started, Components, Foundations, Guides, Resources) with the active one highlighted, the article content in the center, and a right-hand "On this page" table-of-contents sidebar that mirrors the current page's headings. On mobile, both sidebars collapse into a single "On this page" disclosure above the content.
- **Previous/next pagination** at the bottom of interior content pages, linking to the adjacent page in the site's reading order.
- **Footer**: brand mark + one-line description ("Accessible Angular components, styled by daisyUI."), links to Get started and the GitHub source.

## Screens to produce

### 1. Home (`/`)

No sidebar — full-width landing layout. Oversized eyebrow ("Angular + daisyUI") above a huge headline ("Zordon UI"), a one-line summary, two actions (a bold outlined "Get started" and a plain "Browse components" link). Below that, a "Representative preview" panel: a bordered, raised-surface card with a short caption on the left ("Native semantics, daisyUI presentation") and a single real rendered Button component on the right. A status line noting current coverage (e.g. "Button is Planned while remaining release evidence is completed"). Below that, a three-card teaser grid: "Native-first components," "Documented foundations," "Consumer-owned themes," each linking deeper into the site.

### 2. Components showcase / catalogue (`/components`)

This is the centerpiece page — design it in the most detail, in both light and dark theme, at both desktop and mobile width.

1. **Hero** — headline ("68 components. One system."), one-sentence subhead about Angular-native state/forms/accessibility layered onto daisyUI styling, and a stat strip: **68 components planned**, **7 categories**, **Angular 21**, **daisyUI 5**, **Tailwind CSS 4**.
2. **Category filter bar** — pill/tab controls for "All" plus the seven categories: **Actions (6)**, **Data display (19)**, **Navigation (9)**, **Feedback (7)**, **Data input (15)**, **Layout (8)**, **Mockups (4)** — plus a search/filter text input.
3. **Component grid**, grouped by category with a subheading per section. Each card shows: a small live-style rendered preview of the actual daisyUI component at small scale (not an icon), the component name, a one-line description, a maturity badge in the corner, and its category label. Draw real, plausible small renders for at least these: **Actions** — Button, Dropdown, Modal; **Data display** — Avatar, Badge, Card, Table, Timeline, Chat Bubble, Stat; **Navigation** — Navbar, Tabs, Breadcrumbs, Steps; **Feedback** — Alert, Toast, Progress, Tooltip; **Data input** — Checkbox, Radio, Range, Select, Rating, OTP; **Layout** — Divider, Hero, Drawer, Stack; **Mockups** — Browser Mockup, Code Mockup, Phone Mockup.
4. **"Why native" callout module** — a short 2–3 column strip: "Native-first components," "Documented foundations," "Consumer-owned themes."
5. Standard footer.

### 3. Component detail page template (`/components/{name}`) — use Button as the worked example

Every one of the 68 components uses this same template once built, so design it as a reusable pattern:

- Page header: eyebrow "Component reference," H1 with the component name ("Button"), a description sentence, its maturity badge next to the eyebrow, and a "View source" link.
- A callout box directly under the header when maturity isn't `stable` — e.g. "**Planned maturity.** The entry point is implemented, but its remaining browser, assistive-technology, visual, and public API gates are not yet complete. Treat this page as an implementation contract, not a Stable release claim." Style it as a bordered, slightly tinted notice box, not an alarming error state.
- **Install and import** section — a labeled code block (with a "Copy" button in the corner) for the TypeScript import, and a second one for basic markup usage.
- **Live example** section — a bordered "playground" panel showing the real rendered component (e.g. an actual daisyUI-styled button reading "Save changes"), with a small interactive control row beneath it (labeled selects like "Button color" / "Button variant" and a "Reset playground" button) that a developer would use to toggle props live.
- **API** section — a reference table with columns Input / Type / Default / Contract, several rows (color, variant, size, layout, active, pressed, loading, zdDisabled).
- **Variants**, **Accessibility**, **Customization**, **SSR** — short prose sections, each with its own H2.
- **Related** section — a short link list to related foundation/guide pages and back to the component catalogue.
- Standard prev/next pagination and footer.

### 4. Standard documentation content page template — used for Getting started, Foundations, and Guides

One reusable long-form article template, since these sections share identical anatomy. Design it once using **Getting started** as the worked example, and note in the design that Foundations pages (e.g. "Typed foundation vocabularies") and Guides pages (e.g. "Styling and theming") reuse the exact same template with different section content.

- Page header: eyebrow ("Documentation" / "Foundations" / "Guide"), H1, one-sentence description. No maturity badge on these (they're not component pages).
- A sequence of H2 sections mixing: plain prose, bulleted prerequisite/requirement lists, and labeled code blocks with copy buttons (e.g. "Package installation," "Global stylesheet," "Application providers," "Standalone Button example"). Getting Started's sections, in order: Prerequisites, Install, Configure styling, Configure the application, Use your first component, What comes next (each ending with a forward link into the next relevant page).
- Standard prev/next pagination and footer.

### 5. Resources (`/resources`)

Same header/eyebrow pattern ("Project" / "Resources"), but the body is two sections instead of a long article:

- **Project** — a card grid (not a list) linking out: GitHub repository, Component catalogue, Getting started, Roadmap and status, Changelog and releases, Contributing — each card a short heading + one-line description.
- **Upstream documentation** — a plain link list: Angular documentation, daisyUI documentation, Tailwind CSS documentation.

### 6. 404 / not found

A deliberately minimal, centered page breaking from the two-column doc layout — no sidebars. Small "404" eyebrow, H1 "Page not found," one line of body text, and two actions ("Return home," "Browse components"). Keep the header/footer chrome but drop the breadcrumb and TOC.

## Theme and breakpoint coverage

- Design the **Home** and **Components showcase** screens in both light and dark theme.
- Design at least one interior content page (the Component detail template) in dark theme as well, to prove the doc-page anatomy holds up in both themes.
- Provide a mobile-width version of Home and the Components showcase page (stacked nav, single-column grid, collapsed filter bar and sidebars into disclosures).

## Explicitly avoid

- Don't invent a different name, logo, or color system — stay inside the Zordon UI / daisyUI palette-and-monogram described above.
- Don't hide or soften maturity badges anywhere they appear — the honesty about "planned" vs "stable" status is a deliberate, load-bearing part of the brand, including on component detail pages.
- Don't design this as a generic SaaS marketing site; keep the tone closer to technical reference documentation than a startup landing page, especially on interior pages.
- Don't give every page a unique layout — Getting started, Foundations, and Guides pages must visibly share one template; the 68 component pages must visibly share the Button template.

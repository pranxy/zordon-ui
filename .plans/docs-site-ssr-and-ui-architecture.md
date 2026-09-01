# SSR documentation site and information architecture

> **Status:** Ready for implementation — Cloud Run is the production SSR target

## Outcome and boundaries

- **Problem and target:** Replace the development-only, client-rendered showcase with Zordon UI's public documentation and component-catalogue website. Every public page must deliver readable, route-specific HTML before JavaScript runs so search engines and shared-link crawlers can index the page; interactions hydrate afterwards.
- **In scope:** A new Angular documentation application, server rendering and hydration, public URL and metadata policy, a responsive website shell, documentation information architecture, component-reference layout, navigation/search design, and SEO/accessibility/SSR validation.
- **Out of scope:** Changing library component APIs; a blog, remote CMS, accounts, analytics, comments, localization UI, or a generic runtime Markdown/CMS system; per-component content beyond Button and a representative foundation page; deployment credentials and a hosting-provider implementation.
- **Approach:** Build one SSR-capable Angular documentation app using Angular server routes. Server-render every public route at first; prerender static reference routes where the selected host benefits from static HTML. Keep route and navigation metadata in one typed build-time catalogue. Use native semantic HTML and daisyUI styles; client-only features such as code copy, theme switching, search overlay, and interactive playground controls enhance the already-complete document.

## Site map and UI organization

| URL family               | Purpose                           | Page structure                                                                                                                                                                        |
| ------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | Library landing page              | Value proposition, install action, representative component preview, feature principles, component coverage/status, links to get started and Button                                   |
| `/docs/getting-started`  | Fast first-use path               | Prerequisites, Tailwind/daisyUI configuration, install command, provider/configuration, first component, next steps                                                                   |
| `/components`            | Discoverable component catalogue  | Filterable cards grouped by category and maturity; each card exposes name, status, description, and reference URL                                                                     |
| `/components/:component` | Authoritative component reference | Title/status, install/import, live preview, copyable source, API, variants, accessibility/keyboard contract, customization, SSR/forms/overlay notes as applicable, related components |
| `/foundations/:topic`    | Cross-component contracts         | Short explanation, decisions, consumer guidance, supported boundaries, and links to affected components                                                                               |
| `/guides/:topic`         | Task-oriented workflows           | Install, theming, configuration, migration/release guidance, and examples                                                                                                             |
| `/resources`             | Supporting material               | Roadmap/status, changelog/release notes, repository links, contribution links, and external daisyUI/Angular references                                                                |
| `/404`                   | Recoverable unknown route         | Clear not-found message, home/components links, and no index metadata                                                                                                                 |

### Global shell

- **Utility bar:** GitHub/repository link, package/version state, theme control, and a keyboard-accessible search trigger.
- **Primary header:** Brand/home link; `Get started`, `Components`, `Foundations`, `Guides`, and `Resources`; compact mobile menu with the same route hierarchy.
- **Documentation layout:** Left section navigation on desktop, main readable column, and right in-page table of contents for long pages. On mobile, use an accessible modal/drawer navigation and inline table-of-contents disclosure.
- **Page affordances:** Skip link, breadcrumb, page title/description, edit/source link when appropriate, previous/next reference links, and a compact feedback/repository issue link rather than a built-in commenting system.
- **Visual system:** Use daisyUI theme variables and the library's supported `data-theme` behavior; preserve readable light/dark contrast, visible focus, responsive reflow, and no-JavaScript readability.

## Key files, evidence, and decisions

| File or source                                                                            | Why it matters                                                                                              | Decision or plan impact                                                                                                                     |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                                                            | `start` and `build:docs` currently build/serve the client-only `dev` app; GitHub Pages deployment is static | Replace with explicit docs build/serve/SSR scripts; run the compiled Node handler in a container that listens on the platform-supplied port |
| `angular.json`                                                                            | `dev` uses the browser-only application builder; `ssr-example` already uses an Angular server build         | Create a separate `docs` app patterned on the SSR configuration, not by incrementally modifying the existing showcase                       |
| `projects/ssr-example/src/app/app.routes.server.ts`                                       | Existing proof that Angular server route configuration is supported in this workspace                       | Use route-level `RenderMode.Server` initially and evaluate prerendering after host choice                                                   |
| `projects/dev/src/app/app.routes.ts`                                                      | Current site routes are a showcase taxonomy rather than an information architecture                         | Replace rather than preserve these routes; reserve test-only paths from crawlers and public navigation                                      |
| `docs/architecture/0001-platform-support.md`                                              | Angular 21 is the build baseline, while Angular 21–22 consumers are supported                               | Use only Angular 21-compatible SSR/hydration APIs and add a framework compatibility lane before claiming Angular 22 docs-site support       |
| `docs/architecture/0003-styling-and-theming.md`                                           | daisyUI is the visual source of truth and theme scopes are supported                                        | Site styles use documented daisyUI utilities/themes rather than a duplicate design system                                                   |
| `docs/architecture/0007-accessibility-ssr-and-localization.md`                            | Requires SSR-safe browser behavior and WCAG 2.2 AA-oriented interaction                                     | Server HTML must not access browser globals; navigation/search/theme enhancements must be keyboard-accessible and hydrate safely            |
| [Angular hybrid rendering guide](https://angular.dev/guide/prerendering)                  | Angular supports route-specific server rendering and prerendering                                           | Use an SSR-capable server build; prerender stable public routes where hosting and content make it worthwhile                                |
| [Angular hydration guide](https://angular.dev/guide/hydration)                            | Hydration reuses server HTML and prevents client rerender flicker                                           | Enable hydration and validate no mismatch for every representative public route                                                             |
| [Cloud Run container deployment](https://docs.cloud.google.com/run/docs/deploying)        | Cloud Run deploys immutable container revisions as HTTP services                                            | Deploy the existing Node/Express SSR model as a container, with a preview revision before production promotion                              |
| [Cloud Run container contract](https://docs.cloud.google.com/run/docs/container-contract) | Cloud Run supplies the `PORT` value that the service must listen on                                         | Keep the Angular Node server's environment-driven port contract; do not bake a platform URL or port into the app                            |

- **Decision:** Deploy production SSR as a Docker container on **Google Cloud Run**. Its request-serving container model matches Angular's generated Node/Express handler and avoids platform-specific rendering adapters. GitHub Pages may remain a static preview only; it is not the production documentation host.
- **Open gate:** Supply the GCP project, region, custom domain, and GitHub-to-Google workload-identity authorization before T06 deploy automation. The canonical origin stays environment-configured until the domain is selected.

## Tasks

#### T01 — Establish the Cloud Run SSR deployment contract

- **Change:**
  - Package the production documentation server in a minimal Node 24 container and deploy it to Google Cloud Run as a public HTTPS service; retain the existing generated Angular Node handler rather than introducing a platform adapter.
  - Configure the service to use the supplied `PORT`, health checks, immutable image/revision identifiers, and a separate preview service/revision path before production promotion.
  - Define environment values for canonical origin, robots behavior, and staging/noindex behavior; do not hard-code a preview URL into page metadata.
  - Configure GitHub Actions to authenticate to Google Cloud through GitHub OIDC/workload identity rather than a long-lived cloud credential; deploy only after the full docs test suite passes.
  - Replace the existing GitHub Pages deployment path only after a Cloud Run preview smoke deploy proves server responses.
- **Starts at:** `package.json`, `.github/workflows/`, `projects/ssr-example/src/server.ts`, `Dockerfile`, `.dockerignore`
- **Depends on:** None
- **Tests:** `[planned CI smoke script]` (`HTTP integration`) protects production rendering mode by requesting a public route with JavaScript disabled and observing non-empty page-specific HTML, HTTP 200, canonical URL, and indexability policy.
- **Verify:** Build the container, deploy an immutable preview revision, request `/`, `/docs/getting-started`, and `/components/button` with a plain HTTP client; expect route-specific HTML and no client-only blank shell. Request an unknown public URL; expect a 404 response and `noindex` metadata.
- **Risk/recovery:** GCP project/domain/IAM setup is an external prerequisite. Retain the current static deployment only as a preview fallback until the Cloud Run service is verified; do not label that fallback as SSR. Roll back by routing traffic to the previous immutable Cloud Run revision.

#### T02 — Create the dedicated SSR documentation application

- **Change:**
  - Create `projects/docs` as an Angular application with browser bootstrap, server bootstrap, Express/Angular request handler, hydration, and explicit server-route configuration.
  - Configure public site routes for server rendering initially; identify stable routes eligible for build-time prerendering without changing their URLs or metadata contract.
  - Add SSR-safe providers and isolate browser-only behavior behind render hooks/platform checks; remove direct document access from root construction.
  - Replace `start`/`build:docs` with clearly named local docs browser and docs SSR commands; keep the SSR example as library test infrastructure until its responsibilities are deliberately migrated.
- **Starts at:** `angular.json`, `package.json`, `projects/ssr-example/src/app/app.config.server.ts`, `projects/ssr-example/src/server.ts`
- **Depends on:** T01
- **Tests:** `[planned projects/docs SSR smoke suite]` (`SSR/hydration`) protects complete response HTML, successful hydration, browser-only enhancement deferral, and stable consecutive responses.
- **Verify:** Run the docs production SSR build and server, then execute the SSR Playwright suite; expect no hydration console errors, no server access to browser globals, and identical route titles/head data across consecutive requests.
- **Risk/recovery:** Keep the new application independent from the current dev showcase until migration is complete, allowing an immediate rollback to the existing local demo command.

#### T03 — Establish the content, URL, and metadata source of truth

- **Change:**
  - Define a typed build-time page catalogue containing stable slug, title, summary, section, maturity, navigation order, canonical path, edit/source URL, and indexability state.
  - Drive header navigation, left navigation, breadcrumbs, previous/next links, component cards, sitemap paths, Open Graph/Twitter metadata, and route title/description from that catalogue.
  - Make canonical links absolute only after T01 supplies the production origin; exclude preview, internal test, and 404 URLs from sitemap/indexing.
  - Add `robots.txt` and `sitemap.xml` generation to the docs build, with one source of public routes and no manually duplicated URL list.
- **Starts at:** `projects/docs/src/app/`, `projects/components/src/`, `docs/components/button.md`, `docs/foundations/`
- **Depends on:** T01, T02
- **Tests:** `[planned projects/docs/src/app/site-catalog.spec.ts]` (`unit`) protects unique paths, no broken parent/previous/next references, valid indexability flags, and sitemap exclusion. `[planned SSR smoke suite]` (`HTTP integration`) protects title, description, canonical, and robots markup in delivered HTML.
- **Verify:** Run the catalogue unit test and inspect generated sitemap/robots output; expect every indexable catalogue page exactly once, valid canonical URLs, and no test/404/staging entries.
- **Risk/recovery:** Do not introduce a CMS or a runtime Markdown parser. Reassess the build-time catalogue after ten component pages if authoring repetition becomes material.

#### T04 — Implement the responsive website shell and navigation system

- **Change:**
  - Build the global header, footer, skip link, desktop navigation, mobile navigation, breadcrumbs, documentation side navigation, and long-page table of contents using semantic landmarks and keyboard-operable controls.
  - Use a single responsive shell with route data rather than page-specific nav copies; retain visible current-page state and logical heading order.
  - Add a client-enhanced search dialog backed by a build-generated static search index; retain full server-rendered navigation as the no-JavaScript fallback.
  - Implement theme selection as a progressive enhancement that does not alter server HTML before hydration; render a stable default theme and preserve accessible contrast/focus behavior.
- **Starts at:** `projects/docs/src/app/app.component.*`, `projects/docs/src/app/layout/`, `projects/docs/src/styles.*`, `docs/architecture/0003-styling-and-theming.md`
- **Depends on:** T02, T03
- **Tests:** `[planned e2e/docs-navigation.spec.ts]` (`browser`) protects keyboard skip-link focus, desktop/mobile route reachability, current navigation state, search keyboard flow, and responsive navigation behavior. `[planned e2e/accessibility.spec.ts]` (`axe + keyboard`) protects landmark/name/heading regressions.
- **Verify:** Run Chromium browser and accessibility suites at mobile and desktop viewports; expect all public route families reachable by keyboard, no focus trap on menu/search close, and no critical automated accessibility violations.
- **Risk/recovery:** Search remains a local static index. Do not add a remote search service until content scale or ranking needs demonstrate it.

#### T05 — Build page templates and representative content

- **Change:**
  - Implement the landing, getting-started, component-catalogue, component-reference, foundation/guide, resources, and 404 templates described in the site map.
  - Establish a component-reference template with install/import, live example, copyable source, typed API data, variants, accessibility, customization, SSR, and related-content sections—omitting sections that do not apply rather than rendering empty headings.
  - Migrate Button and one foundation topic as representative SSR-rendered pages; show component maturity rather than presenting undocumented legacy examples as supported APIs.
  - Ensure code snippets and examples render meaningful static code/content on the server; add copy/reset/theme/playground controls only after hydration.
- **Starts at:** `projects/docs/src/app/pages/`, `docs/components/button.md`, `docs/foundations/typed-vocabularies.md`, `docs/templates/component-documentation-template.md`
- **Depends on:** T03, T04
- **Tests:** `[planned e2e/docs-pages.spec.ts]` (`SSR/browser`) protects page-specific headings, server-visible install/API content, hydrated code-copy/playground behavior, internal-link integrity, and 404 behavior.
- **Verify:** Request representative pages without JavaScript; expect a unique `<title>`, one visible `<h1>`, page-specific description/body content, and working ordinary links. Run browser tests; expect interactive examples/copy controls to work after hydration without layout shift or mismatch.
- **Risk/recovery:** Treat existing docs as source material, not layout authority. Keep source text reviewable in-repository and avoid a second divergent documentation corpus.

#### T06 — Add crawlability, performance, and release-quality gates

- **Change:**
  - Add a server-rendered route matrix covering home, getting started, one component, one foundation, resources, and unknown routes.
  - Validate metadata, canonical policy, sitemap, robots, structured data only where it is truthful (organization/software product/breadcrumb data), and social preview tags; do not fabricate ratings, pricing, or unsupported schemas.
  - Add performance budgets for initial docs route, image/font policy, and hydration payload; keep demos lazy-loaded so a documentation reader does not load every component playground.
  - Add CI steps for docs lint, production SSR build, SSR/hydration smoke, browser navigation/a11y checks, and link checking; keep visual regression intentionally limited to stable representative routes/themes.
- **Starts at:** `.github/workflows/ci.yml`, `package.json`, `playwright*.config.ts`, `e2e/`, `angular.json`
- **Depends on:** T02, T03, T04, T05
- **Tests:** `[planned SSR/browser/a11y/link suites]` (`CI integration`) protects SEO-visible HTML, metadata correctness, hydration, accessibility, links, and route-level regressions.
- **Verify:** Run docs lint, production SSR build, SSR suite, browser suite, accessibility suite, link checker, and performance/budget check in CI; expect a green route matrix and no public route whose response is a generic shell.
- **Risk/recovery:** Automated checks cannot prove search ranking or screen-reader speech. Before launch, manually review Google Search Console setup, rendered-page inspection, keyboard navigation, and NVDA/VoiceOver representative pages.

## Final acceptance

- **Checks:**
  - The selected production host serves Angular-rendered HTML for every indexable public route, with hydration succeeding without console or mismatch errors.
  - Public pages have unique title/description/canonical metadata, server-rendered primary content, stable URLs, sitemap inclusion, and correct robots behavior; 404/test/preview pages are excluded.
  - The shell is keyboard-operable, responsive, landmarked, theme-safe, and useful without JavaScript; search/copy/playground behavior enhances rather than replaces static content.
  - The component reference template works for Button and a foundation page, proving content, examples, API, and related links can be rendered without a special-case page system.
  - Docs CI gates pass alongside existing library, SSR-example, browser, visual, and package checks.
- **End state:** A standalone, SSR-capable Zordon UI documentation site with a durable public navigation and URL model, ready to grow to all component reference pages without changing its information architecture.
- **Deferrals or blockers:** GCP project/domain/workload-identity setup is required before production deployment and final canonical metadata. Remote search/CMS, blogs, account features, analytics, multilingual routing, and publishing all 68 component pages are intentionally deferred. If deployment requirements later prohibit Cloud Run, retain the SSR Node/container contract and replace only T01's hosting adapter after a new hosting decision.

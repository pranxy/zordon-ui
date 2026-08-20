# Documentation site SSR and UI architecture — implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `.plans/docs-site-ssr-and-ui-architecture.md`
- **Status:** In progress
- **Updated:** 2026-08-20

`Complete` = all rows `Verified` or user-approved `Descoped` + validation passed + final review `Clear` + nothing material open.

## Tasks / subtasks

Status: `Pending` | `In progress` | `Blocked` | `Verified` | `Descoped`

| ID    | Plan ref / requirement                              | Deps        | Status   | Acceptance check                                                      | Evidence                                                                                 |
| ----- | --------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| T01.1 | Select a Node SSR production model                  | —           | Verified | Cloud Run is recorded as the production target                        | Decision in plan on 2026-08-20                                                           |
| T01.2 | Create GCP project/domain/OIDC deployment authority | T01.1       | Blocked  | Preview Cloud Run revision serves the route matrix                    | Requires user-owned GCP project, domain, and IAM configuration                           |
| T01.3 | Add container and deployment automation             | T01.1, T02  | Pending  | Container uses platform `PORT`; CI deploys preview only after tests   | —                                                                                        |
| T02   | Create dedicated SSR documentation application      | T01.1       | Verified | Production SSR build, local server, and hydration smoke pass          | `lint:docs`, `test:docs:ssr`, selected Prettier, and diff check passed; SSR browser: 2/2 |
| T03   | Establish content, URL, and metadata catalogue      | T02         | Verified | All T03 subtasks are verified                                         | Catalogue, routes, metadata, crawl files, and tests pass                                 |
| T03.1 | Complete catalogue schema and invariants            | T02         | Verified | Unit tests reject duplicate/invalid route and navigation metadata     | `test:docs`: 3 files / 9 tests pass                                                      |
| T03.2 | Complete canonical/social/crawl metadata policy     | T03.1       | Verified | SSR responses and generated files reflect origin/indexability policy  | Unit origin boundary + Playwright metadata/sitemap tests pass                            |
| T03.3 | Return a real HTTP 404 for unknown routes           | T03.1       | Verified | Unknown URL responds 404 with server-rendered `noindex` content       | Playwright unknown-route test passes with HTTP 404                                       |
| T03.4 | Add discoverable docs unit and SSR test commands    | T03.1–T03.3 | Verified | `test:docs` and `test:docs:ssr` discover and pass the T03 coverage    | CI runs both commands; Playwright 4/4 pass                                               |
| T04   | Implement responsive shell and navigation           | T02, T03    | Verified | All T04 subtasks are verified                                         | Responsive shell, daisyUI theme integration, search, and browser checks pass             |
| T04.1 | Build semantic responsive shell and route context   | T03         | Verified | Header/footer/skip link/breadcrumb/side nav/TOC render from catalogue | Desktop and mobile visual inspection; catalogue-backed route context                     |
| T04.2 | Add mobile navigation and local search dialog       | T04.1       | Verified | Keyboard and 375px navigation/search flows pass                       | Mobile current state, inline TOC, search Escape, and focus restoration pass              |
| T04.3 | Add progressive light/dark theme control            | T04.1       | Verified | Stable SSR default hydrates; saved theme applies after render         | daisyUI theme variables change and persist without hydration errors                      |
| T04.4 | Add navigation and accessibility browser coverage   | T04.1–T04.3 | Verified | Desktop/mobile keyboard and axe checks pass                           | Docs Playwright 11/11; serious/critical axe checks pass at both viewports                |
| T05   | Build page templates and representative content     | T03, T04    | Pending  | Server HTML and post-hydration page tests pass                        | —                                                                                        |
| T06   | Add crawlability, performance, and release gates    | T02–T05     | Pending  | CI route matrix and docs gates pass                                   | —                                                                                        |

## Loop log

| ID  | Owner                               | Worktree / isolation                                                            | Checks                                                                                                                | Review                                                                               | Cleanup                                   |
| --- | ----------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| T02 | Primary agent                       | Shared workspace; tracker serialized because this thread cannot delegate agents | `lint:docs`; `test:docs:ssr` (2/2); selected Prettier; diff check                                                     | Parent-only inspection; independent delegation unavailable in this side conversation | No persistent server left by Playwright   |
| T03 | Primary agent + delegated test lane | Shared workspace; production and test/config ownership split                    | `lint:docs`; `test:docs` (9/9); production build; docs Playwright (4/4); E2E typecheck; selected Prettier; diff check | Independent review found F1/F2; both fixed and focused re-review completed           | No persistent server/browser process left |
| T04 | Primary agent + delegated test lane | Shared workspace; production and browser-test ownership split                   | `lint:docs`; `test:docs` (9/9); production build; docs Playwright (11/11); E2E typecheck; Prettier; diff check        | Independent review found F1–F3; all fixed; focused re-review `Clear`                 | No persistent server/browser process left |

## Reviews

| Checkpoint              | Reviewer                                                                            | Findings                                                                    | Disposition      | Closure                                   |
| ----------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------- | ----------------------------------------- |
| Documentation-site plan | Primary agent only; independent delegation is unavailable in this side conversation | DEX-001: avoid CMS/runtime Markdown in v1                                   | Accepted in plan | Complexity prevention recorded            |
| T03 implementation      | Independent delegated reviewer                                                      | F1: client routes/nav duplicated catalogue; F2: `noindex` implied 404       | Fix now          | Focused re-review: both resolved; `Clear` |
| T04 implementation      | Independent delegated reviewer                                                      | F1: duplicate visual tokens; F2: incomplete active state; F3: no mobile TOC | Fix now          | Focused re-review: all resolved; `Clear`  |

## Decisions / deviations

| Item | Need / change                                                                                   | Evidence                                                                                | Status   |
| ---- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| D01  | Start T02 after the hosting-model decision, while Cloud project/domain/IAM work remains blocked | Local docs build is independent of user-owned Cloud Run authority                       | Accepted |
| D02  | Keep existing `projects/dev` and `projects/ssr-example` untouched until docs SSR build succeeds | Avoids breaking the existing demo and library SSR fixture                               | Accepted |
| D03  | Complete T03 locally while Cloud Run authority remains blocked                                  | Catalogue, metadata, HTTP status, and test discovery do not require GCP credentials     | Accepted |
| D04  | Keep indexability independent from HTTP response status                                         | Existing noindex pages may be valid; only not-found entries and wildcard routes use 404 | Accepted |
| D05  | Derive client route paths/titles and primary navigation from the typed catalogue                | Prevents sitemap/server routes from drifting from reachable client routes and links     | Accepted |
| D06  | Set docs production budgets to 340 kB initial warning and 8 kB component-style warning          | Measured T04 output is 335.25 kB initial; hard errors remain 400 kB and 12 kB           | Accepted |
| D07  | Import daisyUI themes while disabling unused Tailwind source scanning in the docs shell         | Preserves semantic theme variables without generating workspace-wide unused utilities   | Accepted |

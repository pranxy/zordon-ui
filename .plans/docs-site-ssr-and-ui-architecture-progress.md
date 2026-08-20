# Documentation site SSR and UI architecture — implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `.plans/docs-site-ssr-and-ui-architecture.md`
- **Status:** In progress
- **Updated:** 2026-08-20

`Complete` = all rows `Verified` or user-approved `Descoped` + validation passed + final review `Clear` + nothing material open.

## Tasks / subtasks

Status: `Pending` | `In progress` | `Blocked` | `Verified` | `Descoped`

| ID    | Plan ref / requirement                              | Deps       | Status      | Acceptance check                                                    | Evidence                                                       |
| ----- | --------------------------------------------------- | ---------- | ----------- | ------------------------------------------------------------------- | -------------------------------------------------------------- |
| T01.1 | Select a Node SSR production model                  | —          | Verified    | Cloud Run is recorded as the production target                      | Decision in plan on 2026-08-20                                 |
| T01.2 | Create GCP project/domain/OIDC deployment authority | T01.1      | Blocked     | Preview Cloud Run revision serves the route matrix                  | Requires user-owned GCP project, domain, and IAM configuration |
| T01.3 | Add container and deployment automation             | T01.1, T02 | Pending     | Container uses platform `PORT`; CI deploys preview only after tests | —                                                              |
| T02   | Create dedicated SSR documentation application      | T01.1      | Verified    | Production SSR build, local server, and hydration smoke pass        | `lint:docs`, `test:docs:ssr`, selected Prettier, and diff check passed; SSR browser: 2/2 |
| T03   | Establish content, URL, and metadata catalogue      | T02        | In progress | Catalogue/sitemap/robots tests pass                                 | —                                                              |
| T04   | Implement responsive shell and navigation           | T02, T03   | Pending     | Browser/a11y navigation tests pass                                  | —                                                              |
| T05   | Build page templates and representative content     | T03, T04   | Pending     | Server HTML and post-hydration page tests pass                      | —                                                              |
| T06   | Add crawlability, performance, and release gates    | T02–T05    | Pending     | CI route matrix and docs gates pass                                 | —                                                              |

## Loop log

| ID  | Owner         | Worktree / isolation                                                            | Checks  | Review  | Cleanup |
| --- | ------------- | ------------------------------------------------------------------------------- | ------- | ------- | ------- |
| T02 | Primary agent | Shared workspace; tracker serialized because this thread cannot delegate agents | `lint:docs`; `test:docs:ssr` (2/2); selected Prettier; diff check | Parent-only inspection; independent delegation unavailable in this side conversation | No persistent server left by Playwright |

## Reviews

| Checkpoint              | Reviewer                                                                            | Findings                                  | Disposition      | Closure                        |
| ----------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- | ---------------- | ------------------------------ |
| Documentation-site plan | Primary agent only; independent delegation is unavailable in this side conversation | DEX-001: avoid CMS/runtime Markdown in v1 | Accepted in plan | Complexity prevention recorded |

## Decisions / deviations

| Item | Need / change                                                                                   | Evidence                                                          | Status   |
| ---- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------- |
| D01  | Start T02 after the hosting-model decision, while Cloud project/domain/IAM work remains blocked | Local docs build is independent of user-owned Cloud Run authority | Accepted |
| D02  | Keep existing `projects/dev` and `projects/ssr-example` untouched until docs SSR build succeeds | Avoids breaking the existing demo and library SSR fixture         | Accepted |

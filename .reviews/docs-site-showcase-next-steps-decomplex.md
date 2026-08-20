# Decomplex review: showcase revamp next steps

## Overall status

Two sequencing choices add avoidable work to the remaining implementation: deployment is specified before the deployable site is complete, and search is required before enough public content exists to justify a search index and dialog. Both can be deferred while preserving the required SSR documentation experience.

## Review contract

| Axis                          | Selection                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Mode                          | Prevention                                                                                         |
| Target                        | Remaining steps in `.plans/docs-site-ssr-and-ui-architecture.md`                                   |
| Authority / required behavior | Review the showcase revamp steps while preserving an SSR, crawlable, accessible documentation site |
| Scope                         | Remaining task order, deployment timing, navigation/search scope, and validation burden            |
| Report                        | `.reviews/docs-site-showcase-next-steps-decomplex.md`                                              |

## Coverage

### Inspected

- The implementation plan and progress tracker.
- The current `projects/docs` routes, catalogue, metadata service, server, and representative pages.
- Documentation Playwright configuration and SSR foundation tests.
- Repository scripts and CI workflow.
- The earlier documentation-site complexity review.

### Skipped or partial

- No Cloud Run account, domain, or workload-identity configuration is available locally.
- The installed dependency tree is incomplete, so current checks could not be rerun; the review relies on committed tests and recorded progress evidence.

## Potential findings

### DEX-001 — Move deployment packaging and automation after release-quality gates

- **Evidence:** Confirmed
- **Recommendation:** Act
- **Surface and location / authority:** T01 and its dependency on no prior task; the current app and progress tracker already record the hosting-model decision separately from deployment authority.
- **Current-need evidence:** The Cloud Run target, Node server model, and `PORT` contract are decided. A container and deployment workflow cannot prove the final route matrix until T03–T06 complete it.
- **Added burden:** Implementing deployment first creates a preview service and CI path that must be repeatedly changed as routes, metadata, 404 behavior, and gates are added.
- **Reachable practical impact:** T01 is externally blocked while local T03–T06 work can proceed, and T02 has already proceeded by an explicit deviation.
- **Smallest simpler alternative:** Record the hosting contract as complete, finish the site and its local/CI gates, then package and smoke-deploy the verified server as the last task.
- **Exception / boundary check:** Keep only the already-needed environment contracts (`PORT`, canonical origin, preview noindex) in local implementation before deployment.
- **Required behavior and simplification risk:** Cloud Run SSR, preview smoke testing, OIDC authentication, and rollback remain required; only their execution order changes.
- **Bounded next step or user question:** Recast T01 as a completed hosting decision and move container/deploy automation after the release-quality task.
- **Acceptance signal:** No GCP authority blocks content, shell, template, or CI implementation; the final deploy uses the already-green route matrix.

### DEX-002 — Defer client search until the public catalogue has useful breadth

- **Evidence:** Supported
- **Recommendation:** Act
- **Surface and location / authority:** T04 requires a generated search index and accessible dialog, while T05 initially publishes only Button and one foundation topic.
- **Current-need evidence:** Server-rendered primary navigation, catalogue grouping, and ordinary links cover the initial public route set. No ranking, content volume, or search success criterion is supplied.
- **Added burden:** Search introduces index generation, keyboard-dialog behavior, focus management, result ranking, and browser tests before it materially improves discovery.
- **Reachable practical impact:** It expands the shell’s highest-risk interaction surface and can delay the representative pages that establish whether the content model works.
- **Smallest simpler alternative:** Ship semantic navigation and catalogue filtering first; add search after representative content proves the catalogue or when the migrated route count makes navigation insufficient.
- **Exception / boundary check:** Catalogue filtering may remain if it is a direct, local enhancement of the component list; remote search and a global dialog stay deferred.
- **Required behavior and simplification risk:** All initial routes remain reachable by keyboard and without JavaScript. Search can be added later without changing URLs or page metadata.
- **Bounded next step or user question:** Remove search from T04 acceptance and record it as a post-v1 deferral with a content-scale trigger.
- **Acceptance signal:** Initial shell tests cover navigation, mobile disclosure, landmarks, current-page state, and focus restoration without a search-specific suite.

## Confirmed proportionate areas

- A typed route/content catalogue remains justified as the shared source for navigation, metadata, sitemap, and related links.
- SSR plus hydration remains required for crawlable initial HTML and progressively enhanced examples.
- Responsive navigation, theme handling, accessibility checks, and representative route tests protect current requirements rather than hypothetical scale.
- A final container smoke deploy and immutable revision rollback are proportionate for the chosen production host.

## Limitations

- This report covers complexity trade-offs only. HTTP status correctness, test discovery, and plan readiness are dispositioned by the parent plan review.

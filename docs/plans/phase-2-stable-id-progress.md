# Phase 2 stable ID generation implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 stable IDs across SSR and hydration
- **Status:** `Complete`
- **Updated:** 2026-08-11

`Complete` means the public contract is deterministic and application/request scoped, invalid input
cannot corrupt its sequence, the real SSR fixture proves repeated-request and hydration equality, the
incremental-hydration boundary is explicit, all validation passes, and independent review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID  | Plan ref / requirement                                | Deps     | Status   | Acceptance check                                                                                              | Evidence                                         |
| --- | ----------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| T01 | Audit Angular/CDK ID facilities and repository rules  | —        | Verified | Decision uses public supported APIs and accounts for SSR requests, multiple apps, hydration, and packaging    | `.progress/stable-id-research.md`; Halley audit  |
| T02 | Define the stable public contract and boundaries      | T01      | Verified | Naming, scope grammar, APP_ID handling, sequence ownership, and incremental-hydration limitation are explicit | `docs/foundations/stable-ids.md`                 |
| T03 | Implement and export the smallest shared primitive    | T02      | Verified | Root-provided service has no DOM/global/random state and adds only the reviewed public declaration            | `ZdIdGenerator`; root export; minor Changeset    |
| T04 | Add behavior-sensitive unit and integration coverage  | T03      | Verified | Tests prove exact values, scope isolation, app isolation, rejection behavior, uniqueness, and relationships   | 7 focused tests; module-global mutant rejected   |
| T05 | Prove behavior in the real SSR/hydration fixture      | T03, T04 | Verified | Consecutive requests match; browser hydration preserves IDs/references; no hydration errors occur             | Production SSR build and 3/3 Playwright tests    |
| T06 | Document use, limitations, packaging, and plan status | T05      | Verified | Consumer/contributor docs, risk row, changelog intent, declarations, tarball, and bundle effect are truthful  | Docs, plan, Changeset, declaration/budget review |
| T07 | Validate and independently review the complete step   | T06      | Verified | Focused/full tests, coverage, lint, types, build, budget, SSR, package, format, and final review all pass     | 41 tests at 100%; all gates pass; final Clear    |

## Loop log

| ID        | Owner  | Worktree / isolation  | Checks                                                                                              | Review                                | Cleanup                       |
| --------- | ------ | --------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------- |
| T01 audit | Halley | read-only shared root | Angular/CDK/repository/SSR evidence audit                                                           | Recommendations incorporated          | No audit edits                |
| T02–T07   | parent | shared root           | Unit, coverage, types, lint, builds, budget, SSR/browser, package dry run, and mutation sensitivity | Self-review and final review complete | Module-global mutant restored |

## Reviews

| Checkpoint           | Reviewer         | Findings                                                                                                | Disposition                                                                                            | Closure                   |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------- |
| Read-only audit      | Halley           | CDK private/global/random helper, ambiguous formatting, eager fallback, and incremental hydration risks | Used public APP_ID, collision-free encoding, instance counters, author rules, and explicit-ID boundary | Implementation gates pass |
| Mutation sensitivity | parent           | A module-global counter must fail application-isolation evidence                                        | Moved the map to module scope temporarily; focused suite failed at the second application              | Source restored; 7/7 pass |
| Independent final    | stable_id_review | No material correctness, compliance, packaging, SSR/hydration, accessibility, or test-quality finding   | No change required; test-only lane also returned Clear                                                 | Clear                     |

## Decisions / deviations

| Item                  | Need / change                                                       | Evidence                                                | Status                                                                         |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| CDK `_IdGenerator`    | Avoid a private helper with module-global/random behavior           | Installed CDK source                                    | Use Angular `APP_ID` with a Zordon application-scoped service                  |
| Incremental hydration | Sequence allocation cannot be stable across out-of-order boundaries | Official Angular incremental hydration model            | Require explicit stable IDs/keys across independently triggered sibling blocks |
| Generated spelling    | APP_ID and scope tuple must not collide or require browser escaping | Code-point namespace encoding plus strict scope grammar | Treat spelling as private; expose only uniqueness and relationship behavior    |
| Explicit IDs          | Eager fallback allocation can perturb later IDs even when unused    | Angular signal inputs arrive after construction         | Resolve once after initial inputs; an explicit ID skips allocation entirely    |

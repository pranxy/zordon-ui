# Phase 2 outside interaction and Escape dispatch progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 outside interaction and Escape-key dispatching
- **Status:** `Complete`
- **Updated:** 2026-08-11

`Complete` means the native/CDK ownership and dismissal rules cover the plan row without a premature
overlay stack, behavior-sensitive tests prove supported event ordering and cleanup, SSR/hydration
limits are explicit, validation passes, and independent review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID  | Plan ref / requirement                         | Deps     | Status    | Acceptance check                                                                                                 | Evidence                                  |
| --- | ---------------------------------------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| T01 | Audit native and public CDK event primitives   | —        | Completed | Installed APIs, event ordering, platform guards, cleanup, and limitations are known                              | Research note and read-only audit         |
| T02 | Define dismissal ownership and event semantics | T01      | Completed | Outside, Escape, nested/top-layer, cancellation, drag, Shadow DOM, iframe, and native boundaries are unambiguous | Foundation contract                       |
| T03 | Add behavior-sensitive compatibility tests     | T02      | Completed | Real public CDK behavior proves outside/inside discrimination, Escape routing, ordering, and cleanup             | 3 Angular and 2 browser tests             |
| T04 | Document SSR, hydration, and contributor use   | T02, T03 | Completed | Server no-op, post-hydration attachment, teardown, and component proof gates agree                               | Foundation/testing docs                   |
| T05 | Review package impact and release intent       | T04      | Completed | Public declarations and runtime bundle remain unchanged unless a concrete reviewed API is justified              | Build, declarations, budget, package diff |
| T06 | Validate and independently review the step     | T05      | Completed | Coverage, lint, types, build, browser, format, sensitivity, and final review pass                                | All gates pass; final review Clear        |

## Loop log

| ID               | Owner      | Worktree / isolation  | Checks                                               | Review | Cleanup         |
| ---------------- | ---------- | --------------------- | ---------------------------------------------------- | ------ | --------------- |
| T01 audit        | Dewey      | read-only shared root | Official/installed CDK and repository contract audit | Clear  | No audit edits  |
| T06 final review | Archimedes | read-only shared root | Full diff, installed CDK, tests, package, and scope  | Clear  | No review edits |

## Reviews

| Checkpoint      | Reviewer   | Findings                                    | Disposition                   | Closure |
| --------------- | ---------- | ------------------------------------------- | ----------------------------- | ------- |
| Read-only audit | Dewey      | None                                        | Accepted                      | Clear   |
| Final review    | Archimedes | S2: reverse drag boundary was not exercised | Added symmetric boundary test | Clear   |

## Decisions / deviations

| Item                 | Need / change                                                                                                          | Evidence                                                      | Status   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| Overlay row boundary | This row standardizes policy and compatibility; atomic top-only dispatch ships with the next private overlay stack     | CDK outside routing needs real refs, parentage, and lifecycle | Accepted |
| Public API boundary  | No dispatcher, directive, service, CDK type, or primary-entry runtime import is added before a concrete overlay exists | Packaging ADR and audit                                       | Accepted |
| Release intent       | Tests and repository docs only; the published package is unchanged, so no Changeset is required                        | Public API, FESM, manifest, and pack comparison               | Accepted |

# Phase 2 overlay foundation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 overlay/portal host, stack, positioning,
  collision, and scroll strategies
- **Status:** `Partial`
- **Updated:** 2026-08-11

`Complete` means one private, reusable CDK-backed foundation owns the documented lifecycle and
stack invariants; positioning, collision and scroll policy are behavior-tested; SSR and packaging
boundaries are explicit; validation passes; and independent review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID  | Plan ref / requirement                       | Deps     | Status   | Acceptance check                                                                                 | Evidence                            |
| --- | -------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------ | ----------------------------------- |
| T01 | Audit CDK Overlay/Portal and repo boundaries | —        | Verified | Exact installed lifecycle, container, stack, positioning, scroll, SSR, and packaging facts known | Research note and read-only audit   |
| T02 | Define the private overlay contract          | T01      | Verified | Lifecycle, ownership, dismissal, nesting, theme/direction, cleanup, and public boundary agree    | Foundation design and docs          |
| T03 | Implement host and stack coordination        | T02      | Verified | Portal/ref ownership and atomic top-surface routing work without leaked component references     | Private runtime and focused tests   |
| T04 | Implement positioning and scroll policy      | T02      | Verified | Logical connected/global positions, fallbacks, push/margin, and strategy selection are explicit  | Private policy and browser tests    |
| T05 | Verify SSR, hydration, package, and release  | T03, T04 | Pending  | Two real secondary entries share one stack; first consumer proves hydration without package leak | Deferred first-consumer gate        |
| T06 | Validate and independently review            | T01–T04  | Verified | Unit, browser, lint, types, builds, budgets, format, sensitivity, and final review pass          | Command logs and independent review |

## Loop log

| ID        | Owner  | Worktree / isolation  | Checks                                                             | Review | Cleanup         |
| --------- | ------ | --------------------- | ------------------------------------------------------------------ | ------ | --------------- |
| T01 audit | Dewey  | read-only shared root | Official/installed CDK and repository audit                        | Clear  | No audit edits  |
| T02–T04   | Parent | shared root           | 90 unit/integration tests, Chromium 10/10, builds, budget, dry-run | Clear  | Source retained |

## Reviews

| Checkpoint           | Reviewer   | Findings                                          | Disposition                                                                     | Closure |
| -------------------- | ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| Read-only audit      | Dewey      | None                                              | Implement private source foundation; retain packaging gate                      | Clear   |
| Final review         | Archimedes | Two S2/C3 lifecycle/origin findings               | Fixed with focused regressions                                                  | Clear   |
| Late boundary review | Archimedes | Logical-boundary pointer starts were bubble-phase | Moved handle-owned listeners to capture and added a stop-propagation regression | Clear   |

## Decisions / deviations

| Item                 | Need / change                                                                                       | Evidence                                   | Status   |
| -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------- |
| Public API boundary  | Keep CDK and the foundation private; defer a shared published identity decision to two real entries | ADR 0004, ADR 0006, package audit          | Accepted |
| Scroll-lock boundary | Support noop/reposition directly and the next row's private ref-counted block lease                 | CDK detach behavior and body-lock contract | Accepted |
| Completion status    | Record source behavior as Partial until package identity and consumer hydration are proven          | Honest completion gate                     | Accepted |

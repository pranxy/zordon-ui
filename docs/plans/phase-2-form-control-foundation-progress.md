# Phase 2 form-control foundation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 form control base behavior, touched state, disabled state, validation, and error IDs
- **Status:** `Partial`
- **Updated:** 2026-08-19

`Complete` means value-accessor ownership, interaction state, disabled and validation behavior,
accessible error relationships, SSR/hydration boundaries, verification, and package impact are
explicit and independently reviewed Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID  | Plan ref / requirement                               | Deps    | Status   | Acceptance check                                                                                       | Evidence                  |
| --- | ---------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ | ------------------------- |
| T01 | Audit Angular Forms, accepted ADRs, and repository   | —       | Verified | Installed/current behavior, native reuse, component differences, and premature-abstraction risks known | Research and source audit |
| T02 | Define value-accessor and value ownership            | T01     | Verified | Programmatic writes, user changes, resets, normalization, and typed Reactive Forms ownership agree     | Foundation contract       |
| T03 | Define touched, dirty, submitted, and async states   | T01–T02 | Verified | Interaction reporting and display policy preserve Angular Forms semantics                              | Foundation contract       |
| T04 | Define disabled, readonly, validation, and error IDs | T01–T03 | Verified | Native state and deterministic consumer-first relationships compose without competing owners           | Foundation contract       |
| T05 | Add behavior-sensitive Forms, browser, and SSR proof | T02–T04 | Verified | Tests reject callback loops, false touched state, disabled drift, stale errors, and hydration mismatch | 7 focused + SSR 3/3       |
| T06 | Verify public API, bundle, and release intent        | T02–T05 | Verified | Artifact and Changeset conclusions match the actual implementation                                     | Identical seven-file pack |
| T07 | Validate and independently review                    | T01–T06 | Verified | Targeted/full gates and final independent review pass                                                  | Commands and Clear review |

## Loop log

| ID        | Owner  | Worktree / isolation  | Checks                                                                           | Review | Cleanup         |
| --------- | ------ | --------------------- | -------------------------------------------------------------------------------- | ------ | --------------- |
| T01 audit | Audit  | read-only shared root | Repository, installed Forms, and primary evidence                                | Clear  | No audit edits  |
| T02–T07   | Parent | shared root           | Focused 7/7, SSR 3/3, library 107/107 at 100%, lint, types, build, tooling, pack | Clear  | Source retained |

## Reviews

| Checkpoint      | Reviewer     | Findings                                                                           | Disposition                                      | Closure |
| --------------- | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| Read-only audit | Forms audit  | No generic base; keep native accessors and defer concrete value/focus/package gaps | Adopted contract plus test-only characterization | Clear   |
| Final review    | Forms review | No material correctness, test, SSR, accessibility, package, or status findings     | Accepted                                         | Clear   |

## Decisions / deviations

| Item              | Need / change                                                                    | Evidence                                                                         | Status   |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| Runtime boundary  | Ship no generic base/directive/service/type before real controls                 | Native and composite value/focus/serialization behavior differs; CVA is untyped  | Accepted |
| Submitted owner   | Read and reset `FormGroupDirective.submitted`; do not duplicate it               | Prevents drift across submit, reset, and form replacement                        | Accepted |
| Completion status | Keep Partial until one real native directive and one real composite CVA prove it | Fixtures cannot establish concrete component API, packaging, or browser behavior | Accepted |
| Release intent    | No Changeset                                                                     | Public API and packed seven-file artifact are unchanged                          | Accepted |

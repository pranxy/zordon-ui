# Phase 2 directionality progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 directionality and logical placement mapping
- **Status:** `Partial`
- **Updated:** 2026-08-13

`Complete` means direction ownership and logical-to-physical behavior are explicit, tested at the
appropriate runtime/browser/SSR layers, packaged intentionally, and independently reviewed Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID  | Plan ref / requirement                              | Deps    | Status   | Acceptance check                                                                                           | Evidence                              |
| --- | --------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| T01 | Audit Angular/CDK/repository direction boundaries   | —       | Verified | Installed and supported direction sources, mappings, updates, SSR, and packaging are understood            | Research note and read-only audit     |
| T02 | Define direction ownership and logical API contract | T01     | Verified | Application, nested scope, component, overlay, physical-side, and writing-mode rules agree                 | Foundation design and docs            |
| T03 | Implement the smallest shared mapping/runtime       | T02     | Verified | No duplicate bidi state; mappings and live updates behave at the correct private/public boundary           | Source and focused tests              |
| T04 | Verify browser and SSR integration                  | T03     | Pending  | First published component proves LTR/RTL placement, SSR/hydration, cleanup, and supported-browser behavior | Private Chromium proof; consumer gate |
| T05 | Verify package and release intent                   | T03     | Verified | Public API, FESM, bundle, peer, and Changeset conclusions match the actual artifact                        | Build, pack, and diff evidence        |
| T06 | Validate and independently review                   | T01–T05 | Verified | Tests, lint, types, builds, format, sensitivity, and final review pass                                     | Command logs and Clear review         |

## Loop log

| ID        | Owner  | Worktree / isolation  | Checks                                                                | Review | Cleanup         |
| --------- | ------ | --------------------- | --------------------------------------------------------------------- | ------ | --------------- |
| T01 audit | Dewey  | read-only shared root | Angular/CDK/repository evidence                                       | Clear  | No audit edits  |
| T02–T06   | Parent | shared root           | 100 tests/100% coverage, Chromium 14/14, builds, dry-run, sensitivity | Clear  | Source retained |

## Reviews

| Checkpoint      | Reviewer  | Findings                                                     | Disposition                                                                                     | Closure |
| --------------- | --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------- |
| Read-only audit | Dewey     | Root direction was snapshotted; nested/live RTL was ignored  | Bind and propagate the nearest CDK source, reposition, retain consumer gates                    | Clear   |
| Final review    | Bernoulli | Owned child injector destroyed the borrowed direction source | Replaced it with a non-owning delegating injector; added close, failure, and reopen regressions | Clear   |

## Decisions / deviations

| Item              | Need / change                                                                                 | Evidence                         | Status   |
| ----------------- | --------------------------------------------------------------------------------------------- | -------------------------------- | -------- |
| Public boundary   | Add no duplicate Zordon direction service; retain existing logical aliases                    | ADR 0007 and public vocabulary   | Accepted |
| Writing modes     | Scope v1 mapping to horizontal LTR/RTL; vertical/sideways axes require separate proof         | CDK source and CSS Writing Modes | Accepted |
| Completion status | Keep Partial until the first published component proves browser, SSR/hydration, and packaging | Private overlay remains unpacked | Accepted |

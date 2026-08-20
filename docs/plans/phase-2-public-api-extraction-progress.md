# Public API extraction implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2, public API extraction and breaking-change detection
- **Status:** `Complete`
- **Updated:** 2026-08-19

`Complete` means all rows are Verified or user-approved Descoped, validation passed, the final
review is Clear, and nothing material remains open.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

Status: `Pending` | `In progress` | `Blocked` | `Verified` | `Descoped`

| ID  | Plan requirement                                                                              | Deps    | Status   | Acceptance check                                                                            | Evidence                                                    |
| --- | --------------------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| T01 | Audit APF/public-entry and API Extractor suitability                                          | —       | Verified | Built primary declaration is the single analysis input; no second rollup is introduced      | Research record                                             |
| T02 | Add a tracked primary API report and explicit update/check commands                           | T01     | Verified | Reviewed declaration baseline is generated from `dist/components`                           | Config, report, scripts                                     |
| T03 | Make report drift fail CI/release preparation and add configuration tests                     | T02     | Verified | CI runs after build; real report mutation fails; tooling test covers config/runner boundary | CI, runner, 46 tooling tests                                |
| T04 | Document declaration scope, review workflow, secondary-entry rule, and non-declaration limits | T02     | Verified | Contributor/API/release docs keep manual behavioral review required                         | Public extraction guide                                     |
| T05 | Validate package/tooling/build boundary and final review                                      | T03–T04 | Verified | Format, tooling, API, build/budget, package, and diff gates pass                            | Tooling 46/46; API; docs/lib; release dry run; Clear review |

## Decisions / deviations

| Item             | Decision                                                      | Evidence                                                                         | Status   |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| Analysis input   | Analyze the built APF primary declaration                     | ng-packagr owns shipped declaration generation                                   | Accepted |
| Reports          | One tracked report per real public entry point                | No empty secondary entry points exist yet                                        | Accepted |
| Rollup/doc model | Disable API Extractor declaration rollup and doc-model output | Prevents duplicate package declarations and premature generated docs             | Accepted |
| Review scope     | Keep manual API review for DOM/behavioral contracts           | A declaration report cannot see runtime semantics                                | Accepted |
| Release intent   | No Changeset                                                  | Root development tooling and repository policy only; packed library is unchanged | Accepted |

## Reviews

| Checkpoint           | Reviewer | Findings                                                                                                | Disposition                                                                          | Closure |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------- |
| Read-only audit      | Parent   | API Extractor report warnings can be invocation/platform sensitive; generated report is formatter-owned | Checked runner enforces failure and generated report has a narrow Prettier exclusion | Clear   |
| Final implementation | Parent   | No material finding                                                                                     | No action required                                                                   | Clear   |

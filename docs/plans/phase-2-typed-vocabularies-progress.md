# Phase 2 typed vocabularies implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 typed color, size, style, shape, placement, orientation, and density vocabularies
- **Status:** `Complete`
- **Updated:** 2026-08-10

`Complete` means every row is Verified, the public type contract is documented and packaged, compile-time checks reject unsupported values, validation passes, and the independent final review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID    | Plan ref / requirement                                    | Deps       | Status   | Acceptance check                                                                                                                                       | Evidence                                                                                                                                             |
| ----- | --------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| T01   | Audit daisyUI and repository vocabulary boundaries        | —          | Verified | Every shared union is supported by the pinned daisyUI contract or a cross-component Angular layout contract; component-specific modifiers remain local | Installed daisyUI 5.7.16 selector/theme audit plus accepted styling, directionality, and packaging ADRs                                              |
| T02   | Define the public vocabulary contract                     | T01        | Verified | Color, size, style, shape, placement, orientation, and density names are unambiguous, composable, and do not imply unsupported universal values        | Nine `Zd*` aliases separate shared values, axis placement, and library-owned density from component-local modifiers                                  |
| T03   | Implement and export type-only vocabularies               | T02        | Verified | The primary entry point exposes intentional type-only contracts without runtime payload or accidental exports                                          | Generated package declaration exports exactly nine aliases; FESM remains 233 B raw / 193 B gzip                                                      |
| T03.1 | Add compile-time contract checks                          | T03        | Verified | Supported literals compile and representative unsupported literals fail with explicit `@ts-expect-error` sensitivity                                   | Exact-union assertions and seven invalid literals pass; temporary `ZdColor \| string` widening fails with TS2344 and TS2578, then restoration passes |
| T04   | Document usage and extension boundaries                   | T02, T03   | Verified | Contributors know which vocabulary is shared, which values are component-specific, and how consumer customization remains open                         | Foundation guide documents narrowing, local modifiers, logical direction, type erasure, and consumer styling escape hatches                          |
| T05   | Validate, update the build plan, and independently review | T03.1, T04 | Verified | Typecheck/build/package/coverage/lint/format checks pass, the plan is accurate, and final review is Clear                                              | Typecheck, coverage, lint, 34 tooling tests, build, budget, format, diff, declaration, and seven-file pack checks pass; final review Clear           |

## Loop log

| ID      | Owner                          | Worktree / isolation                 | Checks                                                                                              | Review                                  | Cleanup                           |
| ------- | ------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------- |
| T01–T04 | Parent + read-only audit agent | Shared workspace; agent read-only    | Targeted typecheck, lint, production build, declaration/FESM inspection, and sensitivity proof pass | Public contract boundary audit complete | Temporary widening fully reverted |
| T05     | Parent + independent reviewer  | Shared workspace; reviewer read-only | Full repository gates, package inspection, Changeset status, and final full-plan reread pass        | Clear; no material findings             | No temporary artifacts retained   |

## Reviews

| Checkpoint     | Reviewer                | Findings                                                                                                | Disposition  | Closure |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------ | ------- |
| Contract audit | Vocabulary audit agent  | No blocking findings; recommended the nine-alias type-only boundary and compile-time sensitivity checks | Incorporated | Closed  |
| Final review   | Vocabulary review agent | Clear; no material findings in contract, tests, CI, docs, packaging, or bundle impact                   | Accepted     | Closed  |

## Decisions / deviations

| Item              | Need / change                                                                                                | Evidence                                                                                     | Status   |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | -------- |
| Public API review | Add nine Preview type-only aliases to the primary entry point; compatible new feature with a minor Changeset | Primary entry-point map, generated declaration, `typed-foundation-vocabularies.md` Changeset | Approved |
| Runtime form      | Use erased aliases rather than enums, const enums, or exported arrays                                        | No runtime validation/iteration requirement; FESM size unchanged                             | Accepted |
| Shared boundary   | Components narrow shared types; specialized modifiers and rich mask shapes stay component-local              | Installed daisyUI selectors and ADR 0003 customization contract                              | Accepted |
| Placement         | Keep inline/block axes reusable and logical; do not create invalid compound placement strings                | ADR 0007 requires public `start`/`end`; components can use axis-specific types               | Accepted |
| Density           | Treat compact/comfortable/spacious as Zordon UI spacing intent, not daisyUI modifier classes                 | daisyUI 5.7.16 has no universal density vocabulary                                           | Accepted |

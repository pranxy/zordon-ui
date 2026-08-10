# Phase 2 named part and slot conventions implementation progress

- **Template loaded from:** `implement-plan/assets/progress-tracker-template.md`
- **Plan:** `DAISYUI_ANGULAR_BUILD_PLAN.md` — Phase 2 named part/slot conventions for compound components
- **Status:** `Complete`
- **Updated:** 2026-08-10

`Complete` means every row is Verified, the public naming and projection contract is explicit, Angular projection boundaries are behavior-tested, validation passes, and the independent final review is Clear.

Parent = sole tracker writer under concurrency.

## Tasks / subtasks

| ID    | Plan ref / requirement                                      | Deps       | Status   | Acceptance check                                                                                                        | Evidence                                                                                                                               |
| ----- | ----------------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| T01   | Audit Angular projection and repository API boundaries      | —          | Verified | Contract follows Angular 21 projection behavior, ADR 0002, public-entry-point policy, accessibility, and SSR boundaries | Installed Angular 21.2.19 compiler/runtime, accepted ADRs, package map, and active public API audited                                  |
| T02   | Define naming, cardinality, ownership, and forwarding rules | T01        | Verified | Roots and parts have deterministic names, projection order, required/optional/repeated rules, and consumer ownership    | Component-scoped selectors, two-tier declaration rule, anatomy table, projection order, cardinality, and ownership documented          |
| T03   | Establish the smallest reusable composition pattern         | T02        | Verified | Convention avoids generic runtime registries/helpers while supporting native semantics and future component behavior    | Static Angular projection plus optional functional directives; no production helper, registry, base class, or export                   |
| T03.1 | Add behavior-focused Angular integration tests              | T03        | Verified | Named/default/repeated projection, consumer attributes, static matching, and forwarding boundaries are locked in        | Six focused cases pass for routing/order, customization, fallback, `ngProjectAs`, bound markers, and explicit forwarding               |
| T04   | Document consumer, contributor, and API-review guidance     | T02, T03.1 | Verified | Compound component authors and consumers can use, customize, and evolve named parts without relying on private markup   | Foundation guide, ADR application, contributor/API-review guidance, and README updated                                                 |
| T05   | Validate packaging and independently review the full step   | T04        | Verified | Coverage, lint, typecheck, build, budget, package, format, and final review gates pass                                  | 19 tests/100% implementation coverage, types, lint, build, 233 B/193 B budget, seven-file pack, hygiene, sensitivity, and Clear review |

## Loop log

| ID      | Owner                          | Worktree / isolation                 | Checks                                                                              | Review                  | Cleanup                     |
| ------- | ------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------- | --------------------------- |
| T01–T04 | Parent + read-only audit agent | Shared workspace; agent read-only    | Targeted Angular projection integration suite passes after one corrected assumption | Contract audit complete | No temporary files retained |
| T05     | Parent + independent reviewer  | Shared workspace; reviewer read-only | Full library gates, package verification, and controlled ordering mutation pass     | Final review Clear      | Temporary npm cache removed |

## Reviews

| Checkpoint     | Reviewer                            | Findings                                                                                                                                     | Disposition     | Closure |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------- |
| Contract audit | Read-only foundation audit agent    | Use two-tier static selectors/functional directives; bound markers stay unmatched; avoid generic runtime APIs                                | Incorporated    | Closed  |
| Final review   | Independent implementation reviewer | NP-01 found functional-target forwarding that could lose directive behavior; corrected to projection-only forwarding and independently rerun | Clear after fix | Closed  |

## Decisions / deviations

| Item                | Need / change                                                                                             | Evidence                                                                  | Status   |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| Public naming       | Use `[zd<Component><Part>]`; export `Zd<Component><Part>` only when behavior/styling needs a directive    | ADR 0002, workspace prefix, component entry-point policy                  | Accepted |
| Runtime shape       | Use Angular's static projection; add no generic part input, registry, service, base class, or DOM mover   | Installed Angular projection runtime and tree-shaking boundary            | Accepted |
| Projection-only API | Permit a documented selector without an empty declaration; it remains a semver-reviewed template contract | Angular projection selectors require no directive instance                | Accepted |
| Marker binding      | Require bare static markers; bound attributes remain unmatched and never re-slot                          | Focused installed-Angular integration result                              | Accepted |
| `ngProjectAs`       | Internal static forwarding only for projection-only targets; it never instantiates a functional directive | Compiler literal requirement and integration result                       | Accepted |
| Cardinality         | Document per part; validate locally only when duplicates/missing content break semantics or state         | Angular routes every match and does not enforce cardinality               | Accepted |
| SSR                 | Keep projection deterministic; defer server/hydration proof to the first real compound component          | No production declaration/helper ships in this convention step            | Accepted |
| Changeset           | Omit because only repository tests/docs change and the packed API/runtime remains unchanged               | Active `src/public-api.ts` and package output are intentionally unchanged | Accepted |

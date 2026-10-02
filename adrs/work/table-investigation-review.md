# Table implementation investigation

Date: 2026-09-29. Scope: current Table implementation, public API, documentation, relevant architectural decisions, and Angular Aria/CDK suitability. Investigation only; no implementation changes.

## Conclusion

The shipped `ZdTable` is native-table styling only. It does not implement Angular Aria interaction or MatTable-style column/data rendering. No material defect was found within its documented native contract. The user's desired richer table remains unimplemented.

The existing follow-up in `component-showcase-feedback.md:216` already records T13 as pending and NOT READY. It preserves native Table and adds opt-in Aria Grid composition, but explicitly excludes data sources. Therefore T13 alone will not supply MatTable-like data/column rendering. This investigation recommends evaluating that additional capability; it does not silently expand or approve the existing implementation task.

## Local evidence

- `projects/components/table/src/table.ts:7`: directive with `size`, `zebra`, `pinRows`, `pinCols`; computed daisyUI classes only. No Aria import, rendered views, column registry, data source or keyboard handling.
- `projects/components/table/src/public-api.ts:1`: only Table, size type and validator exported.
- `docs/components/table.md:30`: explicitly excludes grid interaction and data operations.
- `projects/docs/src/app/pages/table.component.ts:63`: consumer-written rows and cells using `@for`; no library rendering abstraction.
- `docs/architecture/0008-angular-aria.md:21`: accepted native-first policy, Aria for matching interactive patterns, CDK for complementary mechanics. Aria must remain behind Zordon consumer signatures; a component integration spike is required.
- `docs/foundations/angular-aria-adoption.md:95`: interactive Table maps to Grid; native Table stays semantic HTML.
- `docs/plans/phase-3-table-specification-progress.md:17`: interactive Grid approval pending.
- Installed Aria and CDK are both 21.2.14. Aria package exports Grid but no Table entry point. Its Grid declarations are marked developer preview.

## Capability comparison

| Capability | Current ZdTable | Angular Aria Grid | CDK Table / MatTable foundation |
| --- | --- | --- | --- |
| daisyUI size, zebra, coarse pinning | Yes | Styling is external | Styling can be supplied by Zordon |
| Arbitrary consumer HTML | Yes | Directives enhance rows/cells/widgets | Custom cell/header/footer templates |
| Named columns and dynamic column order | Consumer implements | Does not supply renderer | Built in |
| Data source and tracked row rendering | Consumer implements | Does not supply renderer | Built in |
| Two-dimensional keyboard/focus behavior | No | Built in | Not supplied merely by setting grid role |
| Embedded-control interaction | Native control behavior | GridCellWidget coordinates interaction | Cell templates can contain controls |
| Sorting/filtering/paging policy | External | External | Separately composed; not all intrinsic to table |

## Recommended direction

1. Preserve `[zdTable]` for ordinary semantic tables. Native captions, header scope and normal controls remain appropriate.
2. Provide an explicit interactive composition backed by `Grid`, `GridRow`, `GridCell` and `GridCellWidget`, hidden behind Zordon declarations. Aria owns keyboard/focus behavior; no parallel key manager.
3. For MatTable-like flexibility, evaluate CDK Table as the rendering layer: named column definitions, custom header/cell/footer templates, displayed-column order, row templates, data inputs, tracking and per-column sticky behavior. Prefer native table DOM to retain daisyUI anatomy. Avoid a mandatory JSON-only column schema that restricts custom content.
4. Treat CDK plus Aria as a candidate architecture, not verified drop-in composition. Verify Aria content queries and parent injection across CDK embedded views, dynamic column changes, row updates, roles and focus ownership. Resolve overlapping sticky mechanisms explicitly.
5. Keep data processing and row selection policy distinct from Aria cell selection. Sorting, paging, server requests and edit persistence need their own contracts. Virtualization should not be promised from basic Grid composition.

The immediate decision is whether the desired addition includes templated data rendering as well as keyboard interaction. The current user request motivates this investigation but does not request implementing either now.

## Validation and review coverage

- Ran `npm run test:lib -- --include=../table/src/table.spec.ts`: one file, three tests passed. These exercise classes, native semantics, option removal, prefixing and invalid size rejection.
- Two initial include patterns matched no tests; corrected relative to the configured source root. Those attempts were not passes.
- Inspected installed Grid declarations and relevant CDK Table declarations against official documentation. Installed declarations control version-specific claims; current upstream documentation may include newer capabilities.
- Independent read-only review corroborated the native-only contract, missing richer API, and pending T13 work. Parent verified the cited code and scope record.
- No browser, assistive-technology, SSR/hydration, full-library or combined Aria/CDK prototype validation was performed. Existing tracker claims are not fresh runtime evidence.
- Existing unrelated dirty work was preserved. No branches, worktrees or persistent servers were created.

## Findings and scope assessment

No admitted material defect in the native implementation. The requested richer behavior is a confirmed capability gap, already tracked as unfinished, rather than a regression in its published behavior.

- Baseline: native scope is explicit and coherent. T13 covers interaction but excludes the data-source scope needed for a full MatTable-like API.
- Implementation: native behavior present; interactive Aria composition and reusable data/column rendering absent.
- Quality: source inspection found no additional material correctness issue in this bounded review.
- Validation: focused native tests pass; richer composition remains unvalidated and cannot be considered ready.

## Primary external sources

- [Angular 21 Grid guide](https://v21.angular.dev/guide/aria/grid): Grid interaction primitives and guidance to retain semantic HTML for simple read-only tables.
- [Official CDK Table guide source](https://raw.githubusercontent.com/angular/components/main/src/cdk/table/table.md): templated columns, row definitions, data-source rendering and tracking. Cross-checked relevant capabilities against installed CDK 21.2.14 declarations; no claim of complete current-main compatibility.
- [Official Material Table guide source](https://raw.githubusercontent.com/angular/components/main/src/material/table/table.md): MatTable builds on CDK; setting a grid role does not add keyboard/focus handling.

Next engineering step: a bounded CDK/Aria integration spike, followed by the explicit Table contract required by ADR 0008 if implementation is requested.

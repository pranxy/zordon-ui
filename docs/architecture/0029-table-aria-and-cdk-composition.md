# ADR 0029: Native Table, Aria interaction and CDK rendering

Status: Accepted. Date: 2026-09-29.

## Context and authorization

The user requested investigation of an Aria-backed Table with MatTable-like flexibility, then authorized implementation of the recommendation. Existing T13 preserves native Table; the follow-up expands its scope to evaluating and demonstrating reusable data/column rendering. ADR 0008 remains authoritative for interaction ownership and public API isolation.

The installed Angular Aria/CDK 21.2.14 spike fails when `GridCell` is added to a CDK column template: instantiation throws NG0201 for `GRID_ROW`. Native `@for` rows pass navigation, widget focus, descendant pointer and data/column change checks. Aria uses declaration-based content queries; supplying an insertion injector alone does not solve discovery. No private registration API will be used.

## Decision

- Preserve `[zdTable]` and its four styling inputs unchanged.
- Add `table[zdTableGrid]`, `tr[zdTableRow]`, `th[zdTableCell],td[zdTableCell]`, and `[zdTableCellWidget]` as opt-in Aria host-directive compositions. Keep rows, cells and widgets in the same consumer template hierarchy; native `@for` and `@if` remain supported.
- Prefix interaction inputs/outputs (`grid*`, `cell*`, `widget*`) to coexist with styling and form-control directives. Header roles are explicit through `cellRole`; consumers retain caption, native scope, labels and control disabled state. Aria owns roving/active-descendant focus, navigation, disabled policy and optional cell selection. Cell selection is not row selection.
- Keep consumer signatures free of Aria types. Angular-generated host metadata retains its real dependencies under ADR 0009. Emit Aria cell/widget marker attributes needed by its public directive composition's descendant pointer lookup.
- Require explicit, document-unique `cellId` and `widgetId` shared by wrapper and hosted directive inputs. The installed Aria default IDs randomize independently on server and client; required inputs avoid private ID-provider overrides or input-signal mutation. Mirror public role/ID/span inputs in host bindings because Aria otherwise writes cell attributes only after browser render. SSR tests reproduced both gaps before correction.
- Use existing `[zdTable]` directly with public CDK Table for named header/body/footer templates, displayed-column order, data source, tracking and sticky columns. Show a working composition rather than duplicate CDK's renderer or re-export its API. This mode retains table semantics and ordinary control tab order; it is not an Aria grid.
- Do not combine CDK row/cell templates with the new Aria Table directives. Document the restriction and do not claim a unified grid/data renderer. Future upstream compatibility can justify revisiting this choice.
- Keep filtering, sorting policy, paging, editing persistence, virtualization and column resizing outside this addition. A showcase may own simple selection/action state.

## Consequences and confirmation

Interactive tables retain arbitrary native markup and Angular control flow. Data-rendered tables gain MatTable-style flexibility without Material styling. Consumers choose the appropriate mode; no new dependency or keyboard manager is introduced.

Verify wrapper roles, aliases, models, native compatibility, pointer descendants, widgets, disabled cells, RTL, row changes and teardown with real Aria. Add real-page, browser and SSR checks; retain bundle and API reports. Installed Angular 21.2 is the immediate validated lane; do not infer unrun platform/manual accessibility gates are passed.

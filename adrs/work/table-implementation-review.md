# Table implementation review

Date: 2026-09-29. **Source review: Clear. Release acceptance: Partial.**

## Review constraints and coverage

Plan-backed review of T13 in [component-showcase-feedback.md](component-showcase-feedback.md) against accepted [ADR 0029](../../docs/architecture/0029-table-aria-and-cdk-composition.md). The bounded scope includes the four new Aria wrappers, exports and type/API contract, unchanged native Table, public examples/snippets, dedicated browser and SSR fixtures, and related tests. Existing unrelated workspace changes were excluded.

An independent reviewer inspected a frozen snapshot and installed Angular Aria implementation, then reviewed the final fixture tabindex and route-copy assertion delta. The reviewer did not author these changes or run the parent's checks. Parent integration and validation evidence below is independently recorded, not attributed to the reviewer.

## Findings and closure

No confirmed material defects. Final narrow delta review is also Clear. No rejected or unresolved source findings.

The parent reproduced and fixed two SSR gaps before final review: Aria writes cell role/identity/span attributes only after browser render, and its default generated IDs differ across server/client instances. Wrapper host bindings mirror public semantic inputs; required explicit cell/widget IDs provide deterministic identity. SSR acceptance failed before these corrections and passes after them.

## Plan compliance matrix

| Requirement | Implementation and evidence | Status |
| --- | --- | --- |
| Native styling compatibility | Original `table.ts` unchanged; three native unit checks retained | Verified |
| Public Aria composition | Grid/row/cell/widget host directives; prefixed aliases; real Aria owns navigation and selection | Verified |
| MatTable-like flexibility | Public CDK Table example with named header/body/footer columns, data rows, tracking and changed order | Verified as separate mode |
| Integration spike before contract | Direct CDK/Aria cells throw NG0201; native `@for` control passes; restriction documented | Verified |
| Keyboard, controls, disabled, RTL, dynamic content | Eight new unit tests; five browser cases in Chromium and Firefox, including axe, keyed focus and complex input activation | Verified on tested lanes |
| SSR and stable semantics | No-JavaScript header/cell roles and IDs; identity survives hydration; Aria/CDK controls work | Verified |
| Real examples and styling | Live page interaction; five reviewed desktop/mobile/RTL/theme images; copyable source and API documentation | Verified |
| Package/public contract | Build, type tests, Table non-local API extraction, budgets and publication dry-run | Verified |
| Supported platform and manual review | WebKit cannot launch; additional Angular lanes and assistive-technology checks not run | Open release gates |

## Plan-backed verdicts

1. **Baseline:** The two-mode contract resolves a demonstrated upstream declaration/injection limitation. A unified Aria/CDK renderer is not claimed.
2. **Compliance:** The requested interaction and flexible rendering examples are implemented; release validation is explicitly partial.
3. **Quality:** The implementation reuses public Aria and CDK behavior without a duplicate keyboard manager, data renderer or private registration bridge. Built-in complexity review found no need for added abstraction.
4. **Tests:** Real Aria and observable user behavior are exercised, including meaningful SSR regressions. New acceptance coverage is not described as proof of an earlier defect where no pre-fix run exists.

## Validation and limits

- Library: 396/396 tests (11 Table), type checks and lint pass. Docs: 41/41 unit tests; tooling: 104/104. Browser lint/type checks pass.
- Table browser checks: 10/10 across Chromium and Firefox, including axe. Visual checks: 2/2, five individually inspected screenshots, final run without snapshot updates.
- Production SSR/hydration: 29/29, including Table. Docs SSR/release: 10/10; navigation/pages: 56/56; accessibility: 2/2, including Table. Docs production build and link/performance/design-system checks pass.
- Package build and all 68 bundle budgets pass; Table entry is 12.34 KiB raw / 2.51 KiB gzip (per-entry metric excludes external dependencies). API extraction and package publication dry-run pass; nothing was published.
- The repository-wide API checker runs extraction in local/update mode, so its exit code alone is not a trustworthy drift gate. Table was separately checked with non-local extraction. Two unrelated union-order baselines were restored from the prior task snapshot after that checker rewrote them.
- Restricted-process browser attempts could not execute and were stopped; reruns with browser-launch permissions passed. WebKit's separate launch failure (exit 3236495362) remains unverified, not skipped or counted as passing.
- Manual assistive-technology review and additional supported Angular lanes remain open; maturity stays Planned. Sorting, filtering, paging, persisted editing, resizing and virtualization remain outside the addition.

## Resources

No commits, branches or worktrees created. Isolated drafts, validation artifacts and frozen review evidence are retained in the current task's visualization directory. Test runners clean up their servers; the task-owned snippet regeneration helper is removed after integration. The work document remains the acceptance tracker.

# Public API extraction and breaking-change detection

The tracked API reports at `etc/api/zordon-ui.api.md`, `etc/api/zordon-ui-button.api.md`, and
`etc/api/zordon-ui-link.api.md` are the declaration-level approval records for the primary, Button,
and Link entry points. They are generated from built Angular Package Format declaration files, not legacy source. CI fails when any report
differs from its reviewed baseline.

## Commands

```sh
# Build the library and compare its declarations with the committed baseline.
npm run test:api

# After review, intentionally refresh the committed report.
npm run build:lib
npm run update:api
```

`npm run check:api` only compares a completed library build with the baseline. It is used in CI after
`build:lib`, and `release:dry-run` includes it. Both commands use the single API-report registry in
`tools/check-api-report.mjs`: `check` compares every candidate with its reviewed baseline, while
`update` runs API Extractor for every registered entry point. It is an approval action; never run it
merely to make a failing check pass.

## Review workflow

1. Make the intended public API change through the correct `public-api.ts` entry point.
2. Run `npm run test:api`. A declaration change fails and produces a temporary comparison report.
3. Review the public API checklist, component specification, maturity, SemVer/Changeset, migration
   notes, package entry point, and generated API-report diff together.
4. If approved, run `npm run update:api`, inspect every affected tracked report, then rerun
   `npm run test:api`.
5. Include the report diff and all required behavioral evidence in the pull request. A report change
   without the corresponding public API review is incomplete.

The report represents every emitted TypeScript declaration, including Angular-generated static
metadata for public directives and injectables. Its scope is intentionally the whole emitted
declaration surface; do not hand-edit it to hide generated declarations.

API Extractor owns the report's generated Markdown formatting. The narrow
`/etc/api/*.api.md` Prettier exclusion prevents formatter churn from becoming a false declaration
change; ordinary repository Markdown remains format-checked.

## What this gate proves

- changes to exported declarations, names, types, optionality, and emitted Angular declaration
  metadata receive an explicit, version-controlled diff;
- forgotten exported types cause the extraction gate to fail;
- CI and release preparation use the same declaration-level baseline.

## What it does not prove

The report cannot detect public behavior that does not change a TypeScript declaration: DOM and ARIA
semantics, selectors, projected content, CSS hooks, forms behavior, event ordering, focus,
accessibility, visual output, SSR/hydration, dependencies, or runtime side effects. The
[public API review](api-review.md), component specification, browser/SSR/visual evidence, package
inspection, and [deprecation policy](deprecation-policy.md) remain required.

No declaration rollup, doc-model JSON, or new public documentation route is generated. ng-packagr
continues to own shipped declarations; API Extractor only verifies the built output and produces the
tracked review report.

## Future secondary entry points

Each published component or optional entry point gets its own API Extractor configuration/report when
it first exists. Button and Link are the initial examples. Their extractor tsconfigs resolve primary-entry types
from the built declaration file rather than source, so the report stays an APF gate. Do not add a
placeholder report for an empty entry point. A future package-level aggregator must not blur
independent entry-point compatibility boundaries.

## References

- [API Extractor API reports](https://api-extractor.com/pages/setup/configure_api_report/)
- [API Extractor configuration](https://api-extractor.com/pages/configs/api-extractor_json/)
- [Package entry-point map](../architecture/entry-points.md)
- [Public API review](api-review.md)

# Public API extraction research

## Question

How can the repository detect and review exported declaration changes without replacing ng-packagr,
accidentally creating a second declaration bundle, or claiming that TypeScript signatures cover the
whole public contract?

## Evidence

- The published entry point is built by ng-packagr from
  `projects/components/src/public-api.ts` into
  `dist/components/types/pranxy-zordon-ui.d.ts`.
- ADR 0006 requires public API extraction and breaking-change review before beta; the public API
  review already treats DOM, accessibility, forms, CSS hooks, SSR, and lifecycle as public in
  addition to TypeScript declarations.
- API Extractor 7.58.12 supports a tracked API report generated from a declaration entry point.
  Its report folder is intended for version control and its temporary report is compared to the
  baseline during a normal run. Its d.ts rollup is intentionally unsuitable here because ng-packagr
  already owns emitted package declarations and future component entry points must remain separate.
- API Extractor can return a warning-level report-drift result depending on invocation/platform
  details. The checked runner propagates a nonzero extractor result and normalizes only newline
  differences when comparing generated and tracked reports, avoiding a Windows/Linux false failure
  without hiding declaration changes.

## Decision

- Add pinned `@microsoft/api-extractor@7.58.12` as a root development dependency.
- Track one primary report at `etc/api/zordon-ui.api.md`, generated from the built primary APF
  declaration. Disable doc model, TSDoc metadata, and d.ts rollup.
- Add `check:api`, `update:api`, and `test:api` scripts. CI runs the check after `build:lib`; the
  release dry run includes it.
- Keep the manual public API review authoritative for non-declaration contracts. Add one distinct
  report per real future secondary entry point; do not create empty placeholder reports.

## Sources

- [API Extractor configuration](https://api-extractor.com/pages/configs/api-extractor_json/)
- [Configuring API reports](https://api-extractor.com/pages/setup/configure_api_report/)
- [Configuring declaration rollups](https://api-extractor.com/pages/setup/configure_rollup/)
- `projects/components/ng-package.json`
- `docs/architecture/0006-packaging-and-public-api.md`
- `docs/contributing/api-review.md`

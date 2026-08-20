# Review: public API extraction and breaking-change detection

## Scope

Bounded plan-backed review of API Extractor configuration, generated primary baseline, checked
runner, package/CI/release wiring, documentation, and package boundary. It does not replace the
manual review of component behavior.

## Evidence matrix

| Requirement                               | Implementation evidence                                                             | Result   |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | -------- |
| Built public declaration is analyzed      | API Extractor starts at `dist/components/types/pranxy-zordon-ui.d.ts`               | Complete |
| Declaration drift is reviewable and fails | Tracked `etc/api` report, checked runner, CI and release-dry-run commands           | Complete |
| No duplicate declaration/package surface  | API Extractor d.ts rollup/doc model/TSDoc output disabled; ng-packagr remains owner | Complete |
| Existing public review remains complete   | Documentation names declaration limits and links manual behavioral review           | Complete |
| Future entry points stay independent      | Guide requires a report only when each real entry point first exists                | Complete |

## Verdicts

1. **Plan/baseline quality:** Adequate. API reports meet the declaration-drift requirement while
   the existing review policy correctly retains DOM, accessibility, styling, and lifecycle scope.
2. **Implementation compliance:** Complete. The pinned tool is configured against the built APF
   declaration, baseline is tracked, CI runs after build, and release dry run includes the check.
3. **Implementation quality:** Clear. The runner handles API Extractor's warning-level drift
   behavior as a failure and normalizes only newlines. The generated-report-only Prettier exclusion
   prevents formatter churn while preserving formatting checks for all ordinary Markdown.
4. **Validation quality:** Clear. Tooling 46/46, `test:api`, docs build, and release dry run pass.
   A deliberate baseline mutation failed the real checked command, then was restored. The docs build
   retains its pre-existing initial bundle-budget warning.

## Result

**Clear.** No material finding. Independent review was unavailable under the active coordination
restriction; this is a parent-owned, read-only plan-backed review.

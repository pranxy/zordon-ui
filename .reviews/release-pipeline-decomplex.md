# Decomplex review: Phase 1 release pipeline

## Overall status

One small operational simplification is available without weakening the release contract. The
remaining separation, validation, tests, and dependency are proportionate to versioning and npm
publish trust boundaries.

## Review contract

| Axis                          | Selection                                                                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mode                          | Audit                                                                                                                                                                 |
| Target                        | Phase 1 release tooling, workflows, configuration, tests, and maintainer guide                                                                                        |
| Authority / required behavior | Build plan release item and ADR 0006: generated changelogs, `next`/`alpha`/`beta`/`rc`, stable `latest`, dry-run package inspection, and provenance-backed publishing |
| Scope                         | Release-related diff only; earlier Phase 1 browser, visual, SSR, and bundle work excluded except CI interaction                                                       |
| Report                        | `.reviews/release-pipeline-decomplex.md`                                                                                                                              |

## Coverage

### Inspected

- Root and publish package metadata, workspace registration, ng-packagr assets, and Changesets
  configuration.
- Version-PR, publish, and CI workflow responsibilities and permissions.
- Release contract, dry-run runner, behavior tests, and maintainer documentation.

### Skipped or partial

- External GitHub environment and npm trusted-publisher account state, which is not repository-owned.
- Earlier unrelated Phase 1 implementation already present in the worktree.

## Potential findings

### DEX-001 — Remove the redundant publish-time npm reinstall

- **Evidence:** Confirmed
- **Recommendation:** Act
- **Surface and location / authority:** `.github/workflows/publish.yml`; the workflow pins Node
  24.15.0, whose distribution already supplies npm 11.12.1, above trusted publishing's npm 11.5.1
  minimum.
- **Current-need evidence:** The separate `npm install --global npm@11.12.1` installs the same CLI
  version already supplied by the pinned Node runtime.
- **Added burden:** It adds a mutable registry download and global installation to the
  provenance-authorized job, creating another network failure and supply-chain surface before every
  publish.
- **Reachable practical impact:** An npm registry outage or compromised resolution path can fail a
  release even after the repository checkout and runtime are fixed.
- **Smallest simpler alternative:** Delete only the global npm installation step and rely on the npm
  CLI bundled with the exact pinned Node version.
- **Exception / boundary check:** Do not remove the exact Node pin, OIDC permissions, protected
  environment, dry run, explicit dist-tag, or provenance flag. Reassess the Node pin when npm raises
  the trusted-publishing minimum.
- **Required behavior and simplification risk:** Trusted publishing remains supported because npm
  11.12.1 exceeds 11.5.1. The only regression risk is a future runtime repackaging, bounded by the
  exact Node version and the publish dry run.
- **Bounded next step or user question:** Remove the step and retain the exact runtime pin.
- **Acceptance signal:** Workflow tests and YAML parsing pass; workflow contains no global npm
  installation and the documented runtime remains Node 24.15.0.

## User-decision queue

No user decision is needed; DEX-001 preserves every accepted release behavior.

## Confirmed proportionate areas

- Separate version-PR and publish workflows prevent pull-request write authority from sharing a job
  with npm OIDC authority.
- Changesets is a maintained dependency replacing custom SemVer/changelog mutation logic.
- The small release validator protects a real untrusted event boundary: package name, SemVer,
  GitHub tag, prerelease flag, and npm dist-tag.
- Negative-path tests cover distinct release-safety failures rather than speculative combinations.
- The protected environment, tag ancestry check, immutable actions, explicit dist-tag, and dry run
  are warranted for the irreversible npm version publish operation.

## Limitations

- The audit cannot prove external npm package existence, repository visibility, environment
  reviewers, or trusted-publisher configuration.

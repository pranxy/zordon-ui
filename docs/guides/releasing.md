# Releasing `@pranxy/zordon-ui`

Releases use Changesets for reviewable version and changelog changes, then a separate GitHub Release
workflow for npm publishing. The publish job uses npm trusted publishing (OIDC); it must never receive
an `NPM_TOKEN`.

## One-time repository and npm setup

1. In GitHub, create an environment named exactly `npm`. Require a reviewer, prevent self-review,
   and restrict deployment tags to `v*`.
2. Protect `master` and `release/*` branches with review requirements. Keep a release branch until
   every GitHub Release from it has published successfully.
3. Allow GitHub Actions to create pull requests so the `Version packages` workflow can maintain its
   version PR.
4. In npm package settings, configure a trusted publisher for owner `pranxy`, repository
   `zordon-ui`, workflow `publish.yml`, environment `npm`, and the `npm publish` action.
5. After an OIDC release succeeds, require two-factor authentication and disallow traditional
   automation tokens for package publishing.

npm only permits trusted-publisher configuration for an existing package. If
`@pranxy/zordon-ui` has never been published, a maintainer must bootstrap one public release using
2FA or a short-lived granular token, then immediately configure trusted publishing and revoke the
token. Do not add the bootstrap credential to a committed workflow. Provenance also requires this
repository and the npm package to be public.

## Record release intent

Every consumer-visible pull request runs:

```shell
npm run changeset
```

Select `@pranxy/zordon-ui`, choose `patch`, `minor`, or `major`, and write a concise consumer-facing
summary. Breaking changes must include migration instructions in the changeset or linked migration
guide. Internal-only changes may omit a changeset when they do not affect the published package.

After changesets merge to a stable `master`, the `Version packages` workflow creates or updates one
version PR. Review its calculated SemVer bump, `projects/components/package.json`, and
`projects/components/CHANGELOG.md`. Merging that PR prepares a version; it does not publish it.

When the package manifest already contains a prerelease version, stable version-PR automation
intentionally pauses: a normal Changesets patch applied to a prerelease would remove its suffix.
Prepare all further prerelease versions on the dedicated release branch described below. Once the
reviewed stable version from `changeset pre exit` reaches `master`, automatic stable version PRs
resume.

## Prerelease channels

Stable versions publish to `latest`. Prerelease suffixes map to the same explicit npm dist-tag:
`next`, `alpha`, `beta`, or `rc`. No other prerelease identifier is publishable.

Changesets prerelease mode must run on a dedicated release branch because entering it on `master`
can block unrelated stable releases:

```shell
git switch -c release/next
npm run prerelease:enter -- next
npm run version:packages
```

Replace `next` with `alpha`, `beta`, or `rc` when appropriate. Commit the generated version and
changelog changes, including `.changeset/pre.json`, on that branch. A prerelease tag must point to a
commit on the matching remote branch (`release/next`, `release/alpha`, `release/beta`, or
`release/rc`). To leave prerelease mode, run `npm run prerelease:exit`, then
`npm run version:packages`; review and merge the resulting stable version into `master` before
creating its stable tag.

## Verify a release candidate

From a clean checkout of the prepared version, run:

```shell
npm ci
npm run format:check
npm run lint:lib
npm run test:lib:types
npm run test:lib:coverage
npm run test:tooling
npm run release:dry-run
```

The dry run builds the partial-Ivy package, enforces bundle budgets, prints the packed tarball
contents, validates the package name and channel, and executes `npm publish --dry-run` with an
explicit dist-tag. Inspect the output: it should contain package metadata, README, LICENSE,
CHANGELOG, FESM bundles, declarations, and maps—never workspace source, tests, credentials, or
legacy entry points.

## Publish

1. Confirm a stable version commit is on `master`, or a prerelease version commit is on the matching
   protected `release/<channel>` branch. The publish workflow rejects every other lineage.
2. Create an annotated tag exactly matching the package version, including the leading `v`, such as
   `v1.2.0` or `v1.2.0-rc.0`, and push it.
3. Draft a GitHub Release for that tag. Mark it as a prerelease exactly when the package version has
   a prerelease suffix. Copy the reviewed changelog notes.
4. Publish the GitHub Release. Approve the protected `npm` environment deployment after reviewing
   the workflow inputs.

The workflow re-runs lint, tests, build, tooling checks, bundle budgets, package dry-run, and the
tag/version/prerelease contract before publishing with provenance. npm versions are immutable, so
re-running a successfully published version fails instead of overwriting it.

## Correct or withdraw a release

Never unpublish a normal release and never move an existing version tag. Correct code in a new
patch release. If a version must not be selected by default, point the appropriate dist-tag at a
known-good version with `npm dist-tag add`, then mark the bad version with `npm deprecate` and a
clear upgrade instruction. These npm mutations are manual maintainer actions protected by 2FA;
verify the exact package, version, and tag before running them.

Public API deprecation and removal follow the canonical
[deprecation and breaking-change policy](../contributing/deprecation-policy.md). This guide owns
package correction and publishing mechanics, not API maturity decisions.

## Primary references

- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm publish and dry-run](https://docs.npmjs.com/cli/v11/commands/npm-publish/)
- [npm dist-tags](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/)
- [Changesets workflow](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Changesets prereleases](https://github.com/changesets/changesets/blob/main/docs/prereleases.md)
- [GitHub environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)

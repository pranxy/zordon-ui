# Changesets

Every user-visible package change must include a changeset. Run `npm run changeset`, select
`@pranxy/zordon-ui`, choose the SemVer impact, and describe the consumer-facing change.

Changesets are release intent, not a release trigger. Merging the generated version PR updates the
package version and changelog. Publishing still requires an explicitly published GitHub Release.

Prerelease mode must be used on a dedicated release branch, never directly on `master`. See
`docs/guides/releasing.md` for the complete stable and prerelease procedures.

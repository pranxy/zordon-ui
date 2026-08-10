# Deprecation and breaking-change policy

This policy applies to public package contracts defined by the
[API review policy](api-review.md). It combines Semantic Versioning with the library's maturity
labels; release channels alone do not determine API stability.

## Change classification

| Change                                                                                                                                      | Stable package treatment |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Backward-compatible defect, documentation correction, or internal change                                                                    | Patch                    |
| Backward-compatible API, variant, behavior, or supported capability                                                                         | Minor                    |
| Deprecation that preserves the old behavior                                                                                                 | Minor                    |
| Removal, rename without compatibility alias, incompatible type/default/event/DOM/ARIA/style-hook change, or newly required dependency/setup | Major                    |

Performance improvements and bug fixes are breaking when consumers must change valid usage or when
documented timing, ordering, DOM, accessibility, or styling contracts become incompatible.

Before `1.0.0`, SemVer says the public API should not be considered stable and permits incompatible
changes in a minor release. Zordon UI still requires an API review, changeset, changelog entry, and
migration instructions. Deprecate first whenever a safe compatibility bridge exists. After
`1.0.0`, intentional breaking changes require a major release.

## Maturity rules

- **Planned/internal experimental:** no published compatibility promise exists, but accepted ADRs
  and repository quality requirements still apply.
- **Experimental export:** may change or disappear only from an explicitly experimental entry point;
  every change is documented for current evaluators.
- **Preview:** may change between prereleases. Breaking preview changes require API review,
  changeset/changelog intent, updated examples, and concise migration notes; they do not require the
  full stable deprecation window.
- **Stable maturity:** is a repository readiness/maintenance label, not a claim that a `0.y.z` or
  prerelease package has SemVer 1.0 guarantees. It follows the lifecycle below, subject to the
  explicit pre-1.0 minor-release exception above.
- **Deprecated:** remains supported through its stated removal release and receives critical fixes
  consistent with the replacement path.

## Stable deprecation lifecycle

1. **Approve:** API review identifies the reason, replacement, affected entry points, compatibility
   impact, and earliest removal release. Cross-component policy changes require an ADR.
2. **Introduce compatibility:** keep existing valid behavior and add the replacement when feasible.
   Mark TypeScript declarations with `@deprecated` and a direct replacement/migration note. Do not
   emit routine runtime console warnings from library components.
3. **Document:** update API reference, examples, changelog/changeset, migration guidance, and the
   component maturity record. Tests cover both the deprecated path and replacement during the
   transition.
4. **Maintain:** keep the API for at least one stable minor release. For `1.x` and later, remove only
   in the next major or later. For `0.x`, an approved minor may remove it after the documented
   transition window.
5. **Remove:** delete exports, aliases, tests, and obsolete examples together; add an explicit
   breaking changeset and migration instructions. Verify the packed public API contains no stale
   path.

Deprecation is not permission to stop testing an API that remains shipped. If an alias cannot
preserve semantics safely, document why and treat the change as breaking at the earliest permitted
release.

## Required migration note

A migration note contains:

- affected imports/selectors/members/behavior and versions;
- why the change is necessary;
- before/after code or markup;
- state, forms, accessibility, styling, SSR, and dependency differences;
- automated migration availability, limitations, and manual follow-up;
- the last supported version and earliest removal version.

Before v1.0, manual migrations are acceptable. ADR 0006 requires `ng update` migrations before
v1.0 for changes that can be transformed reliably after public adoption.

## Emergency exception

A security, legal, data-loss, or severe accessibility defect may make continued compatibility more
harmful than an immediate break. The exception requires maintainer approval, a recorded risk
decision (and ADR when it changes shared policy), the smallest safe change, prominent release notes,
and an actionable migration. Use the correct SemVer boundary whenever release timing permits.

## Package-version deprecation

`npm deprecate` marks a published package version as unsuitable; it does not implement an API
deprecation lifecycle. Use it only for bad published versions with a clear upgrade message. Do not
move or overwrite an existing version. The [release guide](../guides/releasing.md) owns dist-tag
rollback and package-version correction.

## Primary references

- [Semantic Versioning 2.0.0](https://semver.org/)
- [npm deprecate](https://docs.npmjs.com/cli/v11/commands/npm-deprecate/)
- [Creating Angular libraries](https://angular.dev/tools/libraries/creating-libraries)

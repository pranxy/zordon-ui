# Component maturity policy

Maturity communicates compatibility confidence; it is separate from delivery progress. The master
component matrix tracks whether specification, implementation, tests, accessibility, documentation,
and visuals are complete. A component can be implementation-complete while it remains Preview for
consumer feedback.

## Maturity levels

| Level          | Consumer meaning                                                                                           | Publication rule                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Planned**    | Catalog scope exists, but no usable public API is promised                                                 | Not exported or documented as usable                                                                                                                      |
| **Preview**    | Usable for evaluation with documented behavior and quality evidence, but feedback may still change the API | `next`, `alpha`, or `beta` prerelease channels only; breaking changes follow preview migration rules                                                      |
| **Stable**     | Repository-approved compatibility and maintenance commitment with complete delivery evidence               | May be frozen during release-candidate work and is eligible for `latest` once the package reaches a normal release; changes follow the deprecation policy |
| **Deprecated** | Still supported but has a documented replacement and removal boundary                                      | Remains exported and tested until the deprecation policy permits removal                                                                                  |
| **Removed**    | No longer available from supported public entry points                                                     | Migration history remains discoverable; no stale export or deep-import compatibility shim                                                                 |

npm dist-tags describe a package release channel, not component maturity. A prerelease package may
contain components at different maturity levels, but a stable package must not expose Planned or
Preview catalog APIs as Stable public surface.

Experimental optional integrations are governed separately from catalog component maturity. For
example, `@pranxy/zordon-ui/signal-forms` remains explicitly experimental and isolated from core
controls even when a component using the stable forms contract is Stable.

These are repository-defined maturity labels. `Stable` does not turn the current `0.y.z` or
prerelease package into a SemVer 1.0 stable release; the published package version remains the
consumer's compatibility boundary. ADR 0001 uses Stable as the required catalog maturity before the
release candidate.

## Recording maturity

Before component documentation exists, record non-default maturity in the master matrix Notes cell
as `Maturity: Preview`, `Maturity: Stable`, `Maturity: Deprecated`, or `Maturity: Removed`. Rows
without a label are Planned. A Removed label includes the removed version/surface and a migration or
replacement link. Because all 68 catalog components remain required for v1, removing a rejected
preview API does not remove its catalog obligation; the row must also identify the replacement work
and its current maturity. Once component documentation exists, display the same label and link its
evidence; the matrix remains the delivery tracker.

Any maturity change updates the matrix/component docs, changelog intent, and relevant release notes
together. A label is never inferred from an npm tag, merged pull request, exported symbol, or passing
demo alone.

## Promotion gates

### Planned → Preview

- The problem, dependency path, and chosen native directive/component/compound/service shape are
  recorded and approved against the accepted ADRs.
- The Definition of Ready and public API review are complete.
- Spec, Build, Tests, A11y, Docs, and Visual matrix evidence is complete, or any narrowly inapplicable
  cell is explicitly recorded.
- The intended entry point builds and packs without accidental exports or side effects.
- Accessibility, forms, customization, SSR/hydration, RTL, reduced motion, cleanup, and browser
  behavior have applicable evidence.
- Examples state the Preview label and current release channel.

The Done cell may be checked when the implementation Definition of Done is satisfied even while the
API remains Preview. Done does not silently promote compatibility maturity.

### Preview → Stable

- The component is Done with no unresolved critical/high defects or undocumented exceptions.
- API extraction/breaking-change review and all applicable compatibility, bundle, browser,
  accessibility, theme, and visual gates pass.
- Preview feedback is resolved or explicitly dispositioned, and the public API/dependency model is
  not expected to change before the next major boundary.
- Migration notes exist for any preview-era breaking changes.
- A maintainer explicitly approves and records the Stable promotion.

ADR 0001 requires every catalog component API reaching the release candidate to be Stable; rejected
preview API shapes must be explicitly Removed or replaced before that milestone. The build plan
still requires all 68 catalog component rows Done for the release candidate.

### Stable → Deprecated → Removed

- API review approves a replacement, reason, timing, and migration path.
- The [deprecation policy](deprecation-policy.md) transition and support window are complete.
- Removal updates exports, docs, examples, tests, matrix status, changelog, and packed-package
  verification together.

## Demotion and defects

Do not relabel a released Stable component as Preview to avoid compatibility obligations. Correct
defects through SemVer and deprecation. A severe issue may temporarily mark documentation as
Deprecated or unsupported for a specific version, but the emergency exception process still
applies.

Preview work may return to Planned when the public experiment is withdrawn. Record the reason and
migration for any published preview consumer, and remove the public export in the next prerelease
rather than leaving an abandoned surface.

## Primary references

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Changesets prereleases](https://changesets.dev/guide/prereleases)

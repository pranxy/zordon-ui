# Governance documentation research

## Question

What is the smallest complete governance documentation set for contributing to, reviewing the public API of, deprecating, and assigning maturity to this Angular component library?

## Intended output

- Contributor workflow grounded in actual repository commands and release intent.
- Public API review checklist tied to Angular Package Format and accepted ADRs.
- SemVer/deprecation lifecycle with migration and emergency-change rules.
- Component maturity levels tied to the plan matrix and npm release channels.

## Constraints and evidence bar

- Angular 21 library targeting Angular 21–22 consumers.
- daisyUI 5.7.16 and Tailwind CSS 4 peer contract.
- Existing ADRs, build plan, Changesets workflow, and protected OIDC release process are authoritative repository decisions.
- No new runtime APIs, code owners, issue templates, or external settings unless required by the plan item.
- Version-sensitive Angular/package claims require current first-party evidence.

## Search angles

- Current Angular library/public API and compatibility guidance.
- SemVer and npm deprecation behavior.
- Existing repository ADRs, testing gates, package layout, and release workflow.
- Maturity terminology that maps cleanly onto this repository's preview/stable release decisions.

## Sources and findings

- [Creating Angular libraries](https://angular.dev/tools/libraries/creating-libraries) and
  [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format): deliberate
  entry-point exports define the TypeScript package surface; published libraries use partial-Ivy,
  and consumers must use the same or newer Angular version than the build version.
- [Angular testing](https://angular.dev/guide/testing): `ng test` is the stable project interface;
  this repository's browser, SSR, accessibility, visual, and package gates are project policy rather
  than universal Angular mandates.
- [Semantic Versioning 2.0.0](https://semver.org/): versions below 1.0 do not claim a stable public
  API; after 1.0, compatible fixes/additions and incompatible changes map to patch/minor/major.
- [npm deprecate](https://docs.npmjs.com/cli/v11/commands/npm-deprecate/): registry deprecation
  applies to package versions/ranges, not component or source API maturity.
- [Changesets guidance](https://changesets.dev/guide/why): changesets record contributor release
  intent; the selected bump still requires review. The repository remains on Changesets 2.29.8, so
  no v3-next-only behavior is assumed.
- Repository audit: the plan/ADRs already define Ready/Done, public semantics/customization/forms/
  accessibility boundaries, actual CI commands, and the active
  `projects/components/src/public-api.ts`. Automated API extraction remains Phase 2 work.

## Synthesis

- Keep one canonical document per policy and one root contributor entry point; do not duplicate the
  68-row matrix or add these Markdown policies to the legacy documentation routes.
- Public API includes documented behavior, DOM/accessibility, forms, customization, lifecycle, and
  entry-point contracts in addition to TypeScript exports.
- Use Planned/Preview/Stable/Deprecated/Removed for catalog components. Keep experimental optional
  integrations such as Signal Forms isolated and governed separately; Stable remains repository
  maturity while the published package version is the SemVer boundary.
- Package channels (`next`, `alpha`, `beta`, `rc`, `latest`) and component maturity are orthogonal.
- Treat API review as manual today and name API extraction as a future gate rather than an existing
  command.

## State

Research, implementation, validation, and independent review complete.

# ADR 0006: Packaging, entry points, and public API

Status: Accepted  
Date: 2026-08-07

## Context

The library contains many independently useful components. Consumers need tree-shakeable imports without an unmaintainable set of packages.

## Decision

- Retain the package identity `@pranxy/zordon-ui` and Angular selector prefix `zd`.
- Publish one npm package in Angular Package Format, compiled with partial Ivy.
- Provide a primary entry point for shared providers, tokens, common types, and intentionally convenient stable exports.
- Provide component-oriented secondary entry points such as `@pranxy/zordon-ui/button` and `@pranxy/zordon-ui/modal`.
- Keep advanced behavior in its component entry point rather than creating separate npm packages. Styled/native and advanced variants must be separately importable when their dependency weight differs.
- Mark the package as side-effect free except for explicitly declared style or schematic assets.
- List Angular packages, Angular CDK, RxJS, Tailwind, and daisyUI as peer dependencies when used by published code or required consumer setup. Keep build tooling in workspace dev dependencies.
- Build with ng-packagr's production configuration and verify the packed tarball before publishing.
- Maintain one intentional `public-api.ts` per entry point. Deep imports into implementation files are unsupported.
- Add API extraction and breaking-change review before beta.
- Use semver, prerelease channels (`next`, `alpha`, `beta`, `rc`), generated changelogs, and migration notes.
- Add `ng add` installation setup and `ng update` migrations before v1.0, after the manual setup is stable.

## Consequences

- Consumers can import narrowly without managing dozens of packages.
- Entry points are a compatibility commitment and require individual build checks.
- The existing secondary entry points may be replaced rather than migrated if their APIs conflict with these decisions.

## Sources

- [Creating Angular libraries](https://angular.dev/tools/libraries/creating-libraries)

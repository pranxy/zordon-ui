# ADR 0001: Platform and compatibility policy

Status: Accepted  
Date: 2026-08-07

## Context

The library needs a clear minimum platform so its distributed Angular code can be consumed safely while still allowing current applications to upgrade. Angular documents that a consuming application must use the same or a newer Angular version than the version used to build a library.

## Decision

- Build and publish v1 with Angular 21 in partial-Ivy mode.
- Support consuming applications on Angular 21 and Angular 22: peer range `>=21.0.0 <23.0.0`.
- Test the lowest supported Angular major and the current supported major in CI.
- Use Node versions common to Angular 21 and 22 for development and CI: Node 22.22.3+ or Node 24.15.0+ within those major lines.
- Support RxJS 7.4 or later within major version 7.
- Target Tailwind CSS 4 and daisyUI 5. The initial compatibility floor is Tailwind `>=4.1 <5` and daisyUI `>=5.7.16 <6`.
- Follow Angular 21's Baseline browser set because Angular 21 is the minimum supported framework version.
- Feature-detect newer platform APIs such as Popover, anchor positioning, inert behavior, and advanced observers. Provide a tested fallback when the component's core behavior depends on them.
- Support both zone-based and zoneless Angular applications.
- Deliver all 68 catalog components before v1.0. Components may ship as preview APIs in alpha releases but must be stable or explicitly removed before the release candidate.

## Consequences

- Publishing from Angular 21 maximizes compatibility with Angular 21 and 22 consumers.
- Angular 22-only APIs cannot appear in the v1 core implementation.
- Browser support is a dated Baseline policy rather than a hand-maintained list of browser version numbers.
- The compatibility matrix must be reviewed for each Angular, Tailwind, or daisyUI major release.

## Sources

- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular library creation and compatibility](https://angular.dev/tools/libraries/creating-libraries)
- [daisyUI 5 and Tailwind CSS 4](https://daisyui.com/docs/v5/)

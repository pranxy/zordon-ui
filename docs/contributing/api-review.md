# Public API review

Public API review is required before adding or changing anything a package consumer can import,
configure, style through a promised hook, render against, or depend on behaviorally. Review happens
before a component is first published and again for every compatibility-relevant change.

## What is public

The review surface includes more than exported TypeScript declarations:

- package and secondary entry-point names, exports, peer dependencies, and setup requirements;
- selectors, host directives, inputs, models, outputs, methods, services, providers, tokens, public
  types, defaults, and error behavior;
- rendered native elements, required DOM relationships, ARIA behavior, data attributes, focus,
  keyboard interaction, and native events consumers may rely on;
- projected slots/parts, template contexts, content ownership, query/registration rules, and
  controlled/uncontrolled behavior;
- form value types, equality/serialization, ControlValueAccessor behavior, validation state, and
  disabled/read-only precedence;
- documented consumer classes, CSS variables, part directives, theme/prefix behavior, and other
  customization hooks;
- SSR output, hydration-stable IDs/state, localization, directionality, cleanup, and overlay
  lifecycle behavior;
- testing helpers and harnesses exported from `@pranxy/zordon-ui/testing`.

Implementation files, private classes, internal CDK abstractions, undocumented daisyUI internals,
and deep imports are not public. Accidental exposure is a defect, not a compatibility promise.

## Review record

The component specification or pull request must record:

1. **Scope:** new/changed/removed public surfaces and affected entry points.
2. **Maturity:** current and proposed maturity, plus the evidence for any promotion.
3. **Compatibility:** SemVer classification and whether a deprecation/migration path is required.
4. **Alternatives:** native directive, component, compound component, or service shape considered
   when that choice materially affects semantics or weight.
5. **Evidence:** tests, accessibility checks, packed exports, documentation, visual review, and
   compatibility results relevant to the change.

An ADR is required when the decision changes a shared convention, dependency boundary, supported
platform, package structure, or accessibility policy. Component-local details stay in the component
specification.

## Approval checklist

### Angular and API shape

- [ ] The lightest correct directive/component/compound/service shape follows ADR 0002 and preserves
      native semantics.
- [ ] Public state uses consistent signal inputs, outputs, or models; controlled ownership and event
      ordering are explicit.
- [ ] Defaults, nullability, coercion, invalid inputs, error behavior, and method timing are defined.
- [ ] Projected content, template context types, child registration, and declarative/programmatic
      parity are documented.
- [ ] Only APIs supported by the minimum Angular version appear in core public types/runtime code.

### Packaging and dependency boundaries

- [ ] The intended `public-api.ts` is the only export path; no implementation deep import is needed.
- [ ] The primary versus secondary entry-point choice follows ADR 0006 and the entry-point map.
- [ ] Experimental or optional dependencies do not leak into stable/core entry points.
- [ ] The entry point builds in partial-Ivy mode, remains side-effect free, and passes API extraction
      when that gate is available.
- [ ] Peer dependency and bundle-size effects are intentional, documented, and tested.

### Semantics, accessibility, and interaction

- [ ] Native element roles, names, descriptions, states, relationships, and form participation are
      preserved or the relevant WAI-ARIA pattern is implemented.
- [ ] Native HTML, `@angular/aria`, and Angular CDK were evaluated in that order; any custom
      keyboard, focus, selection, expansion, or typeahead implementation has a documented gap.
- [ ] Developer-preview Angular Aria declarations and types remain private, and the tested
      dependency range, SSR/hydration behavior, and bundle effect are recorded when used.
- [ ] Keyboard, focus entry/movement/restoration, pointer/touch, dismissal, and announcement
      behavior are specified.
- [ ] Disabled, read-only, loading, invalid, high-zoom, forced-colors, and reduced-motion behavior is
      defined where applicable.
- [ ] Consumer content/labeling responsibilities and library-owned WCAG 2.2 AA boundaries are clear.

### State, forms, and lifecycle

- [ ] Controlled state has one source of truth; any initial uncontrolled state cannot diverge from
      it.
- [ ] Value-bearing controls define value/equality/serialization, CVA callbacks, reset,
      programmatic writes, touched state, validation, and Angular-owned disabled state.
- [ ] Overlay, observer, timer, listener, object URL, and service-held instance cleanup is covered.
- [ ] SSR performs no browser-global/layout access, and initial IDs/state match during hydration.
- [ ] Localization and logical `start`/`end` direction behavior are injectable and tested where
      applicable.

### Customization and documentation

- [ ] daisyUI classes are the visual foundation; consumer classes/styles/data attributes are applied
      additively.
- [ ] Prefix, theme, CSS variable, and named-part behavior is explicit without promising daisyUI
      internals as Zordon UI API.
- [ ] Basic/advanced examples, anti-patterns, accessibility, forms, customization, SSR, and migration
      notes exist as applicable.
- [ ] Unit/integration/browser/accessibility/visual coverage proves the promised states and failure
      behavior.
- [ ] The build-plan matrix, maturity label, changelog intent, and documentation describe the same
      state.

## Compatibility decision

Classify the change using the [deprecation policy](deprecation-policy.md): compatible patch,
compatible feature/deprecation, or breaking change. A rename is not compatible merely because an
alias could be added; keep the old surface as deprecated when the policy requires a transition.

The reviewer outcome is one of:

- **Approved:** the public contract and evidence are complete for the proposed maturity.
- **Changes required:** named checklist items or compatibility gaps must close before export.
- **ADR required:** the choice crosses a shared architecture boundary.
- **Not public:** keep the implementation internal until the contract is ready.

Approval must name the reviewed entry points and maturity. It never implicitly approves unrelated
exports found in the same package.

Today this is a documented review gate. Automated API extraction and breaking-change detection are
planned in Phase 2 and must not be claimed as passing until that tooling exists. The active primary
entry file is `projects/components/src/public-api.ts`; the legacy file one directory above it is not
the package contract.

## Primary references

- [Creating Angular libraries](https://angular.dev/tools/libraries/creating-libraries)
- [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format)
- [Angular testing](https://angular.dev/guide/testing)

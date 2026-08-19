# Decomplex review: Angular 22 Signal Forms support plan

## Overall status

No potential complexity findings.

## Review contract

| Axis                          | Selection                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Mode                          | Prevention                                                                                                               |
| Target                        | `.plans/angular-22-signal-forms.md`                                                                                      |
| Authority / required behavior | User-requested Angular 22 plan; preserve Angular 21 core compatibility and provide an evidence-backed Signal Forms route |
| Scope                         | Proposed adapter, compatibility fixture, tests, packaging, and rollout gates                                             |
| Report                        | `.reviews/angular-22-signal-forms-decomplex.md`                                                                          |

## Coverage

### Inspected

- Direct native, CVA-compatibility, and signal-native routes in Angular 22's official Signal Forms
  contracts.
- Existing Angular 21–22 platform promise, CVA foundation, optional entry-point reservation, package
  budget, and CI structure.
- Every proposed task for speculative wrappers, duplicate state, premature exports, excessive
  compatibility machinery, and tests without distinct observable behavior.

### Skipped or partial

- Concrete component APIs do not yet exist, so no component-specific adapter design was reviewed.

## Potential findings

**No potential complexity findings.**

## Confirmed proportionate areas

- The plan prefers Angular 22's direct native and CVA paths before introducing any Zordon adapter.
- The `signal-forms` entry point remains absent unless a real component proves a capability gap.
- A capability gap does not pre-approve a same-package adapter; package ownership/versioning must be
  resolved before any Angular-22-only API is introduced.
- The isolated Angular 22 consumer is proportionate to the repository's existing two-major support
  promise and verifies the packed Angular 21 library at the actual consumer boundary.
- Component-specific value/focus/validation behavior remains blocked until real controls exist,
  avoiding a synthetic generic forms framework.

## Limitations

- The first real native and composite controls can reveal a concrete gap that requires a new focused
  complexity review.

# Form-control foundation research

## Scope

- Plan row: form control base behavior, touched state, disabled state, validation, and error IDs.
- Target: Angular 21–22, installed Angular Forms 21.2.19, stable typed Reactive Forms core.
- Constraint: no real Zordon form control is published yet; legacy controls do not define the API.
- Evidence bar: accepted ADRs, installed source, official Angular contracts, behavior-sensitive tests,
  SSR/hydration proof, and package/public-API inspection.

## Questions

1. Is any shared runtime base class, directive, token, or public API justified before the first control?
2. Which behavior belongs to native controls, Angular Forms, a future component, and field/error composition?
3. How must CVA callbacks behave for writes, reset, blur, update strategies, and disabled changes?
4. Which validation/error-display policy can be shared without owning consumer messages?
5. What evidence can truthfully complete this row now, and what must remain gated on real controls?

## Current evidence

- ADR 0005 keeps native controls native and requires CVA only for value-bearing composites.
- Angular Forms is authoritative for disabled state; validation messages remain consumer-owned.
- The installed/default third-party Angular behavior calls `setDisabledState` for both enabled and
  disabled setup states (`callSetDisabledState: 'always'`).
- Angular's CVA setup separates model-to-view `writeValue`, view-to-model `onChange`, blur/touch,
  and disabled callbacks. `updateOn: 'blur'|'submit'` is coordinated by Angular, not by the CVA.
- Angular documents dirty as user value modification and touched as blur/visit; async validation
  uses the separate pending state.
- Existing stable-ID and live-accessibility foundations already own deterministic error IDREF rules.

## Working hypothesis

Do not introduce a universal base class or public runtime API. Native directives should retain
Angular's built-in accessors, while each composite control implements the smallest typed CVA suited
to its value/equality model. Lock the shared ownership contract and real compatibility evidence now;
leave reusable code and final completion to the first concrete native and composite controls.

## Findings and decisions

- Confirmed Angular 21.2.19 calls the accessor's initial `writeValue`, then calls
  `setDisabledState(false|true)` under the default corrected configuration.
- Native styling directives must not provide `NG_VALUE_ACCESSOR`; a custom accessor would replace
  Angular's built-in IME and control-type-specific behavior.
- CVA is untyped and does not provide native `FormData`/autofill participation for composites.
- Angular owns dirty, touched, submitted, pending, validity, reset, and Forms-connected disabled
  state. The fixture reads and resets `FormGroupDirective.submitted` instead of duplicating it.
- `aria-invalid` eligibility is independent of whether consumer error content exists;
  `aria-errormessage` additionally requires a visible pertinent error.
- A test-only accessor now characterizes writes, user commits, blur/submit update strategies,
  nullable and disabled reset, enabled/disabled propagation, stale async-result cancellation, state
  classes, and destroy cleanup. It is not production code or an authoring template.
- The native SSR fixture uses Reactive Forms and proves deterministic initial state, submit/touch
  error eligibility, disabled cleanup, reset, stable relationships, hydration, and axe behavior.
- Dynamic `FormArray`, template-driven `NgModel`, real composite focus topology, native
  serialization/autofill, intrinsic validator changes, and component packaging remain first-control
  gates.

## Outcome

- Plan status: Partial.
- Runtime/public API: unchanged; no generic base or provider.
- Dependency/peer range: unchanged.
- Release intent: no Changeset because only repository docs and test/fixture code changed.
- First public native directive and composite control must repeat the documented full matrix.

## Primary sources

- https://angular.dev/api/forms/ControlValueAccessor
- https://angular.dev/api/forms/ReactiveFormsModule
- https://angular.dev/guide/forms/reactive-forms
- https://angular.dev/guide/forms/form-validation
- https://github.com/angular/angular/blob/main/packages/forms/src/directives/shared.ts

## Remaining gates

- One published native directive retaining the built-in accessor.
- One published composite CVA proving its concrete value, equality, focus, disabled, validation,
  SSR/hydration, serialization, and secondary-entry contracts.
- Template-driven, dynamic-array, supported-version, browser/autofill, and manual accessibility
  evidence on those real controls.

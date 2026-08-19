# Form-control behavior

This foundation defines how Zordon UI controls compose native HTML and Angular Forms. Typed
Reactive Forms are the stable v1 target; template-driven forms continue to work through the same
native accessors or `ControlValueAccessor` contract.

The current deliverable is a behavior contract plus compatibility evidence. It does not ship a
generic base class, value-accessor directive, validation registry, or field-state service. Those
abstractions would be premature before a real native control and a real composite control prove
which behavior is genuinely shared.

## Select the smallest integration

1. Keep an already-correct `input`, `textarea`, or `select` native and enhance it with a styling
   directive. Do not provide another value accessor. Angular's built-in accessors retain native
   value, checkbox, radio, range, select, multiple-select, number, and IME-composition behavior.
2. Use a component only when one semantic value requires coordinated child elements or interaction.
   That component implements `ControlValueAccessor` for its exact public value type and equality
   policy.
3. Implement `Validator` or `AsyncValidator` only when the component owns an intrinsic constraint
   that cannot remain an ordinary consumer validator. Return validation keys and data, never fixed
   English messages.
4. Keep field layout, labels, hints, error content, summaries, and submitted-state display policy in
   field/validator composition rather than in every value accessor.
5. Keep optional Signal Forms support in its separate adapter entry point until that API is stable.

Do not extend Angular's internal value-accessor base classes, replace `NgControl.valueAccessor`
behind a provider's back, or expose Angular Forms/CDK types through a generic Zordon base. Native
and composite controls have materially different value, focus, disabled, serialization, and reset
semantics.

## Value ownership

For a composite value accessor:

- `writeValue` is model-to-view only. Normalize the incoming value according to the component's
  documented type and update the view without calling the registered change or touch callbacks or
  emitting a public `valueChange`/semantic user event. A `model()` write can emit, so the first
  component must prove a separate non-emitting model-to-view path.
- `registerOnChange` and `registerOnTouched` replace the stored callbacks. They do not invoke them.
- Call the change callback exactly once for a semantic user value change, not for every internal DOM
  event and not for programmatic writes.
- Call the touch callback when the user leaves the logical control. Moving focus between internal
  elements of one composite does not touch it. A control without a blur boundary must define the
  equivalent completed-interaction event in its component specification.
- Let Angular implement `updateOn: 'change'`, `'blur'`, and `'submit'`. The accessor still reports
  the user change and logical blur at their real times; it must not buffer or commit a second model.
- Define nullability, reset normalization, equality, serialization, and mutable-value copying per
  component. A non-nullable consumer control does not make every possible CVA caller non-nullable.
- Preserve native event behavior. Higher-level outputs may describe a semantic transition but must
  not duplicate the CVA callback or replace ordinary input/change events without a documented gap.

Angular marks a Reactive Forms control dirty when it commits a reported user change. A value
accessor must not call `markAsDirty`, `markAsTouched`, `setValue`, `disable`, or validator methods on
the consumer's `AbstractControl` to manufacture state.

`ControlValueAccessor` is itself untyped. A `FormControl<T>` therefore does not statically prove
that a custom accessor emits `T`. Every component needs a typed public value API/type test plus
runtime Forms tests; CVA conformance alone is not end-to-end type safety.

## Interaction and display state

The states have separate owners and meanings:

- **pristine/dirty** — Angular Forms derives this from reported user value changes. A programmatic
  write or reset is not a user edit.
- **untouched/touched** — Angular Forms derives this from the accessor's logical blur callback or a
  consumer's explicit `markAsTouched` operation. Touch does not require a value change.
- **submitted** — the enclosing `FormGroupDirective` or `NgForm` owns this state. Angular applies
  `ng-submitted` to the form, not each control. Field/error composition may observe the enclosing
  form; a CVA must not invent its own submitted flag.
- **pending** — Angular validators own this state while asynchronous validation is unresolved.
  Pending is neither valid nor invalid feedback and must have its own visual/status treatment.
- **valid/invalid** — the Angular control and its validators own the result. A view component renders
  it; it does not maintain a competing validity model.

The default field policy shows consumer-provided error content when the control is invalid and is
touched or the containing form has been submitted. A concrete field may offer a documented policy
that also uses dirty or always-visible feedback, but a generic foundation does not hard-code one
policy into every accessor. Reset must restore the corresponding Angular state and hide feedback
that is no longer eligible.

## Disabled and readonly

Angular Forms is authoritative whenever a control is attached to it. Installed Angular 21.2.19
uses the corrected setup behavior that calls `setDisabledState` for both enabled and disabled
states, then calls it for later status changes.

- Native directives leave disabled propagation to Angular's built-in accessor and the native
  `disabled` property.
- A composite `setDisabledState` updates every interactive child and blocks user-originated value
  and touch callbacks. It must also remove the composite from the appropriate tab order and prevent
  pointer/keyboard activation without relying on `aria-disabled` alone.
- A standalone `disabled` input may exist for use without Angular Forms. When a Forms directive is
  attached, its state wins; binding a competing local disabled owner is unsupported. The first
  component must prove how it detects that boundary without a dependency-injection cycle.
- Angular-disabled controls are excluded from an enabled form group's ordinary value. Consumers use
  `getRawValue()` when they intentionally need disabled values. A composite CVA is not automatically
  a native successful form control: `name`, internal/hidden serialization, native `FormData`, and
  disabled serialization behavior are component-specific contracts.
- Readonly is distinct: it keeps applicable controls focusable and submitted while preventing value
  edits. Do not map readonly to `setDisabledState`, and do not claim it for controls whose native or
  composite interaction has no coherent readonly meaning.
- A disabled fieldset/group may add native group behavior, but it must not create a second
  independent disabled state for a child attached to Angular Forms.

## Validation and accessible errors

Consumer validators remain on the `FormControl`, `FormGroup`, or `FormArray`. Component-owned
validators are limited to intrinsic constraints such as a composite value that cannot represent an
invalid internal shape. Dynamic validator inputs call the registered validator-change callback;
they do not mutate the consumer's validator list directly.

Validation messages are projected or otherwise consumer-owned and localizable. Zordon may expose
the current error data and state needed to select content, but it does not translate arbitrary
validation keys into fixed strings.

Follow the [live accessibility contract](live-announcements-and-descriptions.md):

- preserve consumer `aria-describedby` IDs first and append deterministic owned hint IDs;
- generate missing owned IDs through `ZdIdGenerator`;
- expose `aria-invalid="true"` when invalid feedback is eligible under the component's documented
  display policy, even if the consumer supplied no error content;
- add `aria-errormessage` only while a currently visible, pertinent error exists;
- remove only owned relationships when the control becomes valid, disabled, pending, reset, or the
  error content disappears;
- do not universally duplicate the error ID in both `aria-errormessage` and `aria-describedby`;
- use explicit IDs across independently hydrated defer boundaries.

Native constraint attributes remain native where they describe the element. Angular validators
and browser constraint validation are separate mechanisms; a component must document which one its
API configures instead of assuming one automatically mirrors the other.

## Lifecycle, SSR, and hydration

Server and client start with the same value, disabled state, validation eligibility, visible error
content, IDs, and relationships. A server render does not infer that a control was touched or a form
was submitted. Browser-only autofill, focus, composition, selection, and file values are reconciled
through native/Angular behavior after hydration, not read during server rendering.

Destroying and recreating a control must unregister Forms callbacks and validators. Dynamic
`FormArray` rows must not retain prior component instances, stale IDs, subscriptions, or error
relationships.

## Required proof with the first controls

Before this foundation becomes complete, at least one native directive and one composite CVA must
prove:

- standalone `FormControl`, typed `FormGroup`, and dynamic `FormArray` use;
- template-driven `NgModel` compatibility through the same accessor contract;
- programmatic writes, user changes, reset, nullability, equality, and no callback loops;
- change, blur, and submit update strategies;
- logical touch across internal focus moves;
- initial enabled/disabled setup, later Forms-owned transitions, standalone disabled use, and
  readonly distinction;
- pristine/dirty, untouched/touched, submitted, pending, valid, and invalid rendering;
- synchronous and asynchronous consumer validators plus any intrinsic validator;
- stable hint/error IDs, dynamic consumer IDREF composition, reset/disabled cleanup, and consumer
  message ownership;
- native submission and autofill where applicable;
- deterministic SSR, clean hydration, destruction/recreation, and event-replay behavior;
- typed declarations, tree shaking, secondary-entry packaging, and no accidental Forms types in
  unrelated entry points.

The current test-only accessor fixture characterizes Angular's integration pipeline. It is not a
recommended base implementation and cannot close these component-specific gates.

## References

- [Angular `ControlValueAccessor`](https://angular.dev/api/forms/ControlValueAccessor)
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular form validation](https://angular.dev/guide/forms/form-validation)
- [Angular `ReactiveFormsModule` configuration](https://angular.dev/api/forms/ReactiveFormsModule)
- [WAI form validation guidance](https://www.w3.org/WAI/tutorials/forms/validation/)

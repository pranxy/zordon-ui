# Async action foundation research

## Question

What shared action-state and cancellation contract should Zordon UI establish before ACT-01 Button and later form, overlay, and feedback components exist?

## Intended output

- A version-matched, source-backed foundation contract.
- The smallest behavior-sensitive evidence that can be justified without publishing a generic task framework.
- A truthful plan/package/Changeset status and explicit first-consumer exit gates.

## Constraints and evidence bar

- Current supported framework line is Angular 21–22; the installed workspace is authoritative for local behavior.
- Prefer native events, platform cancellation, Angular primitives, and existing component ownership over new services.
- Do not base the public design on legacy component folders.
- Distinguish observable cancellation from merely ignoring a stale completion.
- Preserve native button, link, and form submission semantics.
- SSR must not execute browser/user actions on the server; hydration and event replay must not duplicate an action.
- Primary sources and installed source are required for behavior-sensitive claims.

## Research angles

- Native button disabled and form-submit behavior; `aria-disabled` ownership.
- Angular output/event replay and destroy cleanup behavior.
- `AbortController`/`AbortSignal`, Promise, and Observable cancellation boundaries.
- daisyUI Button loading/disabled presentation versus behavior.
- Accessible pending names, `aria-busy`, status announcements, focus retention, and reduced motion.
- Concurrency policies: ignore, replace/cancel, queue, and parallel.
- Error propagation, stale completion, retries, and teardown.
- Package/public API impact and first-consumer proof gates.

## Sources and findings

- Installed workspace: Angular core/forms 21.2.19, CDK 21.2.14, RxJS 7.8, and daisyUI 5.7.16.
- Angular `OutputEmitterRef.emit()` returns `void`; an output is a notification and cannot be used as
  an awaitable callback protocol. Source: https://angular.dev/guide/components/outputs
- Angular event replay captures native events before hydration and re-invokes them afterwards. The
  action owner therefore needs the same synchronous guard for replayed and ordinary activation.
  Source: https://angular.dev/guide/hydration#capturing-and-replaying-events
- Angular's error guidance keeps recoverable error handling at the callsite and reserves the root
  `ErrorHandler` for unexpected errors. Source: https://angular.dev/best-practices/error-handling
- The HTML Standard makes native disabled form controls prevent queued user click dispatch and bars
  them from constraint validation; this behavior is broader than presentation.
  Source: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute
- WAI-ARIA defines `aria-disabled` as a perceivable inoperable state but does not implement the
  suppression; `aria-busy` lets assistive technology defer owned content changes and is not a
  disabled or announcement mechanism. Sources: https://www.w3.org/TR/wai-aria-1.2/#aria-disabled
  and https://www.w3.org/TR/wai-aria-1.2/#aria-busy
- DOM abort is cooperative: the signal records a reason and invokes abort steps, while an observing
  API can ignore an abort after completion. Source: https://dom.spec.whatwg.org/#abortcontroller
- RxJS unsubscription disposes one Observable execution according to the source's teardown; it does
  not universally prove an external side effect was rolled back.
  Source: https://rxjs.dev/guide/observable#disposing-observable-executions
- daisyUI 5.7.16 Button has disabled presentation but no loading modifier. Loading is a separate
  component; legacy `.loading` Button examples in the repository are stale. The installed Button
  disabled selector uses CSS/pointer events and cannot replace native/application activation guards.
- A form-level guard is required because Enter, `requestSubmit()`, alternate submitters, and
  programmatic workflow calls are not owned by one Button.
- Client single-flight behavior is a UX/race invariant, not server idempotency or authorization.

## Conflicts / rejected approaches

- Rejected `action: () => Promise|Observable` on Button: it duplicates native events, treats inputs
  as callbacks, and freezes an async type/protocol before a real component exists.
- Rejected an output-listener return convention: Angular discards output handler return values.
- Rejected a generic public/private action runner or state union: Button, forms, overlays, search,
  uploads, and queues have different ownership, concurrency, error, and result contracts.
- Rejected mapping every pending state to native disabled: it can remove focus and changes form
  behavior. `aria-disabled` also cannot stand alone because it does not suppress activation.
- Rejected claiming abort from stale-result suppression or component destruction: ignored results
  can coexist with continuing external work.
- Rejected arbitrary timers/network calls in tests. Controllable deferred operations make the
  duplicate, abort, stale completion/finally, failure, retry, form, and cleanup oracles deterministic.

## Synthesis decisions

- Ship documentation and test-only browser/SSR characterization, with no library runtime or public
  API change.
- Consumer/application work owns pending, failure, cancellation, and server idempotency. A future
  component-owned workflow may define an explicit typed operation only when its lifecycle requires it.
- Single-flight is the ACT-01 starting convention, while replace, queue, and parallel remain explicit
  component/workflow policies.
- Cancellation request and invocation identity are both required for replace-latest: stale success,
  error, and `finally` cannot update or clear a newer operation.
- Pending, disabled, Forms validation pending, loading content, and closing remain distinct states.
- Keep the master row and tracker Partial until ACT-01 proves the public API, native/form behavior,
  package path, pre-hydration event replay, manual assistive technology, and supported-version lanes.
- No Changeset: repository docs and dev/test fixtures do not change the packed library.

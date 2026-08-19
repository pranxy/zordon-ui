# Async actions

This foundation defines pending, concurrency, cancellation, completion, and error ownership for
user-initiated asynchronous work. It applies to Button, form submission, dialog confirmation,
toast promise flows, uploads, and other component-specific actions.

The current deliverable is a contract plus compatibility evidence. It does not ship a generic task
runner, `action: () => Promise` input, cancellation service, or public async-state union. ACT-01
Button is the first component that can prove the real activation, form, accessibility, SSR, and
package boundary.

## Keep operation ownership explicit

An Angular output is a notification, not an awaitable callback. `output().emit()` returns `void`,
and a native `click` listener's return value is not a task contract. A Button directive therefore
cannot discover when consumer work starts, settles, fails, or supports cancellation.

Use one of these ownership shapes:

1. **Controlled presentation.** A native action element preserves `click`, `submit`, navigation,
   and keyboard behavior. The consumer owns the operation and binds a pending/loading input that
   only changes presentation and activation policy documented by that component.
2. **Component-owned workflow.** A service-backed or compound workflow may explicitly accept an
   operation in its own typed API when it must coordinate guards, close lifecycle, progress, or a
   result. The owning component then handles every synchronous throw, rejection, cancellation,
   stale result, and destruction path.
3. **Framework-owned workflow.** Angular Forms submission, Router navigation, `resource`, or another
   framework facility remains the state owner when it already exposes pending/error/cancellation
   behavior. Zordon observes that public state; it does not wrap it in a competing task model.

Do not add a generic callback input to Button merely so the library can await it. Inputs describe
state and configuration; native events and higher-level outputs remain observable notifications.
Do not accept both a callback input and a normal native/output handler for the same activation.

## Operation lifecycle

Every component that owns work defines one internal operation identity and these observable phases:

- **idle** — no owned operation is active;
- **pending** — one or more owned operations are unresolved according to the component's concurrency
  policy;
- **settled** — the current operation completed, failed, or acknowledged cancellation and the
  component has reached its documented stable state.

Success, error, and cancelled are outcomes, not automatically persistent visual modes. A concrete
component decides whether an outcome remains visible, resets to idle, closes, navigates, or enables
retry. It must not use one boolean to mean disabled, pending, validation pending, closing, and
loading content.

For each accepted activation:

1. capture a unique operation identity before invoking consumer/application work;
2. publish pending state before another activation can be accepted;
3. handle synchronous throws and asynchronous rejection through the same owner;
4. commit completion or error only when that operation is still current;
5. release pending state exactly once on every terminal path; and
6. dispose timers, subscriptions, listeners, abort controllers, and retained consumer references.

Do not call asynchronous work from a template expression, computed signal, render hook that can run
again, or an `effect` whose dependency changes can accidentally restart it. User work begins from an
explicit event or documented imperative method.

## Choose concurrency per component

The component specification selects one policy and exposes it only when consumers genuinely need a
choice:

| Policy               | Meaning                                                                                           | Typical use                                     |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Ignore while pending | The first accepted activation owns the operation; later activations are rejected until it settles | Save, destructive confirmation, form submission |
| Replace latest       | A new activation requests cancellation of the previous operation and becomes current              | Search, preview, remote filtering               |
| Queue                | Activations run in order and each gets a result                                                   | Explicit command or upload queues               |
| Parallel             | Multiple operations run independently and pending derives from the active count                   | Independent item actions                        |

Ignore-while-pending is the safe starting policy for a single commit action, but it is not a
catalog-wide default. Queue and parallel modes need bounded retention, stable item identity, error
policy, and cleanup. Replace-latest needs both a cancellation request and a stale-result guard.

One physical activation produces at most one accepted operation. Pointer, keyboard, native form
submission, programmatic submission, hydration event replay, and component methods must converge on
the same guard. Debounce is a timing policy, not duplicate protection, and is inappropriate for
ordinary buttons unless the component's domain specifically requires it.

Client-side suppression is not server idempotency. Mutating network operations still require the
application/server to use an idempotency key, conditional request, transaction, or equivalent
domain guarantee where duplicate requests would be harmful.

## Cancellation and stale results are different

Cancellation is cooperative:

- `AbortController.abort(reason)` signals intent; only work that observes the signal is cancelled;
- a plain Promise has no cancellation protocol;
- unsubscribing an Observable stops notifications and runs its teardown, but only that source's
  implementation determines whether underlying work is actually cancelled; and
- closing, navigation, replacement, timeout, or destruction may request cancellation without
  proving the external side effect was rolled back.

Never describe an operation as cancelled merely because its eventual result was ignored. Use an
operation identity/generation check even when an abort signal exists: upstream work can ignore the
signal, settle concurrently, or have completed its external side effect already. A stale success or
error must not overwrite the current operation's pending state, content, validation, toast, or
overlay lifecycle.

An owning component creates an `AbortController` only for an API that accepts its signal. Pass the
signal down rather than exposing the controller. On replace or destroy, abort once and release all
owned listeners/subscriptions. Treat an expected acknowledged abort separately from a failure; do
not show a generic error or forward it as an unexpected application error.

## Completion and error ownership

The callsite that starts the operation has the context needed to handle its expected failure.
Recoverable failures become component/application state, visible localizable content, or a typed
workflow result. Unexpected programming or infrastructure failures remain visible to the
application's error reporting; do not silently catch and discard them.

Component outputs remain typed notifications such as an accepted request, completion, cancellation,
or a high-level state transition. They are not RxJS error channels, and emitting one does not replace
native `click` or `submit`. Avoid emitting both a generic state change and multiple outcome outputs
for one transition unless each has a distinct documented consumer.

Retries are new operation identities. The component defines whether a retry clears the previous
error immediately, retains context while pending, and reuses a server idempotency key. Automatic
retry, backoff, timeout, offline recovery, and persistence are domain policies, not Button defaults.

## Pending is not disabled

`disabled`, `aria-disabled`, and pending communicate different things:

- Native `disabled` prevents user click dispatch on a form control, removes it from normal focus
  navigation, bars constraint validation, and changes form behavior. Use it when the control is
  genuinely unavailable, including when Forms owns disabled state.
- `aria-disabled="true"` exposes an operability state but does not suppress native keyboard,
  pointer, programmatic activation, form submission, or navigation. The component must guard every
  activation path itself.
- Pending says work is in progress. It may temporarily reject another activation while keeping the
  current control focusable, or it may coexist with a separate Cancel action.

Do not universally map pending to native disabled. Removing the focused trigger can strand focus,
hide an available cancellation path, and prevent consumers from inspecting its status. Conversely,
do not use only `aria-disabled` or daisyUI's disabled styling as a behavioral guard. daisyUI 5.7.16
applies pointer-event and visual rules for `.btn-disabled`/`[aria-disabled="true"]`; it does not
implement keyboard, programmatic, form, or application-level suppression.

A submit action is owned at the form's submit boundary, not only at one button. Enter from a field,
`requestSubmit()`, another submitter, and replayed submit/click events can bypass a button-only guard.
Preserve constraint validation and `SubmitEvent.submitter`; call `preventDefault()` only when the
application intentionally replaces native submission. Angular Reactive Forms pending validation is
also separate from an action's network pending state.

Links remain links. An anchor has no native disabled state; if a workflow temporarily blocks
navigation, it needs an explicit, keyboard-complete, focus-aware contract. Do not remove `href` or
substitute a button without matching the intended navigation semantics.

## Accessible pending and feedback

Pending must remain understandable without spinner motion, color, or a disabled cursor:

- keep the action's accessible name stable when possible, or replace it with a complete localizable
  name such as “Saving account” rather than an unlabeled spinner;
- mark a purely decorative spinner `aria-hidden="true"` and expose static pending text/state;
- use `aria-busy` on the region whose owned content is being updated when assistive technology
  should defer those updates, not automatically on every button;
- retain focus unless the accepted workflow deliberately opens, closes, or navigates to a new
  context;
- announce one meaningful completion/error path through the
  [live accessibility contract](live-announcements-and-descriptions.md), not both a local status and
  an imperative duplicate; and
- follow the [reduced-motion contract](reduced-motion.md). daisyUI's Loading mask can continue
  moving more slowly under reduced motion, so it cannot be the only pending cue.

Frequent progress values are throttled to meaningful milestones. A cancel action has its own name,
focus behavior, operability, and outcome. Failure content stays discoverable and retryable according
to the workflow instead of disappearing on a short timer.

## SSR, hydration, and destruction

Server rendering never starts a user action, subscribes to browser work, creates an abort controller
for a future click, or guesses a client-only pending state. Server and client render the same
controlled initial text, operability, IDs, and ARIA. If the application already knows an operation
is pending from transferred state, that state needs one explicit owner and deterministic markup.

Angular event replay re-invokes captured native events after hydration. Each replayed event is a real
activation and enters the same synchronous concurrency guard as a post-hydration event. Do not add a
second “hydrated click” path or start work from `afterNextRender`. A component must prove that a
captured activation starts once, rapid captured/ordinary activations follow its policy, and pending
work does not delay application stability indefinitely.

On destroy, an owning component requests cancellation where supported, unsubscribes, invalidates the
current identity, and releases references. Later completion/rejection cannot update destroyed state
or emit outputs. A controlled-presentation Button owns no consumer task and therefore must not abort
consumer work merely because the directive is destroyed.

## First-consumer verification

ACT-01 Button and every later owner of asynchronous work must add behavior-sensitive checks for its
chosen policy:

1. native pointer and keyboard activation plus preserved `click`/`submit` behavior;
2. synchronous pending publication and rapid duplicate activation;
3. success, synchronous throw, rejection, retry, and terminal cleanup;
4. replacement/abort races where a stale success and stale failure arrive after the next operation;
5. destruction while pending with no later state write, output, timer, subscription, or retained
   consumer reference;
6. native disabled, Forms-disabled, `aria-disabled`, pending, and cancel behavior as distinct states;
7. accessible name, focus retention, busy/status/error semantics, reduced motion, and manual
   NVDA/VoiceOver verification;
8. real form Enter, alternate submitter, `requestSubmit()`, validation, reset, and server-side
   idempotency guidance where applicable;
9. deterministic SSR HTML, clean hydration, pre-hydration event replay, and exactly one accepted
   operation; and
10. package/type/bundle checks for the concrete API, without exposing Promise/Observable/CDK types
    unless that component intentionally owns them.

Use controllable deferred work in tests rather than arbitrary sleeps. Assert rendered state and
bounded side effects, then prove the duplicate/stale/cleanup oracle rejects a known-bad mutation.
Browser automation cannot prove server idempotency or spoken announcements; those need integration
and manual evidence at the consuming workflow.

## Current proof boundary

The shared fixture characterizes native activation, synchronous duplicate suppression, focusable
pending semantics, cooperative abort, stale-result rejection, terminal cleanup, and deterministic
SSR/hydration markup. It is not a production helper or proof of ACT-01's API, form integration,
event-replay timing, server idempotency, manual assistive-technology behavior, or package path.

This row remains Partial until the first published action component repeats the matrix through its
real public API and secondary entry point.

## References

- [Angular custom events with outputs](https://angular.dev/guide/components/outputs)
- [Angular hydration and event replay](https://angular.dev/guide/hydration#capturing-and-replaying-events)
- [Angular unhandled error guidance](https://angular.dev/best-practices/error-handling)
- [HTML button element](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
- [HTML disabled form controls](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute)
- [DOM abort APIs](https://dom.spec.whatwg.org/#aborting-ongoing-activities)
- [WAI-ARIA `aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- [WAI-ARIA `aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- [RxJS observable disposal](https://rxjs.dev/guide/observable#disposing-observable-executions)
- [daisyUI Button](https://daisyui.com/components/button/)
- [daisyUI Loading](https://daisyui.com/components/loading/)

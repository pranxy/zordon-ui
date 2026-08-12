# Dismissal and outside-interaction foundation

Zordon UI uses native close-request behavior and public Angular CDK Overlay event streams. It does
not ship a second document dispatcher or expose CDK event types. This contract standardizes
dismissal policy now; the next overlay-stack foundation will implement atomic top-surface routing.

This contract implements [ADR 0004](../architecture/0004-overlays-and-angular-cdk.md),
[ADR 0007](../architecture/0007-accessibility-ssr-and-localization.md), and
[ADR 0008](../architecture/0008-angular-aria.md).

## Selection order

1. Use the native element's close-request behavior when it matches the component.
2. For a CDK portal, consume public `OverlayRef.keydownEvents()`,
   `OverlayRef.outsidePointerEvents()`, and `OverlayRef.backdropClick()` inside the private Zordon
   overlay lifecycle.
3. Do not inject CDK dispatcher services into components and do not add per-component
   `document:click` or `window:keydown` listeners.
4. Keep dismissal reasons distinct: `escape`, `outside-pointer`, and `backdrop` are separate from
   trigger, selection, navigation, programmatic, and destroy reasons accepted by ADR 0004.

Zordon public inputs, outputs, and close events must use Zordon-owned types. Never expose or
re-export `OverlayRef`, `OverlayKeyboardDispatcher`, `OverlayOutsideClickDispatcher`, or CDK event
types.

## Native elements

### Dialog

A modal `<dialog>` receives platform close requests through its cancelable, non-bubbling `cancel`
event. Use that event instead of a document Escape listener. An uncontrolled dialog may allow the
native default. A controlled dialog must call `preventDefault()` immediately and route the request
through its Zordon state and close guard before changing native state.

Escape is part of the modal-dialog keyboard pattern, but it is not the only exit. Keep a visible,
focusable close or cancel control. Backdrop activation is a separate component policy and must not
be inferred from the `cancel` event.

### Popover

An `auto` popover already provides top-layer light dismissal for outside activation and Escape,
including native nesting rules. Use it only when the component can synchronize controlled state,
guards, focus, and `beforetoggle`/`toggle` behavior with the browser. Do not layer CDK outside or
Escape dispatch over the same native light-dismiss policy. `manual` popovers require explicit
dismissal ownership.

## CDK event behavior

`OverlayRef.attach()` registers the ref with shared root dispatchers; `detach()` and `dispose()`
remove it. Component code subscribes to the ref's public observables and ties subscriptions to the
overlay lifecycle. It does not call dispatcher `add`, `remove`, or `detach` itself.

### Keyboard dispatch

Installed CDK 21.2.14 listens for bubbling `keydown` on `body`, visits attached refs newest-first,
and emits to the first ref that has an observer and passes its optional
`OverlayConfig.eventPredicate`. An interactive top ref therefore remains subscribed while opening,
open, and visibly closing—even when Escape dismissal is disabled—so a lower ref cannot receive the
key through the gap.

The Zordon Escape classifier accepts only:

- `event.key === 'Escape'`;
- no Alt, Control, Meta, or Shift modifier;
- `defaultPrevented === false`;
- `isComposing === false`; and
- `repeat === false`.

An inner widget gets first refusal: it may call `preventDefault()` or stop bubbling before `body`
when Escape belongs to its own interaction. Once Zordon accepts Escape, it calls `preventDefault()`
and emits at most one close request; it generally does not stop propagation. Ignoring repeat avoids
a held key closing a child and then its parent. A fresh key press may dismiss the next surface.

`CdkConnectedOverlay` and CDK Dialog have their own narrower unmodified-Escape auto-close behavior.
When Zordon needs close guards, composition/repeat handling, lifecycle reasons, or atomic stack
ownership, disable directive auto-close or use the private `OverlayRef` lifecycle instead.

### Outside dispatch

Installed CDK listens in capture phase on `body` for `pointerdown`, `click`, `auxclick`, and
`contextmenu`. The public outside stream emits the latter three as `MouseEvent`; it is not a raw
pointerdown stream. For a normal click, both the pointer-down origin and click target must be
outside. Starting or ending inside the pane therefore does not dismiss during a drag across its
boundary.

Outside dismissal must not call `preventDefault()` or stop propagation. The user's intended outside
target still activates. Descendant bubble-phase `stopPropagation()` is not an opt-out because CDK
observes outside interaction in capture phase; register the element as a logical inside boundary
instead.

The logical inside boundary includes:

- the overlay pane;
- its trigger/origin;
- explicitly registered safe elements; and
- panes owned by child overlays.

CDK pane containment follows composed event targets through open Shadow DOM. Raw
`CdkConnectedOverlay` origin exclusion uses ordinary `contains`, so the future Zordon boundary must
use the composed path for shadow-hosted origins. Events inside an iframe do not reach the parent
document and are outside this guarantee.

## Why the overlay stack still owns arbitration

Keyboard dispatch selects one subscriber, but outside dispatch does not. An event outside every pane
can notify several attached refs from newest to oldest. A ref without an outside observer can also
fail to shield a lower parent. Closing the child synchronously can make a naive dynamic “is top”
check admit the same physical event to the parent.

The next private overlay-stack foundation must therefore:

- atomically claim each physical event for one highest participating surface before state changes;
- keep dismissal-disabled and visibly closing interactive surfaces registered as shields;
- model logical parents, origins, safe elements, child panes, and channel participation;
- emit one reason once and gate duplicate requests during closing;
- classify a backdrop click once as `backdrop`, not both backdrop and outside-pointer; and
- deregister on detach, dispose, navigation, destroy, and error paths without retaining components.

Clicking inside a child closes nothing. Clicking parent content while a child is open may dismiss the
child only. Clicking outside an entire nested stack produces at most one request for the top eligible
surface; a second physical event may reach the parent. A component-specific menu “close all” policy
is explicit rather than a generic cascade.

## SSR and hydration

Server output contains stable trigger/content relationships but no attached CDK overlay or global
listener. Do not attach an `OverlayRef` or call dispatcher registration during SSR. Browser behavior
starts after hydration through the owning component lifecycle.

The first real consumer must prove that a user or replayed opening interaction attaches once, is not
reclassified as outside, dismisses once, cleans up on every exit, and produces no hydration errors.
JavaScript-disabled output remains meaningful. CDK dispatch is scoped to one Angular root
injector/document; multiple Angular applications and cross-document iframe coordination require an
explicit bridge and are not covered by this contract.

## Required tests

The compatibility fixture pins installed upstream behavior. Each real dismissible component must
also prove its own policy in a browser:

- inside, origin, safe-element, child-pane, and outside boundaries;
- pointer-down/click cross-boundary handling and uninterrupted outside actions;
- newest eligible Escape ownership, descendant veto, modifiers, composition, repeat, and fresh keys;
- disabled/guarded and closing surfaces shielding parents;
- atomic one-event/one-reason behavior for nested panes and backdrops;
- detach/reattach/dispose/navigation cleanup without duplicate delivery;
- native dialog `cancel` prevention when the component is controlled; and
- SSR/hydration attachment and replay behavior for the first consumer.

Chromium automation does not establish touch-generated click behavior, assistive-technology
interaction, closed Shadow DOM, iframe bridging, or mobile browser behavior. Keep those as explicit
component/release gates.

## References

- [Angular CDK Overlay API](https://material.angular.dev/cdk/overlay/api)
- [MDN `KeyboardEvent.key`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key)
- [MDN `KeyboardEvent.isComposing`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/isComposing)
- [MDN dialog `cancel` event](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event)
- [MDN popover attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/popover)
- [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

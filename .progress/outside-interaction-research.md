# Outside interaction and Escape dispatch research

Updated: 2026-08-11

## Question and constraints

Define the smallest shared contract for outside pointer interaction and Escape-key dispatch in Zordon
UI without duplicating Angular CDK, shipping a premature global listener, or stealing responsibility
from the still-pending overlay stack.

## Evidence bar

- Accepted overlay, Angular Aria, accessibility, SSR, packaging, and public-API ADRs.
- Official Angular/CDK documentation plus installed `@angular/cdk` 21.2.14 behavior and source.
- Observable Angular/browser tests for event ordering, containment, top-layer ownership, cleanup, and
  keyboard cancellation.
- Explicit SSR/hydration, Shadow DOM, iframe, nested-overlay, and native-control boundaries.

## Open questions

1. Which public CDK declarations already dispatch outside pointer and keyboard events?
2. Does this row justify a production Zordon abstraction before the overlay host/stack exists?
3. Which event phase and event type preserve trigger clicks, drag/release behavior, and nested layers?
4. How must Escape handle `defaultPrevented`, propagation, repeat, modifiers, composition, and editable
   targets?
5. How are only the top eligible surface, child overlays, and logical inside elements coordinated?
6. What cleanup and SSR/hydration behavior can be proven before the first real overlay component?

## Initial repository evidence

- ADR 0004 assigns outside interaction, Escape, nesting, and cleanup to shared private overlay
  infrastructure built on Angular CDK.
- The overlay host, stack, positioning, and scroll-strategy row remains pending immediately after this
  row, so a dispatcher that cannot yet coordinate a real stack would be premature.
- `@angular/cdk` is already a required peer/workspace dependency. No additional dependency is needed.
- The completed focus foundation similarly standardizes supported CDK composition without exporting a
  wrapper before a real overlay lifecycle supplies a gap.

## Installed CDK 21.2.14 findings

- `OverlayRef.outsidePointerEvents()` and `OverlayRef.keydownEvents()` are public observables backed
  by root `OverlayOutsideClickDispatcher` and `OverlayKeyboardDispatcher` services. An `OverlayRef`
  joins both dispatcher stacks only while attached and is removed on detach/dispose.
- The outside dispatcher listens in capture phase on `body` for `pointerdown`, `click`, `auxclick`,
  and `contextmenu`. For ordinary clicks, both pointer-down origin and click target must be outside;
  starting or ending inside the overlay is not considered an outside interaction.
- Outside containment follows parent nodes through ShadowRoot hosts. Browser events inside a separate
  iframe document cannot reach the parent document dispatcher.
- Outside dispatch walks attached overlays newest-first. Entering a higher pane stops dispatch to
  lower panes, but an interaction outside every pane can notify multiple overlays. CDK alone does not
  enforce ADR 0004's top-eligible-only dismissal policy.
- Keyboard dispatch listens for bubbling `keydown` on `body`, walks newest-first, and emits to only
  the first subscribed eligible overlay. A nested widget can keep an owned key from the dispatcher by
  stopping propagation before `body`.
- Public `OverlayConfig.eventPredicate` can dynamically reject an event and let dispatch continue to
  the next overlay. The future Zordon stack can use that hook to select the top eligible surface;
  component code should subscribe to `OverlayRef` streams rather than inject dispatcher services.
- CDK emits events; it does not define Zordon dismissal reasons or guards. `CdkConnectedOverlay`
  applies its own unmodified-Escape auto-detach and excludes its origin from `overlayOutsideClick`,
  while CDK Dialog similarly handles unmodified Escape. A private lifecycle needing guards should
  disable directive auto-close or own an `OverlayRef` subscription.

## Native platform findings

- Native `popover="auto"` already supplies top-layer light dismiss for outside activation and Escape,
  including nested popover ordering. Do not layer a CDK outside listener over the same native policy.
- Native modal `<dialog>` emits a cancelable, non-bubbling `cancel` event for close requests such as
  Escape; preventing it keeps the dialog open. Use that event instead of a document Escape listener.
- WAI-ARIA APG requires Escape to close a modal dialog, but component workflows can still expose a
  documented close guard and must retain a visible close control.

## Primary references

- https://material.angular.dev/cdk/overlay/api
- https://github.com/angular/components
- https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/popover
- https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Installed `node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs`
- Installed `node_modules/@angular/cdk/fesm2022/dialog.mjs`

# Focus management foundation

Zordon UI composes native browser behavior and public Angular CDK A11y primitives for focus
containment, initial focus, restoration, and focus-origin detection. It does not ship a parallel
focus-trap implementation or a generic Zordon wrapper before a real overlay lifecycle needs one.

This contract implements [ADR 0004](../architecture/0004-overlays-and-angular-cdk.md),
[ADR 0007](../architecture/0007-accessibility-ssr-and-localization.md), and
[ADR 0008](../architecture/0008-angular-aria.md).

## Selection order

1. Use native focus behavior when it fully matches the component. A modal native `<dialog>` opened
   with `showModal()` already supplies modal focus containment; Zordon still owns its initial-focus,
   close, restoration, and fallback policy.
2. For a simple template region whose Angular lifetime exactly matches its open lifetime, compose the
   standalone public `CdkTrapFocus` directive from `@angular/cdk/a11y`.
3. For a portaled, animated, persistent, or nested overlay, let the future private Zordon overlay
   lifecycle own a public CDK `FocusTrap` created by `FocusTrapFactory`. Do not add an independent
   trap stack before the overlay stack exists.
4. Use native `:focus-visible` and `:focus-within` for ordinary styling. Add public CDK
   `FocusMonitor`/`CdkMonitorFocus` only when focus origin changes component behavior or cannot be
   expressed by those selectors.

Angular Aria owns focus behavior inside a matching compound widget family. Focus trapping remains
complementary CDK/overlay work; it is not a reason to install `@angular/aria` before the first real
consumer or to duplicate its roving-tabindex and active-descendant behavior.

## Simple template regions

The supported direct-composition shape is:

```html
@if (open()) {
<section cdkTrapFocus cdkTrapFocusAutoCapture>
  <button type="button">Secondary action</button>
  <button cdkFocusInitial type="button">Preferred initial action</button>
  <button type="button" (click)="close()">Close</button>
</section>
}
```

The `@if` lifetime is material. `cdkTrapFocusAutoCapture` records the currently focused element,
schedules initial focus after rendering, and restores the recorded element only when the directive
is destroyed. Setting `[cdkTrapFocus]="false"` disables containment but does not restore focus; do
not treat it as a close lifecycle.

`cdkFocusInitial` is a marker inspected during capture, not a standalone focus directive. Put it on
one enabled, visible, focusable target. A marked non-focusable container delegates to its first
tabbable descendant. A disabled or hidden marked control with no tabbable descendant causes capture
to fail rather than falling back to the whole region.

Create the region only when its focusable content is rendered and ready. Do not trap a permanently
hidden container, call focus from a template getter/effect, or use timers to guess when an animation
has finished. If an entrance animation delays visibility, the owning component/overlay lifecycle
must activate and focus after the visible state is observable.

## Future overlay lifecycle

The direct directive is not the overlay abstraction. A future overlay coordinator must own:

- capture of the logical restoration target before opening;
- trap creation/activation only after the portal is attached and visible;
- the component-specific initial target and a safe fallback when it is unavailable;
- top-overlay-only activation for nested overlays;
- close-animation ordering, trap destruction, portal disposal, and restoration;
- an explicit restoration opt-out only for a documented workflow;
- fallback to a connected, enabled logical target when the original target was removed or disabled.

Use public CDK `FocusTrapFactory`/`FocusTrap` under that lifecycle. Do not select
`ConfigurableFocusTrapFactory` merely to obtain another root-level stack: its installed default inert
strategy is a focus-event redirector, not native `inert`, and ADR 0004 assigns nesting and top-overlay
policy to Zordon's future overlay stack.

Focus containment alone does not create a modal. The owning native dialog or overlay must also supply
correct semantics, background inertness/pointer policy, dismissal, stacking, scroll behavior, and
accessible labeling.

## Restoration rules

- Restore focus by default after the closing region is removed.
- Prefer the exact connected trigger that opened the region.
- If it is unavailable, use a component-specified connected fallback that preserves the user's task
  flow; do not blindly focus `body`.
- Do not steal focus if application code deliberately moved it as part of the same close workflow.
- Destroyed components must release traps and FocusMonitor registrations even when close is caused by
  navigation, parent destruction, or an error path.

`CdkTrapFocus` directly calls `focus()` on its captured element at destruction. That is sufficient for
the simple lifetime above, but it has no fallback-selection or close-reason policy. Complex overlays
therefore keep restoration in their own lifecycle.

## Focus-visible and focus origin

Default component styling uses native CSS:

```css
:host(:focus-visible),
:host :focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

Never remove the browser outline without a tested replacement. Keyboard focus must remain visible in
default themes, forced-colors mode, and consumer customization.

Use `FocusMonitor` only when the component truly needs `'keyboard'`, `'mouse'`, `'touch'`, or
`'program'` state, or when programmatic focus must preserve a declared origin through `focusVia`.
Monitoring installs shared document/root/window listeners and adds documented `cdk-*-focused`
classes. A manual `monitor()` call must pair with `stopMonitoring()`; the standalone
`CdkMonitorFocus` directive performs that cleanup on destroy. Zordon public APIs must not expose CDK
focus-origin types or classes.

## Boundaries and unsupported assumptions

- CDK's basic trap constrains sequential Tab navigation with focus sentinels. It does not prevent a
  pointer or arbitrary script from moving focus outside the region.
- Keep visual order aligned with DOM/tab order. Positive `tabindex`, CSS `order`, shadow-root
  traversal, and iframe/object boundaries can diverge from the basic trap's traversal model and need
  component-specific evidence.
- Dynamic focusable children are re-evaluated when a trap boundary is reached, but removing the
  currently focused child still needs a component-specific focus fallback.
- Native and CDK traps must not be layered on the same region unless a concrete browser defect and
  compatibility test justify it.

## SSR and hydration

Installed CDK 21.2.14 creates `CdkTrapFocus` DOM anchors only when `Platform.isBrowser` is true, and
`FocusMonitor` returns without installing listeners on the server. Initial focus is scheduled after a
browser render, so server HTML must not contain a focused-state assumption.

The first real component using a trap must still prove meaningful server HTML, identical initial
open/closed structure and state, hydration without mismatch errors, browser-only focus activation,
and cleanup/restoration after hydration. Source inspection or this compatibility fixture does not by
itself make every overlay SSR-ready.

## Required tests

For each trapping component or overlay, verify in a real browser:

- focus enters the documented initial target after open;
- Tab and Shift+Tab wrap at the region boundaries in DOM order;
- disabled/missing initial targets follow the component's documented fallback;
- dynamic focusable content and removal of the active child preserve a logical focus target;
- close, destroy, navigation, and nested-overlay transitions restore or transfer focus correctly;
- pointer/programmatic focus cannot violate the component's modal policy;
- keyboard focus remains visibly styled, including forced colors;
- monitored focus-origin state is removed and listeners are released on destroy;
- SSR/hydration produces no DOM mismatch or premature server focus behavior.

Do not use jsdom to claim real tabbability or Tab wrapping: CDK's `InteractivityChecker` depends on
browser visibility and geometry. Unit tests may cover server no-op behavior and cleanup; browser tests
own focus order, capture, restoration, and `:focus-visible` evidence.

## References

- [Angular CDK accessibility overview](https://material.angular.dev/cdk/a11y/overview)
- [Angular CDK accessibility API](https://material.angular.dev/cdk/a11y/api)
- [MDN `:focus-visible`](https://developer.mozilla.org/docs/Web/CSS/:focus-visible)

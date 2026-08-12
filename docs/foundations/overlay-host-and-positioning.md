# Overlay host, stack, positioning, and scroll policy

Zordon's private CDK overlay foundation centralizes portal ownership, lifecycle, stacking,
dismissal arbitration, connected/global positioning, theme forwarding, and cleanup. It is not a
public component API. Native dialog and popover components remain native-first when the platform
already supplies the required behavior.

This foundation is **Partial**. Its source-level behavior is implemented and tested, but future
component secondary entry points must prove that they share one application stack rather than
bundling separate private singleton identities. No CDK or private Zordon overlay type is exported.

## Ownership and lifecycle

- The coordinator creates at most one `OverlayRef` for one template or component portal. DOM
  portals are excluded because moving live DOM complicates hydration and ownership.
- The default CDK `OverlayContainer` owns its shared container. A handle owns only its ref, portal,
  subscriptions, pane theme, and stack registration; it never destroys the shared container.
- Opening is browser-only. On the server the coordinator returns no handle and never calls
  `Overlay.create()`, so it cannot append overlay DOM or global listeners.
- Closing is two-phase: `requestClose(reason)` enters `closing` and continues shielding lower
  surfaces; `finalizeClose()` detaches, disposes, and unregisters. Destruction and partial attach
  failures use the same idempotent cleanup path.
- A parent cannot finalize while a registered child exists. Nested surfaces close child-first.
- Stack order follows successful CDK attachment order. Components must not invent independent
  z-index scales or rely on CDK's version-specific popover implementation.

## One event, one surface

The newest eligible surface owns Escape, outside interaction, or backdrop interaction. A closing
or dismissal-disabled interactive surface still shields its parent. Native events are claimed
before a close callback can synchronously mutate the stack, preventing one event from closing a
child and then its parent.

Pane content, the origin, registered safe elements, and owned child panes form the logical inside
boundary. Composed paths support open Shadow DOM. Backdrop and outside streams can observe the same
physical event, so the stack reserves and emits exactly one `backdrop` reason. These guarantees are
limited to Zordon surfaces in one Angular application and document; iframes, closed shadow roots,
other Angular roots, and unrelated Material/CDK overlays need an explicit bridge.

## Positioning and collision behavior

Connected overlays provide an ordered list of logical origin/overlay pairs. The mapper preserves
that order and configures CDK's public flexible strategy with an explicit viewport margin (8 px by
default), push enabled by default, flexible dimensions enabled by default, and grow-after-open
disabled by default. CDK first selects a fully fitting position, then its documented flexible-fit
or visible-area fallback, and can push the result inside the viewport.

Each component owns its meaningful fallback order; a tooltip, menu, select, and date picker do not
share one universal sequence. Global positioning supports logical start/end and centered placement.
The following directionality foundation will own the public placement vocabulary and live direction
changes. Consumers never receive CDK position objects.

## Scroll policy

Only these policies are supported by the private foundation:

- `reposition`, always with CDK `autoClose: false`, for anchored interactive surfaces;
- `noop`, for surfaces whose component policy intentionally ignores scrolling.

CDK `close` and reposition `autoClose` directly detach the ref, bypassing Zordon close reasons,
guards, animations, focus restoration, and stack cleanup. CDK `block` mutates page scroll state and
belongs to the next body-scroll-lock foundation. A future close-on-scroll behavior must issue a
normal Zordon close request.

## Themes, SSR, and hydration

The coordinator snapshots the nearest composed-ancestor `data-theme` from the origin/context and
sets it on the owned pane. An explicit `null` removes the pane attribute; the global document theme
continues to inherit naturally. The shared overlay container is never themed or mutated.

Server HTML must contain the meaningful closed or inline trigger/content state, never a pane,
backdrop, generated overlay host, or dispatcher listener. The first real consuming component must
prove hydration/event replay opens exactly one overlay after render, does not reinterpret the
opening event as outside, positions correctly, and cleans up without mismatch errors. The current
browser fixture proves layout and cleanup after ordinary client rendering; it does not close that
component-specific hydration gate.

## Package boundary and completion gate

Keeping these classes unexported prevents CDK and private types from entering the current package
API or root bundle. Independently built secondary entry points can, however, duplicate a private
root token/class and create separate stacks. This row becomes Complete only after two actual overlay
component entry points prove one shared registry and top-only arbitration through an approved
package identity boundary. A primary `ɵ` bridge would still be a published artifact and therefore
requires an explicit ADR, API review, package evidence, and release intent; hidden globals or DOM
singleton properties are prohibited.

## Verification

Unit tests cover stack/lifecycle transitions, event claiming, child-first teardown, failure unwind,
portal destruction, server gating, theme snapshots, ordered position mapping, and allowed scroll
strategies. The real Chromium fixture proves edge collision/flip, viewport margin, scroll
repositioning, theme application, pane/backdrop attachment, Escape/backdrop reasons, and final
container cleanup. The first consuming component must extend browser, SSR/hydration, focus,
directionality, scroll-lock, accessibility, and package compatibility coverage.

## Sources

- [Angular CDK Overlay API](https://material.angular.dev/cdk/overlay/api)
- [Angular CDK Overlay overview](https://material.angular.dev/cdk/overlay/overview)
- [Angular CDK Portal overview](https://material.angular.dev/cdk/portal/overview)
- [Angular server-side rendering](https://angular.dev/best-practices/performance/ssr)
- [Angular hydration](https://angular.dev/guide/hydration)

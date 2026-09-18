# Overlay host, stack, positioning, and scroll policy

Zordon's private CDK overlay foundation centralizes portal ownership, lifecycle, stacking,
dismissal arbitration, connected/global positioning, theme forwarding, and cleanup. It is not a
public component API. Native dialog and popover components remain native-first when the platform
already supplies the required behavior.

This foundation is **Complete for its automated gate**. Dropdown and Tooltip import the version-locked
`internal-overlay` package bridge defined by ADR 0009. Built-package contracts and mixed-component
browser/SSR tests prove shared application stacking. The bridge explicitly reports its support types;
consumer component inputs and outputs do not expose CDK or internal overlay objects.

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
The [directionality foundation](directionality-and-logical-placement.md) owns the public placement vocabulary and live direction
changes. Consumers never receive CDK position objects.

## Scroll policy

Only these policies are supported by the private foundation:

- `reposition`, always with CDK `autoClose: false`, for anchored interactive surfaces;
- `noop`, for surfaces whose component policy intentionally ignores scrolling.

CDK `close` and reposition `autoClose` directly detach the ref, bypassing Zordon close reasons,
guards, animations, focus restoration, and stack cleanup. The `block` policy composes the private
[body scroll-lock foundation](body-scroll-lock.md). A future close-on-scroll behavior must issue a
normal Zordon close request.

## Themes, SSR, and hydration

The coordinator snapshots the nearest composed-ancestor `data-theme` from the origin/context and
sets it on the owned pane. An explicit `null` removes the pane attribute; the global document theme
continues to inherit naturally. The shared overlay container is never themed or mutated.

Server HTML contains meaningful native triggers and inline descriptions without panes or backdrops.
Production SSR tests verify no-JavaScript output and hydrated Dropdown/Tooltip opening, focus,
top-only Escape and cleanup without mismatch errors. Native Tooltip listeners activate after render;
pre-activation focus events are not replayed. Essential descriptions remain consumer-owned inline
content. These tests do not claim incremental hydration or unrelated overlay integration.

## Package boundary and completion gate

The implementation lives in `projects/components/internal-overlay/src/overlay/`, with one explicit
secondary package bridge under [ADR 0009](../architecture/0009-shared-overlay-runtime.md). Dropdown,
Tooltip and the browser foundation fixture import that entry rather than compiling separate source copies.
Its API report makes the implementation export visible; the primary bundle remains independent.
The two actual component entry points prove shared registry identity and top-only arbitration; the
fixture is not counted as a second component. Hidden globals or DOM singleton properties remain prohibited.

## Verification

Unit tests cover stack/lifecycle transitions, event claiming, child-first teardown, failure unwind,
portal destruction, server gating, theme snapshots, ordered position mapping, and allowed scroll
strategies. The real Chromium fixture proves edge collision/flip, viewport margin, scroll
repositioning, theme application, pane/backdrop attachment, Escape/backdrop reasons, and final
container cleanup. Dropdown and Tooltip extend browser, SSR/hydration, focus, directionality, axe and
package coverage. Blocking scroll-lock hydration/mobile evidence and human accessibility remain
separate component gates. See [Tooltip progress](../plans/phase-5-tooltip-progress.md).

Modal now adds a third packaged consumer, native and overlay-mode dismissal, nested blocking leases
and ordinary production hydration evidence. Its backend boundaries are recorded in
[ADR 0010](../architecture/0010-modal-native-and-overlay.md). Physical mobile scroll/keyboard and
human accessibility gates remain open.

## Sources

- [Angular CDK Overlay API](https://material.angular.dev/cdk/overlay/api)
- [Angular CDK Overlay overview](https://material.angular.dev/cdk/overlay/overview)
- [Angular CDK Portal overview](https://material.angular.dev/cdk/portal/overview)
- [Angular server-side rendering](https://angular.dev/best-practices/performance/ssr)
- [Angular hydration](https://angular.dev/guide/hydration)

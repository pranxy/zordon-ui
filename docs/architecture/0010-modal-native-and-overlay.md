# ADR 0010: Native Modal with an explicit overlay backend

Status: Accepted

Date: 2026-09-18

## Decision

Modal defaults to native `dialog.showModal()` when available. The browser owns native top-layer
modality, background inertness and keyboard behavior. An explicit `overlay` backend uses an open
nonmodal dialog element, CDK focus trapping and owned background isolation. `auto` falls back to that
backend when `showModal` is unavailable; explicitly requesting an unsupported native backend fails
before attachment. Angular Aria has no necessary role in this dialog pattern.

Both backends attach one component portal through the existing version-locked overlay coordinator.
They share its stack, theme snapshot, directionality propagation and ref-counted body scroll lock.
No second coordinator, hidden global, independently installed package or CDK type enters the consumer
API. Native mode adds its own browser top-layer behavior; it does not assume that unrelated CDK
popovers automatically become descendants of a native modal.

Consumers choose overlay mode for content containing portaled Dropdown/Tooltip widgets. Native
modality makes outside DOM inert, even when an unrelated popup attempts to render above it. Relocating
the shared container or relying on CDK's private popover internals would break ownership. Mixed
native/overlay nested modal backends are not a supported composition; use one backend per nested
flow. Native nested dialogs and overlay-mode Dropdown Escape arbitration have separate browser tests.

## State and cleanup

Service refs resolve one typed result, serialize guard/action work, retain rejected or failed dialogs
for retry and ignore late completion after destruction. Declarative templates emit close requests
and wait for their consumer to accept `open=false`. Queue entries begin only after the previous
result settles. Opening another service dialog establishes a stack: parent teardown destroys newer
dialogs before releasing its own resources.

Opening/closing snapshots and restores owned background inert/ARIA state, isolates lower modal panes,
and restores a connected focusable origin after final close. The default CDK container remains
untouched and available to same-application popup children in overlay mode. A supplied ViewContainerRef
provides the caller's direction/injection context and a destruction boundary; without it the root
service owns the lifetime.

The scoped Modal stylesheet neutralizes daisyUI `modal-box` opacity/scale transitions because Angular
and the native dialog API own visibility. The box class remains prefix-aware, and theme tokens and
consumer pane classes remain available. Native `modal`/`modal-open` CSS visibility classes are not
combined with this runtime.

## Limits and evidence

SSR renders triggers and consumer inline content without a modal portal, lock or global listener.
Declarative opening runs after rendering; imperative server opening throws a clear error. Native
browser chrome can participate in Tab navigation; tests assert that background page controls cannot
receive focus rather than replacing native behavior with a custom key loop.

The automated evidence is recorded in [Modal progress](../plans/phase-5-modal-progress.md). Human
screen-reader/contrast/reflow and physical iOS/Android scroll/keyboard review remain open. Scope is
one Angular application/document; unrelated overlay systems and independently bootstrapped roots
are not coordinated.

References: [CDK dialog API](https://v20.material.angular.dev/cdk/dialog/api),
[Angular CDK native-dialog integration issue](https://github.com/angular/components/issues/28133).

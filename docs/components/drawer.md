# Drawer

`@pranxy/zordon-ui/drawer` provides `ZdDrawer` and the lazy `ZdDrawerPanel` template directive.
Modal mode composes the packaged Modal implementation, including its CDK focus trap, shared
overlay stack, background isolation, nested scroll locks and focus restoration. Persistent and
push modes keep the panel and main content in the document. No separate Aria drawer pattern or
duplicate overlay service is introduced.

## Controlled navigation

Import `ZdDrawer` and `ZdDrawerPanel` into the owning standalone component. The example also
uses `ZdNavbarToggle` from the Navbar entry and an owner `open = signal(false)`.

```html
<button
  zdNavbarToggle
  [controls]="drawer.panelId"
  [expanded]="open()"
  (expandedChange)="open.set($event)"
>
  Navigation
</button>
<zd-drawer
  #drawer
  label="Project navigation"
  mode="responsive"
  [open]="open()"
  (openChange)="open.set($event)"
  closeOnNavigation
>
  <ng-template zdDrawerPanel let-close>
    <nav aria-label="Project sections">
      <a routerLink="/projects">Projects</a>
      <a routerLink="/settings">Settings</a>
    </nav>
    <button type="button" (click)="close()">Close navigation</button>
  </ng-template>
  <main>Application content</main>
</zd-drawer>
```

The panel template receives `ZdDrawerContext`, whose `$implicit` is a zero-argument close
request callback. Other projected content becomes the main content area. The owner chooses
whether that area is a main landmark; Drawer does not add another main. Use the stable public
`panelId` for a trigger's controls relationship. A closed modal has a hidden ID placeholder;
the live modal panel uses that ID after opening.

## Public contract

| Member                  | Default        | Contract                                                                         |
| ----------------------- | -------------- | -------------------------------------------------------------------------------- |
| `open`                  | `false`        | Accepted state; interaction never mutates this input                             |
| `openChange`            | Output         | Emits `false` when closing is requested                                          |
| `closeRequest`          | Output         | Emits `close`, `escape`, `backdrop`, `navigation` or `swipe` before `openChange` |
| `requestClose(reason?)` | `close`        | Public request method; does nothing when already closed                          |
| `panelId`               | Generated      | Stable per instance; use for Navbar or custom triggers                           |
| `label`                 | `Drawer`       | Modal dialog or inline complementary landmark name                               |
| `mode`                  | `modal`        | `modal`, `persistent`, `push`, `responsive`                                      |
| `desktopMode`           | `persistent`   | `persistent` or `push` at/above the responsive breakpoint                        |
| `effectiveMode()`       | Derived        | Current concrete modal/persistent/push mode                                      |
| `side`                  | `start`        | Logical `start` or `end`, following CDK Directionality                           |
| `width`                 | `320`          | Finite positive CSS pixel width; viewport/container limits still apply           |
| `breakpoint`            | `768`          | Finite positive viewport width in CSS pixels                                     |
| `closeOnEscape`         | `true`         | Allow modal Escape requests                                                      |
| `closeOnBackdrop`       | `true`         | Allow modal backdrop requests                                                    |
| `closeOnNavigation`     | `false`        | Request close on Router NavigationEnd, including query/fragment navigation       |
| `swipe`                 | `false`        | Show a native close button that also accepts deliberate outward touch/pen swipes |
| `closeLabel`            | `Close drawer` | Localized label for the optional swipe/close button                              |

Boolean inputs accept Angular boolean-attribute syntax. The root emits prefix-aware `drawer`
and `drawer-{side}` classes. Packaged CSS owns the actual layouts, safe-area padding and modal
geometry; it does not depend on daisyUI's hidden-checkbox drawer convention. Theme colors come
from the surrounding scope and are forwarded by the shared modal/overlay implementation.

Ignoring a request leaves the drawer visible, focus trapped and scrolling locked in modal mode.
Accept by setting `open=false`. Close policies can change while open. Label and side are captured
by Modal when an opening begins; close and reopen to apply changes to its dialog name or placement.
Width and panel content update through their existing bindings. To disable a trigger, use its
native disabled state or Navbar Toggle's disabled input.

## Layout, responsive state and SSR

Persistent mode uses a normal grid column. Push mode positions the panel inside the layout and
moves/narrows the main content using a logical margin. Neither has a backdrop, focus trap or
scroll lock; both expose a named complementary landmark. Their width is capped at 45% of the
container so main content stays available. End-side panels occupy the opposite side without
reversing logical reading order. Content requiring a different narrow layout should use
responsive modal mode instead of an excessively narrow inline sidebar.

Modal mode uses a named, full-height dialog at the logical viewport edge. Its width is capped
by the viewport, it scrolls independently, and safe-area padding covers all physical edges.
The first tabbable control receives focus, with the dialog as fallback. The shared Modal service
restores the previously focused connected, focusable element after accepted closure.

Responsive mode chooses `desktopMode` at or above `breakpoint`, otherwise modal. It watches
matchMedia only after rendering and removes listeners on replacement/destruction. SSR starts
with the desktop mode deterministically, and hydration then adapts to the actual viewport.
If matchMedia is unavailable, the desktop fallback remains. A responsive transition changes
layout without emitting a close request or changing accepted `open`.

Open persistent/push panels render their content on the server. Modal portals are created only
in the browser; server output contains the main content and no active modal. Do not put essential
server-only navigation exclusively in a modal template. All panel views are lazy and are destroyed
on close or transfer between inline and modal layouts; keep forms, data and navigation state in
the owner when they must survive. The owner also supplies a sensible focus destination if a
responsive transition removes the original focus target.

## Router, nesting and touch

With a Router provider, `closeOnNavigation` observes successful NavigationEnd events. Canceled
or incomplete navigation does not close anything. Without a Router there are no navigation
events to observe. The component does not intercept links or own URL state.

Nested Drawers and Modals share one modal service and overlay stack. Escape targets only the
top surface; a rejected request does not escape to a lower one. Closing a child preserves the
parent scroll lock and restores its opener. Destroying a parent disposes owned child views and
their surfaces. Applications should reset their nested open signals when closing an entire
navigation flow if reopening should start without child panels.

Swipe interaction is limited to the explicitly labeled close handle so scrolling ordinary
panel content remains native. An outward horizontal touch/pen gesture must travel at least
64 pixels and exceed its vertical movement. Direction respects side and RTL. Inward/vertical
drags and canceled pointers do not request closure; movement beyond tap slop suppresses the
following compatibility click. The same handle remains an ordinary keyboard/click close button.
This is swipe-to-close; edge-swipe opening and drag-progress animation are not included.

## Verification and migration

See [ADR 0027](../architecture/0027-drawer-modal-composition.md),
[accessibility review](drawer-accessibility-review.md), [visual matrix](drawer-visual-matrix.md)
and [milestone evidence](../plans/phase-6-drawer-progress.md).

Replace legacy hidden checkbox state with an owner signal, move sidebar content into
`ng-template[zdDrawerPanel]`, and connect native/Navbar triggers to `panelId` and `open`.
Remove competing overlay focus, scroll and Escape handlers. Keep semantic navigation, menu
state, route destinations, form persistence and localized content in the application.

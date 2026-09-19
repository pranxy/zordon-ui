# Toast

FDB-06 exports `ZdToastOutlet`, `ZdToastService` and typed notification contracts from
`@pranxy/zordon-ui/toast`. Mount one declarative outlet per service instance. The root service is
convenient for application notifications; provide `ZdToastService` at a component/route boundary
for isolated lifecycle and state. The outlet reuses the packaged Alert component.

```ts
import { inject } from '@angular/core';
import { ZdToastOutlet, ZdToastService } from '@pranxy/zordon-ui/toast';

// Include ZdToastOutlet in the standalone component imports.
readonly toasts = inject(ZdToastService);

saveNotice() {
  this.toasts.show({ message: 'Draft saved', color: 'success' });
}
```

```html
<zd-toast-outlet label="Notifications" [limit]="3" />
```

## Service and options

`show(options)` returns a generated string ID. `update(id, options)` replaces the options and
returns false for missing IDs. `dismiss(id)` removes an active or queued notification; `clear()`
removes all. `items()` is a readonly signal in FIFO order, including queued items. Each item exposes
its ID, revision, pending action state and normalized options.

| Option         | Default                | Contract                                                             |
| -------------- | ---------------------- | -------------------------------------------------------------------- |
| `message`      | Required               | Nonempty plain text; also used for announcements with custom content |
| `color`        | Neutral                | info, success, warning or error                                      |
| `position`     | `bottom-end`           | top/middle/bottom combined with start/center/end                     |
| `duration`     | `5000`, actions `0`    | Active visible milliseconds, 0 persists; finite range 0–2147483647   |
| `priority`     | `polite`               | off, polite or assertive; color does not imply priority              |
| `key`          | None                   | Optional deduplication key across active and queued messages         |
| `dismissLabel` | `Dismiss notification` | Localized accessible name for the close button                       |
| `action`       | None                   | label, run callback and localized errorMessage                       |
| `template`     | None                   | `TemplateRef<ZdToastContext>`; implicit context is the current item  |

The visible `limit` is a global FIFO limit across all positions, defaults to 3 and accepts integers
1–20. Extra messages wait without rendering or consuming timeout. The service holds at most 100
active plus queued messages; a new unique message beyond that limit throws RangeError. Duplicate
keys return the existing ID without updating content, order or remaining time. Explicit updates
may retain their key, but cannot take another item's key. Updating does not reorder the queue.

Alerts pause remaining time on hover, focus anywhere inside the notification, and a hidden tab.
Updating to a different duration restarts timing; an unchanged duration retains the remaining time.
Use duration 0 for important messages and actionable content. Preserving information elsewhere in
the application is the consumer's responsibility. All messages have an operable dismiss button.

Actions persist by default. `act(id)` runs a configured action once while pending; the native button
remains focusable with aria-disabled/aria-busy and repeat activation is ignored. Success dismisses
the message. Failure keeps it visible, replaces its message with errorMessage, sets assertive
priority and disables timeout so retry remains available. A manually updated or dismissed message
is not changed by a stale action settlement. Actions run only when activated; custom template
actions can call service methods directly.

```ts
this.toasts.show({
  message: 'Item deleted',
  action: { label: 'Undo', run: () => this.undo(), errorMessage: 'Undo failed. Try again.' },
});

const result = await this.toasts.track(savePromise, {
  loading: { message: 'Saving draft' },
  success: () => ({ message: 'Draft saved', color: 'success' }),
  error: () => ({ message: 'Save failed', color: 'error', duration: 0, priority: 'assertive' }),
});
```

`track` creates an independent persistent loading message (ignoring loading key/duration), then
updates that ID with success/error options. It returns the work value or rejects with its error.
Handle rejection in the consumer. Valid, pure formatter callbacks are consumer-owned. Dismissal,
outlet teardown or a manual update prevents the settlement from replacing/resurrecting the message;
none of these cancel the underlying promise or an already-running action.

## Content, announcements and focus

For custom content use an `ng-template` with `let-item`, and pass its TemplateRef as `template`.
The required message provides a concise textual equivalent; custom controls remain ordinary native
controls. The template owner must keep its context alive or dismiss the notification on destruction.

The outlet owns pre-existing empty status and alert regions. After hydration, newly visible or
updated items are batched by priority in the current render. Queued items are announced when
promoted. The visible Alert instances have announcements off, so buttons and custom content are
not duplicated through a second path. Initial SSR/first-render messages remain visible without
an automatic announcement. Newly mounting an outlet treats its pre-existing queue the same way.
Rapid changes can coalesce; this is not a durable speech queue or an AT delivery guarantee.

Showing, updating or timing out an unfocused toast does not move focus. Dismissing a focused toast
restores its connected trigger when possible; otherwise focus moves to the outlet region. Hover
and focus prevent timeout. There is no global Escape listener, focus trap, scroll lock or outside
click dismissal. Critical information needing acknowledgement belongs in a dialog or persistent
application UI. Manually changing a focused toast's position may recreate its rendered group;
keep its position stable during interaction.

## Positioning, lifecycle and styling

All nine positions are fixed to the viewport using daisyUI Toast classes. Start/end follow RTL;
center uses a physical midpoint so it works in both document and nested direction scopes. Pointer
events pass through stack gaps. Entry motion is disabled for reduced motion and forced colors.
Compile `toast`, position classes, `alert`, `alert-horizontal` and the required Alert color classes
under the existing styling contract. Class prefixes apply through `ZdClassNames`.

The outlet is declarative and remains in its DOM/theme scope. Mount it near the application root,
outside transformed/clipping ancestors. It is not a CDK portal or native top-layer surface and does
not override modal isolation; do not use a background toast for essential feedback inside an open
modal. This native outlet needs no overlay stack lease or imperative LiveAnnouncer, per ADR 0017.

Outlet destruction clears active/queued messages and destroys Alert timers/listeners. A second
outlet using the same service throws. SSR renders deterministic initial messages and empty live
regions with no browser DOM container or timer side effects. Match initial server/client state;
independent incremental-hydration ordering remains unverified.

See [accessibility review](toast-accessibility-review.md), [visual matrix](toast-visual-matrix.md)
and [delivery evidence](../plans/phase-5-toast-progress.md). Manual AT and compatibility gates remain open.

# Modal

Status: automated implementation complete; manual accessibility pending.

Import `ZdModal` and `ZdModalService` from `@pranxy/zordon-ui/modal`. Modal provides a controlled
declarative template, typed service refs, confirmation and a queue on Angular 21. Native dialog is
the default when available; choose `backend: 'overlay'` for content with portaled Dropdown/Tooltip
widgets. No Angular Aria widget is needed. See [ADR 0010](../architecture/0010-modal-native-and-overlay.md).

## Declarative usage

```html
<button type="button" (click)="editing.set(true)">Edit</button>
<ng-template
  zdModal
  [open]="editing()"
  [options]="editorOptions"
  (openChange)="editing.set($event)"
  (closed)="onClosed($event)"
  let-modal
>
  <h2>Edit draft</h2>
  <label>Title <input [formControl]="title" /></label>
  <button type="button" (click)="modal.close(title.value)">Save</button>
  <button type="button" (click)="modal.close()">Cancel</button>
</ng-template>
```

`editorOptions` must include a localized `label`, such as `{ label: 'Edit draft' }`. `open` defaults
to false. `openChange` requests false after a permitted close; the consumer can reject it by leaving
`open` true. `closed` emits the accepted result. Changing `open` to false externally closes without
running the guard again, using the last accepted request or `{ reason: 'close' }`. The options and
template are captured for each opening; use a new opening to change configuration. Destruction
releases the dialog without emitting an event from a destroyed directive.

## Service usage

```typescript
const modal = inject(ZdModalService);
const viewContainer = inject(ViewContainerRef);

// editorTemplate: TemplateRef<ZdModalContext<string>>
const ref = modal.open(
  editorTemplate,
  {
    label: 'Edit draft',
    backend: 'overlay',
    beforeClose: async result => result.reason !== 'close' || (await canLeave()),
  },
  viewContainer,
);
const result = await ref.result;

const confirmed = await modal.confirm({
  label: 'Publish draft',
  message: 'Publish the current version?',
  confirmLabel: 'Publish',
  cancelLabel: 'Keep editing',
  action: () => publishDraft(),
});
```

`open<T>(template, options, viewContainerRef?)` returns `ZdModalRef<T>`. Passing null for the template
uses the built-in message and confirmation buttons. Pass a ViewContainerRef from the desired
direction/injection scope; it also closes the dialog when its owner is destroyed. Without one, the
root service owns the lifetime and direction context. Merely projecting a template does not infer
an arbitrary HTML direction scope for a service call.

`confirm(options, viewContainerRef?)` resolves true only for a confirmed result.
`enqueue<T>(template, options, viewContainerRef?)` resolves a result after its dialog reaches the front
of the service queue and closes. Queue failures do not block subsequent entries; handle rejected
promises if an application/view has been destroyed before opening. Queueing does not serialize
independent direct calls to `open`.

## Options

| Option                         | Default              | Meaning                                                                            |
| ------------------------------ | -------------------- | ---------------------------------------------------------------------------------- |
| `label`                        | Required             | Accessible dialog name; supply a visible heading too                               |
| `description`                  | None                 | Optional accessible description text                                               |
| `backend`                      | `auto`               | Native when supported; `native` requires support; `overlay` opts into CDK modality |
| `size`                         | `md`                 | `sm` (24rem), `md` (32rem), `lg` (48rem), `full` (dynamic viewport)                |
| `placement`                    | `center`             | `center`, `top`, `bottom`, logical `start`, logical `end`                          |
| `panelClass`                   | None                 | Extra classes on the owned pane; style its dialog descendant                       |
| `closeOnEscape`                | `true`               | Permit Escape requests; a guard can still reject them                              |
| `closeOnBackdrop`              | `true`               | Permit backdrop requests; a guard can still reject them                            |
| `initialFocus`                 | `first`              | First tabbable control, or `dialog` for the focusable surface                      |
| `beforeClose`                  | None                 | Boolean or Promise<boolean> guard for a requested result                           |
| `message`                      | None                 | Plain text in the built-in confirmation layout                                     |
| `confirmLabel` / `cancelLabel` | `Confirm` / `Cancel` | Localizable confirmation buttons                                                   |
| `errorMessage`                 | Retry guidance       | Localizable visible alert for guard/action failures                                |
| `action`                       | None                 | Optional synchronous/async confirmation work                                       |

`ZdModalResult<T>` contains `reason` and optional `value`. Reasons are `close`, `escape`, `backdrop`,
`submit`, `confirm`, `cancel`, `destroy`. `close(value?, reason?)` resolves whether the request closed
the ref. `confirm()` runs the action then requests a guarded confirm close. `destroy()` forces owner
teardown, bypassing guards. `result` resolves once; `closed()`, `pending()` and `error()` are read-only
signals. `error()` preserves the caught value for diagnostics; the UI renders safe localized text.
The exported ref is obtained from the service/template; its internal constructor and `accept`
method are implementation contracts, not consumer entry points.

Pending work rejects duplicate close/confirm requests. A thrown/rejected guard or action keeps the
dialog open and exposes an alert so the consumer can retry. A confirm close guard runs after the
action succeeds; make repeated actions safe if a guard can veto that close. Destruction does not
abort consumer network work, but prevents its late completion from reopening/closing another dialog.

## Focus, forms and dismissal

Native mode uses `showModal`, native cancel events and browser modality. Browser chrome may remain
part of the native Tab cycle. Overlay mode uses CDK focus trapping and owned inert/ARIA background
isolation, without `aria-modal` that would hide same-application popup siblings from assistive
technology. Dropdown inside an overlay modal receives Escape first; a later Escape reaches Modal.
Native mode is for content that stays within the native dialog subtree. Use the same backend for a
nested modal flow; do not combine an overlay child with a native modal parent.

On closing, newer dialogs are destroyed first. Scroll locking is ref-counted across the shared
overlay runtime; closing one nested dialog does not unlock its parent. Focus returns to the captured
origin when it remains connected and focusable. Custom close targets and redirects remain the
consumer's responsibility. The default container is never moved into a dialog or destroyed.

Native form controls and validation remain consumer-owned. Valid `method="dialog"` submissions are
intercepted and become guarded `submit` requests. They do not place an untyped native submitter string
into a typed result; call `modal.close(typedValue)` to return data. Ordinary form submissions are not
intercepted. Use explicit `type="button"` for actions that should not submit a form.

Native backdrop closing requires a pointer press and click outside the dialog box, so dragging out
from content does not accidentally close it. Overlay backdrop/Escape events use shared top-only
arbitration. Rejected or pending requests keep shielding lower surfaces.

## Styling, responsive layout and lifecycle

The prefix-aware daisyUI `modal-box` class uses theme colors/radii. Zordon's unlayered scoped styles
neutralize its CSS-only opacity/scale/translate state; native/Angular state owns visibility. The docs
fixture compiles the actual daisyUI class so this interaction is tested. Do not add daisyUI `modal`,
`modal-open` or checkbox-modal visibility classes. No separate stylesheet import is needed.

Style `.zd-modal-pane`, `.zd-modal-dialog` and `.zd-modal-actions`, or scope rules under `panelClass`.
The nearest origin theme is copied at opening; document theme tokens continue to inherit. Logical
placement follows the supplied Angular Directionality context, including live changes. Fullscreen
ignores native placement margins, uses `100dvh` and physical safe-area padding. Other sizes keep
one-rem viewport margins and scroll internally. Forced colors retain borders/focus; reduced motion
disables box transitions. Consumer content animations remain consumer-owned.

SSR emits no dialog portal, scroll lock or background isolation. Declarative render hooks open only
after hydration; an imperative service call on the server throws before creating DOM. Keep meaningful
trigger labels and essential information inline. Teardown removes portals, focus guards, listeners,
owned background attributes and the final lock. Background elements present at isolation are owned;
unrelated dynamic body portals and other Angular roots are outside the integration contract.

Migrating from daisyUI dialog markup: move content into a template, provide its label/options, replace
direct `showModal()`/`close()` calls with the Modal API and remove competing visibility classes.

See [visual evidence](modal-visual-matrix.md), [manual review](modal-accessibility-review.md) and
[progress](../plans/phase-5-modal-progress.md).

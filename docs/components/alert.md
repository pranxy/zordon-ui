# Alert

Status: automated implementation complete; manual accessibility pending.

Import `ZdAlert` from `@pranxy/zordon-ui/alert`. Alert is an inline message with native projected
content. It uses Angular 21 signals and daisyUI styling; no Aria widget or CDK overlay is required.

```ts
import { Component, signal } from '@angular/core';
import { ZdAlert } from '@pranxy/zordon-ui/alert';

@Component({
  imports: [ZdAlert],
  template: `
    <zd-alert
      color="info"
      style="soft"
      announcement="polite"
      dismissible
      dismissLabel="Close update"
      [open]="visible()"
      (openChange)="visible.set($event)"
    >
      <span zdAlertIcon>ⓘ</span>
      <h2 zdAlertTitle>Update available</h2>
      <p>Save your work before installing the update.</p>
      <button zdAlertActions type="button">Install later</button>
      <details zdAlertDetails>
        <summary>Release details</summary>
        <p>The update improves keyboard navigation.</p>
      </details>
    </zd-alert>
  `,
})
export class UpdateMessage {
  readonly visible = signal(true);
}
```

## API

| Input/output/method | Default         | Contract                                                                                |
| ------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `color`             | Unset           | `info`, `success`, `warning`, `error`; unset keeps neutral daisyUI styling.             |
| `style`             | Unset           | `soft`, `outline`, `dash`; unset uses filled styling.                                   |
| `direction`         | `responsive`    | `horizontal`, `vertical`, or column below 40rem/row at 40rem and above.                 |
| `announcement`      | `off`           | `off` has no live-region role; `polite` uses status; `assertive` uses alert.            |
| `open`              | `true`          | Consumer-owned visibility. Closed content is hidden and inert but remains instantiated. |
| `dismissible`       | `false`         | Shows a native close button. Does not govern API/timeout requests.                      |
| `dismissLabel`      | `Dismiss alert` | Accessible close-button name; localize it and keep it nonempty.                         |
| `autoDismiss`       | `0`             | Active milliseconds until one timeout request; zero disables. Finite 0–2147483647 only. |
| `openChange`        | —               | Emits false when dismissal is requested; the consumer accepts by changing open.         |
| `dismissRequested`  | —               | Reason: `close-button`, `timeout`, or `api`. Emitted before openChange.                 |
| `dismiss()`         | —               | Requests close with reason api; optionally pass another declared reason.                |

`ZdAlertColor`, `ZdAlertStyle`, `ZdAlertDirection`, `ZdAlertAnnouncement` and
`ZdAlertDismissReason` are exported types. The template export is `zdAlert`.

## Anatomy and composition

| Static projection selector | Content and ownership                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `zdAlertIcon`              | Decorative icon content; its wrapper is aria-hidden. Do not put focusable controls here. |
| `zdAlertTitle`             | Consumer-selected heading or text element; use a heading level appropriate to the page.  |
| Default content            | Body text or other native content.                                                       |
| `zdAlertDetails`           | Optional native details/summary, with browser-owned disclosure and SSR support.          |
| `zdAlertActions`           | Native buttons/links or a container of actions; application owns action handlers.        |

These selectors route projection and require no extra directive imports. Use one wrapper per named
region when grouping multiple nodes. Angular projection is static; a dynamically added selector
does not move content. Empty icon/action wrappers are hidden. The optional built-in close button
shares the actions region. No generic slot API or automatic icon/content generation is added.

Compose existing Button or Link directives on projected controls as needed. Native details works
without JavaScript. Alert does not own a details-open model, fetch content, or turn a static notice
into a modal dialog. Hiding Alert preserves projected state; use consumer `@if` for destruction/lazy
creation. No automatic Escape dismissal or focus movement occurs.

## Controlled dismissal and timing

Bind `(openChange)` or `[(open)]` to accept close requests. Ignoring the output leaves the alert
visible. A rejected request is emitted only once; close and reopen the alert, or change autoDismiss,
to start a new request cycle. Changing the timer resets its full duration. Changing message content
alone does not reset it. If a new message requires a fresh lifetime, recreate or reopen the alert.

Auto-dismiss is opt-in and starts after the browser's first render. The remaining duration pauses
while the pointer is over the host, focus is anywhere inside it, or the document is hidden. Moving
focus between actions/details remains paused. Timers and visibility listeners are canceled on
destruction. No timer runs on the server.

Do not time-limit essential instructions or actions that users cannot retrieve elsewhere. Leave
autoDismiss at zero for persistent errors or actionable content. Applications that accept manual
dismissal while focus is inside should move focus to a suitable surviving control as part of their
close handler. Alert cannot infer that destination and does not steal focus from elsewhere.

## Announcements and accessibility

Color and urgency are independent. Use off for static content, polite for routine dynamic updates,
and assertive only for urgent messages. Live modes set the matching native ARIA role and atomic
semantics, without a second announcer or duplicated explicit aria-live attribute. Do not add a
competing role/live binding to the host. The component does not focus itself or replay server text
after hydration; initial announcements vary by assistive technology.

For reliable routine updates, keep an initially empty polite region mounted and update its text.
If actions/details would make whole-region announcements too verbose, use off and a separate,
application-owned text-only status region. Do not announce the same message twice.

Close buttons have visible keyboard focus and a 44px minimum target. Projected controls retain
their own labels, focus indicators and disabled behavior. The component adds no animation. RTL,
forced-color interaction and responsive layout are browser-tested. Axe evidence covers the neutral
interactive fixture, not every semantic theme/style contrast combination. Consumer themes must
validate contrast, especially colored text in soft/outline/dash styles. Manual screen-reader,
contrast, zoom/reflow and device review remain pending.

## Styling and SSR

Compile daisyUI candidates for alert, alert-info/success/warning/error, alert-soft/outline/dash and
alert-horizontal/vertical in the consuming stylesheet. Class generation honors `ZdClassNames`
prefix configuration. The component's small embedded stylesheet handles layout, empty regions,
hidden state, wrapping and the native close button; it adds no package CSS import requirement.
Themes remain consumer-owned and follow normal data-theme inheritance.

Server HTML includes message, native details, controls and live semantics. Hydration preserves
that structure; timing begins only in the browser. Delayed pre-hydration events, incremental
hydration, Angular 21.0/22 and Firefox/WebKit lanes remain unverified.

See [ADR 0012](../architecture/0012-inline-alert-dismissal.md),
[accessibility review](alert-accessibility-review.md),
[visual matrix](alert-visual-matrix.md), and [daisyUI Alert](https://daisyui.com/components/alert/).

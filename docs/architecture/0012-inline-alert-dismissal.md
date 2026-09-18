# ADR 0012: Inline Alert semantics and controlled dismissal

- Status: Accepted
- Date: 2026-09-18

## Decision

Publish `ZdAlert` as an OnPush standalone component with static named projection regions and
default body content. Native buttons and details/summary supply interaction semantics. No Angular
Aria widget, overlay, modal focus behavior or separate live announcer is needed.

Visual color does not imply urgency. Announcement defaults to off; consumers explicitly choose
polite status or assertive alert semantics. Keep the host's role and atomic behavior consistent and
avoid a duplicate aria-live declaration. Human announcement behavior remains a review gate.

Dismissal emits a reason and openChange(false), leaving acceptance to the consumer. One request
per cycle prevents repeated timers/activations when a consumer rejects dismissal. Closed content
is hidden/inert and retained. Consumers choose destruction and the appropriate focus destination.

Auto-dismiss defaults to disabled and counts browser-active milliseconds only, pausing for hover,
focus within the host and hidden document state. A configured duration change or reopen resets the
cycle; text changes alone do not. The browser render hook and destruction cleanup bound its lifetime.

## Consequences

Applications own labels, headings, essential-content timing decisions, projected actions and
accepted-close focus handling. Native details remains functional in server HTML. Alert does not
turn off-page notices into dialogs or toasts. The shared theme, prefix and projection contracts
remain unchanged, and no dependencies or budgets are increased.

Automated accessibility evidence covers neutral interactive semantics and forced-color behavior;
custom/semantic palette contrast, physical devices and assistive technology remain human gates.
Delayed event replay and incremental hydration are not claimed by ordinary SSR proof.

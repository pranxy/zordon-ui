# Toast accessibility review

Status: Automated verification complete; human review pending. FDB-06 is not Done.

One local announcement path per event: persistent empty status/alert regions receive text for
newly visible or updated messages. Visible Alert components have announcements off. Queue promotion
announces the promoted text; custom templates require a plain-text equivalent. Initial content is
not assumed to trigger AT speech. Rapid render batches can coalesce; no speech delivery guarantee.

Incoming messages do not steal focus. Native action/close buttons are operable, timers pause on
hover/focus/hidden documents, and action messages persist by default. Focused dismissal returns to
the trigger or stable outlet. The application owns durable status, errors and cancellation.

Automated checks cover queue/dedupe/limits, action failures and pending guards, promise lifecycle,
focus, timeout pause, all nine logical placements, nested RTL centering, reduced motion, narrow
layout, SSR and full fixture axe. Alert owns and separately tests hidden-tab timing cleanup.

Pending human gates:

- NVDA/JAWS/VoiceOver: priority, repeated text, batched rapid events, queue promotions, verbosity,
  action discovery and focus restoration. Native live-region DOM changes do not prove speech.
- Theme contrast, custom content, translated long text/actions, forced colors, reduced-motion
  comfort, physical touch devices and 200%/400% zoom.
- Modal-context integration: root toasts remain background content during modal isolation.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration.

Use persistent messages or application UI for essential information. Do not rely on auto-dismissed
toasts as the sole record of errors or as an acknowledgement mechanism.

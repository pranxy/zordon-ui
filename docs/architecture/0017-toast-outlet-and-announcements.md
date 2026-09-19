# ADR 0017: Toast outlet and local announcements

Status: Accepted. Date: 2026-09-19.

## Context

FDB-06 needs a declarative outlet and imperative service with queueing, actions, promise updates,
priority, dismissal and SSR. The foundation anticipated overlay/live-announcer reuse, but selection
order favors native local semantics when a stable outlet can own the content.

## Decision

Provide scoped signal state with one outlet per service, a bounded FIFO queue, stable IDs and
explicit deduplication. Reuse the packaged Alert component for semantic colors, controls and
pauseable timer lifecycle. Render fixed stacks declaratively with daisyUI positions; they do not
need modal arbitration, outside dismissal, scroll locks or focus traps. Do not instantiate a
second overlay runtime or acquire a shared overlay-stack lease for a non-blocking fixed container.

Mount empty local status/alert regions and batch visible message changes by priority after initial
render. Keep visible Alert announcements off. No CDK LiveAnnouncer is necessary when these regions
already provide the appropriate local path. Initial SSR content stays meaningful without browser
containers or timers. Use the existing application-scoped ID generator.

Keep promise/action lifecycle explicit: no duplicate pending action, no stale resurrection, and
no implication that dismissal cancels work. Clear state when the outlet is destroyed. Restore
focus only when dismissed content owns it, using its origin or a stable outlet fallback.

## Consequences

Toasts remain in the outlet's DOM/theme scope and below native modal top layers/isolation. Root
placement outside transformed/clipping ancestors is consumer-owned. Important modal feedback
belongs inside the modal. Native announcement batches are not durable speech queues. Template
context lifetime, localization, valid mapping callbacks and persistent records remain consumer
responsibilities. Human AT, contrast, motion and modal-context review remain gates.

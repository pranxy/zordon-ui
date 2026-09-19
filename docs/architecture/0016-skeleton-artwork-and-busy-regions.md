# ADR 0016: Skeleton artwork and busy regions

Status: Accepted. Date: 2026-09-19.

## Context

FDB-05 needs flexible placeholder shapes and compositions without making every placeholder an
accessible loading announcement or changing the lifecycle of the real content.

## Decision

Use an OnPush decorative component, always aria-hidden and inert, with controlled active visibility.
Support geometric text, rectangle, circle and custom clip-path shapes plus three small presets.
Keep CSS dimensions consumer-owned and validate bounded line counts and positive motion duration.
Use daisyUI shimmer, optional pulse and static modes with embedded reduced-motion/forced-color
fallbacks. No Angular Aria/CDK widget, timers or browser-only state are required.

Provide a separate native-host directive that only binds aria-busy. The application supplies the
actual region semantics, data state, loaded/error content, focus and status announcements. Do not
discover ancestors, register placeholders or infer loading from their presence.

## Consequences

Consumers pass consistent loading state to their region and placeholders. Existing content and
controls remain under consumer control. Put status announcements outside busy regions. SSR uses
the same initial state as hydration. Human busy-region, animation and theme review remain gates.

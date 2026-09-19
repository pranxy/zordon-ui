# ADR 0014: Native Progress and decorative buffering

Status: Accepted. Date: 2026-09-19.

## Context

FDB-03 needs determinate and indeterminate progress, labels, formatting, buffering and completion.
The platform already implements non-interactive progress semantics; a second buffer progressbar
would communicate misleading duplicate task completion.

## Decision

Use an OnPush component containing exactly one native progress element. Null input omits value;
finite numbers clamp to a validated positive max. A required name and a pure formatter supply
accessible naming and value text. Visual labels and the optional bounded buffer are decorative.
Derived readonly state exposes completion consistently during SSR and browser rendering; there
is no event, async lifecycle, focus change or automatic live announcement.

Use daisyUI classes through ZdClassNames. Embed layout, buffer and animation overrides. Respect
reduced motion; force native appearance and hide the buffer in forced colors. Native semantics
need no Angular Aria or CDK dependency.

## Consequences

Consumers own busy regions, application success, cancellation, errors and announcements. They
must supply deterministic localized text and compile the existing daisyUI Progress styles. The
buffer is supplementary; applications can include its meaning in custom value text. Platform
painting and assistive-technology behavior remain manual release gates.

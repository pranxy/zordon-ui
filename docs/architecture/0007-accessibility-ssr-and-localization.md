# ADR 0007: Accessibility, SSR, localization, and directionality

Status: Accepted  
Date: 2026-08-07

## Context

Accessibility and platform compatibility cannot be added reliably after 68 component APIs are fixed. They must shape the shared contracts.

## Decision

- WCAG 2.2 AA is the target for library-owned behavior and default styling, subject to consumer-provided content and colors.
- Follow native semantics first and the relevant WAI-ARIA Authoring Practices pattern for custom widgets.
- Every interactive component documents its keyboard model, focus behavior, labeling requirements, and announcement behavior.
- Automated accessibility checks are necessary but do not replace manual keyboard and screen-reader verification.
- Support logical directions and Angular CDK Directionality. Public placements use `start` and `end` where physical direction is not intrinsic.
- User-facing library strings are injectable and localizable. Components do not hard-code English validation or action text without an override.
- Date, time, and number display use adapter/formatter interfaces rather than a fixed locale or timezone.
- Never access `window`, `document`, storage, media queries, observers, or layout measurements during server rendering.
- Browser-only behavior starts in SSR-safe render hooks and must tolerate missing or delayed layout information.
- Generated IDs and initial controlled state must match between server and client.
- Animations honor `prefers-reduced-motion`; essential state changes remain understandable without animation.
- Components remain usable at 200% zoom and reflow at 400% zoom where WCAG requires it.
- Forced-colors and visible focus indicators are included in the visual and manual verification matrices.

## Consequences

- Accessibility acceptance criteria are part of each component specification and cannot be deferred to final hardening.
- Formatting and direction dependencies remain injectable and tree-shakeable.
- Visual examples must include long translated strings and RTL content before a component is marked Done.

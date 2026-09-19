# ADR 0015: Radial Progress semantics and projected content

Status: Accepted. Date: 2026-09-19.

## Context

FDB-04 needs a daisyUI CSS ring with projected center labels/icons, variable dimensions, unknown
totals and percentage thresholds. A native progress element does not provide this projected visual
structure consistently across browsers.

## Decision

Use an OnPush component with one progressbar host and a decorative ring. Bind accessible min/max
and current value in actual units, normalize the CSS percentage separately, and omit current value
for unknown totals. A required name and pure formatter keep meaning independent of projection.
Hide projected center content from accessibility and make it inert. No Angular Aria/CDK dependency
or custom keyboard model is needed for this non-interactive indicator.

Thresholds select ring colors by inclusive percentage boundaries; validate strict ordering and
copy inputs. Values are controlled and completion is derived. Keep sizing in CSS, ring motion in
CSS, and application success/announcements in the consumer. Reduced motion stops rotation and
transitions. Forced colors substitutes a system outline plus text for the gradient.

## Consequences

Projected labels must be reflected in accessible name/value text when meaningful. Threshold colors
need textual context. Ring coloring does not compromise inherited center text contrast. Consumers
must supply sensible CSS dimensions and deterministic formatters. Human AT, forced-color, theme
contrast and animation review remain release gates.

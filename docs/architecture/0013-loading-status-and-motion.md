# ADR 0013: Loading status, delay and static motion fallback

- Status: Accepted
- Date: 2026-09-18

## Decision

Publish an OnPush standalone Loading component. Indeterminate status needs no Angular Aria widget
or CDK overlay. Keep a mounted status region with delayed text separate from aria-hidden/inert
artwork and optional visible text. Decorative mode removes announcements.

The consumer owns active work and busy state on its content. Inline/center/overlay are layout
choices; overlay is non-blocking and never implies focus trapping, scrolling locks or disabled
controls. Custom content is a static projection region with application-owned normal animation.

Use a linked signal to reset elapsed state when active/delay changes, plus a browser-only render
effect with timer cleanup. Server output shows zero-delay work immediately and keeps positive-delay
feedback empty. Do not introduce request management or a minimum visible interval.

For reduced motion and forced colors, replace visible SVG-mask/custom animation with a static ring.
Outer CSS animation suppression cannot stop animation embedded in SVG masks. Labels remain readable,
and forced colors uses system color. The fallback ships in component styles.

## Consequences

Consumers compile the daisyUI glyph candidates globally and supply localized task labels. Custom
animation lifetimes remain theirs even while artwork is hidden. Prefix and semantic theme
contracts remain unchanged. Native mask families and dimensions are browser-tested; deterministic
visual baselines use static fallback states instead of sampling unstable animation frames.

Assistive technology, animated visual review, consumer theme contrast and physical device/reflow
review remain human gates. Ordinary SSR proof does not establish delayed event replay, incremental
hydration or all Angular/browser compatibility lanes. No dependency or budget changes are required.

# ADR 0004: Overlay infrastructure and Angular CDK

Status: Accepted  
Date: 2026-08-07

## Context

Dropdowns, tooltips, dialogs, toasts, drawers, select popups, and megamenus share difficult behavior: positioning, stacking, focus, outside interaction, dismissal, scrolling, and cleanup.

## Decision

- Use Angular CDK as a required peer dependency for v1 overlay and accessibility infrastructure.
- Build one internal overlay abstraction on CDK Overlay, Portal, A11y, Bidi, and Layout primitives where appropriate.
- Keep the internal abstraction private so CDK details do not leak into public component APIs.
- Prefer native `<dialog>` and Popover behavior when it materially improves semantics, while retaining the shared abstraction for fallback, focus restoration, scroll strategy, and consistent events.
- Standardize overlay lifecycle states: closed, opening, open, and closing.
- Standardize dismissal reasons: trigger, selection, backdrop, outside pointer, Escape, programmatic, navigation, and destroy.
- Every overlay restores focus unless explicitly disabled for a documented workflow.
- Overlay instances must clean up portals, global listeners, observers, timers, and scroll locks on close and destroy.
- Logical placements must map correctly in RTL.
- Nested overlays use a shared stack manager so Escape and outside interactions affect only the top eligible overlay.
- Server rendering produces stable trigger/content relationships without accessing browser globals; overlays become interactive after hydration.

## Consequences

- CDK version compatibility follows the supported Angular range.
- Consumers pay for CDK code only when bundlers retain features that import it, but CDK remains an installation peer.
- Overlay behavior is tested once at the foundation level and again for component-specific policies.

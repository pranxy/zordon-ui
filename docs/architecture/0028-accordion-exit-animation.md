# ADR 0028: Accordion visual exit before hiding

Status: Accepted
Date: 2026-09-29

## Context

The component review explicitly requests an Accordion close animation. [ADR 0018](0018-accordion-aria-composition.md) requires immediate hiding and inertness, and the implementation also removes nonpreserved lazy content immediately. That prevents a visible exit.

## Decision

Keep Angular Aria as the sole owner of expanded state. On close, preserve immediate semantic closure and inertness, but retain the already-rendered panel content for a bounded visual exit. Hide the panel and apply existing lazy destruction/preservation policy when the exit completes. Reduced motion completes immediately. Rapid reopening and destruction must cancel obsolete presentation completion.

This decision replaces only ADR 0018's immediate visual hiding timing. It retains its Aria composition, keyboard, nested-content and consumer focus ownership decisions. Use local presentation code; do not introduce another expansion model or an animation framework.

## Alternatives considered

- Immediate hiding preserves current behavior but cannot meet the requested animation.
- Keeping all lazy content permanently mounted changes the existing preservation contract unnecessarily.
- A shared animation runtime adds scope without an established shared lifecycle requirement.

## Consequences and confirmation

Presentation can briefly outlive expanded state, but closed content must not remain interactive. Browser tests must observe intermediate close geometry, immediate nonfocusability and eventual collapse; unit tests protect lazy content lifetime. Test reversal, reduced motion and destruction. The user authorized implementation on 2026-09-29. The panel now retains content through the existing grid transition, with unit and browser regression coverage for content lifetime, immediate inertness, reversal and reduced motion.

## References

- [Feedback implementation plan](../../adrs/work/component-showcase-feedback.md), T3.

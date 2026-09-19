# ADR 0018: Accordion Aria composition

Status: Accepted. Date: 2026-09-19.

## Context

DSP-01 needs grouped disclosure, single/multiple expansion, native alternatives, keyboard,
disabled states, lazy/preserved content, SSR, deep links and nested use. Angular Aria 21 provides
the grouped trigger/panel behavior. Native details/radio presentation already ships in Collapse.

## Decision

Compose public Angular Aria Group, Trigger and Panel as host directives. Expose their supported
inputs and model output and forward public commands. Keep an explicit public panel reference
bridge. Use native headings and buttons with daisyUI Collapse anatomy. Do not duplicate Aria's
navigation or expansion state machine. Add synthetic native click activation because Aria's
group otherwise processes pointerdown and keydown only; keyboard default activation is prevented
by Aria, so the zero-detail click path does not double toggle.

Own lazy template creation/preservation in the Zordon panel. The installed compiler does not
forward the nested `preserveContent` host input through the composed Aria Panel. The small local
view policy avoids private Aria deferred-content APIs and keeps visibility tied to Aria state.
Use eager content for server-visible essentials. Closed panels are hidden/inert immediately.

Stop panel keydown/pointerdown/focusin propagation so form controls do not operate an ancestor
group. Put a nested accordion in a child component's template to prevent Aria's descendant query
from mixing groups. Verify this supported composition explicitly. Native details/radio alternatives
stay in Collapse; routing and focus policy for deep links remain application-owned.

## Consequences

Model bindings are synchronous state synchronization, not a vetoable request protocol. Consumers
normalize externally assigned single-mode state and restore focus when closing focused content
externally. Applications relying on bubbled panel events need internal/capture listeners. Inline
nested groups in the same outer template are unsupported. No overlay, global URL listener or
second keyboard runtime is introduced. Angular Aria remains a pinned developer-preview dependency;
manual AT and compatibility checks stay open.

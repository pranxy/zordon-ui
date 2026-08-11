# ADR 0002: Component API and composition conventions

Status: Accepted  
Date: 2026-08-07

## Context

A wrapper component for every daisyUI class would obscure native HTML behavior and make customization harder. Complex widgets still need coordinated Angular state and accessibility behavior.

## Decision

- Prefer an attribute directive when daisyUI styles an already-correct native element, including buttons, links, inputs, textareas, selects, checkboxes, radios, toggles, masks, and lightweight effects.
- Use a component for visual structures with meaningful projected parts, such as cards, alerts, avatars, stats, and mockups.
- Use compound components for widgets with coordinated child state, such as accordion, tabs, menu, carousel, table, and form-control groups.
- Add injectable services only for genuinely programmatic workflows such as dialogs and toasts. Every service-backed feature must retain a declarative API.
- Use standalone Angular declarations, OnPush change detection, signal inputs/outputs/models, host metadata, native template control flow, and SSR-safe render hooks.
- Support controlled state for every stateful component. Offer an uncontrolled initial-state input only when it improves ergonomics without creating two sources of truth.
- Name two-way state as the state noun plus `Change`, following Angular conventions.
- Preserve native events and semantics. Library outputs describe higher-level state transitions and do not replace native events without a specific reason.
- Project arbitrary consumer content by default. Named parts use directives or explicit selectors; template inputs are reserved for repeated or data-driven content.
- Apply the component-specific
  [named-part contract](../foundations/named-parts-and-slots.md): `[zd<Component><Part>]` selectors
  are optionally backed by directives from the root's component entry point, projection is static,
  and no generic string slot or runtime registry is introduced.
- Generate IDs only when consumers do not supply them, and use the shared hydration-safe ID facility.
- Do not require an icon library. Accept projected icons and templates, and provide only minimal internal icons where behavior would otherwise be unclear.
- Expose global defaults through a tree-shakeable `provideZordonUi(...)` function and lightweight
  injection tokens. Local inputs always take precedence. Apply the staged
  [component-defaults contract](../foundations/component-defaults.md); its runtime provider feature
  is added only with the first concrete component that can prove it.

## Consequences

- Native controls retain browser behavior, form participation, autofill, and accessible semantics.
- Some features expose both a directive and a higher-level group or field component.
- Compound components require documented ownership and registration rules for projected children.
- Public API reviews must include DOM semantics and content projection, not only TypeScript types.

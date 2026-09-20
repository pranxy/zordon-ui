# ADR 0019: Breadcrumbs native navigation

Status: Accepted. Date: 2026-09-20.

## Context

NAV-01 needs route-aware ancestry, current-page semantics, decorative icons/separators, responsive
labels, maximum visible items, middle overflow, scrolling and structured data. These are ordinary
page links, not application commands. A native disclosure supports overflow before hydration.

## Decision

Render native nav/ol/anchors and delegate application links to public RouterLink. Keep explicit
item identity and hierarchy; the last item is current. Use native details/summary for a collapsed
middle list and native horizontal scrolling as an alternative. Add only Escape/outside dismissal
and focus recovery after hydration. Do not use Menu/MenuItem, overlay arbitration or imperative
navigation for ordinary links. Keep full accessible names while CSS selects short visual labels.

Opt-in Schema.org microdata represents the full user-accessible trail in a hidden metadata
container. Require explicit absolute HTTP(S) canonical ancestor URLs, separate from router
commands. Bind text and URL anchors through Angular rather than injecting HTML or bypassing
resource-URL security. This avoids inferring the application's canonical policy.

## Consequences

The native dropdown stays in its DOM/theme context and needs unclipped placement. It does not
flip at viewport edges or escape modal isolation. Dynamic structural changes require application
focus policy. Applications own route hierarchy, canonical URLs, localization and decorative
templates. Native disclosure works without JavaScript; enhanced dismissal waits for hydration.
Manual AT, browser compatibility and production search validation remain separate gates.

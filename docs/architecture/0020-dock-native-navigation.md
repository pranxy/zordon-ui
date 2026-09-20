# ADR 0020: Dock native navigation

Status: Accepted. Date: 2026-09-20.

Dock presents page destinations using native anchors inside a named navigation landmark.
Angular RouterLink/RouterLinkActive supply route generation and matching through public APIs.
An optional active ID overrides route matching. Unavailable entries remove the destination and
tab stop while retaining named link semantics with aria-disabled.

Navigation does not require an Angular Aria widget. Action toolbars, tab panels and application
menus have different interaction contracts and remain outside this component. Native horizontal
scrolling preserves ordinary Tab behavior and accommodates more destinations at narrow widths.

Fixed layout reserves its explicit size and safe-area padding in the host by default. Sticky
layout applies to the host so its containing block governs positioning. Applications own overall
page clearance, clipping and overlaps. CSS handles breakpoints and safe areas without server/client
viewport disagreement or browser measurements. The tradeoffs are an extra scroll-container tab
stop, application-owned focus when visibility changes, and no overflow popup or roving-focus model.

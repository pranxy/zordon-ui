# ADR 0021: Megamenu composes Dropdown and optional Aria commands

Status: Accepted. Date: 2026-09-20.

Megamenu needs wide arbitrary navigation content, responsive layout and the same dismissal/focus
policies as Dropdown. A second overlay implementation would duplicate event arbitration, theme
forwarding, positioning and cleanup. The root therefore composes the public Dropdown directive and
retains its trigger/template primitives. Its only new behavior is optional successful-Router-navigation
closure. The panel supplies a bounded grid surface and a CSS single-column mobile fallback.

Site navigation remains native. A separate opt-in command bar composes Angular Aria MenuBar with
the existing Aria-backed Dropdown items/menus. This preserves a clear semantic distinction and avoids
adding command roles to links/forms. The bar delegates top-level roving focus, RTL arrows and
typeahead to Aria. Popups retain Dropdown focus and close policies. Sibling popup switching via Aria
submenu relationships is outside this composition; Escape returns to the bar before another root
is selected.

Panels remain lazy and closed on the server, consistent with Dropdown. Consumers supply ordinary
navigation outside the disclosure when links must work without JavaScript. Full width means the
viewport minus gutters, not ancestor width. Responsive panels retain the same content instance;
no viewport observer, alternate mobile content tree, native popover or second overlay stack is added.

Dependencies remain on the installed Angular 21 baseline. Projected content semantics, styles,
route matching, post-navigation focus and optional exclusive-open state remain consumer-owned.

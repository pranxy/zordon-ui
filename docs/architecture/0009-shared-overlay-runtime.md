# ADR 0009: One packaged overlay runtime

Status: Accepted for the Dropdown implementation; cross-component completion remains pending

Date: 2026-09-14

## Decision

Move the existing overlay implementation and tests into the dedicated
`@pranxy/zordon-ui/internal-overlay` secondary entry point. Export its coordinator as
`ɵZdOverlayCoordinator` and explicitly report its support contracts in API extraction. All shipped
overlay components import this package entry; they must not compile another copy of the source.
This is a published, version-locked implementation bridge, not an undocumented claim of privacy.
It carries no independent stability promise and is not intended for consumer imports.

The primary entry point remains lightweight and does not re-export overlay infrastructure. Aria and
CDK types may occur in the internal bridge report, but consumer Dropdown input/output signatures
must not expose them. Packaging and release review include both reports and the packed tarball.
Angular's generated static `ɵ` host-directive metadata necessarily references the pinned Aria
declarations. This compiler metadata is visible in the complete API report and is an explicit
compatibility commitment; it is not a consumer input/output or a re-export of an Aria declaration.
The report must retain it rather than editing generated declarations to conceal the dependency.
This decision adds no hidden global, DOM singleton, separately installed package or new dependency.

## Dismissal and composition

The shared coordinator can capture Escape on an owned pane before a hosted widget handles it.
The same stack arbitration still claims the event once and only the top eligible overlay receives
the request. An optional close predicate executes before entering `closing`; rejection leaves the
surface open and shielding lower surfaces. Dropdown uses this boundary to emit controlled close
requests and disposes only after its consumer accepts the new state.

Dropdown menus compose Aria Menu and MenuItem as host directives. Each lazy panel is an independent
Aria menu. Zordon owns the native disclosure trigger and connects nested overlay lifecycles, initial
focus, logical submenu opening/collapse and selection close. These are the documented lazy-portal
and controlled-state gaps; navigation within each menu, typeahead and disabled action behavior remain
Aria-owned. No Aria private patterns or mutation of its input signals is used. This avoids eager,
invisible submenu overlays and detached-parent focusout handling from the original probe.

## Completion boundary

The Dropdown package build must import the bridge rather than defining the coordinator again.
The existing browser foundation fixture uses the same entry. The broader foundation still requires
two actual shipped overlay component entries to prove cross-component stacking; a test fixture is
not counted as a second component. That gate remains open until another overlay component ships.

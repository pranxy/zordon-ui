# ADR 0022: Menu native navigation and Aria Tree

Status: Accepted. Date: 2026-09-20.

The daisyUI Menu appearance supports several semantics. Zordon separates them instead of switching
roles on one component. `ZdMenu` is native page navigation with recursive lists, group buttons and
RouterLinkActive. `ZdMenuTree` is a selectable hierarchy backed by Angular Aria Tree. Application
commands reuse Dropdown's Aria Menu and shared overlay runtime, with MegamenuBar for horizontal
command bars. No Aria declarations or private APIs are re-exported through Menu.

Both data APIs require unique nonempty IDs and labels across the full hierarchy. Native enabled
leaves require one destination; groups disclose children and have no simultaneous destination.
Icons/badges/shortcut hints are decorative, with explicit accessible badge information. Shortcuts
are hints rather than global registrations. Native link behavior and disabled semantics remain
distinct from selectable tree-item behavior.

Selection/expansion use Angular model state with immediate updates and change outputs. Consumers own
state consistency and focus after structural changes. Aria owns tree roles, roving focus, keyboard
axes, typeahead, selection and deferred groups. A dedicated branch button provides pointer/touch
expansion and returns focus to the tree item without adding another sequential tab stop.

Packaged CSS owns layout, wrapping and focus/state rules. daisyUI supplies visual modifiers/tokens.
The fixture omits redundant generic menu/layout candidates and scopes its own demo styling, keeping
all existing CSS and bundle limits. Initial native expanded links render without JavaScript;
interactive expansion and Tree selection require hydration. No new overlay or viewport runtime is added.

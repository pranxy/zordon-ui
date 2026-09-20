# ADR 0023: Navbar native layout and controlled panels

Status: Accepted. Date: 2026-09-20.

Navbar is a named native navigation landmark with projected start/center/end regions. Projected
anchors retain their HTML and Router behavior. A separate CSS-only content wrapper controls
desktop/mobile visibility at 48rem. Angular Aria is appropriate for separately composed command
menus, not for replacing ordinary navigation with roving tabindex or menu roles.

A native button directive exposes required panel identity, accepted expanded state, disabled state
and an expansion request output. It never owns the panel or optimistically changes accepted state.
An inline panel fixture proves acceptance/rejection, native activation, owner-controlled Escape and
route closure. Concrete Drawer pairing is reserved for LYT-02; Navbar does not duplicate the
existing overlay/focus runtime or implement a partial Drawer.

Packaged CSS owns layout, logical direction, safe-area padding, static/sticky/fixed positioning and
transparent background. Fixed bars do not reserve height; applications own layout offsets and
stacking. Responsive visibility retains views and owner state. Applications own focus recovery
when resizing hides the currently focused region and contrast over transparent backgrounds.

Server-rendered native links remain usable. The mobile fixture starts expanded, preserving critical
destinations before hydration. No viewport measurement, browser-only initialization, Router import,
event replay dependency or animation is needed in Navbar. Public API remains independent of Aria
preview declarations and the future Drawer API.

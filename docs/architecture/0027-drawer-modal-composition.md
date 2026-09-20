# ADR 0027: Drawer composition with the shared Modal lifetime

Status: Accepted · 2026-09-20 · LYT-02

Drawer requires inline application layouts and modal navigation, with shared nesting, background
isolation and scroll ownership. A second modal stack would create conflicting locks and focus
behavior. Angular Aria has no separate drawer primitive to adopt.

`ZdDrawer` composes the existing public `ZdModal` directive in overlay mode. Modal retains
portal creation, dialog semantics, initial/restored focus, focus trapping, inert background,
nested lifetime and shared scroll leases. Drawer supplies edge geometry, safe areas, a typed
lazy panel template, controlled close requests, Router observation and explicit touch handling.
Persistent grid and push-margin modes remain native inline layouts.

The owner accepts all close requests by updating `open`. Modal's guard stays false while Drawer
emits its own typed request; rejected requests preserve the active surface. Responsive changes
transfer the lazy template between layouts and leave accepted state unchanged. SSR uses the
desktop responsive fallback and renders inline panels; modal portals start after rendering.

The implementation exposed shared Modal corrections. Overlay-backed modal dialogs must also
declare `aria-modal=true`. Its pointerdown handler must return void: assigning `false` in an
Angular event expression canceled the pointer event, preventing native button focus and causing
nested closure to restore the wrong element. The new handler records the boundary flag without
canceling pointer focus. Modal also supplies system-color fallbacks for its surface, text and
border so it remains opaque when theme variables are absent. Drawer and full Modal regressions
cover these changes.

The swipe affordance is a named native close button with dedicated pointer capture. Only an
outward horizontal touch/pen gesture beyond 64px closes; drags suppress compatibility clicks.
There is no global edge gesture or alternative keyboard manager. Applications own panel state
across view recreation, nested open models and focus when an original element no longer exists.

Manual assistive technology, physical touch, safe-area devices, custom-theme contrast and zoom
remain release gates. Package/API/coverage budgets and Angular 21 dependencies are unchanged.

# Megamenu accessibility review

Status: Automated verification complete; human review pending. NAV-04 is not Done.

Native site navigation and application command menus use separate semantics. The native surface
adds no widget roles or focus trap; labelled regions/headings/forms remain application-owned.
The optional command bar uses Angular Aria MenuBar, composed with existing Aria-backed Dropdown menus.

Automated scenarios cover native Tab/Enter/ArrowDown/Escape, focus restoration, Router current-page
state and successful-navigation closure, unavailable link placeholders, hover/focus/manual policies,
outside dismissal, destruction, command roving focus/RTL/typeahead, responsive full-width/one-column
containment, reduced motion, forced-color focus, axe and closed-server/hydrated-panel behavior.
Unit tests cover optional Router operation, subscription cleanup and controlled-state acceptance.

Pending human gates:

- NVDA, JAWS and VoiceOver: expanded/controlled relationships, heading/link discovery, command
  announcement and focus after navigation or panel dismissal.
- Theme/content contrast, long translations, physical touch devices, high-contrast painting,
  viewport clipping and 200%/400% zoom/reflow.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration.

Applications own names, projected content semantics/focus styles, current-route accuracy, focus after
navigation and no-JavaScript navigation alternatives. MenuBar is opt-in for commands. Open sibling
menus do not switch on horizontal arrows; close with Escape before navigating the bar. Independent
roots require consumer-controlled state for exclusive-open behavior.

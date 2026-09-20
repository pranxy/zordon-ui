# Dock accessibility review

Status: Automated verification complete; human review pending. NAV-02 is not Done.

A named navigation landmark contains native links, current-page markers and nonfocusable
unavailable link placeholders. Decorative icons, visual labels and badges are hidden from AT;
explicit accessible names preserve labels and optional badge information. No menu/tab semantics
or custom keyboard model is introduced.

Automated evidence covers Router state and manual overrides, destinations, disabled behavior,
Tab/Enter navigation, horizontal keyboard scrolling in narrow RTL, responsive visibility,
all five sizes, fixed reservation, simulated 24px safe area, sticky containment, reduced motion,
forced-color focus, axe, native SSR links and hydrated navigation.

Pending human gates:

- NVDA, JAWS and VoiceOver landmark/current-page/badge/unavailable announcements and link navigation.
- Theme/icon contrast, physical touch and notched devices, long translations, high-contrast
  painting and 200%/400% zoom/reflow.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration.

Applications own labels, nonfocusable icon artwork, unique current-route policy, containing-block
geometry, fixed-surface overlap and focus when responsive visibility or item replacement hides
the focused destination. Automated safe-area simulation does not verify physical device behavior.

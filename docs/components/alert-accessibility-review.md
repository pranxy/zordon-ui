# Alert accessibility review

Status: Pending human review.

- [x] Explicit off/status/alert semantics and atomic announcements are unit-tested.
- [x] Native close button name, type, keyboard activation and focus retention on rejected requests.
- [x] Native details and projected actions work in browser; details also works without JavaScript.
- [x] Timed requests pause during pointer, focus-within and hidden-document interaction.
- [x] Neutral interactive axe scans, narrow RTL, forced colors and reduced-motion environment.
- [ ] NVDA and VoiceOver: routine/urgent updates, initial SSR content, changes and duplicate announcements.
- [ ] Contrast of every color/style in supported themes, especially soft/outline/dash text.
- [ ] Human focus indicators, 200–400% zoom/reflow, forced colors and physical touch targets.
- [ ] Application review of timing necessity, retrievability of information and accepted-close focus destination.

Automated axe scans are scoped to the neutral interactive fixture. They do not certify the full
semantic color/style matrix or consumer-projected controls. No manual sign-off is claimed.

# Loading accessibility review

Status: Pending human review.

- [x] Atomic status text, decorative suppression, localized nonempty labels and separate inert artwork.
- [x] Delayed text/artwork, cancellation, synchronous reset and no server timer.
- [x] Real mask families/sizes, non-blocking pointer and keyboard overlay actions.
- [x] Reduced-motion and forced-color static fallback, narrow RTL, axe scans.
- [ ] NVDA and VoiceOver: empty-to-populated status changes and initial server content.
- [ ] Human animation review for all six styles; readability of the static fallback.
- [ ] Theme contrast, visible labels, forced colors and color-independent communication.
- [ ] Physical devices, 200–400% zoom/reflow and application busy/disabled-state integration.

No manual sign-off is claimed. Consumers supply aria-busy on affected content and avoid duplicate
announcements. Loading does not block interaction or provide determinate progress semantics.

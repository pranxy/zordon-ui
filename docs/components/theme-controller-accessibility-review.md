# Theme Controller accessibility review

Status: Pending human review. Automated evidence is recorded in the component progress tracker.

- [x] Native checkbox/toggle, radio, select and button roles and labels are represented in fixtures.
- [x] Keyboard Space/Enter and synchronized checked/selected/pressed states are browser-tested.
- [x] Axe scans pass in light and dark; nested preview ownership is verified.
- [x] RTL narrow viewport, forced colors, reduced motion and disabled controls are exercised.
- [ ] NVDA/Firefox or Chrome and VoiceOver/Safari: names, group announcements and selected state.
- [ ] Human contrast, visible focus and forced-colors review for every supported consumer theme.
- [ ] 200–400% zoom/reflow and physical mobile touch/keyboard review.
- [ ] Assess whether the consuming application needs a live announcement for external theme changes.

No manual sign-off is claimed. Native semantics and automated checks do not complete this gate.

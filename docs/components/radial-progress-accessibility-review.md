# Radial Progress accessibility review

Status: Automated checks complete; human review pending. FDB-04 is not Done.

The host exposes one named progressbar with min/max/value in actual task units. Unknown totals
omit the current value. Decorative center content is aria-hidden and inert; it cannot add another
focus stop or duplicate accessible name. Consumers provide any meaningful projected text through
the name or formatter too, and own busy regions and completion announcements.

Automated checks cover numeric and threshold validation, completion/reset, projected content,
class prefixes, geometry, colors, animation opt-out, reduced motion, forced colors, RTL text,
narrow reflow, focus retention, axe, no-JavaScript server semantics and hydration.

Pending human gates:

- NVDA/JAWS/VoiceOver: names, custom units, unknown totals, value changes and consumer announcements.
- Contrast across supported themes, threshold meanings without color, Windows high contrast
  outline/text and projected icon or label alternatives.
- 200%/400% zoom, long localized center labels, RTL, physical devices and animation comfort.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration compatibility.

Neither axe nor visual snapshots certify AT speech or all-theme contrast. Do not put actions in
the inert center or treat progress completion as proof of application success.

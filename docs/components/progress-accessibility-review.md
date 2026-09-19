# Progress accessibility review

Status: Automated checks complete; human review pending. FDB-03 is not Done.

One native progress element has a required name, normalized value/max and formatted value text.
Unknown totals omit `value`, preserving native indeterminate semantics. Visual labels and buffers
are decorative. No tabindex, live region, invented keyboard interaction or duplicate progressbar
is introduced. Consumer buttons retain focus during changes. The application owns busy state,
completion announcements and errors.

Automated Chromium/axe checks cover the entire fixture, determinate/indeterminate transitions,
completion/reset, hidden visible labels, RTL buffer geometry, 360px reflow, motion opt-out,
reduced motion and forced colors. Server HTML remains meaningful without JavaScript; hydration
retains native meaning and responds to changes. These checks do not verify AT speech.

Pending human gates:

- NVDA/JAWS with Chrome/Firefox and VoiceOver with Safari: naming, value text, unknown totals,
  focus stability, custom units and completion announcements in a consuming application.
- Windows high contrast/native painting, all supported theme colors and buffer visibility.
- 200%/400% zoom, long localized labels, RTL, physical touch devices and static/animated feedback.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration compatibility.

Do not infer success from reaching 100%, announce every update, or put essential state only in
the decorative buffer. Custom formatting owns localization and meaningful value text.

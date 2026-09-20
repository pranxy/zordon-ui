# Breadcrumbs accessibility review

Status: Automated verification complete; human review pending. NAV-01 is not Done.

A named navigation landmark contains an ordered hierarchy and one aria-current page. Decorative
separators/icons are hidden from assistive technology. Short visual labels retain complete
accessible names. Overflow uses native details/summary and a list of navigation links, with no
application menu semantics. The full metadata container is hidden from visual/AT navigation.

Automated evidence covers overflow bounds, current-page policy, RouterLink destinations and
navigation, native href behavior, Tab/Enter/Escape, outside dismissal, focus restoration, complete
structured ordering, no-JavaScript disclosure, SSR/hydration, narrow RTL dropdown containment,
native horizontal keyboard scrolling, reduced motion, forced-color focus and axe.

Pending human gates:

- NVDA, JAWS and VoiceOver: hierarchy/current-page announcement, summary state, nested list
  navigation, modified activation, shortened-label comprehension and focus restoration.
- Custom theme contrast, decorative icons, long translated labels, physical touch devices,
  high-contrast painting, 200%/400% zoom/reflow and viewport-edge placement.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration.

Applications own accurate hierarchy, localized labels, canonical URLs, icon semantics, unclipped
placement and focus policy when programmatically replacing the trail or changing overflow mode.
Search-engine validation of a production site's structured data is outside component verification.

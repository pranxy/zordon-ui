# Menu accessibility review

Status: Automated verification complete; human review pending. NAV-05 is not Done.

Native navigation uses named nav/list semantics, inline disclosure buttons, real destinations and
current-page markers. Disabled leaves have no href or tab stop. Separators remain inside ordinary
list items. The separate selectable hierarchy uses Angular Aria Tree/TreeItem/TreeItemGroup; command
menus compose existing Dropdown/Aria Menu behavior.

Automated evidence covers native Tab/Enter/disclosure, complete badge names, disabled destinations,
Router state and manual overrides, hierarchy identity validation, Tree keyboard expansion/selection,
disabled skipping, typeahead, RTL, controlled models, pointer expansion with focus return, five
sizes, horizontal wrapping, 360px containment, forced-color focus, reduced motion and axe. SSR checks
native no-JavaScript links/initial expansion followed by hydrated Router and Tree interaction.

Pending human gates:

- NVDA, JAWS and VoiceOver: list/title/separator understanding, disclosure relationships, Tree
  levels/positions/selection, branch-button discoverability and command submenu navigation.
- Theme/icon contrast, physical touch targets, high-contrast painting, long translations, zoom/reflow
  at 200%/400%, large/deep data sets and focus when externally collapsing/removing nodes.
- Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration.

Applications own localized labels, nonfocusable icon templates, actual shortcut registrations,
selection consistency and post-navigation/data-change focus. Models apply user changes immediately;
they are not request-only controlled state. Badge changes do not create live announcements.

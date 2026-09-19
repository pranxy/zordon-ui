# Accordion accessibility review

Status: Automated verification complete; human review pending. DSP-01 is not Done.

Native heading/button pairs expose Angular Aria expanded, controls and disabled relationships.
Panels are labelled regions, hidden and inert when closed. Panel events do not operate the outer
group. Nested groups use a child component boundary. Native details/radio alternatives retain
their browser semantics. Eager content supports meaningful initial HTML.

Automated evidence covers single/multiple state, group commands, keyboard movement, disabled
items, lazy recreation/preservation, input and nested-group isolation, synthetic activation,
stable relationships, SSR/hydration, native alternatives, deep links, RTL, narrow layout, reduced
motion, forced-color focus styling and axe.

Pending human gates:

- NVDA, JAWS and VoiceOver: headings/regions, expanded announcements, soft-disabled discovery,
  synthetic activation, nested groups, navigation and preservation of reading position.
- Theme/custom-indicator contrast, high-contrast painting, long translated labels, touch devices,
  zoom/reflow at 200%/400%, focus perception and motion comfort.
- Native details-name compatibility, Firefox/WebKit, Angular 21.0/22, delayed event replay and
  incremental hydration.

Applications own heading hierarchy, unique IDs, external state consistency, deep-link focus,
focus recovery after externally closing a panel, and meaningful names for native radios.

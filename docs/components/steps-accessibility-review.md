# Steps accessibility review

Status: automated checks verified; manual review
pending. Baseline: Angular 21.2.19, CDK/Aria 21.2.14, daisyUI 5.7.16, Chromium.

| Area               | Automated evidence                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Semantics          | Named ordered list, current-step marker, readable status/description, display-only content           |
| Keyboard           | Native Tab order, disabled skipping, Enter/Space request, rejected request retains focus             |
| Linear progression | Preceding completion gates forward steps; earlier/current steps remain eligible                      |
| Wizard composition | Native required validation, accepted panel visibility and owner heading focus                        |
| States             | Complete/current/upcoming/error/disabled; combined current error; all colors and custom icon context |
| Responsive         | Desktop horizontal, 360px vertical, explicit horizontal native overflow, RTL                         |
| Focus/contrast     | Forced-color focus/current marker, axe checks; no component animation                                |
| SSR                | Meaningful progress and disabled state before hydration; validated progression after hydration       |

Pending: NVDA/JAWS/VoiceOver ordered-list/current-step announcements, custom icon/color contrast,
physical touch, high-contrast painting, long translated labels, 200%/400% zoom/reflow and native
overflow interaction. Firefox/WebKit, Angular 21.0/22, delayed event replay and incremental hydration
remain unverified. The owner must test asynchronous validation, panel announcements and focus when
steps are removed or navigation is rejected.

No tab roles or live region are added. Icon templates must be nonfocusable and decorative. Optional
controls IDs must reference existing owner panels. Native button names include label, description
and visible state. This review does not mark the component Done.

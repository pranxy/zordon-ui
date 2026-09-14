# Calendar accessibility review

**Maturity:** Preview; manual review pending.  
**Platform:** Angular 21.2.19, Aria/CDK 21.2.14.  
**Date:** 2026-09-14.

Automated checks cover labelled grids, native day buttons with pressed state, current-day
annotations, unavailable dates, controlled selection, keyboard movement, RTL, popup Escape and
focus restoration, and scoped axe scans. Native buttons retain their semantic role inside Aria
grid cells. Grid selection is disabled: date/range business state is announced through each day
button's `aria-pressed`, preventing Aria selection bookkeeping from changing the form value.

| Review                                                                              | Status  | Owner          |
| ----------------------------------------------------------------------------------- | ------- | -------------- |
| Screen-reader day names, pressed/current/unavailable states and month announcements | Pending | Human reviewer |
| NVDA/Firefox, NVDA/Chromium, VoiceOver/Safari, mobile screen readers                | Pending | Human reviewer |
| Physical touch, popup dismissal and keyboard appearance                             | Pending | Human reviewer |
| Theme contrast and selected/unavailable distinguishability                          | Pending | Human reviewer |
| Forced-colors focus/selection and 200%/400% zoom/reflow                             | Pending | Human reviewer |

Consumers supply an accessible name, translated strings/locale, and any error/help IDs. Custom
day content must be noninteractive. The native dialog supplies modality on the supported browser
baseline; environments without dialog methods receive an explicitly nonmodal open-dialog
fallback with a close button. No manual result is inferred from automated checks.

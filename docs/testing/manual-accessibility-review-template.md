# Manual accessibility review template

Copy this file into the component's documentation directory when beginning its accessibility review. Automated axe results are evidence, but they do not establish WCAG conformance on their own.

## Review metadata

| Field                        | Value                                            |
| ---------------------------- | ------------------------------------------------ |
| Component and maturity       |                                                  |
| Reviewer                     |                                                  |
| Review date                  |                                                  |
| Commit or package version    |                                                  |
| Component states reviewed    |                                                  |
| Browser and operating system |                                                  |
| Screen reader and version    |                                                  |
| Input devices                | Keyboard / pointer / touch / switch / other      |
| Themes and direction         | Light / dark / custom / forced colors; LTR / RTL |
| Viewports and zoom           | Desktop / mobile / 200% zoom / 400% reflow       |
| Related specification        | WAI-ARIA APG pattern or native HTML behavior     |

Use `Pass`, `Fail`, or `N/A` for every result. A failure must link to an issue; `N/A` must include a reason.

## Semantics, names, and relationships

| Check                                                                                | Result | Evidence or issue |
| ------------------------------------------------------------------------------------ | ------ | ----------------- |
| The most semantic native element is used.                                            |        |                   |
| Role, accessible name, description, value, and state are correct.                    |        |                   |
| Labels, help, errors, headings, groups, and regions are programmatically associated. |        |                   |
| Decorative content is hidden and meaningful non-text content has an equivalent.      |        |                   |
| Dynamic state changes are exposed without duplicate or noisy announcements.          |        |                   |
| Consumer-provided ARIA is preserved unless the public API explicitly owns it.        |        |                   |

## Keyboard and input

| Check                                                                       | Result | Evidence or issue |
| --------------------------------------------------------------------------- | ------ | ----------------- |
| Every function is operable with keyboard alone.                             |        |                   |
| Tab order follows the visual and logical order without positive `tabindex`. |        |                   |
| Pattern-specific keys match the WAI-ARIA APG or native platform behavior.   |        |                   |
| Focus never becomes trapped except inside an intentional modal interaction. |        |                   |
| Pointer gestures have a single-pointer alternative.                         |        |                   |
| Touch targets meet the approved target-size policy or documented exception. |        |                   |
| Dragging, hover, and motion interactions have equivalent alternatives.      |        |                   |

Record the tested sequence and observed result:

```text
1.
2.
3.
```

## Focus management and visibility

| Check                                                                                          | Result | Evidence or issue |
| ---------------------------------------------------------------------------------------------- | ------ | ----------------- |
| Initial focus enters the component at the expected target.                                     |        |                   |
| Opening, closing, disabling, removing, and validation events move or retain focus predictably. |        |                   |
| Modal focus is contained and restored to a logical target.                                     |        |                   |
| Focus indicators remain visible in every theme and forced-colors mode.                         |        |                   |
| Sticky content, overlays, and virtual keyboards do not obscure the focused element.            |        |                   |

## Screen-reader review

Minimum stable-component coverage is one current desktop screen reader plus VoiceOver/WebKit. Forms, navigation, and overlays should also cover a second desktop combination and the applicable mobile screen reader.

| Combination                                      | Result | Evidence or issue |
| ------------------------------------------------ | ------ | ----------------- |
| NVDA with Firefox or Chrome on Windows           |        |                   |
| VoiceOver with Safari on macOS                   |        |                   |
| VoiceOver with Safari on iOS, when applicable    |        |                   |
| TalkBack with Chrome on Android, when applicable |        |                   |

For each applicable combination, verify browse/read mode, focus mode, announcements, rotor/element navigation, reading order, and interaction instructions.

## Forms, errors, and status

| Check                                                                                        | Result | Evidence or issue |
| -------------------------------------------------------------------------------------------- | ------ | ----------------- |
| Label, required, disabled, read-only, checked/selected, and validation states are announced. |        |                   |
| Errors identify the field, describe correction, and remain available after announcement.     |        |                   |
| Submission, reset, autofill, and browser validation behave predictably.                      |        |                   |
| Loading, success, warning, and failure messages use appropriate live-region priority.        |        |                   |
| Instructions do not rely only on color, position, shape, sound, or motion.                   |        |                   |

## Visual, responsive, and motion review

| Check                                                                                                     | Result | Evidence or issue |
| --------------------------------------------------------------------------------------------------------- | ------ | ----------------- |
| Text and non-text contrast pass in light, dark, and required custom themes.                               |        |                   |
| Content remains usable at 200% zoom and reflows without two-dimensional scrolling at 400% where required. |        |                   |
| Text spacing overrides do not clip, overlap, or hide content.                                             |        |                   |
| Forced-colors mode preserves content, states, boundaries, and focus indicators.                           |        |                   |
| `prefers-reduced-motion` removes or reduces non-essential motion.                                         |        |                   |
| Orientation is not unnecessarily locked and responsive ordering remains logical.                          |        |                   |

## Internationalization and platform review

| Check                                                                                   | Result | Evidence or issue |
| --------------------------------------------------------------------------------------- | ------ | ----------------- |
| LTR and RTL reading, focus, arrow keys, placement, and animation direction are correct. |        |                   |
| Long translated labels and localized values reflow without loss.                        |        |                   |
| High contrast, increased text size, and platform accessibility settings remain usable.  |        |                   |
| Server-rendered and hydrated output preserves names, IDs, focus, and announcements.     |        |                   |

## Automated evidence

| Check                                                                       | Result | Evidence or issue |
| --------------------------------------------------------------------------- | ------ | ----------------- |
| Unit accessibility assertions pass.                                         |        |                   |
| axe passes in every representative state and required theme.                |        |                   |
| Browser keyboard/focus tests pass.                                          |        |                   |
| Visual regressions pass for focus, forced colors, zoom, and reduced motion. |        |                   |

## Review outcome

- [ ] All applicable checks pass.
- [ ] Every failure has an owner, severity, and release decision.
- [ ] Automated tests cover regressions discovered during manual review.
- [ ] Component documentation records keyboard interaction and assistive-technology behavior.
- [ ] Reviewer approves the component's current maturity label.

### Open issues and exceptions

| Issue | WCAG criterion | Severity | Owner | Target release | Approved exception and expiry |
| ----- | -------------- | -------- | ----- | -------------- | ----------------------------- |
|       |                |          |       |                |                               |

### Sign-off

| Role                   | Name | Date | Decision         |
| ---------------------- | ---- | ---- | ---------------- |
| Accessibility reviewer |      |      | Approve / Reject |
| Component owner        |      |      | Approve / Reject |

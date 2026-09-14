# Calendar visual matrix

| Story                     | Boundaries                                                                               | Evidence                        |
| ------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------- |
| Light desktop single date | Selected/current/unavailable/outside days, navigation, native labels                     | `calendar--light-desktop.png`   |
| Dark mobile RTL range     | Contiguous range, logical direction, narrow layout, translated/custom companion examples | `calendar--dark-rtl-mobile.png` |
| Open popup                | Native dialog, backdrop, close action, calendar anatomy                                  | `calendar--popup.png`           |

The screenshots cover material presentation boundaries. Selection modes, disabled and readonly,
custom day content, locale/week start, prefix composition, and civil-date limits have separate
unit/browser assertions. Keyboard and Escape/focus restoration, reduced motion, forced colors,
and SSR/hydration require behavior evidence; screenshots alone do not establish accessibility.

Manual assistive technology, contrast, physical mobile and zoom/reflow review remain open in
[the accessibility record](calendar-accessibility-review.md).

# Steps visual matrix

| Scenario                     | Evidence                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Light desktop                | `steps--light-desktop.png`: completed/current/upcoming wizard with active delivery panel; display-only error/disabled/icon states |
| Dark RTL 360px               | `steps--dark-rtl-mobile.png`: vertical progression, logical marker/connector placement and wrapping labels                        |
| Horizontal/vertical          | Browser geometry and explicit orientation checks                                                                                  |
| All eight colors             | Browser class/state checks; daisyUI color modifiers compiled in fixture                                                           |
| Forced colors/reduced motion | Browser focus/current error and axe; no Steps animations                                                                          |
| Explicit horizontal mobile   | Browser local-overflow and focusable scroll-container checks                                                                      |

Snapshots live in `e2e/__screenshots__/visual-regression.spec.ts/`. The fixture compiles color
modifiers while component CSS owns layout, and demo styles are explicitly scoped. Manual custom
theme/icon, long-translation, zoom, high-contrast painting and physical-device review remains pending.

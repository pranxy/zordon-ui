# Progress visual matrix

| Scenario                   | Automated evidence                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| Light desktop              | Native upload at 25%, buffer at 70%, custom units, indeterminate pattern, zero and eight semantic colors |
| Dark RTL at 360px          | Same states with logical buffer origin and wrapping controls/labels                                      |
| Reduced motion             | Both screenshots use static rendering; browser asserts no animation or value transition                  |
| Explicit animation opt-out | Browser toggles animation and checks native computed styles                                              |
| Forced colors              | Browser checks restored native appearance and hidden decorative buffer                                   |
| State changes              | Browser checks complete, reset and unknown totals without changing focus                                 |

New baselines: `progress--light-desktop.png` and `progress--dark-rtl-mobile.png` in the Chromium
visual snapshot directory. Tall viewports keep the documentation sticky header outside captures.
Human animation, contrast across all themes, native forced-color painting, zoom/reflow and
Firefox/WebKit review remain pending. Baselines certify only the recorded environment.

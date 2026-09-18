# FAB visual matrix

| Case                                                            | Evidence                    |
| --------------------------------------------------------------- | --------------------------- |
| Light desktop: single, expanded vertical and four-action flower | `fab--light-desktop.png`    |
| Dark RTL mobile: single and expanded vertical fallback          | `fab--dark-rtl-mobile.png`  |
| Four fixed corners in both directions, nonoverlapping actions   | Chromium geometry checks    |
| Five-action fallback, reduced motion and forced colors          | Chromium interaction checks |

Baselines are inspected before acceptance. Human contrast, reflow, physical touch and safe-area
review remain pending.

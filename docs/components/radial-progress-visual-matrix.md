# Radial Progress visual matrix

| Scenario                   | Automated evidence                                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Light desktop              | Values 0/25/50/75/100, custom units, unknown total, projected label/icon, three diameters/thicknesses and eight colors |
| Dark RTL at 360px          | Same gallery with wrapping controls and isolated formatted center text                                                 |
| Reduced motion             | Static screenshots and browser checks of ring and endpoint transition/animation settings                               |
| Explicit animation opt-out | Browser toggles rotation off and back on                                                                               |
| Threshold changes          | Browser verifies inclusive percentage boundaries with a max of 200                                                     |
| Forced colors              | Browser verifies static border, suppressed gradients and visible text                                                  |

Baselines: `radial-progress--light-desktop.png` and `radial-progress--dark-rtl-mobile.png` under the
Chromium visual snapshot directory. Tall viewports keep the documentation header outside captures.
Human animation, all-theme contrast, zoom/reflow, high-contrast painting and Firefox/WebKit review
remain pending. Ring color does not change the center text foreground.

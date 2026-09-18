# Theme Controller visual matrix

| Scenario                                                       | Evidence                                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Light desktop with system choice and independent light preview | `theme-controller--light-desktop.png`                                            |
| Dark narrow RTL with independent light preview                 | `theme-controller--dark-rtl-mobile.png`                                          |
| Forced colors and reduced motion at 360px                      | Chromium geometry/interaction test                                               |
| All native control states and nested isolation                 | Chromium interaction suite                                                       |
| Custom registry names                                          | Unit/browser selection tests; consumer CSS compilation remains application-owned |

Baselines live in `e2e/__screenshots__/visual-regression.spec.ts/`. Human contrast, zoom/reflow,
physical device and custom-theme review remain pending; see the accessibility review.

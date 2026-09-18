# Alert visual matrix

| Scenario                                                                      | Evidence                       |
| ----------------------------------------------------------------------------- | ------------------------------ |
| Four semantic colors × filled/soft/outline/dash, plus vertical layout         | `alert--light-variants.png`    |
| Neutral interactive content, native details and close button, dark narrow RTL | `alert--dark-rtl-mobile.png`   |
| Responsive row-to-column at 40rem, no narrow overflow                         | Chromium geometry assertions   |
| Forced colors and reduced-motion environment                                  | Chromium interaction/axe check |

Baselines live in `e2e/__screenshots__/visual-regression.spec.ts/`. Palette screenshots are visual
regression evidence, not contrast sign-off. Human theme contrast, screen-reader, zoom and physical
device review remain pending.

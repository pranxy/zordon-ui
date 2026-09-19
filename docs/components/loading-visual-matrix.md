# Loading visual matrix

| Scenario                                                                | Evidence                                |
| ----------------------------------------------------------------------- | --------------------------------------- |
| Light desktop size/color gallery under reduced motion                   | `loading--static-light-matrix.png`      |
| Dark narrow RTL with labels, center/overlay/custom and gallery fallback | `loading--static-dark-rtl.png`          |
| Six actual SVG mask families, xs–xl geometry                            | Chromium computed-mask and width checks |
| Live reduced-motion/forced-color changes and custom fallback            | Chromium interaction test               |

Baselines live in `e2e/__screenshots__/visual-regression.spec.ts/`. Each variant intentionally uses
the same static ring under reduced motion. Animated frames are not deterministic snapshots;
their human visual review remains pending, alongside theme contrast and physical device review.

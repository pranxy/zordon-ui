# Modal visual matrix

| Case                                                              | Evidence                      |
| ----------------------------------------------------------------- | ----------------------------- |
| Native medium editor, light desktop                               | `modal--native-light.png`     |
| Overlay editor, dark RTL mobile                                   | `modal--overlay-dark-rtl.png` |
| Small bottom/start placement and live direction changes           | Chromium geometry checks      |
| Fullscreen dynamic viewport bounds, reduced motion, forced colors | Chromium checks               |

Baselines are inspected before acceptance. Additional physical-display, human contrast/reflow and
mobile keyboard/safe-area review remain pending.

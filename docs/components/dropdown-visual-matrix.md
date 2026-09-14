# Dropdown visual matrix

Automated baselines cover the public component fixture, not just the integration probe.

| Case                                      | Evidence                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| Light desktop open menu                   | `dropdown--light-menu.png`; inspected and comparison passed             |
| Dark RTL narrow viewport with nested menu | `dropdown--dark-rtl-nested-mobile.png`; inspected and comparison passed |
| Arbitrary form panel                      | Browser semantic/focus coverage; consumer owns styling                  |
| Edge collision and viewport margin        | Chromium geometric assertions                                           |
| Reduced motion and forced colors          | Chromium emulation checks; manual display review pending                |

Human contrast, screen-reader, touch, zoom/reflow and physical high-contrast review remain open.

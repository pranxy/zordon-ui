# Toast visual matrix

| Scenario        | Evidence                                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| Light desktop   | Info, success/action and warning/custom-content stack                                 |
| Dark RTL mobile | Same stack at 360px with native action/close controls                                 |
| All placements  | Browser geometry checks for nine positions in LTR and nested RTL                      |
| Motion          | Reduced-motion screenshots and browser animation suppression                          |
| Lifecycle       | Queue promotion, timeout pause, action errors, promise settlement and outlet teardown |

Baselines: `toast--light-stack.png` and `toast--dark-rtl-mobile.png` under the Chromium visual
snapshot directory. Stack-only captures avoid unrelated page content. Existing baselines remain
unchanged. Human theme contrast, custom content, animation, forced-color painting, zoom/reflow and
Firefox/WebKit review remain pending.

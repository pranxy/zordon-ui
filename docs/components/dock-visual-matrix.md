# Dock visual matrix

| Scenario        | Evidence                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| Light desktop   | Native current destination, icons, labels, badge and disabled destination                 |
| Dark RTL mobile | 360px layout with additional destinations and native horizontal overflow                  |
| Layout          | Five heights, fixed bottom placement/reservation, simulated safe area, sticky containment |
| Responsive      | Mobile/desktop visibility and compact labels                                              |
| Interaction     | Router state, keyboard focus/scrolling, reduced motion and forced-color focus             |

Baselines: `dock--light-desktop.png` and `dock--dark-rtl-mobile.png` in the Chromium snapshot
directory. Human theme contrast, physical devices, long translations, high-contrast painting,
zoom/reflow and Firefox/WebKit remain pending.

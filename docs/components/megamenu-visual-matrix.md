# Megamenu visual matrix

| Scenario        | Evidence                                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| Light desktop   | Three-column panel with grouped links, unavailable destination and search form        |
| Dark RTL mobile | Single-column 360px popup with logical content direction and bounded width            |
| Layout          | Anchored width cap, full viewport width minus 32px, responsive collapse and scrolling |
| Interaction     | Current route, keyboard focus, command menus, hover/focus/manual policies             |
| Motion/contrast | Reduced-motion captures and forced-color focus checks                                 |

Baselines: `megamenu--light-desktop.png` and `megamenu--dark-rtl-mobile.png` in the Chromium snapshot
directory. Human contrast, physical devices, long translations, zoom/reflow and Firefox/WebKit
remain pending. Panel captures include projected content; surrounding documentation controls are
outside the snapshots.

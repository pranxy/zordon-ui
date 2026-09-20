# Breadcrumbs visual matrix

| Scenario        | Evidence                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| Light desktop   | Icon, complete ancestor/current labels and open middle-overflow list               |
| Dark RTL mobile | Short visual labels, logical separators/placement and open overflow at 360px       |
| Layout          | Three/four-slot limits, full-trail scroll mode and narrow RTL dropdown containment |
| Interaction     | Native disclosure, RouterLink navigation, current-link policy and keyboard focus   |
| Motion/contrast | Reduced-motion captures and forced-color focus checks                              |

Baselines: `breadcrumbs--light-desktop.png` and `breadcrumbs--dark-rtl-mobile.png` in the Chromium
visual snapshot directory. Existing baselines remain unchanged. Human theme contrast, long labels,
physical devices, high-contrast painting, zoom/reflow and Firefox/WebKit remain pending.

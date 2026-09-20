# Drawer visual matrix

| Scenario               | Evidence                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Light desktop, 1280px  | Persistent project navigation beside main content, Navbar toggle and independent help sidebar        |
| Dark RTL mobile, 360px | Start-side modal at the right edge, full-height surface, backdrop, close handle and named navigation |
| Push and responsive    | Browser geometry, viewport mode transitions and main-content access                                  |
| Modal stacking         | Nested Escape, focus return, background isolation and scroll-lock assertions                         |
| Gesture boundaries     | Native Chromium touch input for inward versus outward drag                                           |

Baselines are `drawer--light-desktop.png` and `drawer--dark-rtl-mobile.png`. The fixture waits
for hydration before enabling mode selection. Both images were inspected after baseline
creation. Physical safe areas, forced-color painting, custom themes and high zoom remain manual
review items. The component intentionally has no motion-dependent opening/closing behavior.

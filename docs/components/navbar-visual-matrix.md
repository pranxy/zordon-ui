# Navbar visual matrix

| Scenario                        | Evidence                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| Light desktop, static           | `navbar--light-desktop.png`: brand, center Router destinations and account action          |
| Dark RTL 360px, expanded mobile | `navbar--dark-rtl-mobile.png`: logical regions, mobile toggle and inline destination panel |
| Breakpoint at 48rem             | Browser checks visible desktop links and hidden mobile controls/panel                      |
| Sticky/fixed                    | Browser geometry checks nearest scroller and viewport top placement                        |
| Transparent                     | Browser computed-background assertion                                                      |
| Forced colors/reduced motion    | Browser focus, RTL containment and axe checks; no component animations                     |

Snapshots live in `e2e/__screenshots__/visual-regression.spec.ts/`. The fixture includes the actual
daisyUI Navbar CSS and scopes its own control styling. Manual long-label/zoom, device safe-area,
high-contrast painting, custom-theme and transparent-surface contrast review remains pending.

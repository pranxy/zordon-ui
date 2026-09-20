# Pagination visual matrix

| Scenario                     | Evidence                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Light desktop                | `pagination--light-desktop.png`: controlled range, query range, page sizes, unknown total |
| Dark RTL 360px               | `pagination--dark-rtl-mobile.png`: wrapped native controls, logical boundary glyphs       |
| Five Button sizes            | Browser containment checks for xs/sm/md/lg/xl                                             |
| Empty/loading/disabled       | Browser state, unavailable anchors and status assertions                                  |
| Current/ellipsis             | Unit/range checks and baseline current underline/noninteractive gaps                      |
| Forced colors/reduced motion | Browser focus, current-page interaction and axe; component transition override            |

Snapshots live in `e2e/__screenshots__/visual-regression.spec.ts/`. Actual Button and Join styling is
compiled in the fixture; its demo CSS is explicitly scoped. Manual long/localized-number, zoom,
physical device, high-contrast painting and custom-theme contrast review remains pending.

# Menu visual matrix

| Scenario        | Evidence                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| Light desktop   | Native titles/separator, Router current page, nested group, badge/shortcut, expanded Tree     |
| Dark RTL mobile | 360px stacked examples, mirrored indentation/decoration, unavailable nodes and branch control |
| Layout          | Five sizes, horizontal wrapping, narrow containment and minimum 24px row targets              |
| Interaction     | Native links/disclosure, Tree expansion/selection, command submenus and focus                 |
| Motion/contrast | Reduced-motion captures and forced-color focus checks                                         |

Baselines: `menu--light-desktop.png` and `menu--dark-rtl-mobile.png` in the Chromium snapshot
directory. Human theme contrast, physical devices, long translations, large/deep trees, zoom/reflow
and Firefox/WebKit remain pending. Visual review corrected title contrast and separator geometry.

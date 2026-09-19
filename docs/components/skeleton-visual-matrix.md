# Skeleton visual matrix

| Scenario          | Evidence                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Light desktop     | Text/rectangle/circle/custom shapes, dimensions/radius, paragraph/avatar-text/card presets |
| Dark RTL at 360px | Same gallery with logical multiline alignment and wrapping controls                        |
| Motion            | Browser verifies actual daisy shimmer, pulse, none and changed duration                    |
| Reduced motion    | Screenshots use static rendering; browser verifies shimmer and pulse stop                  |
| Forced colors     | Browser verifies no animation and visible system-color borders                             |
| Loading lifecycle | Busy state, hidden artwork and consumer-owned content replacement                          |

New baselines are `skeleton--light-desktop.png` and `skeleton--dark-rtl-mobile.png` in the Chromium
snapshot directory. Tall capture viewports keep the docs sticky header outside the gallery.
Human animation, theme perception, forced-color painting, zoom and Firefox/WebKit review remain
pending. Existing baselines and global styles are not changed.

# Accordion visual matrix

| Scenario            | Evidence                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Light desktop       | Default-open eager profile, nested group, arrow/plus/custom/none indicators, disabled trigger and native alternatives |
| Dark RTL mobile     | Billing lazy content open at 360px; logical padding, controls and native alternatives                                 |
| Interaction         | Single/multiple expansion, keyboard focus, preservation, nested isolation and deep links                              |
| Motion and contrast | Reduced-motion captures; browser reduced-motion and forced-color focus checks                                         |

Baselines: `accordion--light-desktop.png` and `accordion--dark-rtl-mobile.png` in the Chromium
visual snapshot directory. Existing baselines remain unchanged. Human contrast, forced-color
painting, zoom/reflow, physical devices and Firefox/WebKit review remain pending.

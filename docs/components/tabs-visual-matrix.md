# Tabs visual matrix

| Scenario                  | Evidence                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Light desktop, 1280px     | Workspace box tabs/actions, manual vertical lift, URL border tabs and long large tabs    |
| Dark RTL mobile, 360px    | Logical layout, wrapped vertical labels, native horizontal overflow and contained panels |
| Selected/focused/disabled | Distinct selected border/weight, inset focus outline and disabled native button styling  |
| Panel lifecycle           | Browser tests assert preserved drafts and recreated lazy inputs                          |
| Mutation                  | Browser tests assert order, selected state and focus after accepted move/removal         |

Baselines: `tabs--light-desktop.png` and `tabs--dark-rtl-mobile.png` in the visual Chromium suite.
The fixture uses packaged component CSS with theme variables. All five sizes share the same
structure; md/sm/lg are represented in baselines, xs/xl remain manual visual review items.
Custom themes, forced-color painting, physical touch, high zoom and assistive technology remain
pending. Screenshot comparisons are regression evidence, not a contrast/accessibility certification.

# Collapse

**Component ID:** DSP-08  
**Maturity:** Preview  
**Entry point:** `@pranxy/zordon-ui/collapse`

Collapse’s first delivery is a native disclosure styling composition, not a stateful accordion
widget. It maps daisyUI’s container, title, content, indicator, and forced visual-state classes
while preserving consumer ownership of the element choice and interaction model.

## daisyUI inventory

| Candidate                         | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `collapse`                        | Disclosure container                      |
| `collapse-title`                  | Trigger/title part                        |
| `collapse-content`                | Collapsible content part                  |
| `collapse-arrow`, `collapse-plus` | Visual indicator modifiers                |
| `collapse-open`, `collapse-close` | Forced visual state for non-details hosts |

The installed daisyUI 5.7.16 CSS recognizes native `<details open>`, a consumer-focusable host, or
a direct checked checkbox/radio input. It applies its own transitions only when reduced motion is
not requested.

## Public API

`[zdCollapse]` has optional `indicator` (`'arrow' | 'plus'`) and `forcedState`
(`'open' | 'close'`) inputs. `[zdCollapseTitle]` and `[zdCollapseContent]` add their respective
part classes. Omission preserves daisyUI’s base styling. Invalid values reject.

`forcedState` is only valid for non-details hosts; daisyUI does not apply `collapse-open` or
`collapse-close` to the `<details>/<summary>` pattern. No `open` model, two-way binding, outputs,
methods, click/keyboard/outside handlers, lazy rendering, content preservation option, animation
controls, IDs, ARIA attributes, Angular Aria, or CDK dependency is included.

## Native interaction and accessibility boundary

Prefer native `<details zdCollapse>` with `<summary zdCollapseTitle>` for a standalone disclosure;
the consumer owns the native `open` attribute. Focus-based div and checkbox/radio patterns remain
available when their semantics and behavior are intentional. Consumers own heading structure,
summary text, labels for checkbox/radio controls, disabled policy, focus order, current state
announcement, outside-click behavior, deep links, and content searchability.

Do not apply an accordion pattern to independent disclosures. A future grouped mode must be
separately approved and use the Angular Aria Accordion primitives behind a Zordon-owned API.

## Customization and evidence

Consumer classes/styles control borders, backgrounds, spacing, icon placement, responsive rules,
and content appearance. Do not expose arbitrary animation, icon, width, height, outside-click, or
keyboard inputs. Before Preview require class lifecycle/unit/type/API/package proof; browser and
SSR native-host proof; axe plus manual native-summary keyboard, checkbox/radio labeling,
focus/forced-colors/contrast/zoom/reflow/RTL/assistive-technology review; and visual coverage for
details, checkbox, indicator, forced state, themes, and mobile RTL.

## Sources

- [daisyUI Collapse documentation](https://daisyui.com/components/collapse/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Angular Aria adoption](../foundations/angular-aria-adoption.md)

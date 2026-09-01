# Carousel

**Component ID:** DSP-06  
**Maturity:** Preview  
**Entry point:** `@pranxy/zordon-ui/carousel`

Carousel’s first delivery is a native scroll-snap layout directive, not a slideshow widget. It
maps daisyUI’s container/item/axis/alignment classes and preserves consumer-owned scrolling,
semantics, controls, state, media, and accessibility.

## daisyUI inventory

| Candidate                                           | Purpose                       |
| --------------------------------------------------- | ----------------------------- |
| `carousel`                                          | Scrollable snap container     |
| `carousel-item`                                     | Snap item                     |
| `carousel-horizontal`, `carousel-vertical`          | Axis modifiers                |
| `carousel-start`, `carousel-center`, `carousel-end` | Item snap alignment modifiers |

Installed daisyUI 5.7.16 CSS uses native scrolling and scroll snap; it has no current-index,
loop, timer, keyboard, control, dot, thumbnail, or ARIA implementation.

## Public API

`[zdCarousel]` has optional `orientation` (`'horizontal' | 'vertical'`) and `align`
(`'start' | 'center' | 'end'`) inputs; `[zdCarouselItem]` adds the item class. Omission leaves the
upstream horizontal/start behavior. Invalid values reject. No outputs, models, navigation methods,
autoplay, looping, pointer/wheel handling, virtual rendering, lazy loading, or Angular Aria/CDK
dependency are included.

## Native and accessibility boundary

Consumers choose list/region semantics, labels, item roles, focus order, media alternatives,
scroll buttons, pagination/dots, current-item announcement, keyboard policy, reduced-motion
behavior, and scroll position. The base directive adds no roles, IDs, focusability, events,
observers, timers, browser APIs, or ARIA attributes. Consumer controls should use native buttons
and target a labelled scroll region; autoplay and looping require a later separately approved
interaction API.

## Customization and evidence

Consumer classes/styles control item width, gap, responsive axis, scroll padding, and content.
Do not expose arbitrary width, duration, easing, slide, thumbnail, or control inputs. Before
Preview require class lifecycle/unit/type/API/package proof; browser and SSR native-host proof;
axe plus manual keyboard/focus/contrast/forced-colors/zoom/reflow/RTL review; and visual coverage
for axis/alignment/themes/mobile RTL. Performance review is required before any virtual/autoplay
or large-slide feature.

## Sources

- [daisyUI Carousel documentation](https://daisyui.com/components/carousel/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)

# Carousel accessibility review

**Component/maturity:** Carousel — Preview  
**Related specification:** [Carousel](carousel.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated checks prove that the native directives preserve
consumer-owned ordered-list semantics, labels, list items, and native scrolling across browser and
hydration paths. They do not turn a scroll-snap layout into an accessible carousel widget.

| Review area         | Required manual review                                                                                                  | Status  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| Semantics           | Choose a labelled list, region, or other appropriate structure; maintain a meaningful reading order                     | Pending |
| Controls            | Use native labelled buttons; verify keyboard behavior, focus order, target relationships, and current-item announcement | Pending |
| Motion              | Review consumer-added smooth scrolling, autoplay, looping, and pause/stop controls; respect reduced motion              | Pending |
| Layout              | Test RTL, long localized item content, 200% zoom, 400% reflow, narrow viewports, and variable-width items               | Pending |
| Themes and platform | Review item/control contrast in supported and custom themes, forced colors, and assistive technology                    | Pending |

## Automated boundary

Browser, SSR/hydration, and axe checks exercise horizontal/vertical axes, center/end alignment,
native `ol`/`li` hosts, consumer-provided labels and focusability, and two scroll-snap items per
direction. They establish that the directives add visual candidates without adding roles,
focusability, ARIA state, keyboard handling, current-item state, controls, timers, observers, or
autoplay.

Manual review is required before Carousel advances beyond Preview maturity.

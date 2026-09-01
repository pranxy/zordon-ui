# Card accessibility review

**Component/maturity:** Card — Planned  
**Related specification:** [Card](card.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated checks prove that Card preserves an article’s
native semantics, consumer-selected heading/action/media content, and a consumer-owned radio
selection across browser and hydration paths. They do not certify every image, heading hierarchy,
interactive composition, custom-theme contrast, or assistive-technology experience.

| Review area                | Required manual review                                                                                                   | Status  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------- |
| Images and content         | Meaningful alternatives; decorative-media treatment; crop and content visibility at zoom/reflow                          | Pending |
| Semantic structure         | Appropriate article/section/label/link choice and heading hierarchy in consuming pages                                   | Pending |
| Interactive ownership      | Keyboard/focus order; no nested interactive controls within a clickable Card; native radio/checkbox/link/button behavior | Pending |
| Themes and media treatment | Contrast for normal and `image-full` Cards in supported/custom themes and real imagery                                   | Pending |
| Layout                     | RTL side layout, long localization, 200% zoom, 400% reflow, and narrow viewports                                         | Pending |
| Platform                   | Forced-colors and assistive-technology review for consumer-selected semantics                                            | Pending |

## Automated boundary

Browser, SSR/hydration, and axe coverage exercise `card-body`, `card-title`, `card-actions`,
border/dash, xs/xl, side, image-full, direct figures, native article/label hosts, and a
consumer-owned radio. These checks establish that the directives add visual candidates without
adding a role, focusability, ARIA state, or interaction behavior.

Manual review is required before Card advances beyond Planned maturity.

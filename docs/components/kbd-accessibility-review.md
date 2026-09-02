# Kbd accessibility review

**Component/maturity:** Kbd — Preview  
**Related specification:** [Kbd](kbd.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`,
`e2e/ssr-hydration.spec.ts`, and `e2e/visual-regression.spec.ts`

This record remains open. Automated checks prove Kbd preserves native `<kbd>` markup, consumer
text, and consumer-provided accessible shortcut expansion through browser and hydration paths. They
do not translate key names, detect a platform, register shortcuts, or make a keycap interactive.

| Review area        | Required manual review                                                                                | Status  |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------- |
| Shortcut meaning   | Confirm labels and descriptions are understandable without relying only on symbols.                   | Pending |
| Surrounding action | Confirm keyboard order and activation belong to the consumer’s native button or link, not the keycap. | Pending |
| Layout             | Test RTL, long localized labels, 200% zoom, 400% reflow, and narrow viewports.                        | Pending |
| Themes and colors  | Review forced colors, contrast, and assistive technology in supported and custom themes.              | Pending |

## Automated boundary

Browser and SSR/hydration tests cover native inline and key-combination markup, xs/xl candidates,
consumer-provided `aria-label` and `aria-hidden` attributes, and the absence of injected role or
focusability. The axe scan covers the isolated native fixture, and the visual baseline covers inline
and combination composition in dark theme, RTL, and a mobile viewport.

Manual review is required before Kbd advances beyond Preview maturity.

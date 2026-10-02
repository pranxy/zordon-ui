# Chat Bubble visual matrix

**Component/maturity:** Chat Bubble — Planned  
**Entry point:** `@pranxy/zordon-ui/chat-bubble`

The focused dark RTL mobile baseline covers start/end placement, image/header/footer, primary/success/error Bubble colors, and explicit delivery-error text: `chat-bubble--native--dark-rtl-mobile.png`. Browser, SSR/hydration, and axe tests protect semantics; manual accessibility review remains in [Chat Bubble accessibility review](chat-bubble-accessibility-review.md).

## Showcase feedback evidence — 2026-09-29

The existing matrix remains the component-wide contract. The focused documentation examples now have reviewed light desktop and dark RTL mobile baselines in `e2e/visual-docs-site.spec.ts` (`showcase-chat-bubble--*`). The previews group the requested static compositions; real interactions, motion, geometry and image decoding are covered separately. Card also samples low/high-radius and consumer themes; Diff captures its matched image comparison separately.

See the [implementation evidence](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29) for the selected boundaries, passing production accessibility/SSR checks, regression sensitivity and remaining browser/baseline limits. This does not close the matrix's outstanding manual gates or change component maturity.

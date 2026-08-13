# Body scroll lock and scrollbar gutters

Zordon's private body-lock manager composes public CDK `BlockScrollStrategy` behavior across
multiple blocking overlays. It does not expose a consumer service or own application page layout.

This foundation is **Partial**. Source-level nesting, cleanup, and SSR boundaries are implemented
and tested. Completion requires a real Modal or Drawer to prove hydration and physical mobile
behavior, plus two packaged overlay entries to prove one shared manager identity.

## Lock ownership and lifecycle

- Components choose `block` only for modal surfaces. Nonmodal surfaces retain `reposition` or
  `noop`.
- Every blocking `OverlayRef` receives an idempotent lease. The first enabled lease creates and
  enables one CDK owner; later leases share it; only the final release disables it.
- Leases remain held through opening, open, and visible closing, releasing on final detach/dispose.
  Arbitrary sibling release order cannot unlock beneath another blocker.
- Injector destruction disables the owner once and makes late releases harmless.
- Semantic stack size does not determine lock count; modality and stacking are separate concerns.

Installed CDK records viewport position, preserves root inline `left` and `top`, applies negative
offsets, and adds `cdk-global-scrollblock`. Final disable restores its owned state and scroll
position. The injected class fixes the root with `overflow-y: scroll`, preserving classic-scrollbar
space. Zordon reuses this instead of maintaining competing scroll-position math.

## Scrollbar-gutter policy

Applications may opt into stable page geometry before overlays open:

```css
html {
  scrollbar-gutter: stable;
}
```

This remains consumer CSS. `stable` reserves space for classic scrollbars and does nothing for
overlay scrollbars. `stable both-edges` deliberately adds a matching opposite-inline gutter and is
not a Zordon default. Unsupported browsers ignore it; CDK's `overflow-y: scroll` class remains the
lock-time fallback.

Zordon never calculates `innerWidth - clientWidth`, adds physical right padding, or mutates
consumer `scrollbar-gutter`. Those approaches conflict with RTL/left scrollbars, existing page
compensation, overlay scrollbars, and dynamic viewports.

## Restoration and ownership limits

Under normal ownership, final release preserves unrelated root classes/styles, pre-lock inline
`left`/`top`, HTML/body inline `scroll-behavior`, and captured scroll position. The browser may clamp
restoration if page dimensions change. Consumer mutation of those same owned properties while
locked and programmatic router/scroll restoration during a lock are unsupported conflicts.

The guarantee covers one Zordon Angular application and ordinary document. Separate Angular
bootstraps, unrelated Material/CDK blockers, alternate documents, iframes, and custom page scroll
containers are not coordinated. Future component entries must prove they use the same manager;
hidden globals and DOM properties are prohibited.

CDK only enables if the page is already scrollable. If a non-scrollable page grows after its sole
lease is acquired, it does not observe and retry. This limitation does not justify an observer until
a real component demonstrates the need.

## Mobile and inner scrolling

Do not install document-wide touch preventers or `touch-action: none`: modal content must scroll and
users must retain pinch zoom. A component-owned scrolling region may use
`overscroll-behavior: contain` where supported. Visual viewport changes, on-screen keyboards, safe
areas, and keeping inputs visible belong to concrete component layout.

Desktop Playwright and mobile emulation do not prove iOS Safari rubber-band, browser-toolbar, or
keyboard behavior. Physical/device-cloud iOS Safari and Android Chrome review is required before
the first blocking component is mobile-ready.

## SSR, package, and verification

The coordinator checks the browser platform before creating an overlay, strategy, or lease. Server
HTML therefore has no lock class, offsets, or overlay DOM. The first component must prove event
replay opens once after hydration and final close restores document state without mismatch.

Current runtime remains unreachable from intentional exports, so private CDK types do not enter the
package FESM or declarations. A shared published identity requires ADR/API/release review.

Focused tests cover ref counting, arbitrary release order, repeated lifecycle calls, injector
destruction, policy mapping, cleanup, server no-op, and event ownership. A real-browser scenario is
authored for scroll restoration, sibling blockers, background suppression, inner scrolling, layout
stability, consumer state preservation, and cleanup; it remains an execution gate when browser
launch is available.

## Sources

- [Angular CDK Overlay API](https://material.angular.dev/cdk/overlay/api)
- [CSS Overflow Level 3](https://www.w3.org/TR/css-overflow-3/#scrollbar-gutter-property)
- [MDN scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter)
- [MDN overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior)
- [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)

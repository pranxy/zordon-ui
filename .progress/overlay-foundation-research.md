# Overlay foundation research

- **Question:** What is the smallest private Angular CDK overlay/portal foundation that satisfies
  host ownership, stacking, positioning, collision handling, scroll strategies, cleanup, SSR, and
  the accepted dismissal/focus contracts without leaking CDK through Zordon's public API?
- **Target:** `DAISYUI_ANGULAR_BUILD_PLAN.md` Phase 2 overlay/portal row.
- **Exact installed context:** Angular 21.2.19, Angular CDK 21.2.14, daisyUI 5.7.16.
- **Evidence bar:** accepted ADRs, installed CDK source/types/tests, official current CDK guidance,
  focused Angular tests, real-browser layout behavior, production/SSR/package evidence.

## Questions

1. Which CDK primitives should the private foundation own versus expose to component adapters?
2. How should one application-scoped stack atomically arbitrate nested Escape/outside events?
3. Which lifecycle, portal attachment, z-index, backdrop, origin, and cleanup invariants are required?
4. Which connected-position fallback/push/viewport-margin rules are safe as shared defaults?
5. Which scroll strategies are valid by overlay category, and what belongs to the following body
   scroll-lock row?
6. What can be proved without a real public component and what must remain a first-consumer gate?
7. How can the implementation remain private and still be reusable by future secondary entry points?

## Sources and findings

- The installed CDK package is 21.2.14. `OverlayRef.attach()` owns portal attachment, position and
  scroll strategies, backdrop setup, and keyboard/outside dispatcher registration. `detach()`
  leaves a reusable ref; `dispose()` completes streams and removes the owned host. Zordon therefore
  needs one idempotent handle that ultimately disposes its ref.
- `OverlayContainer` lazily appends one shared container to `document.body`. The private coordinator
  must guard before `Overlay.create()` on the server and must never destroy or theme that shared
  container.
- CDK attachment order controls painting. Reattached hosts move to the end; current CDK can use a
  popover top layer, but the supported 21.x floor does not justify making that an API contract.
- Public `FlexibleConnectedPositionStrategy` preserves ordered fallback positions and supports
  viewport margin, push, flexible dimensions, and grow-after-open. Component semantics—not a global
  preset—must choose the fallback order.
- CDK `close` and reposition `autoClose` hard-detach the ref. They bypass Zordon close requests,
  guards, closing animations, focus restoration, and stack cleanup. Only `noop` and reposition with
  `autoClose: false` are safe here. `block` belongs to the following body-scroll-lock row.
- Template and component portals have clear destruction ownership. DOM portals move live DOM and
  remain excluded until a concrete hydration-safe need exists.
- CDK outside dispatch can notify multiple overlay refs for one native event, whereas keyboard
  dispatch stops at the first subscribed ref. The Zordon stack must claim a native event before a
  synchronous close mutates order, keep closing surfaces shielding parents, and deduplicate
  backdrop/outside observation.
- A pane theme snapshot must follow composed ancestors through an open shadow root. Mutating the
  shared container would leak one surface's theme to siblings.
- Keeping source private prevents current API/CDK leakage, but independently bundled component
  secondary entry points can duplicate private root-token identities. Completion requires two real
  entries to prove one approved shared identity. A primary `ɵ` bridge is still a published API
  artifact and needs an ADR/package/release decision; hidden globals are not acceptable.

## Primary references

- https://material.angular.dev/cdk/overlay/api
- https://material.angular.dev/cdk/overlay/overview
- https://material.angular.dev/cdk/portal/overview
- https://angular.dev/best-practices/performance/ssr
- https://angular.dev/guide/hydration
- Installed source: `node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs`
- Installed declarations: `node_modules/@angular/cdk/types/_overlay-module-chunk.d.ts`
